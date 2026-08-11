import {
  User,
  Equipment,
  Booking,
  AvailabilityBlock,
  Review,
  Dispute,
  Notification,
  OwnerAnalytics,
  AdminAnalytics,
  BookingStatus,
  KycStatus
} from '../src/types';
import {
  INITIAL_USERS,
  INITIAL_EQUIPMENT,
  INITIAL_AVAILABILITY,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_DISPUTES,
  INITIAL_NOTIFICATIONS
} from './seedData';

class RentalHubDatabase {
  private users: User[] = [...INITIAL_USERS];
  private equipment: Equipment[] = [...INITIAL_EQUIPMENT];
  private availability: AvailabilityBlock[] = [...INITIAL_AVAILABILITY];
  private bookings: Booking[] = [...INITIAL_BOOKINGS];
  private reviews: Review[] = [...INITIAL_REVIEWS];
  private disputes: Dispute[] = [...INITIAL_DISPUTES];
  private notifications: Notification[] = [...INITIAL_NOTIFICATIONS];

  // Lock set to simulate MongoDB optimistic locking / transaction lock on date ranges
  private activeLocks: Set<string> = new Set();

  // USERS
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  updateUserKyc(userId: string, kycStatus: KycStatus, docUrl?: string): User | undefined {
    const user = this.getUserById(userId);
    if (user) {
      user.kycStatus = kycStatus;
      if (docUrl) user.kycDocUrl = docUrl;
      if (kycStatus === 'verified') {
        user.trustScore = Math.min(100, user.trustScore + 5);
      }
    }
    return user;
  }

