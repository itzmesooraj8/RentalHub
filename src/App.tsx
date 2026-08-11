import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ROUTES } from './lib/routes';

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
import { ComparePage } from './pages/ComparePage';

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

// Dynamic redirect component to prevent literal :id routing bugs
const BookRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={ROUTES.bookEquipment(id || '')} replace />;
};

function AppRoutes() {
  const { currentUser, toggleFavorite, loginRole } = useAuth();
  const {
    equipmentList,
    bookings,
    reviews,
    disputes,
    notifications,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    updateEquipmentRate,
    addBooking,
    updateBookingStatus,
    cancelBooking,
    updateBookingCondition,
    addReview,
    resolveDispute,
    markNotificationsRead,
    markNotificationRead,
  } = useData();

  const favorites = currentUser?.favorites || [];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans flex flex-col justify-between selection:bg-[#F27D26] selection:text-black">
      <div>
        <Navbar
          favoritesCount={favorites.length}
          notificationsCount={notifications.filter((n) => !n.read).length}
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
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/browse"
              element={
                <BrowsePage
                  equipmentList={equipmentList}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            {/* Redirect /map to /browse?view=map for unified discovery system */}
            <Route path="/map" element={<Navigate to="/browse?view=map" replace />} />

            <Route path="/compare" element={<ComparePage />} />

            <Route
              path="/equipment/:id"
              element={
                <EquipmentDetailPage
                  equipmentList={equipmentList}
                  reviewsList={reviews}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />

            {/* Dynamic Redirect Fix for /book/:id */}
            <Route path="/book/:id" element={<BookRedirect />} />

            {/* Public Only Auth Page */}
            <Route
              path="/auth"
              element={
                <PublicOnlyRoute user={currentUser}>
                  <AuthPage onLogin={(user) => {}} currentUser={currentUser} />
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
                    onToggleFavorite={toggleFavorite}
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
                    onMarkAllRead={markNotificationsRead}
                    onMarkRead={markNotificationRead}
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
                    onCancelBooking={cancelBooking}
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
                    onSubmitConditionReport={updateBookingCondition}
                    onAddReview={addReview}
                    onCancelBooking={cancelBooking}
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
                    onAddBooking={addBooking}
                  />
                </ProtectedRoute>
              }
            />

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
                    user={currentUser!}
                    bookings={bookings}
                    favoriteItems={equipmentList.filter((e) => favorites.includes(e.id))}
                    onToggleFavorite={toggleFavorite}
                    onSubmitConditionReport={updateBookingCondition}
                    onAddReview={addReview}
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
                    user={currentUser!}
                    equipmentList={equipmentList}
                    incomingBookings={bookings}
                    onCreateEquipment={addEquipment}
                    onDeleteEquipment={deleteEquipment}
                    onUpdateRate={updateEquipmentRate}
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
                    onDeleteEquipment={deleteEquipment}
                    onUpdateRate={updateEquipmentRate}
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
                    onCreateEquipment={addEquipment}
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
                    onDeleteEquipment={deleteEquipment}
                    onUpdateRate={updateEquipmentRate}
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
                    onUpdateEquipment={updateEquipment}
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
                    onUpdateBookingStatus={updateBookingStatus}
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
                    onResolveDispute={resolveDispute}
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
                  <AdminDisputesPage disputes={disputes} onResolveDispute={resolveDispute} />
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
                    user={currentUser!}
                    onUpdateUser={() => {}}
                    onSwitchRole={loginRole}
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
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
