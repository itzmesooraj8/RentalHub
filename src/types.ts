export type UserRole = 'customer' | 'owner' | 'admin';

export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  location?: string;
  bio?: string;
  trustScore: number;
  kycStatus?: KycStatus;
  kycVerified?: boolean;
  memberSince?: string;
  kycDocUrl?: string;
  completedRentalsCount?: number;
  onTimeReturnRate?: number;
  createdAt?: string;
  favorites?: string[];
}

export type EquipmentCategory =
  | 'Heavy Machinery'
  | 'Power Tools'
  | 'Event & Audio'
  | 'Photography & Drones'
  | 'Landscaping & Lawn'
  | 'Vehicles & Trailers'
  | 'Agriculture & Farming'
  | 'Manufacturing & Industrial'
  | 'Logistics & Cargo'
  | 'Sports & Outdoors'
  | 'Science & Lab'
  | 'All';

export interface EquipmentSpecs {
  [key: string]: string;
}

export interface Equipment {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerTrustScore: number;
  ownerKyVerified: boolean;
  title: string;
  category: EquipmentCategory | string;
  industry?: string;
  description: string;
  dailyRate: number;
  weeklyRate: number;
  securityDeposit: number;
  location: string;
  lat: number;
  lng: number;
  coordinates?: { lat: number; lng: number };
  images: string[];
  specs: EquipmentSpecs;
  status?: 'active' | 'maintenance' | 'unlisted';
  availabilityStatus?: 'available' | 'booked' | 'maintenance';
  approvedByAdmin?: boolean;
  rating: number;
  reviewCount: number;
  co2SavedPerDayKg: number;
  createdAt?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AvailabilityBlock {
  id: string;
  equipmentId: string;
  startDate: string;
  endDate: string;
  reason: 'booking' | 'maintenance' | 'owner_block';
  bookingId?: string;
}

export type BookingStatus =
  | 'pending'
  | 'locked'
  | 'confirmed'
  | 'pickup_ready'
  | 'active'
  | 'return_pending'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface ConditionPhotos {
  pickupPhotos?: string[];
  pickupNotes?: string;
  pickupDate?: string;
  returnPhotos?: string[];
  returnNotes?: string;
  returnDate?: string;
  damageDetected?: boolean;
}

export interface PriceBreakdown {
  rentalDays: number;
  dailyRate: number;
  subtotal: number;
  deliveryFee?: number;
  securityDeposit: number;
  platformFee: number;
  insuranceFee: number;
  total: number;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  equipmentImage: string;
  equipmentCategory?: EquipmentCategory | string;
  customerId: string;
  renterId?: string;
  customerName: string;
  renterName?: string;
  customerAvatar?: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  deliveryMethod?: 'pickup' | 'delivery';
  deliveryAddress?: string;
  priceBreakdown: PriceBreakdown;
  status: BookingStatus;
  paymentStatus?: 'paid' | 'pending' | 'refunded';
  paymentIntentId?: string;
  pickupTimestamp?: string;
  returnTimestamp?: string;
  conditionReportBefore?: {
    notes?: string;
    photos?: string[];
    verifiedBy?: string;
    timestamp?: string;
  };
  conditionReportAfter?: {
    notes?: string;
    photos?: string[];
    verifiedBy?: string;
    timestamp?: string;
  };
  damageReport?: {
    description?: string;
    photos?: string[];
    claimedAmount?: number;
    reportedBy?: string;
    timestamp?: string;
  };
  condition?: ConditionPhotos;
  damagePhotos?: string[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  conditionNotes?: string;
  hasDisputeFlag?: boolean;
  co2SavedTotalKg?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  itemCount?: number;
  industry?: string;
}

export interface Review {
  id: string;
  bookingId?: string;
  equipmentId: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  fromRole?: 'customer' | 'owner';
  toUserId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  equipmentTitle: string;
  raisedByUserId?: string;
  raisedByName?: string;
  raisedByRole?: UserRole;
  againstUserId?: string;
  againstName?: string;
  renterName?: string;
  ownerName?: string;
  reason: string;
  description: string;
  photos?: string[];
  amountClaimed?: number;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed' | 'resolved_renter' | 'resolved_owner';
  resolutionNotes?: string;
  refundAmount?: number;
  createdAt: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking_request' | 'booking_confirmed' | 'pickup_reminder' | 'return_reminder' | 'dispute_alert' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface DynamicPricingSuggestion {
  equipmentId: string;
  currentRate: number;
  suggestedRate: number;
  demandLevel: 'low' | 'moderate' | 'high' | 'peak';
  confidenceScore: number;
  reasoning: string[];
  seasonalMultiplier: number;
  projectedRevenueIncreasePct: number;
}

export interface OwnerAnalytics {
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number; bookingsCount: number }[];
  utilizationRatePct: number;
  idleCostEstimate: number;
  totalBookings: number;
  activeEquipmentCount: number;
  topPerformingEquipment: { title: string; revenue: number; utilizationPct: number }[];
  totalCo2SavedKg: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  customersCount: number;
  ownersCount: number;
  totalEquipment: number;
  pendingApprovals: number;
  totalBookingsCount: number;
  grossTransactionVolume: number;
  platformFeesEarned: number;
  openDisputesCount: number;
  totalCo2SavedKg: number;
}

export interface AnalyticsData {
  totalRevenue: number;
  completedRentals: number;
  assetUtilizationRate: number;
  co2SavedKg: number;
}

export type EscrowStatus = 'HELD' | 'RELEASED' | 'DISPUTED' | 'REFUNDED';

export interface EscrowLedgerEntry {
  action: string;
  timestamp: string;
  actor: string;
  status: EscrowStatus;
  notes?: string;
}

export interface EscrowLedger {
  id: string;
  bookingId: string;
  equipmentId: string;
  equipmentTitle?: string;
  customerId: string;
  customerName?: string;
  ownerId: string;
  ownerName?: string;
  amount: number;
  securityDeposit: number;
  status: EscrowStatus;
  heldAt: string;
  releasedAt?: string;
  disputedAt?: string;
  ledgerHistory: EscrowLedgerEntry[];
  createdAt?: string;
}

export interface PreDispatchInspectionResult {
  bookingId: string;
  conditionType: 'pickup' | 'return' | 'damage';
  anomalyDetected: boolean;
  structuralIntegrityScore: number;
  crackCount: number;
  leakDetected: boolean;
  confidenceScore: number;
  inspectionSummary: string;
  recommendedAction: 'APPROVE_DISPATCH' | 'NEEDS_OWNER_REVIEW' | 'FLAG_FOR_DISPUTE';
  timestamp: string;
}