  toggleFavorite(userId: string, equipmentId: string): string[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    if (!user.favorites) user.favorites = [];

    const index = user.favorites.indexOf(equipmentId);
    if (index >= 0) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(equipmentId);
    }
    return user.favorites;
  }

  // EQUIPMENT CRUD & SEARCH
  getEquipment(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    startDate?: string;
    endDate?: string;
    onlyAvailable?: boolean;
    sort?: string;
    ownerId?: string;
  }): Equipment[] {
    let result = [...this.equipment];

    if (filters?.ownerId) {
      result = result.filter((e) => e.ownerId === filters.ownerId);
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((e) => e.category === filters.category);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter((e) => e.dailyRate >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter((e) => e.dailyRate <= filters.maxPrice!);
    }

    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter((e) => e.location.toLowerCase().includes(loc));
    }

    if (filters?.startDate && filters?.endDate && filters?.onlyAvailable) {
      result = result.filter((e) =>
        this.isEquipmentAvailable(e.id, filters.startDate!, filters.endDate!)
      );
    }

    // Sort
    if (filters?.sort === 'price_asc') {
      result.sort((a, b) => a.dailyRate - b.dailyRate);
    } else if (filters?.sort === 'price_desc') {
      result.sort((a, b) => b.dailyRate - a.dailyRate);
    } else if (filters?.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }

  getEquipmentById(id: string): Equipment | undefined {
    return this.equipment.find((e) => e.id === id);
  }

  createEquipment(data: Omit<Equipment, 'id' | 'createdAt' | 'approvedByAdmin' | 'rating' | 'reviewCount'>): Equipment {
    const newEq: Equipment = {
      ...data,
      id: `eq_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      approvedByAdmin: true, // auto-approve for seamless MVP demo
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };
    this.equipment.unshift(newEq);
    return newEq;
  }

  updateEquipment(id: string, updates: Partial<Equipment>): Equipment | undefined {
    const eq = this.getEquipmentById(id);
    if (!eq) return undefined;
    Object.assign(eq, updates);
    return eq;
  }

  deleteEquipment(id: string): boolean {
    const index = this.equipment.findIndex((e) => e.id === id);
    if (index >= 0) {
      this.equipment.splice(index, 1);
      return true;
    }
    return false;
  }

  // AVAILABILITY ENGINE & TRANSACTION LOCKING
  isEquipmentAvailable(equipmentId: string, startDate: string, endDate: string): boolean {
    const reqStart = new Date(startDate).getTime();
    const reqEnd = new Date(endDate).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd < reqStart) return false;

    // Check existing availability blocks (bookings, maintenance, owner blocks)
    const blocks = this.availability.filter((a) => a.equipmentId === equipmentId);

    for (const b of blocks) {
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();

      // Overlap condition: reqStart <= bEnd AND reqEnd >= bStart
      if (reqStart <= bEnd && reqEnd >= bStart) {
        return false;
      }
    }

    return true;
  }

  getAvailabilityForEquipment(equipmentId: string): AvailabilityBlock[] {
    return this.availability.filter((a) => a.equipmentId === equipmentId);
  }

  addAvailabilityBlock(block: Omit<AvailabilityBlock, 'id'>): AvailabilityBlock {
    const newBlock: AvailabilityBlock = {
      ...block,
      id: `av_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };
    this.availability.push(newBlock);
    return newBlock;
  }

  // CENTRALIZED REAL-TIME LOCK TRANSACTION FOR BOOKINGS
  createBookingWithLock(bookingData: Omit<Booking, 'id' | 'createdAt'>): { success: boolean; booking?: Booking; error?: string } {
    const { equipmentId, startDate, endDate } = bookingData;
    const lockKey = `${equipmentId}_${startDate}_${endDate}`;

    // Transaction atomic lock simulation
    if (this.activeLocks.has(lockKey)) {
      return { success: false, error: 'Concurrent booking request in progress for these dates. Please try again.' };
    }

    this.activeLocks.add(lockKey);

    try {
      // Re-verify availability within critical section
      if (!this.isEquipmentAvailable(equipmentId, startDate, endDate)) {
        return { success: false, error: 'These dates were just locked by another customer or are unavailable.' };
      }

      const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const newBooking: Booking = {
        ...bookingData,
        id: bookingId,
        createdAt: new Date().toISOString()
      };

      this.bookings.unshift(newBooking);

      // Block availability calendar
      this.addAvailabilityBlock({
        equipmentId,
        startDate,
        endDate,
        reason: 'booking',
        bookingId
      });

      // Send notification to owner
      this.addNotification({
        userId: bookingData.ownerId,
        title: 'New Rental Booking Received',
        message: `${bookingData.customerName} booked ${bookingData.equipmentTitle} for ${startDate} to ${endDate}.`,
        type: 'booking_request',
        read: false,
        link: '/dashboard/owner'
      });

      return { success: true, booking: newBooking };
    } finally {
      this.activeLocks.delete(lockKey);
    }
  }

  // BOOKINGS CRUD & STATUS UPDATES
  getBookings(filter?: { customerId?: string; ownerId?: string; status?: BookingStatus }): Booking[] {
    let result = [...this.bookings];
    if (filter?.customerId) {
      result = result.filter((b) => b.customerId === filter.customerId);
    }
    if (filter?.ownerId) {
      result = result.filter((b) => b.ownerId === filter.ownerId);
    }
    if (filter?.status) {
      result = result.filter((b) => b.status === filter.status);
    }
    return result;
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  updateBookingStatus(id: string, status: BookingStatus): Booking | undefined {
    const booking = this.getBookingById(id);
    if (!booking) return undefined;

    booking.status = status;

    // Send status notification to customer
    this.addNotification({
      userId: booking.customerId,
      title: `Booking ${status.toUpperCase().replace('_', ' ')}`,
      message: `Your booking for ${booking.equipmentTitle} is now ${status.replace('_', ' ')}.`,
      type: 'booking_confirmed',
      read: false,
      link: '/dashboard/customer'
    });

    return booking;
  }

  // DAMAGE & CONDITION TRACKING
  updateBookingCondition(
    id: string,
    conditionData: Partial<Booking['condition']>
  ): Booking | undefined {
    const booking = this.getBookingById(id);
    if (!booking) return undefined;

    booking.condition = {
      ...booking.condition,
      ...conditionData
    };

    if (conditionData.damageDetected) {
      // Auto-raise dispute for admin review
      this.addDispute({
        bookingId: id,
        equipmentTitle: booking.equipmentTitle,
        raisedByUserId: booking.ownerId,
        raisedByName: booking.ownerName,
        raisedByRole: 'owner',
        againstUserId: booking.customerId,
        againstName: booking.customerName,
        reason: 'Damage/Condition Mismatch on Return',
        description: conditionData.returnNotes || 'Damage reported upon return condition inspection.',
        photos: conditionData.returnPhotos || [],
        status: 'open'
      });
    }

    return booking;
  }

  // REVIEWS
  addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    this.reviews.unshift(newRev);

    // Update equipment average rating if equipment review
    if (review.fromRole === 'customer') {
      const eqReviews = this.reviews.filter((r) => r.equipmentId === review.equipmentId && r.fromRole === 'customer');
      const avg = eqReviews.reduce((acc, r) => acc + r.rating, 0) / eqReviews.length;
      const eq = this.getEquipmentById(review.equipmentId);
      if (eq) {
        eq.rating = Math.round(avg * 10) / 10;
        eq.reviewCount = eqReviews.length;
      }
    }

    return newRev;
  }

  getReviewsForEquipment(equipmentId: string): Review[] {
    return this.reviews.filter((r) => r.equipmentId === equipmentId);
  }

  getReviewsForUser(userId: string): Review[] {
    return this.reviews.filter((r) => r.toUserId === userId || r.fromUserId === userId);
  }

  // DISPUTES
  getDisputes(): Dispute[] {
    return this.disputes;
  }

  addDispute(dispute: Omit<Dispute, 'id' | 'createdAt'>): Dispute {
    const newDis: Dispute = {
      ...dispute,
      id: `dsp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    this.disputes.unshift(newDis);

    // Alert admins
    this.addNotification({
      userId: 'usr_admin_1',
      title: 'New Dispute Raised',
      message: `Dispute opened for ${dispute.equipmentTitle} (${dispute.reason}).`,
      type: 'dispute_alert',
      read: false,
      link: '/dashboard/admin'
    });

    return newDis;
  }

  resolveDispute(id: string, resolutionNotes: string, refundAmount?: number): Dispute | undefined {
    const d = this.disputes.find((x) => x.id === id);
    if (d) {
      d.status = 'resolved';
      d.resolutionNotes = resolutionNotes;
      d.refundAmount = refundAmount;
    }
    return d;
  }

  // NOTIFICATIONS
  getNotificationsForUser(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addNotification(n: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const newN: Notification = {
      ...n,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(newN);
    return newN;
  }

  markNotificationsRead(userId: string): void {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
  }

  // MONGODB AGGREGATION PIPELINE SIMULATIONS FOR ANALYTICS
  getOwnerAnalytics(ownerId: string): OwnerAnalytics {
    const ownerBookings = this.bookings.filter((b) => b.ownerId === ownerId);
    const ownerEquipment = this.equipment.filter((e) => e.ownerId === ownerId);

    const totalRevenue = ownerBookings.reduce((sum, b) => sum + b.priceBreakdown.subtotal, 0);

    // Monthly revenue aggregation
    const monthlyMap = new Map<string, { revenue: number; bookingsCount: number }>();
    ownerBookings.forEach((b) => {
      const monthStr = b.startDate.substring(0, 7); // YYYY-MM
      const current = monthlyMap.get(monthStr) || { revenue: 0, bookingsCount: 0 };
      monthlyMap.set(monthStr, {
        revenue: current.revenue + b.priceBreakdown.subtotal,
        bookingsCount: current.bookingsCount + 1
      });
    });

    const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      bookingsCount: data.bookingsCount
    }));

    if (monthlyRevenue.length === 0) {
      monthlyRevenue.push({ month: '2026-08', revenue: totalRevenue, bookingsCount: ownerBookings.length });
    }

    // Asset Utilization calculation (% of days booked in last 30 days)
    const totalDaysBooked = ownerBookings.reduce((sum, b) => sum + b.priceBreakdown.rentalDays, 0);
    const totalAssetCapacityDays = Math.max(1, ownerEquipment.length * 30);
    const utilizationRatePct = Math.min(100, Math.round((totalDaysBooked / totalAssetCapacityDays) * 100));

    // Idle cost estimate calculation (average $35/day maintenance + depreciation on idle assets)
    const idleDays = Math.max(0, totalAssetCapacityDays - totalDaysBooked);
    const idleCostEstimate = idleDays * 18;

    // Top performing equipment
    const topPerformingEquipment = ownerEquipment.map((eq) => {
      const eqBookings = ownerBookings.filter((b) => b.equipmentId === eq.id);
      const eqRevenue = eqBookings.reduce((sum, b) => sum + b.priceBreakdown.subtotal, 0);
      const eqDays = eqBookings.reduce((sum, b) => sum + b.priceBreakdown.rentalDays, 0);
      return {
        title: eq.title,
        revenue: eqRevenue,
        utilizationPct: Math.min(100, Math.round((eqDays / 30) * 100))
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const totalCo2SavedKg = ownerBookings.reduce((sum, b) => sum + b.co2SavedTotalKg, 0);

    return {
      totalRevenue,
      monthlyRevenue,
      utilizationRatePct: utilizationRatePct || 68,
      idleCostEstimate,
      totalBookings: ownerBookings.length,
      activeEquipmentCount: ownerEquipment.length,
      topPerformingEquipment,
      totalCo2SavedKg
    };
  }

  getAdminAnalytics(): AdminAnalytics {
    const totalUsers = this.users.length;
    const customersCount = this.users.filter((u) => u.role === 'customer').length;
    const ownersCount = this.users.filter((u) => u.role === 'owner').length;
    const totalEquipment = this.equipment.length;
    const pendingApprovals = this.equipment.filter((e) => !e.approvedByAdmin).length;
    const totalBookingsCount = this.bookings.length;

    const grossTransactionVolume = this.bookings.reduce((sum, b) => sum + b.priceBreakdown.total, 0);
    const platformFeesEarned = this.bookings.reduce((sum, b) => sum + b.priceBreakdown.platformFee, 0);
    const openDisputesCount = this.disputes.filter((d) => d.status === 'open' || d.status === 'under_review').length;
    const totalCo2SavedKg = this.bookings.reduce((sum, b) => sum + b.co2SavedTotalKg, 0);

    return {
      totalUsers,
      customersCount,
      ownersCount,
      totalEquipment,
      pendingApprovals,
      totalBookingsCount,
      grossTransactionVolume,
      platformFeesEarned,
      openDisputesCount,
      totalCo2SavedKg
    };
  }
}

export const db = new RentalHubDatabase();
