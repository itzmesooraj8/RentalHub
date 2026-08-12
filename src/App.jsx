import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { DataProvider, useData } from "./context/DataContext.jsx";
import { ROUTES } from "./lib/routes.js";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { ProtectedRoute } from "./components/guards/ProtectedRoute.jsx";
import { RoleRoute } from "./components/guards/RoleRoute.jsx";
import { PublicOnlyRoute } from "./components/guards/PublicOnlyRoute.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { BrowsePage } from "./pages/BrowsePage.jsx";
import { EquipmentDetailPage } from "./pages/EquipmentDetailPage.jsx";
import { BookingFlowPage } from "./pages/BookingFlowPage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { FavoritesPage } from "./pages/FavoritesPage.jsx";
import { DashboardResolverPage } from "./pages/DashboardResolverPage.jsx";
import { ComparePage } from "./pages/ComparePage.jsx";
import { CustomerDashboard } from "./pages/CustomerDashboard.jsx";
import { BookingsPage } from "./pages/BookingsPage.jsx";
import { BookingDetailsPage } from "./pages/BookingDetailsPage.jsx";
import { NotificationsPage } from "./pages/NotificationsPage.jsx";
import { OwnerDashboard } from "./pages/OwnerDashboard.jsx";
import { OwnerEquipmentPage } from "./pages/OwnerEquipmentPage.jsx";
import { OwnerEquipmentFormPage } from "./pages/OwnerEquipmentFormPage.jsx";
import { OwnerEquipmentDetailsPage } from "./pages/OwnerEquipmentDetailsPage.jsx";
import { OwnerBookingsPage } from "./pages/OwnerBookingsPage.jsx";
import { OwnerCalendarPage } from "./pages/OwnerCalendarPage.jsx";
import { OwnerAnalyticsPage } from "./pages/OwnerAnalyticsPage.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { AdminUsersPage } from "./pages/AdminUsersPage.jsx";
import { AdminEquipmentPage } from "./pages/AdminEquipmentPage.jsx";
import { AdminCategoriesPage } from "./pages/AdminCategoriesPage.jsx";
import { AdminBookingsPage } from "./pages/AdminBookingsPage.jsx";
import { AdminDisputesPage } from "./pages/AdminDisputesPage.jsx";
import { AdminAnalyticsPage } from "./pages/AdminAnalyticsPage.jsx";
import { ForbiddenPage } from "./pages/ForbiddenPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
const BookRedirect = () => {
  const { id } = useParams();
  return <Navigate to={ROUTES.bookEquipment(id || "")} replace />;
};
function AppRoutes() {
  const { currentUser, toggleFavorite, loginRole, updateUser } = useAuth();
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
    markNotificationRead
  } = useData();
  const favorites = currentUser?.favorites || [];
  return <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans flex flex-col justify-between selection:bg-[#F27D26] selection:text-black">
      <div>
        <Navbar
    favoritesCount={favorites.length}
    notificationsCount={notifications.filter((n) => !n.read).length}
  />

        <main className="pb-16 min-h-[calc(100vh-220px)]">
          <Routes>
            {
    /* Public Routes */
  }
            <Route
    path="/"
    element={<HomePage
      equipmentList={equipmentList}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
    />}
  />
            <Route
    path="/browse"
    element={<BrowsePage
      equipmentList={equipmentList}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
    />}
  />
            {
    /* Redirect /map to /browse?view=map for unified discovery system */
  }
            <Route path="/map" element={<Navigate to="/browse?view=map" replace />} />

            <Route path="/compare" element={<ComparePage />} />

            <Route
    path="/equipment/:id"
    element={<EquipmentDetailPage
      equipmentList={equipmentList}
      reviewsList={reviews}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
    />}
  />

            {
    /* Dynamic Redirect Fix for /book/:id */
  }
            <Route path="/book/:id" element={<BookRedirect />} />

            {
    /* Public Only Auth Page */
  }
            <Route
    path="/auth"
    element={<PublicOnlyRoute user={currentUser}>
                  <AuthPage onLogin={(user) => {
    }} currentUser={currentUser} />
                </PublicOnlyRoute>}
  />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/register" element={<Navigate to="/auth" replace />} />

            {
    /* Protected Favorites Route */
  }
            <Route
    path="/favorites"
    element={<ProtectedRoute user={currentUser}>
                  <FavoritesPage
      currentUser={currentUser}
      favoriteItems={equipmentList.filter((e) => favorites.includes(e.id))}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
    />
                </ProtectedRoute>}
  />

            {
    /* Protected Notifications Route */
  }
            <Route
    path="/notifications"
    element={<ProtectedRoute user={currentUser}>
                  <NotificationsPage
      currentUser={currentUser}
      notifications={notifications}
      onMarkAllRead={markNotificationsRead}
      onMarkRead={markNotificationRead}
    />
                </ProtectedRoute>}
  />

            {
    /* Protected Customer Bookings Routes */
  }
            <Route
    path="/bookings"
    element={<ProtectedRoute user={currentUser}>
                  <BookingsPage
      currentUser={currentUser}
      bookings={bookings}
      onCancelBooking={cancelBooking}
    />
                </ProtectedRoute>}
  />
            <Route
    path="/bookings/:bookingId"
    element={<ProtectedRoute user={currentUser}>
                  <BookingDetailsPage
      currentUser={currentUser}
      bookings={bookings}
      onSubmitConditionReport={updateBookingCondition}
      onAddReview={addReview}
      onCancelBooking={cancelBooking}
    />
                </ProtectedRoute>}
  />

            {
    /* Protected Booking Flow */
  }
            <Route
    path="/equipment/:id/book"
    element={<ProtectedRoute user={currentUser}>
                  <BookingFlowPage
      equipmentList={equipmentList}
      currentUser={currentUser}
      onAddBooking={addBooking}
    />
                </ProtectedRoute>}
  />

            {
    /* Route Resolver Endpoint */
  }
            <Route
    path="/dashboard"
    element={<ProtectedRoute user={currentUser}>
                  <DashboardResolverPage user={currentUser} />
                </ProtectedRoute>}
  />

            {
    /* Customer Dashboard Route */
  }
            <Route
    path="/dashboard/customer"
    element={<RoleRoute user={currentUser} allowedRoles={["customer"]}>
                  <CustomerDashboard
      user={currentUser}
      bookings={bookings}
      favoriteItems={equipmentList.filter((e) => favorites.includes(e.id))}
      onToggleFavorite={toggleFavorite}
      onSubmitConditionReport={updateBookingCondition}
      onAddReview={addReview}
    />
                </RoleRoute>}
  />

            {
    /* Owner Workspace Routes */
  }
            <Route
    path="/dashboard/owner"
    element={<RoleRoute user={currentUser} allowedRoles={["owner"]}>
                  <OwnerDashboard
      user={currentUser}
      equipmentList={equipmentList}
      incomingBookings={bookings}
      onCreateEquipment={addEquipment}
      onDeleteEquipment={deleteEquipment}
      onUpdateRate={updateEquipmentRate}
    />
                </RoleRoute>}
  />
            <Route
    path="/owner/equipment"
    element={<RoleRoute user={currentUser} allowedRoles={["owner"]}>
                  <OwnerEquipmentPage
      currentUser={currentUser}
      equipmentList={equipmentList}
      onDeleteEquipment={deleteEquipment}
      onUpdateRate={updateEquipmentRate}
    />
                </RoleRoute>}
  />
            <Route
    path="/owner/equipment/new"
    element={<RoleRoute user={currentUser} allowedRoles={["owner"]}>
                  <OwnerEquipmentFormPage
      currentUser={currentUser}
      equipmentList={equipmentList}
      onCreateEquipment={addEquipment}
    />
                </RoleRoute>}
  />
            <Route
    path="/owner/equipment/:equipmentId"
    element={<RoleRoute user={currentUser} allowedRoles={["owner"]}>
                  <OwnerEquipmentDetailsPage
      currentUser={currentUser}
      equipmentList={equipmentList}
      bookings={bookings}
      reviews={reviews}
      onDeleteEquipment={deleteEquipment}
      onUpdateRate={updateEquipmentRate}
    />
                </RoleRoute>}
  />
            <Route
    path="/owner/equipment/:equipmentId/edit"
    element={<RoleRoute user={currentUser} allowedRoles={["owner"]}>
                  <OwnerEquipmentFormPage
      currentUser={currentUser}
      equipmentList={equipmentList}
      onUpdateEquipment={updateEquipment}
    />
                </RoleRoute>}
  />
            <Route
    path="/owner/bookings"
    element={<RoleRoute user={currentUser} allowedRoles={["owner"]}>
                  <OwnerBookingsPage
      currentUser={currentUser}
      incomingBookings={bookings}
      onUpdateBookingStatus={updateBookingStatus}
    />
                </RoleRoute>}
  />
            <Route
    path="/owner/calendar"
    element={<RoleRoute user={currentUser} allowedRoles={["owner"]}>
                  <OwnerCalendarPage
      currentUser={currentUser}
      equipmentList={equipmentList}
      bookings={bookings}
    />
                </RoleRoute>}
  />
            <Route
    path="/owner/analytics"
    element={<RoleRoute user={currentUser} allowedRoles={["owner"]}>
                  <OwnerAnalyticsPage
      currentUser={currentUser}
      equipmentList={equipmentList}
      bookings={bookings}
    />
                </RoleRoute>}
  />

            {
    /* Admin Workspace Routes */
  }
            <Route
    path="/dashboard/admin"
    element={<RoleRoute user={currentUser} allowedRoles={["admin"]}>
                  <AdminDashboard
      bookings={bookings}
      disputes={disputes}
      onResolveDispute={resolveDispute}
    />
                </RoleRoute>}
  />
            <Route
    path="/admin/users"
    element={<RoleRoute user={currentUser} allowedRoles={["admin"]}>
                  <AdminUsersPage currentUser={currentUser} />
                </RoleRoute>}
  />
            <Route
    path="/admin/equipment"
    element={<RoleRoute user={currentUser} allowedRoles={["admin"]}>
                  <AdminEquipmentPage equipmentList={equipmentList} />
                </RoleRoute>}
  />
            <Route
    path="/admin/categories"
    element={<RoleRoute user={currentUser} allowedRoles={["admin"]}>
                  <AdminCategoriesPage />
                </RoleRoute>}
  />
            <Route
    path="/admin/bookings"
    element={<RoleRoute user={currentUser} allowedRoles={["admin"]}>
                  <AdminBookingsPage bookings={bookings} />
                </RoleRoute>}
  />
            <Route
    path="/admin/disputes"
    element={<RoleRoute user={currentUser} allowedRoles={["admin"]}>
                  <AdminDisputesPage disputes={disputes} onResolveDispute={resolveDispute} />
                </RoleRoute>}
  />
            <Route
    path="/admin/analytics"
    element={<RoleRoute user={currentUser} allowedRoles={["admin"]}>
                  <AdminAnalyticsPage />
                </RoleRoute>}
  />

            {
    /* Protected Profile Route */
  }
            <Route
    path="/profile"
    element={<ProtectedRoute user={currentUser}>
                  <ProfilePage
      user={currentUser}
      onUpdateUser={updateUser}
      onSwitchRole={loginRole}
    />
                </ProtectedRoute>}
  />

            {
    /* Error & Fallback Routes */
  }
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {
    /* Global Footer */
  }
      <Footer />
    </div>;
}
export default function App() {
  return <Router>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </Router>;
}
