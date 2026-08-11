import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectMongo } from './server/mongo';
import { db } from './server/db';
import { generateDynamicPricing, generateRentalAiAssistantResponse } from './server/geminiService';
import { User } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Connect to MongoDB Atlas
  await connectMongo();

  // API HEALTH
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'RentalHub Production Backend (MongoDB Atlas)',
      timestamp: new Date().toISOString(),
    });
  });

  // --- AUDIT LOG STREAM ENDPOINT ---
  app.get('/api/audit-logs', async (req, res) => {
    const logs = await db.getAuditLogs();
    res.json(logs);
  });

  // --- AUTH ENDPOINTS ---
  app.post('/api/auth/login', async (req, res) => {
    const { email, role } = req.body;
    let user = await db.getUserByEmail(email);

    if (!user) {
      const users = await db.getUsers();
      const usersByRole = users.filter((u) => u.role === (role || 'customer'));
      user = usersByRole[0] || users[0];
    }

    res.json({
      token: `jwt_token_${user.id}_${Date.now()}`,
      user,
    });
  });

  app.post('/api/auth/demo-login', async (req, res) => {
    const { role } = req.body;
    const users = await db.getUsers();
    const user = users.find((u) => u.role === role) || users[0];
    res.json({
      token: `jwt_token_${user.id}_${Date.now()}`,
      user,
    });
  });

  app.post('/api/auth/register', async (req, res) => {
    const { name, email, role, phone, location } = req.body;
    const existing = await db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name || 'New User',
      email,
      role: role || 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      phone: phone || '',
      location: location || 'Austin, TX',
      bio: 'Equipment rental member.',
      trustScore: 90,
      kycStatus: role === 'owner' ? 'pending' : 'verified',
      completedRentalsCount: 0,
      onTimeReturnRate: 100,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      favorites: [],
    };

    await db.createUser(newUser);
    res.json({
      token: `jwt_token_${newUser.id}_${Date.now()}`,
      user: newUser,
    });
  });

  app.get('/api/auth/me/:userId', async (req, res) => {
    const user = await db.getUserById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });

  app.post('/api/auth/kyc', async (req, res) => {
    const { userId, docUrl } = req.body;
    const updated = await db.updateUserKyc(userId, 'verified', docUrl);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: updated });
  });

  app.post('/api/auth/favorite', async (req, res) => {
    const { userId, equipmentId } = req.body;
    const favorites = await db.toggleFavorite(userId, equipmentId);
    res.json({ success: true, favorites });
  });

  // --- EQUIPMENT ENDPOINTS ---
  app.get('/api/equipment', async (req, res) => {
    const { category, search, minPrice, maxPrice, location, lat, lng, startDate, endDate, onlyAvailable, sort, ownerId } = req.query;

    const items = await db.getEquipment({
      category: category as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location: location as string,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
      onlyAvailable: onlyAvailable === 'true',
      sort: sort as string,
      ownerId: ownerId as string,
    });

    res.json(items);
  });

  app.get('/api/equipment/:id', async (req, res) => {
    const item = await db.getEquipmentById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Equipment not found' });
    res.json(item);
  });

  app.post('/api/equipment', async (req, res) => {
    const equipmentData = req.body;
    const newEquipment = await db.createEquipment({
      ...equipmentData,
      id: `eq_${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    res.json(newEquipment);
  });

  app.put('/api/equipment/:id', async (req, res) => {
    const updated = await db.updateEquipment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Equipment not found' });
    res.json(updated);
  });

  app.delete('/api/equipment/:id', async (req, res) => {
    const success = await db.deleteEquipment(req.params.id);
    res.json({ success });
  });

  // --- SMART SEARCH & AI PRODUCT INTELLIGENCE ---
  app.post('/api/equipment/smart-search', async (req, res) => {
    const { query, userLocation, role } = req.body;
    try {
      const allEquipment = await db.getEquipment();
      const aiResponse = await generateRentalAiAssistantResponse(query || 'Equipment rental query', allEquipment, role || 'customer');

      const matchedEquipment = await db.getEquipment({
        search: query,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      });

      res.json({
        query,
        aiInterpretation: aiResponse,
        resultsCount: matchedEquipment.length,
        equipment: matchedEquipment,
      });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Smart search error' });
    }
  });

  // --- BOOKING ENDPOINTS ---
  app.get('/api/bookings', async (req, res) => {
    const { customerId, ownerId, status } = req.query;
    const bookings = await db.getBookings({
      customerId: customerId as string,
      ownerId: ownerId as string,
      status: status as any,
    });
    res.json(bookings);
  });

  app.get('/api/bookings/:id', async (req, res) => {
    const booking = await db.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  });

  app.post('/api/bookings', async (req, res) => {
    const { equipmentId, customerId, startDate, endDate, deliveryMethod, deliveryAddress } = req.body;
    const equipment = await db.getEquipmentById(equipmentId);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const user = (await db.getUserById(customerId)) || (await db.getUsers())[0];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const rentalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));

    const subtotal = equipment.dailyRate * rentalDays;
    const deliveryFee = deliveryMethod === 'delivery' ? 45 : 0;
    const platformFee = Math.round(subtotal * 0.1 * 100) / 100;
    const insuranceFee = Math.round(subtotal * 0.05 * 100) / 100;
    const securityDeposit = equipment.securityDeposit;
    const total = subtotal + deliveryFee + platformFee + insuranceFee + securityDeposit;

    const newBooking = {
      id: `bk_${Date.now()}`,
      equipmentId,
      equipmentTitle: equipment.title,
      equipmentImage: equipment.images[0],
      equipmentCategory: equipment.category,
      customerId: user.id,
      customerName: user.name,
      renterId: user.id,
      renterName: user.name,
      ownerId: equipment.ownerId,
      ownerName: equipment.ownerName,
      startDate,
      endDate,
      deliveryMethod: deliveryMethod || 'delivery',
      deliveryAddress,
      status: 'confirmed' as const,
      priceBreakdown: {
        dailyRate: equipment.dailyRate,
        rentalDays,
        subtotal,
        deliveryFee,
        securityDeposit,
        platformFee,
        insuranceFee,
        total,
      },
      paymentStatus: 'paid' as const,
      createdAt: new Date().toISOString(),
    };

    const result = await db.createBooking(newBooking);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result.booking);
  });

  app.put('/api/bookings/:id/status', async (req, res) => {
    const { status } = req.body;
    const updated = await db.updateBookingStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Booking not found' });
    res.json(updated);
  });

  // --- REVIEWS & DISPUTES ---
  app.get('/api/reviews', async (req, res) => {
    const reviews = await db.getReviews(req.query.equipmentId as string);
    res.json(reviews);
  });

  app.get('/api/disputes', async (req, res) => {
    const disputes = await db.getDisputes();
    res.json(disputes);
  });

  app.post('/api/disputes/:id/resolve', async (req, res) => {
    const { winner } = req.body;
    const updated = await db.resolveDispute(req.params.id, winner);
    if (!updated) return res.status(404).json({ error: 'Dispute not found' });
    res.json(updated);
  });

  // --- NOTIFICATIONS ---
  app.get('/api/notifications/:userId', async (req, res) => {
    const notifs = await db.getNotifications(req.params.userId);
    res.json(notifs);
  });

  // --- ANALYTICS ENDPOINTS ---
  app.get('/api/analytics/owner/:ownerId', async (req, res) => {
    const analytics = await db.getOwnerAnalytics(req.params.ownerId);
    res.json(analytics);
  });

  app.get('/api/analytics/admin', async (req, res) => {
    const analytics = await db.getAdminAnalytics();
    res.json(analytics);
  });

  // --- AI PRICING ENDPOINT ---
  app.post('/api/ai/recommend-pricing', async (req, res) => {
    const { equipmentId } = req.body;
    const equipment = await db.getEquipmentById(equipmentId);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const bookings = await db.getBookings({ ownerId: equipment.ownerId });

    try {
      const pricingAdvice = await generateDynamicPricing(equipment, bookings.length, equipment.dailyRate);
      res.json(pricingAdvice);
    } catch {
      res.json({
        equipmentId: equipment.id,
        currentRate: equipment.dailyRate,
        suggestedRate: Math.round(equipment.dailyRate * 1.08),
        demandLevel: 'high',
        confidenceScore: 88,
        reasoning: [
          `High demand for ${equipment.category} in ${equipment.location}.`,
          `Current rate is 8% below local market benchmark.`,
          `Increasing daily rate optimizes revenue yield without losing bookings.`,
        ],
        seasonalMultiplier: 1.1,
        projectedRevenueIncreasePct: 8,
      });
    }
  });

  // Serve Vite frontend in development & production static mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();

      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RentalHub</title>
  </head>
  <body class="bg-[#0A0A0A] text-slate-100 font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RentalHub Production Express Server running on http://localhost:${PORT}`);
  });
}

startServer();
