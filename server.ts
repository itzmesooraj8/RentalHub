import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { generateDynamicPricing, generateRentalAiAssistantResponse } from './server/geminiService';
import { User, EquipmentCategory } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API HEALTH
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'RentalHub MVP Backend', timestamp: new Date().toISOString() });
  });

  // --- AUTH ENDPOINTS ---
  app.post('/api/auth/login', (req, res) => {
    const { email, role } = req.body;
    let user = db.getUserByEmail(email);

    if (!user) {
      // Find default user by role if provided
      const usersByRole = db.getUsers().filter((u) => u.role === (role || 'customer'));
      user = usersByRole[0] || db.getUsers()[0];
    }

    res.json({
      token: `jwt_mock_token_${user.id}_${Date.now()}`,
      user
    });
  });

  app.post('/api/auth/demo-login', (req, res) => {
    const { role } = req.body; // 'customer' | 'owner' | 'admin'
    const user = db.getUsers().find((u) => u.role === role) || db.getUsers()[0];
    res.json({
      token: `jwt_mock_token_${user.id}_${Date.now()}`,
      user
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, role, phone, location } = req.body;
    const existing = db.getUserByEmail(email);
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
      createdAt: new Date().toISOString(),
      favorites: []
    };

    db.createUser(newUser);
    res.json({
      token: `jwt_mock_token_${newUser.id}_${Date.now()}`,
      user: newUser
    });
  });

  app.get('/api/auth/me/:userId', (req, res) => {
    const user = db.getUserById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });

  app.post('/api/auth/kyc', (req, res) => {
    const { userId, docUrl } = req.body;
    const updated = db.updateUserKyc(userId, 'verified', docUrl);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: updated });
  });

  app.post('/api/auth/favorite', (req, res) => {
    const { userId, equipmentId } = req.body;
    const favorites = db.toggleFavorite(userId, equipmentId);
    res.json({ success: true, favorites });
  });

  // --- EQUIPMENT ENDPOINTS ---
  app.get('/api/equipment', (req, res) => {
    const { category, search, minPrice, maxPrice, location, startDate, endDate, onlyAvailable, sort, ownerId } = req.query;

    const items = db.getEquipment({
      category: category as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location: location as string,
      startDate: startDate as string,
      endDate: endDate as string,
      onlyAvailable: onlyAvailable === 'true',
      sort: sort as string,
      ownerId: ownerId as string
    });

    res.json(items);
  });

  app.get('/api/equipment/:id', (req, res) => {
    const eq = db.getEquipmentById(req.params.id);
    if (!eq) return res.status(404).json({ error: 'Equipment not found' });

    const owner = db.getUserById(eq.ownerId);
    const availability = db.getAvailabilityForEquipment(eq.id);
    const reviews = db.getReviewsForEquipment(eq.id);

    res.json({
      ...eq,
      owner,
      availability,
      reviews
    });
  });

  app.post('/api/equipment', (req, res) => {
    const { ownerId, title, category, description, dailyRate, weeklyRate, securityDeposit, location, lat, lng, images, specs } = req.body;
    const owner = db.getUserById(ownerId);

    if (!owner) return res.status(400).json({ error: 'Valid owner ID is required' });

    const newEq = db.createEquipment({
      ownerId,
      ownerName: owner.name,
      ownerAvatar: owner.avatar,
      ownerTrustScore: owner.trustScore,
      ownerKyVerified: owner.kycStatus === 'verified',
      title,
      category: category as EquipmentCategory,
      description,
      dailyRate: Number(dailyRate),
      weeklyRate: Number(weeklyRate) || Number(dailyRate) * 5,
      securityDeposit: Number(securityDeposit) || 100,
      location,
      lat: Number(lat) || 30.2672,
      lng: Number(lng) || -97.7431,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000'],
      specs: specs || {},
      status: 'active',
      co2SavedPerDayKg: Math.round((Number(dailyRate) / 20) * 10) / 10
    });

    res.json(newEq);
  });

  app.put('/api/equipment/:id', (req, res) => {
    const updated = db.updateEquipment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Equipment not found' });
    res.json(updated);
  });

  app.delete('/api/equipment/:id', (req, res) => {
    const ok = db.deleteEquipment(req.params.id);
    res.json({ success: ok });
  });

  // --- AVAILABILITY ENDPOINTS ---
  app.get('/api/availability/check', (req, res) => {
    const { equipmentId, startDate, endDate } = req.query;
    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const available = db.isEquipmentAvailable(equipmentId as string, startDate as string, endDate as string);
    res.json({ available, equipmentId, startDate, endDate });
  });

  app.post('/api/availability/block', (req, res) => {
    const { equipmentId, startDate, endDate, reason } = req.body;
    const block = db.addAvailabilityBlock({ equipmentId, startDate, endDate, reason: reason || 'owner_block' });
    res.json(block);
  });

  // --- BOOKING ENDPOINTS (WITH TRANSACTIONAL LOCK) ---
  app.get('/api/bookings', (req, res) => {
    const { customerId, ownerId, status } = req.query;
    const bookings = db.getBookings({
      customerId: customerId as string,
      ownerId: ownerId as string,
      status: status as any
    });
    res.json(bookings);
  });

  app.get('/api/bookings/:id', (req, res) => {
    const booking = db.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  });

  app.post('/api/bookings', (req, res) => {
    const { equipmentId, customerId, startDate, endDate, paymentIntentId } = req.body;

    const eq = db.getEquipmentById(equipmentId);
    if (!eq) return res.status(404).json({ error: 'Equipment not found' });

    const cust = db.getUserById(customerId);
    if (!cust) return res.status(404).json({ error: 'Customer not found' });

    // Calculate rental days
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const rentalDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));

    const subtotal = rentalDays * eq.dailyRate;
    const platformFee = Math.round(subtotal * 0.1 * 100) / 100;
    const insuranceFee = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + eq.securityDeposit + platformFee + insuranceFee;

    const priceBreakdown = {
      rentalDays,
      dailyRate: eq.dailyRate,
      subtotal,
      securityDeposit: eq.securityDeposit,
      platformFee,
      insuranceFee,
      total
    };

    const result = db.createBookingWithLock({
      equipmentId,
      equipmentTitle: eq.title,
      equipmentImage: eq.images[0] || '',
      equipmentCategory: eq.category,
      customerId,
      customerName: cust.name,
      customerAvatar: cust.avatar,
      ownerId: eq.ownerId,
      ownerName: eq.ownerName,
      startDate,
      endDate,
      priceBreakdown,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentIntentId: paymentIntentId || `pi_stripe_${Date.now()}`,
      condition: {
        pickupPhotos: [],
        returnPhotos: []
      },
      co2SavedTotalKg: Math.round(rentalDays * eq.co2SavedPerDayKg * 10) / 10
    });

    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }

    res.json(result.booking);
  });

  app.put('/api/bookings/:id/status', (req, res) => {
    const { status } = req.body;
    const updated = db.updateBookingStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Booking not found' });
    res.json(updated);
  });

  app.post('/api/bookings/:id/damage-track', (req, res) => {
    const { pickupPhotos, pickupNotes, returnPhotos, returnNotes, damageDetected } = req.body;
    const updated = db.updateBookingCondition(req.params.id, {
      pickupPhotos,
      pickupNotes,
      returnPhotos,
      returnNotes,
      damageDetected,
      returnDate: returnPhotos?.length ? new Date().toISOString() : undefined
    });
    if (!updated) return res.status(404).json({ error: 'Booking not found' });
    res.json(updated);
  });

  // --- REVIEWS & DISPUTES ENDPOINTS ---
  app.get('/api/reviews', (req, res) => {
    const { equipmentId, userId } = req.query;
    if (equipmentId) return res.json(db.getReviewsForEquipment(equipmentId as string));
    if (userId) return res.json(db.getReviewsForUser(userId as string));
    res.json(db.getReviewsForEquipment('eq_1'));
  });

  app.post('/api/reviews', (req, res) => {
    const review = db.addReview(req.body);
    res.json(review);
  });

  app.get('/api/disputes', (req, res) => {
    res.json(db.getDisputes());
  });

  app.post('/api/disputes', (req, res) => {
    const dispute = db.addDispute(req.body);
    res.json(dispute);
  });

  app.put('/api/disputes/:id/resolve', (req, res) => {
    const { resolutionNotes, refundAmount } = req.body;
    const resolved = db.resolveDispute(req.params.id, resolutionNotes, refundAmount);
    if (!resolved) return res.status(404).json({ error: 'Dispute not found' });
    res.json(resolved);
  });

  // --- NOTIFICATIONS ---
  app.get('/api/notifications/:userId', (req, res) => {
    res.json(db.getNotificationsForUser(req.params.userId));
  });

  app.post('/api/notifications/:userId/read', (req, res) => {
    db.markNotificationsRead(req.params.userId);
    res.json({ success: true });
  });

  // --- ANALYTICS ENDPOINTS ---
  app.get('/api/analytics/owner/:ownerId', (req, res) => {
    const analytics = db.getOwnerAnalytics(req.params.ownerId);
    res.json(analytics);
  });

  app.get('/api/analytics/admin', (req, res) => {
    const analytics = db.getAdminAnalytics();
    res.json(analytics);
  });

  // --- GEMINI AI ENDPOINTS ---
  app.post('/api/ai/dynamic-pricing', async (req, res) => {
    const { equipmentId } = req.body;
    const eq = db.getEquipmentById(equipmentId);
    if (!eq) return res.status(404).json({ error: 'Equipment not found' });

    const ownerBookings = db.getBookings({ ownerId: eq.ownerId });
    const categoryEquipment = db.getEquipment({ category: eq.category });
    const avgRate = Math.round(
      categoryEquipment.reduce((sum, item) => sum + item.dailyRate, 0) / Math.max(1, categoryEquipment.length)
    );

    const suggestion = await generateDynamicPricing(eq, ownerBookings.length, avgRate);
    res.json(suggestion);
  });

  app.post('/api/ai/assistant', async (req, res) => {
    const { userQuery, role } = req.body;
    const allEq = db.getEquipment();
    const answer = await generateRentalAiAssistantResponse(userQuery || 'Recommend top equipment', allEq, role || 'customer');
    res.json({ answer });
  });

  // Vite Middleware for Dev / Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RentalHub full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
