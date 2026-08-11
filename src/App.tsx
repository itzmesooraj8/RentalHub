import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Equipment, Booking, Review, Dispute, UserRole, BookingStatus } from './types';
import {
  CURRENT_USER,
  MOCK_EQUIPMENT,
  MOCK_BOOKINGS,
  MOCK_REVIEWS,
  MOCK_DISPUTES,
  MOCK_NOTIFICATIONS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { RoleRoute } from './components/guards/RoleRoute';
import { PublicOnlyRoute } from './components/guards/PublicOnlyRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { EquipmentDetailPage } from './pages/EquipmentDetailPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardResolverPage } from './pages/DashboardResolverPage';

// Customer Pages
import { CustomerDashboard } from './pages/CustomerDashboard';
import { BookingsPage } from './pages/BookingsPage';
import { BookingDetailsPage } from './pages/BookingDetailsPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Owner Pages
import { OwnerDashboard } from './pages/OwnerDashboard';
import { OwnerEquipmentPage } from './pages/OwnerEquipmentPage';
import { OwnerEquipmentFormPage } from './pages/OwnerEquipmentFormPage';
import { OwnerEquipmentDetailsPage } from './pages/OwnerEquipmentDetailsPage';
import { OwnerBookingsPage } from './pages/OwnerBookingsPage';
import { OwnerCalendarPage } from './pages/OwnerCalendarPage';
import { OwnerAnalyticsPage } from './pages/OwnerAnalyticsPage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminEquipmentPage } from './pages/AdminEquipmentPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { AdminDisputesPage } from './pages/AdminDisputesPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';

