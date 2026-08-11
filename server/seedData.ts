import { User, Equipment, Booking, AvailabilityBlock, Review, Dispute, Notification } from '../src/types';

export const INITIAL_USERS: (User & { passwordHash?: string })[] = [
  {
    id: 'usr_owner_1',
    name: 'Aarav Sharma',
    email: 'aarav@heavyrentals.in',
    passwordHash: '$2a$10$f3rQ7tW5o2Y9N6e3m1b0u.4c8K7a9L2m5N8e1b0u.4c8K7a9L2m5N', // password123
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    phone: '+91 98200 12345',
    location: 'Mumbai, MH',
    bio: 'Multi-industry equipment & asset owner providing construction, agricultural, and industrial tools.',
    trustScore: 98,
    kycStatus: 'verified',
    kycDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
    completedRentalsCount: 142,
    onTimeReturnRate: 99,
    createdAt: '2024-01-15T08:00:00Z',
    favorites: ['eq_1', 'eq_3']
  },
  {
    id: 'usr_owner_2',
    name: 'Priya Patel',
    email: 'priya@audiovision.in',
    passwordHash: '$2a$10$f3rQ7tW5o2Y9N6e3m1b0u.4c8K7a9L2m5N8e1b0u.4c8K7a9L2m5N',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    phone: '+91 98450 67890',
    location: 'Bengaluru, KA',
    bio: 'Event producer & cinema gear specialist providing high-end media kits, audio rigs, and drone optics.',
    trustScore: 96,
    kycStatus: 'verified',
    kycDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
    completedRentalsCount: 89,
    onTimeReturnRate: 97,
    createdAt: '2024-02-10T10:00:00Z',
    favorites: []
  },
  {
    id: 'usr_cust_1',
    name: 'Ananya Iyer',
    email: 'ananya.i@contracting.in',
    passwordHash: '$2a$10$f3rQ7tW5o2Y9N6e3m1b0u.4c8K7a9L2m5N8e1b0u.4c8K7a9L2m5N',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    phone: '+91 98110 54321',
    location: 'New Delhi, NCR',
    bio: 'Residential renovation contractor and event organizer.',
    trustScore: 99,
    kycStatus: 'verified',
    completedRentalsCount: 28,
    onTimeReturnRate: 100,
    createdAt: '2024-03-01T12:00:00Z',
    favorites: ['eq_2', 'eq_5', 'eq_8']
  },
  {
    id: 'usr_cust_2',
    name: 'Rohan Verma',
    email: 'rohan@landscapedesign.in',
    passwordHash: '$2a$10$f3rQ7tW5o2Y9N6e3m1b0u.4c8K7a9L2m5N8e1b0u.4c8K7a9L2m5N',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    phone: '+91 98765 43210',
    location: 'Hyderabad, TS',
    bio: 'Agricultural & landscape specialist renting specialized earthmovers and tillers.',
    trustScore: 94,
    kycStatus: 'verified',
    completedRentalsCount: 15,
    onTimeReturnRate: 96,
    createdAt: '2024-04-12T14:30:00Z',
    favorites: ['eq_1']
  },
  {
    id: 'usr_admin_1',
    name: 'Platform Admin',
    email: 'admin@rentalhub.com',
    passwordHash: '$2a$10$f3rQ7tW5o2Y9N6e3m1b0u.4c8K7a9L2m5N8e1b0u.4c8K7a9L2m5N',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    phone: '+91 1800 123 4822',
    location: 'New Delhi, India',
    bio: 'RentalHub Trust & Safety Platform Operations Administrator.',
    trustScore: 100,
    kycStatus: 'verified',
    completedRentalsCount: 500,
    onTimeReturnRate: 100,
    createdAt: '2023-11-01T00:00:00Z',
    favorites: []
  }
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq_1',
    ownerId: 'usr_owner_1',
    ownerName: 'Aarav Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 98,
    ownerKyVerified: true,
    title: 'Caterpillar 302.7 CR Mini Excavator',
    category: 'Heavy Machinery',
    industry: 'Construction',
    description: 'Compact 2.7-ton CR mini excavator with enclosed cab, AC, quick coupler, 12" and 24" buckets. Ideal for trenching, foundation prep, and landscape excavating.',
    dailyRate: 285,
    weeklyRate: 1400,
    securityDeposit: 500,
    location: 'Mumbai, MH',
    lat: 19.0760,
    lng: 72.8777,
    images: [
      'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'Operating Weight': '2,670 kg',
      'Max Dig Depth': '2,740 mm',
      'Engine Power': '23.6 HP Diesel',
      'Fuel Capacity': '45 L'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 4.9,
    reviewCount: 24,
    co2SavedPerDayKg: 18.5,
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'eq_2',
    ownerId: 'usr_owner_1',
    ownerName: 'Aarav Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 98,
    ownerKyVerified: true,
    title: 'Bobcat T590 Compact Track Loader / Skid Steer',
    category: 'Heavy Machinery',
    industry: 'Construction',
    description: 'Powerful rubber-tracked skid steer with 66" smooth bucket and hydraulic auger attachment. High flow hydraulics for demanding job sites.',
    dailyRate: 320,
    weeklyRate: 1650,
    securityDeposit: 600,
    location: 'Bengaluru, KA',
    lat: 12.9716,
    lng: 77.5946,
    images: [
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'ROC': '998 kg',
      'Engine': '66 HP Tier 4',
      'Track Width': '320 mm',
      'Travel Speed': '11.8 km/h'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 4.8,
    reviewCount: 19,
    co2SavedPerDayKg: 22.0,
    createdAt: '2024-01-22T14:00:00Z'
  },
  {
    id: 'eq_3',
    ownerId: 'usr_owner_1',
    ownerName: 'Aarav Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 98,
    ownerKyVerified: true,
    title: 'John Deere 5075E Utility Tractor (75 HP 4WD)',
    category: 'Agriculture & Farming',
    industry: 'Agriculture',
    description: 'Heavy duty 75 HP diesel utility tractor equipped with front loader bucket, 3-point hitch, dual rear hydraulic SCVs, and power reverser transmission for heavy farm work.',
    dailyRate: 260,
    weeklyRate: 1250,
    securityDeposit: 500,
    location: 'New Delhi, NCR',
    lat: 28.6139,
    lng: 77.2090,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'Horsepower': '75 HP',
      'Drive Type': '4WD Power Reverser',
      'PTO Power': '61 HP',
      'Lift Capacity': '1,450 kg'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 4.95,
    reviewCount: 15,
    co2SavedPerDayKg: 24.5,
    createdAt: '2024-01-25T08:00:00Z'
  },
  {
    id: 'eq_4',
    ownerId: 'usr_owner_2',
    ownerName: 'Priya Patel',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 96,
    ownerKyVerified: true,
    title: 'RED V-Raptor 8K VV Cinema Camera Package',
    category: 'Photography & Drones',
    industry: 'Photography & Media',
    description: 'Full cinema kit including RED V-Raptor 8K VV body, 3x 2TB PRO CFexpress cards, RED Touch 7.0" LCD, V-mount battery module, wooden camera cage, and hard Pelican rolling case.',
    dailyRate: 450,
    weeklyRate: 2200,
    securityDeposit: 1200,
    location: 'Hyderabad, TS',
    lat: 17.3850,
    lng: 78.4867,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'Sensor': '35.4 MP CMOS Multi-Format',
      'Resolution': '8K @ 120 fps',
      'Dynamic Range': '17+ stops',
      'Lens Mount': 'RF Mount (PL Adapter included)'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 4.95,
    reviewCount: 16,
    co2SavedPerDayKg: 6.8,
    createdAt: '2024-02-15T11:00:00Z'
  },
  {
    id: 'eq_5',
    ownerId: 'usr_owner_2',
    ownerName: 'Priya Patel',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 96,
    ownerKyVerified: true,
    title: 'DJI Inspire 3 Cinema Drone Pro Combo',
    category: 'Photography & Drones',
    industry: 'Photography & Media',
    description: 'Full-frame 8K ProRes RAW airborne camera drone with RC Plus dual controllers, 6x TB51 batteries, charging hub, RTK high precision positioning, and master lens kit.',
    dailyRate: 380,
    weeklyRate: 1850,
    securityDeposit: 1000,
    location: 'Chennai, TN',
    lat: 13.0827,
    lng: 80.2707,
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'Camera': 'Zenmuse X9-8K Air',
      'Flight Time': 'Up to 28 mins per battery',
      'Max Speed': '94 km/h',
      'Transmission': 'O3 Pro 15km'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 5.0,
    reviewCount: 12,
    co2SavedPerDayKg: 8.0,
    createdAt: '2024-02-18T16:00:00Z'
  },
  {
    id: 'eq_6',
    ownerId: 'usr_owner_2',
    ownerName: 'Priya Patel',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 96,
    ownerKyVerified: true,
    title: 'JBL VTX A8 Line Array Concert Sound System (20,000W)',
    category: 'Event & Audio',
    industry: 'Events',
    description: 'Concert-grade sound reinforcement system including 4x JBL VTX A8 tops, 2x VTX B18 subwoofers, Crown I-Tech 4x3500HD amplifier rack, digital mixing console, and cabling.',
    dailyRate: 520,
    weeklyRate: 2500,
    securityDeposit: 1000,
    location: 'Pune, MH',
    lat: 18.5204,
    lng: 73.8567,
    images: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'Max SPL': '139 dB',
      'Total Output': '20,000W RMS',
      'Coverage': '110° Horizontal Dispersion',
      'Ideal Audience': '500 - 2,000 people'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 4.88,
    reviewCount: 22,
    co2SavedPerDayKg: 14.5,
    createdAt: '2024-03-01T12:00:00Z'
  },
  {
    id: 'eq_7',
    ownerId: 'usr_owner_1',
    ownerName: 'Aarav Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 98,
    ownerKyVerified: true,
    title: 'Hyster 5,000 lbs Cushion Tire Forklift',
    category: 'Logistics & Cargo',
    industry: 'Logistics',
    description: 'Reliable LPG powered warehouse forklift with 189" 3-stage mast, side shifter, full free lift, non-marking cushion tires. Ideal for warehouse unloading and factory freight handling.',
    dailyRate: 180,
    weeklyRate: 850,
    securityDeposit: 400,
    location: 'Ahmedabad, GJ',
    lat: 23.0225,
    lng: 72.5714,
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1586191582152-32a8848d56a3?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'Lift Capacity': '5,000 lbs (2,268 kg)',
      'Max Lift Height': '189 in (4.8 m)',
      'Fuel Type': 'LPG Propane',
      'Features': 'Side Shift & Tilt'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 4.9,
    reviewCount: 28,
    co2SavedPerDayKg: 16.0,
    createdAt: '2024-03-05T09:30:00Z'
  },
  {
    id: 'eq_8',
    ownerId: 'usr_owner_1',
    ownerName: 'Aarav Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 98,
    ownerKyVerified: true,
    title: 'Miller Trailblazer 325 Diesel Welder / 12,000W Generator',
    category: 'Manufacturing & Industrial',
    industry: 'Manufacturing',
    description: 'Commercial engine-driven multi-process welder (Stick, TIG, MIG) combined with a 12,000W clean sine-wave generator. Mounted on road-ready highway trailer with leads.',
    dailyRate: 145,
    weeklyRate: 680,
    securityDeposit: 350,
    location: 'Kolkata, WB',
    lat: 22.5726,
    lng: 88.3639,
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'Welding Output': '325A @ 100% Duty Cycle',
      'Generator Peak': '12,000 Watts',
      'Engine': 'Kubota Diesel 25 HP',
      'Weight': '520 kg'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 4.92,
    reviewCount: 41,
    co2SavedPerDayKg: 15.0,
    createdAt: '2024-03-10T15:00:00Z'
  },
  {
    id: 'eq_9',
    ownerId: 'usr_owner_2',
    ownerName: 'Priya Patel',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    ownerTrustScore: 96,
    ownerKyVerified: true,
    title: 'FLIR T865 High-Performance Thermal Camera System',
    category: 'Science & Lab',
    industry: 'Education & Labs',
    description: 'Precision radiometric infrared camera with 640x480 resolution, ultra-sharp thermal imaging, continuous autofocus, and Wi-Fi data streaming for industrial & lab diagnostics.',
    dailyRate: 210,
    weeklyRate: 980,
    securityDeposit: 600,
    location: 'Jaipur, RJ',
    lat: 26.9124,
    lng: 75.7873,
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: {
      'IR Resolution': '640 x 480 (307,200 pixels)',
      'Temp Range': '-40°C to 2,000°C',
      'Accuracy': '±1°C or ±1%',
      'Display': '4" Touchscreen LCD'
    },
    status: 'active',
    approvedByAdmin: true,
    rating: 5.0,
    reviewCount: 9,
    co2SavedPerDayKg: 5.2,
    createdAt: '2024-03-15T11:00:00Z'
  }
];

export const INITIAL_AVAILABILITY: any[] = [
  { id: 'av_1_1', equipmentId: 'eq_1', date: '2026-08-15', bookingId: 'bk_1', reason: 'booking' },
  { id: 'av_1_2', equipmentId: 'eq_1', date: '2026-08-16', bookingId: 'bk_1', reason: 'booking' },
  { id: 'av_1_3', equipmentId: 'eq_1', date: '2026-08-17', bookingId: 'bk_1', reason: 'booking' },
  { id: 'av_1_4', equipmentId: 'eq_1', date: '2026-08-18', bookingId: 'bk_1', reason: 'booking' },
  { id: 'av_2_1', equipmentId: 'eq_4', date: '2026-08-20', bookingId: 'bk_2', reason: 'booking' },
  { id: 'av_2_2', equipmentId: 'eq_4', date: '2026-08-21', bookingId: 'bk_2', reason: 'booking' },
  { id: 'av_2_3', equipmentId: 'eq_4', date: '2026-08-22', bookingId: 'bk_2', reason: 'booking' },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk_1',
    equipmentId: 'eq_1',
    equipmentTitle: 'Caterpillar 302.7 CR Mini Excavator',
    equipmentImage: 'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&q=80&w=1000',
    equipmentCategory: 'Heavy Machinery',
    customerId: 'usr_cust_1',
    customerName: 'Ananya Iyer',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    ownerId: 'usr_owner_1',
    ownerName: 'Aarav Sharma',
    startDate: '2026-08-15',
    endDate: '2026-08-18',
    priceBreakdown: {
      rentalDays: 3,
      dailyRate: 285,
      subtotal: 855,
      securityDeposit: 500,
      platformFee: 85.5,
      insuranceFee: 45.0,
      total: 1485.5
    },
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentIntentId: 'pi_stripe_test_881920',
    condition: {
      pickupPhotos: ['https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&q=80&w=1000'],
      pickupNotes: 'Machine inspected at pickup. Clean tracks, full diesel tank, no visible scratches.',
      pickupDate: '2026-08-15T09:00:00Z',
      returnPhotos: [],
    },
    co2SavedTotalKg: 55.5,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'bk_2',
    equipmentId: 'eq_4',
    equipmentTitle: 'RED V-Raptor 8K VV Cinema Camera Package',
    equipmentImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
    equipmentCategory: 'Photography & Drones',
    customerId: 'usr_cust_2',
    customerName: 'Rohan Verma',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    ownerId: 'usr_owner_2',
    ownerName: 'Priya Patel',
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    priceBreakdown: {
      rentalDays: 2,
      dailyRate: 450,
      subtotal: 900,
      securityDeposit: 1200,
      platformFee: 90,
      insuranceFee: 60,
      total: 2250
    },
    status: 'pending',
    paymentStatus: 'paid',
    paymentIntentId: 'pi_stripe_test_992144',
    condition: {
      pickupPhotos: [],
      returnPhotos: []
    },
    co2SavedTotalKg: 13.6,
    createdAt: '2026-08-05T14:20:00Z'
  },
  {
    id: 'bk_3_past',
    equipmentId: 'eq_3',
    equipmentTitle: 'John Deere 5075E Utility Tractor',
    equipmentImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
    equipmentCategory: 'Agriculture & Farming',
    customerId: 'usr_cust_1',
    customerName: 'Ananya Iyer',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    ownerId: 'usr_owner_1',
    ownerName: 'Aarav Sharma',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    priceBreakdown: {
      rentalDays: 2,
      dailyRate: 260,
      subtotal: 520,
      securityDeposit: 500,
      platformFee: 52,
      insuranceFee: 26,
      total: 1098
    },
    status: 'completed',
    paymentStatus: 'paid',
    paymentIntentId: 'pi_stripe_test_11204',
    condition: {
      pickupPhotos: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000'],
      pickupNotes: 'Front loader attachment secure, diesel tank topped off.',
      pickupDate: '2026-07-10T08:30:00Z',
      returnPhotos: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000'],
      returnNotes: 'Returned in pristine condition with full tank.',
      returnDate: '2026-07-12T17:00:00Z'
    },
    co2SavedTotalKg: 49.0,
    createdAt: '2026-07-02T11:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    bookingId: 'bk_3_past',
    equipmentId: 'eq_3',
    fromUserId: 'usr_cust_1',
    fromUserName: 'Ananya Iyer',
    fromUserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    fromRole: 'customer',
    toUserId: 'usr_owner_1',
    rating: 5,
    comment: 'The John Deere tractor handled land clearing effortlessly! Aarav provided full operating instructions and delivery was right on time.',
    createdAt: '2026-07-13T10:00:00Z'
  },
  {
    id: 'rev_2',
    bookingId: 'bk_3_past',
    equipmentId: 'eq_3',
    fromUserId: 'usr_owner_1',
    fromUserName: 'Aarav Sharma',
    fromUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    fromRole: 'owner',
    toUserId: 'usr_cust_1',
    rating: 5,
    comment: 'Ananya is an exemplary renter! Returned the tractor spotlessly cleaned and right on schedule. Would rent to her anytime!',
    createdAt: '2026-07-13T14:20:00Z'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'dsp_1',
    bookingId: 'bk_3_past',
    equipmentTitle: 'Hyster 5,000 lbs Cushion Tire Forklift',
    raisedByUserId: 'usr_owner_1',
    raisedByName: 'Aarav Sharma',
    raisedByRole: 'owner',
    againstUserId: 'usr_cust_2',
    againstName: 'Rohan Verma',
    ownerName: 'Aarav Sharma',
    renterName: 'Rohan Verma',
    amountClaimed: 150,
    reason: 'Fork Guard Scrape Inspection',
    description: 'Minor cosmetic paint scraping on side carriage guard after warehouse transit. Deposit hold reviewed by admin.',
    photos: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000'],
    status: 'under_review',
    createdAt: '2026-08-08T16:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'usr_owner_1',
    title: 'New Booking Confirmed',
    message: 'Ananya Iyer confirmed booking for Caterpillar 302.7 CR Excavator (Aug 15 - Aug 18).',
    type: 'booking_confirmed',
    read: false,
    link: '/dashboard/owner',
    createdAt: '2026-08-01T10:01:00Z'
  },
  {
    id: 'notif_2',
    userId: 'usr_owner_2',
    title: 'Pending Booking Request',
    message: 'Rohan Verma requested RED V-Raptor 8K Camera (Aug 20 - Aug 22). Review and accept or decline.',
    type: 'booking_request',
    read: false,
    link: '/dashboard/owner',
    createdAt: '2026-08-05T14:21:00Z'
  },
  {
    id: 'notif_3',
    userId: 'usr_cust_1',
    title: 'Upcoming Rental Reminder',
    message: 'Your rental for Caterpillar Excavator starts in 4 days. Contact Aarav to coordinate pickup.',
    type: 'return_reminder',
    read: true,
    link: '/dashboard/customer',
    createdAt: '2026-08-11T08:00:00Z'
  }
];
