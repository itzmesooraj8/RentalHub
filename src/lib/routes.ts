export const ROUTES = {
  home: '/',
  browse: '/browse',
  browseCategory: (cat: string) => `/browse?category=${encodeURIComponent(cat)}`,
  browseMap: '/browse?view=map',
  equipmentDetail: (id: string) => `/equipment/${id}`,
  bookEquipment: (id: string) => `/equipment/${id}/book`,
  auth: '/auth',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  profile: '/profile',
  favorites: '/favorites',
  notifications: '/notifications',
  bookings: '/bookings',
  bookingDetail: (id: string) => `/bookings/${id}`,

  // Customer specific
  customerDashboard: '/dashboard/customer',

  // Owner specific
  ownerDashboard: '/dashboard/owner',
  ownerEquipment: '/owner/equipment',
  ownerNewEquipment: '/owner/equipment/new',
  ownerEquipmentEdit: (id: string) => `/owner/equipment/${id}/edit`,
  ownerEquipmentDetail: (id: string) => `/owner/equipment/${id}`,
  ownerBookings: '/owner/bookings',
  ownerCalendar: '/owner/calendar',
  ownerAnalytics: '/owner/analytics',

  // Admin specific
  adminDashboard: '/dashboard/admin',
  adminUsers: '/admin/users',
  adminEquipment: '/admin/equipment',
  adminCategories: '/admin/categories',
  adminBookings: '/admin/bookings',
  adminDisputes: '/admin/disputes',
  adminAnalytics: '/admin/analytics',

  // System
  forbidden: '/403',
  notFound: '/404',
};