// System Pages
import { ForbiddenPage } from './pages/ForbiddenPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [favorites, setFavorites] = useState<string[]>(CURRENT_USER.favorites || ['eq_2', 'eq_5']);

  const handleSwitchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (currentUser) {
        setCurrentUser({ ...currentUser, favorites: updated });
      }
      return updated;
    });
  };

  const handleAddEquipment = (newEq: Equipment) => {
    setEquipmentList((prev) => [newEq, ...prev]);
  };

  const handleUpdateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipmentList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipmentList((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateEquipmentRate = (id: string, newRate: number) => {
    setEquipmentList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, dailyRate: newRate } : e))
    );
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b))
    );
  };

  const handleUpdateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const handleUpdateBookingCondition = (
    bookingId: string,
    beforePhotos: string[],
    afterPhotos: string[],
    conditionNotes: string
  ) => {
    const hasDifferences = conditionNotes.trim().length > 0;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            beforePhotos,
            afterPhotos,
            conditionNotes,
            hasDisputeFlag: hasDifferences,
            damagePhotos: [...beforePhotos, ...afterPhotos],
          };
        }
        return b;
      })
    );

    if (hasDifferences) {
      const targetBooking = bookings.find((b) => b.id === bookingId);
      if (targetBooking) {
        const newDispute: Dispute = {
          id: `disp-auto-${Date.now().toString().slice(-4)}`,
          bookingId: bookingId,
          equipmentTitle: targetBooking.equipmentTitle,
          renterName: targetBooking.customerName || targetBooking.renterName,
          ownerName: targetBooking.ownerName,
          reason: 'Condition Difference / Inspection Discrepancy',
          amountClaimed: targetBooking.priceBreakdown.securityDeposit,
          status: 'open',
          description: conditionNotes,
          createdAt: new Date().toISOString().split('T')[0],
          beforePhotos,
          afterPhotos,
        };

        setDisputes((prev) => [newDispute, ...prev.filter((d) => d.bookingId !== bookingId)]);
      }
    }
  };

  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleResolveDispute = (disputeId: string, winner: 'renter' | 'owner') => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' as const } : d))
    );
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleLogout = () => {
    setCurrentUser(null as unknown as User);
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans flex flex-col justify-between selection:bg-[#F27D26] selection:text-black">
        <div>
          <Navbar
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchRole={handleSwitchRole}
            favoritesCount={favorites.length}
            notificationsCount={unreadNotifCount}
          />

          <main className="pb-16 min-h-[calc(100vh-220px)]">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <HomePage
                    equipmentList={equipmentList}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                }
              />
              <Route
                path="/browse"
                element={
                  <BrowsePage
                    equipmentList={equipmentList}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                }
              />
              {/* Redirect /map to /browse?view=map for unified discovery system */}
              <Route path="/map" element={<Navigate to="/browse?view=map" replace />} />

              <Route
                path="/equipment/:id"
                element={
                  <EquipmentDetailPage
                    equipmentList={equipmentList}
                    reviewsList={reviews}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                }
              />

              {/* Public Only Auth Page */}
              <Route
                path="/auth"
                element={
                  <PublicOnlyRoute user={currentUser}>
                    <AuthPage onLogin={setCurrentUser} currentUser={currentUser} />
                  </PublicOnlyRoute>
                }
              />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/register" element={<Navigate to="/auth" replace />} />

              {/* Protected Favorites Route */}
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute user={currentUser}>
                    <FavoritesPage
                      currentUser={currentUser}
                      favoriteItems={equipmentList.filter((e) => favorites.includes(e.id))}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </ProtectedRoute>
                }
              />

              {/* Protected Notifications Route */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute user={currentUser}>
                    <NotificationsPage
                      currentUser={currentUser}
                      notifications={notifications}
                      onMarkAllRead={handleMarkNotificationsRead}
                      onMarkRead={handleMarkNotificationRead}
                    />
                  </ProtectedRoute>
                }
              />

              {/* Protected Customer Bookings Routes */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute user={currentUser}>
                    <BookingsPage
                      currentUser={currentUser}
                      bookings={bookings}
                      onCancelBooking={handleCancelBooking}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/:bookingId"
                element={
                  <ProtectedRoute user={currentUser}>
                    <BookingDetailsPage
                      currentUser={currentUser}
                      bookings={bookings}
                      onSubmitConditionReport={handleUpdateBookingCondition}
                      onAddReview={handleAddReview}
                      onCancelBooking={handleCancelBooking}
                    />
                  </ProtectedRoute>
                }
              />

              {/* Protected Booking Flow */}
              <Route
                path="/equipment/:id/book"
                element={
                  <ProtectedRoute user={currentUser}>
                    <BookingFlowPage
                      equipmentList={equipmentList}
                      currentUser={currentUser}
                      onAddBooking={handleAddBooking}
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="/book/:id" element={<Navigate to="/equipment/:id/book" replace />} />

              {/* Route Resolver Endpoint */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute user={currentUser}>
                    <DashboardResolverPage user={currentUser} />
                  </ProtectedRoute>
                }
              />

              {/* Customer Dashboard Route */}
              <Route
                path="/dashboard/customer"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['customer']}>
                    <CustomerDashboard
                      user={currentUser}
                      bookings={bookings}
                      favoriteItems={equipmentList.filter((e) => favorites.includes(e.id))}
                      onToggleFavorite={handleToggleFavorite}
                      onSubmitConditionReport={handleUpdateBookingCondition}
                      onAddReview={handleAddReview}
                    />
                  </RoleRoute>
                }
              />

              {/* Owner Workspace Routes */}
              <Route
                path="/dashboard/owner"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['owner']}>
                    <OwnerDashboard
                      user={currentUser}
                      equipmentList={equipmentList}
                      incomingBookings={bookings}
                      onCreateEquipment={handleAddEquipment}
                      onDeleteEquipment={handleDeleteEquipment}
                      onUpdateRate={handleUpdateEquipmentRate}
                    />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/equipment"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['owner']}>
                    <OwnerEquipmentPage
                      currentUser={currentUser}
                      equipmentList={equipmentList}
                      onDeleteEquipment={handleDeleteEquipment}
                      onUpdateRate={handleUpdateEquipmentRate}
                    />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/equipment/new"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['owner']}>
                    <OwnerEquipmentFormPage
                      currentUser={currentUser}
                      equipmentList={equipmentList}
                      onCreateEquipment={handleAddEquipment}
                    />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/equipment/:equipmentId"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['owner']}>
                    <OwnerEquipmentDetailsPage
                      currentUser={currentUser}
                      equipmentList={equipmentList}
                      bookings={bookings}
                      reviews={reviews}
                      onDeleteEquipment={handleDeleteEquipment}
                      onUpdateRate={handleUpdateEquipmentRate}
                    />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/equipment/:equipmentId/edit"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['owner']}>
                    <OwnerEquipmentFormPage
                      currentUser={currentUser}
                      equipmentList={equipmentList}
                      onUpdateEquipment={handleUpdateEquipment}
                    />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/bookings"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['owner']}>
                    <OwnerBookingsPage
                      currentUser={currentUser}
                      incomingBookings={bookings}
                      onUpdateBookingStatus={handleUpdateBookingStatus}
                    />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/calendar"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['owner']}>
                    <OwnerCalendarPage
                      currentUser={currentUser}
                      equipmentList={equipmentList}
                      bookings={bookings}
                    />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/analytics"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['owner']}>
                    <OwnerAnalyticsPage
                      currentUser={currentUser}
                      equipmentList={equipmentList}
                      bookings={bookings}
                    />
                  </RoleRoute>
                }
              />

              {/* Admin Workspace Routes */}
              <Route
                path="/dashboard/admin"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['admin']}>
                    <AdminDashboard
                      bookings={bookings}
                      disputes={disputes}
                      onResolveDispute={handleResolveDispute}
                    />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['admin']}>
                    <AdminUsersPage currentUser={currentUser} />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/equipment"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['admin']}>
                    <AdminEquipmentPage equipmentList={equipmentList} />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['admin']}>
                    <AdminCategoriesPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['admin']}>
                    <AdminBookingsPage bookings={bookings} />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/disputes"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['admin']}>
                    <AdminDisputesPage disputes={disputes} onResolveDispute={handleResolveDispute} />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <RoleRoute user={currentUser} allowedRoles={['admin']}>
                    <AdminAnalyticsPage />
                  </RoleRoute>
                }
              />

              {/* Protected Profile Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute user={currentUser}>
                    <ProfilePage
                      user={currentUser}
                      onUpdateUser={setCurrentUser}
                      onSwitchRole={handleSwitchRole}
                    />
                  </ProtectedRoute>
                }
              />

              {/* Error & Fallback Routes */}
              <Route path="/403" element={<ForbiddenPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
