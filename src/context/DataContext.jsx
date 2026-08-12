import { createContext, useContext, useState, useEffect } from "react";
import { equipmentService } from "../services/equipmentService.js";
import { bookingService } from "../services/bookingService.js";
import { apiClient } from "../services/apiClient.js";
const DataContext = createContext(void 0);
export const DataProvider = ({ children }) => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eqs, bks, revs, disps, notifs] = await Promise.all([
        equipmentService.getEquipment(),
        bookingService.getBookings().catch(() => []),
        apiClient.get("/api/reviews").then((r) => r.data.data).catch(() => []),
        apiClient.get("/api/disputes").then((r) => r.data.data).catch(() => []),
        apiClient.get("/api/notifications").then((r) => r.data.data).catch(() => [])
      ]);
      setEquipmentList(eqs);
      setBookings(bks);
      setReviews(revs);
      setDisputes(disps);
      setNotifications(notifs);
    } catch (err) {
      console.error("Failed to load backend data:", err);
      setError(err?.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refreshData();
    const eventSource = new EventSource("/api/events");
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("\u26A1 [SSE Real-Time Event Stream]", data);
        refreshData();
      } catch (e) {
      }
    };
    eventSource.addEventListener("EQUIPMENT_CREATED", () => refreshData());
    eventSource.addEventListener("BOOKING_CREATED", () => refreshData());
    eventSource.addEventListener("BOOKING_STATUS_CHANGED", () => refreshData());
    eventSource.addEventListener("ESCROW_RELEASED", () => refreshData());
    eventSource.addEventListener("PAYMENT_RECEIVED", () => refreshData());
    eventSource.addEventListener("NOTIFICATION_ADDED", () => refreshData());
    eventSource.addEventListener("DISPUTE_CREATED", () => refreshData());
    return () => {
      eventSource.close();
    };
  }, []);
  const addEquipment = async (newEqData) => {
    const created = await equipmentService.createEquipment(newEqData);
    setEquipmentList((prev) => [created, ...prev]);
    return created;
  };
  const updateEquipment = async (id, updates) => {
    const updated = await equipmentService.updateEquipment(id, updates);
    setEquipmentList((prev) => prev.map((e) => e.id === id ? updated : e));
  };
  const deleteEquipment = async (id) => {
    await equipmentService.deleteEquipment(id);
    setEquipmentList((prev) => prev.filter((e) => e.id !== id));
  };
  const updateEquipmentRate = async (id, newRate) => {
    const updated = await equipmentService.updateEquipment(id, { dailyRate: newRate });
    setEquipmentList((prev) => prev.map((e) => e.id === id ? updated : e));
  };
  const addBooking = async (bookingData) => {
    const created = await bookingService.createBooking(bookingData);
    setBookings((prev) => [created, ...prev]);
    return created;
  };
  const updateBookingStatus = async (id, status) => {
    const updated = await bookingService.updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => b.id === id ? updated : b));
  };
  const cancelBooking = async (id) => {
    await updateBookingStatus(id, "cancelled");
  };
  const updateBookingCondition = async (bookingId, beforePhotos, afterPhotos, conditionNotes) => {
    const hasDifferences = conditionNotes.trim().length > 0;
    const type = beforePhotos.length > 0 ? "before" : "after";
    await apiClient.post(`/api/bookings/${bookingId}/condition`, {
      type,
      notes: conditionNotes,
      photos: [...beforePhotos, ...afterPhotos]
    });
    setBookings(
      (prev) => prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            beforePhotos,
            afterPhotos,
            conditionNotes,
            hasDisputeFlag: hasDifferences,
            damagePhotos: [...beforePhotos, ...afterPhotos]
          };
        }
        return b;
      })
    );
  };
  const addReview = async (newReview) => {
    const res = await apiClient.post("/api/reviews", {
      equipmentId: newReview.equipmentId,
      rating: newReview.rating,
      comment: newReview.comment
    });
    const created = res.data.data;
    setReviews((prev) => [created, ...prev]);
    equipmentService.getEquipment().then(setEquipmentList).catch(() => {
    });
  };
  const resolveDispute = async (disputeId, winner) => {
    await apiClient.post(`/api/disputes/${disputeId}/resolve`, { winner });
    setDisputes((prev) => prev.map((d) => d.id === disputeId ? { ...d, status: "resolved" } : d));
  };
  const markNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await apiClient.patch("/api/notifications/read-all").catch(() => {
    });
  };
  const markNotificationRead = async (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    await apiClient.patch(`/api/notifications/${id}/read`).catch(() => {
    });
  };
  return <DataContext.Provider
    value={{
      equipmentList,
      bookings,
      reviews,
      disputes,
      notifications,
      loading,
      error,
      refreshData,
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
    }}
  >
      {children}
    </DataContext.Provider>;
};
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
