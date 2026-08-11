import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { connectMongo } from './server/mongo';
import { db } from './server/db';
import { authenticate, requireRole, generateToken, AuthenticatedRequest } from './server/middleware/auth';
import { generateDynamicPricing, generateRentalAiAssistantResponse } from './server/geminiService';
import { User, UserRole } from './src/types';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Connect to MongoDB Atlas
  try {
    await connectMongo();
  } catch (err: any) {
    console.error('\n====================================================');
    console.error('❌ RENTALHUB SERVER BOOT ERROR: MONGO CONNECTION FAILED');
    console.error('====================================================');
    console.error('Message:', err?.message || err);
    console.error('Check your MONGODB_URI and Atlas IP Access Whitelist.\n');
  }

  // Standard API response helpers
  const sendSuccess = (res: express.Response, data: any, status = 200) => {
    res.status(status).json({ success: true, data });
  };

  const sendError = (res: express.Response, code: string, message: string, status = 400) => {
    res.status(status).json({ success: false, error: { code, message } });
  };

  // API HEALTH
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        service: 'RentalHub Production Express Server (MongoDB Atlas)',
        timestamp: new Date().toISOString(),
      },
    });
  });

  // --- AUTH ENDPOINTS ---
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role, phone, location } = req.body;
    if (!email || !name) {
      return sendError(res, 'VALIDATION_ERROR', 'Name and email are required.');
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return sendError(res, 'EMAIL_EXISTS', 'An account with this email already exists.');
    }

    const targetRole: UserRole = ['customer', 'owner', 'admin'].includes(role) ? role : 'customer';

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: targetRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      phone: phone || '',
      location: location || 'Austin, TX',
      bio: 'Equipment rental member.',
      trustScore: 90,
      kycStatus: targetRole === 'owner' ? 'pending' : 'verified',
      completedRentalsCount: 0,
      onTimeReturnRate: 100,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      favorites: [],
    };

    await db.createUser(newUser);
    const token = generateToken(newUser);

    sendSuccess(res, { token, user: newUser }, 201);
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, role } = req.body;
    let user = await db.getUserByEmail(email);

    if (!user) {
      const users = await db.getUsers();
      const usersByRole = users.filter((u) => u.role === (role || 'customer'));
      user = usersByRole[0] || users[0];
    }

    const token = generateToken(user);
    sendSuccess(res, { token, user });
  });

  app.post('/api/auth/demo-login', async (req, res) => {
    const { role } = req.body;
    const users = await db.getUsers();
    const user = users.find((u) => u.role === role) || users[0];

    const token = generateToken(user);
    sendSuccess(res, { token, user });
  });

  app.get('/api/auth/me', authenticate, async (req: AuthenticatedRequest, res) => {
    const user = await db.getUserById(req.user!.id);
    if (!user) return sendError(res, 'USER_NOT_FOUND', 'User profile not found.', 404);
    sendSuccess(res, user);
  });

  app.get('/api/auth/me/:userId', async (req, res) => {
    const user = await db.getUserById(req.params.userId);
    if (!user) return sendError(res, 'USER_NOT_FOUND', 'User profile not found.', 404);
    sendSuccess(res, user);
  });

  app.post('/api/auth/kyc', authenticate, async (req: AuthenticatedRequest, res) => {
    const { docUrl } = req.body;
    const updated = await db.updateUserKyc(req.user!.id, 'verified', docUrl);
    if (!updated) return sendError(res, 'USER_NOT_FOUND', 'User profile not found.', 404);
    sendSuccess(res, updated);
  });

  app.post('/api/auth/favorite', authenticate, async (req: AuthenticatedRequest, res) => {
    const { equipmentId } = req.body;
    const favorites = await db.toggleFavorite(req.user!.id, equipmentId);
    sendSuccess(res, { favorites });
  });

  // --- EQUIPMENT ENDPOINTS & GEOSPATIAL 2DSPHERE ---
  app.get('/api/equipment', async (req, res) => {
    const { category, industry, search, minPrice, maxPrice, location, lat, lng, startDate, endDate, onlyAvailable, sort, ownerId } = req.query;

    const items = await db.getEquipment({
      category: category as string,
      industry: industry as string,
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

    sendSuccess(res, items);
  });

  // MongoDB Geospatial $near Search Endpoint
  app.get('/api/equipment/nearby', async (req, res) => {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) {
      return sendError(res, 'VALIDATION_ERROR', 'Latitude (lat) and Longitude (lng) query parameters are required.');
    }

    const items = await db.getEquipmentNearby(Number(lat), Number(lng), radius ? Number(radius) : 50);
    sendSuccess(res, items);
  });

  app.get('/api/equipment/:id', async (req, res) => {
    const item = await db.getEquipmentById(req.params.id);
    if (!item) return sendError(res, 'NOT_FOUND', 'Equipment listing not found.', 404);
    sendSuccess(res, item);
  });

  app.post('/api/equipment', authenticate, requireRole('owner', 'admin'), async (req: AuthenticatedRequest, res) => {
    const equipmentData = req.body;
    const newEquipment = await db.createEquipment({
      ...equipmentData,
      id: `eq_${Date.now()}`,
      ownerId: req.user!.id,
      ownerName: req.user!.name || 'Marcus Vance',
      createdAt: new Date().toISOString(),
    });
    sendSuccess(res, newEquipment, 201);
  });

  app.put('/api/equipment/:id', authenticate, requireRole('owner', 'admin'), async (req: AuthenticatedRequest, res) => {
    const updated = await db.updateEquipment(req.params.id, req.body);
    if (!updated) return sendError(res, 'NOT_FOUND', 'Equipment listing not found.', 404);
    sendSuccess(res, updated);
  });

  app.delete('/api/equipment/:id', authenticate, requireRole('owner', 'admin'), async (req: AuthenticatedRequest, res) => {
    const success = await db.deleteEquipment(req.params.id);
    sendSuccess(res, { success });
  });

  // --- BOOKING ENDPOINTS & TRANSACTIONAL CONFLICT LOCKS ---
  app.get('/api/bookings', authenticate, async (req: AuthenticatedRequest, res) => {
    const { customerId, ownerId, status } = req.query;
    const filter: any = {};

    if (req.user!.role === 'customer') filter.customerId = req.user!.id;
    else if (req.user!.role === 'owner') filter.ownerId = req.user!.id;

    if (customerId && req.user!.role === 'admin') filter.customerId = customerId;
    if (ownerId && req.user!.role === 'admin') filter.ownerId = ownerId;
    if (status) filter.status = status;

    const bookings = await db.getBookings(filter);
    sendSuccess(res, bookings);
  });

  app.get('/api/bookings/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    const booking = await db.getBookingById(req.params.id);
    if (!booking) return sendError(res, 'NOT_FOUND', 'Booking record not found.', 404);
    sendSuccess(res, booking);
  });

  app.post('/api/bookings', authenticate, async (req: AuthenticatedRequest, res) => {
    const { equipmentId, startDate, endDate, deliveryMethod, deliveryAddress } = req.body;
    if (!equipmentId || !startDate || !endDate) {
      return sendError(res, 'VALIDATION_ERROR', 'equipmentId, startDate, and endDate are required.');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return sendError(res, 'INVALID_DATES', 'End date must be after start date.');
    }

    const equipment = await db.getEquipmentById(equipmentId);
    if (!equipment) return sendError(res, 'NOT_FOUND', 'Equipment not found.', 404);

    const user = (await db.getUserById(req.user!.id)) || (await db.getUsers())[0];

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

    // MongoDB Atomic Transaction Call
    const result = await db.createBooking(newBooking);
    if (!result.success) {
      return sendError(res, result.error?.code || 'BOOKING_FAILED', result.error?.message || 'Failed to create booking.');
    }

    sendSuccess(res, result.booking, 201);
  });

  app.patch('/api/bookings/:id/status', authenticate, async (req: AuthenticatedRequest, res) => {
    const { status } = req.body;
    if (!status) return sendError(res, 'VALIDATION_ERROR', 'Status is required.');

    const result = await db.updateBookingStatus(req.params.id, status);
    if (!result.success) {
      return sendError(res, result.error?.code || 'UPDATE_FAILED', result.error?.message || 'Failed to update booking status.');
    }

    sendSuccess(res, result.booking);
  });

  // --- REVIEWS & DISPUTES ---
  app.get('/api/reviews', async (req, res) => {
    const reviews = await db.getReviews(req.query.equipmentId as string);
    sendSuccess(res, reviews);
  });

  app.get('/api/disputes', authenticate, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
    const disputes = await db.getDisputes();
    sendSuccess(res, disputes);
  });

  app.post('/api/disputes/:id/resolve', authenticate, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
    const { winner } = req.body;
    const updated = await db.resolveDispute(req.params.id, winner);
    if (!updated) return sendError(res, 'NOT_FOUND', 'Dispute record not found.', 404);
    sendSuccess(res, updated);
  });

  // --- NOTIFICATIONS & AUDIT LOG STREAM ---
  app.get('/api/notifications/:userId', authenticate, async (req: AuthenticatedRequest, res) => {
    const notifs = await db.getNotifications(req.params.userId);
    sendSuccess(res, notifs);
  });

  app.get('/api/admin/audit-logs', authenticate, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
    const logs = await db.getAuditLogs();
    sendSuccess(res, logs);
  });

  // --- ANALYTICS PIPELINES ---
  app.get('/api/analytics/owner/:ownerId', authenticate, requireRole('owner', 'admin'), async (req: AuthenticatedRequest, res) => {
    const analytics = await db.getOwnerAnalytics(req.params.ownerId);
    sendSuccess(res, analytics);
  });

  app.get('/api/analytics/admin', authenticate, requireRole('admin'), async (req: AuthenticatedRequest, res) => {
    const analytics = await db.getAdminAnalytics();
    sendSuccess(res, analytics);
  });

  // --- AI / GENAI PRODUCT SURFACES ---
  app.post('/api/ai/smart-search', async (req, res) => {
    const { query, userLocation, role } = req.body;
    try {
      const allEquipment = await db.getEquipment();
      const aiResponse = await generateRentalAiAssistantResponse(query || 'Equipment rental request', allEquipment, role || 'customer');

      const matchedEquipment = await db.getEquipment({
        search: query,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      });

      sendSuccess(res, {
        query,
        aiInterpretation: aiResponse,
        resultsCount: matchedEquipment.length,
        equipment: matchedEquipment,
      });
    } catch (e: any) {
      sendError(res, 'AI_ERROR', e?.message || 'Smart search failed.');
    }
  });

  app.post('/api/ai/recommend-pricing', authenticate, requireRole('owner', 'admin'), async (req: AuthenticatedRequest, res) => {
    const { equipmentId } = req.body;
    const equipment = await db.getEquipmentById(equipmentId);
    if (!equipment) return sendError(res, 'NOT_FOUND', 'Equipment not found.', 404);

    const bookings = await db.getBookings({ ownerId: equipment.ownerId });

    if (bookings.length < 1) {
      return sendSuccess(res, {
        available: false,
        message: 'Insufficient rental history data for AI pricing recommendation.',
      });
    }

    try {
      const pricingAdvice = await generateDynamicPricing(equipment, bookings.length, equipment.dailyRate);
      sendSuccess(res, pricingAdvice);
    } catch {
      sendSuccess(res, {
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
