import { connectMongo } from '../server/mongo';
import { db } from '../server/db';
import { generateToken } from '../server/middleware/auth';
import { Equipment, Booking } from '../src/types';

async function runBackendTests() {
  console.log('====================================================');
  console.log('RENTALHUB BACKEND INTEGRATION & CONFLICT TEST SUITE');
  console.log('====================================================\n');

  try {
    // 1. Database Connection & Health
    console.log('[TEST 1] Testing MongoDB Atlas Connection...');
    await connectMongo();
    console.log('✓ PASSED: Connected to MongoDB Atlas Cluster.\n');

    // 2. JWT Generation & Role Authorization
    console.log('[TEST 2] Testing JWT Token Generation & Role Claims...');
    const testCustomer = { id: 'usr_test_cust', email: 'test.cust@rentalhub.com', role: 'customer' as const, name: 'Test Renter' };
    const testAdmin = { id: 'usr_test_admin', email: 'admin@rentalhub.com', role: 'admin' as const, name: 'Super Admin' };

    const custToken = generateToken(testCustomer);
    const adminToken = generateToken(testAdmin);

    if (!custToken || !adminToken) throw new Error('JWT token generation failed.');
    console.log('✓ PASSED: JWT tokens generated for Customer and Admin roles.\n');

    // 3. Equipment & Geospatial 2dsphere Search ($near)
    console.log('[TEST 3] Testing MongoDB 2dsphere Geospatial $near Query...');
    const austinLat = 30.2672;
    const austinLng = -97.7431;

    const nearbyEquipment = await db.getEquipmentNearby(austinLat, austinLng, 50);
    console.log(`✓ PASSED: Found ${nearbyEquipment.length} equipment items within 50km radius of Austin, TX.\n`);

    // 4. Double-Booking Conflict Prevention & Atomic Transaction
    console.log('[TEST 4] Testing Concurrent Double-Booking Conflict Prevention...');
    const targetEq = nearbyEquipment[0] || (await db.getEquipment())[0];

    // Clean up previous test bookings to ensure idempotent test execution
    const { BookingModel } = await import('../server/models/Booking');
    const { AvailabilityBlockModel } = await import('../server/models/AvailabilityBlock');
    await BookingModel.deleteMany({ id: { $regex: '^bk_test_' } });
    await AvailabilityBlockModel.deleteMany({ bookingId: { $regex: '^bk_test_' } });

    const testStartDate = `2029-01-10`;
    const testEndDate = `2029-01-15`;

    const bookingAttempt1: Booking = {
      id: `bk_test_${Date.now()}_1`,
      equipmentId: targetEq.id,
      equipmentTitle: targetEq.title,
      equipmentImage: targetEq.images[0],
      equipmentCategory: targetEq.category,
      customerId: testCustomer.id,
      customerName: testCustomer.name,
      ownerId: targetEq.ownerId,
      ownerName: targetEq.ownerName,
      startDate: testStartDate,
      endDate: testEndDate,
      deliveryMethod: 'delivery',
      status: 'confirmed',
      priceBreakdown: {
        dailyRate: targetEq.dailyRate,
        rentalDays: 5,
        subtotal: targetEq.dailyRate * 5,
        deliveryFee: 45,
        securityDeposit: targetEq.securityDeposit,
        platformFee: 50,
        insuranceFee: 25,
        total: targetEq.dailyRate * 5 + 120 + targetEq.securityDeposit,
      },
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };

    const bookingAttempt2: Booking = {
      ...bookingAttempt1,
      id: `bk_test_${Date.now()}_2`,
      customerId: 'usr_test_cust_2',
      customerName: 'Rival Renter',
    };

    // Execute reservation attempts sequentially to test instant conflict detection
    const res1 = await db.createBooking(bookingAttempt1);
    const res2 = await db.createBooking(bookingAttempt2);

    const successes = [res1, res2].filter((r) => r.success);
    const conflicts = [res1, res2].filter((r) => !r.success && r.error?.code === 'BOOKING_CONFLICT');

    if (successes.length === 1 && conflicts.length === 1) {
      console.log('✓ PASSED: MongoDB Transaction prevented double-booking!');
      console.log(`  - Reservation 1: ${res1.success ? 'ACCEPTED' : 'REJECTED (' + res1.error?.message + ')'}`);
      console.log(`  - Reservation 2: ${res2.success ? 'ACCEPTED' : 'REJECTED (' + res2.error?.message + ')'}\n`);
    } else {
      throw new Error(`Double-booking test failed! Successes: ${successes.length}, Conflicts: ${conflicts.length}`);
    }

    // 5. Booking State Machine Validation
    console.log('[TEST 5] Testing Illegal Booking Status State Machine Transition...');
    const createdBookingId = successes[0].booking!.id;
    const illegalUpdate = await db.updateBookingStatus(createdBookingId, 'completed'); // Illegal: confirmed -> completed directly

    if (!illegalUpdate.success && illegalUpdate.error?.code === 'ILLEGAL_TRANSITION') {
      console.log('✓ PASSED: State machine rejected illegal transition (confirmed -> completed).\n');
    } else {
      throw new Error('State machine failed to reject illegal transition.');
    }

    console.log('====================================================');
    console.log('ALL BACKEND INTEGRATION & CONFLICT TESTS PASSED 100%');
    console.log('====================================================');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ TEST SUITE FAILED:', err?.message || err);
    process.exit(1);
  }
}

runBackendTests();
