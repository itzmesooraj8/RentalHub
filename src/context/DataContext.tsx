import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, Booking, Review, Dispute, Notification, BookingStatus } from '../types';
import { equipmentService } from '../services/equipmentService';
import { bookingService } from '../services/bookingService';
import { apiClient } from '../services/apiClient';

interface DataContextType {
  equipmentList: Equipment[];
  bookings: Booking[];
  reviews: Review[];
  disputes: Dispute[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addEquipment: (newEq: Partial<Equipment>) => Promise<Equipment>;
  updateEquipment: (id: string, updates: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  updateEquipmentRate: (id: string, newRate: number) => Promise<void>;
  addBooking: (bookingData: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    deliveryMethod?: 'pickup' | 'delivery';
    deliveryAddress?: string;
  }) => Promise<Booking>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  updateBookingCondition: (
    bookingId: string,
    beforePhotos: string[],
    afterPhotos: string[],
    conditionNotes: string
  ) => void;
  addReview: (newReview: Review) => void;
  resolveDispute: (disputeId: string, winner: 'renter' | 'owner') => Promise<void>;
  markNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eqs, bks] = await Promise.all([
        equipmentService.getEquipment(),
        bookingService.getBookings().catch(() => []),
      ]);
      setEquipmentList(eqs);
      setBookings(bks);
    } catch (err: any) {
      console.error('Failed to load backend data:', err);
      setError(err?.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addEquipment = async (newEqData: Partial<Equipment>): Promise<Equipment> => {
    const created = await equipmentService.createEquipment(newEqData);
    setEquipmentList((prev) => [created, ...prev]);
    return created;
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>): Promise<void> => {
    const updated = await equipmentService.updateEquipment(id, updates);
    setEquipmentList((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const deleteEquipment = async (id: string): Promise<void> => {
    await equipmentService.deleteEquipment(id);
    setEquipmentList((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEquipmentRate = async (id: string, newRate: number): Promise<void> => {
    const updated = await equipmentService.updateEquipment(id, { dailyRate: newRate });
    setEquipmentList((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const addBooking = async (bookingData: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    deliveryMethod?: 'pickup' | 'delivery';
    deliveryAddress?: string;
  }): Promise<Booking> => {
    // Crucial fix: call backend API and throw error on conflict/failure so UI handles it accurately!
    const created = await bookingService.createBooking(bookingData);
    setBookings((prev) => [created, ...prev]);
    return created;
  };

  const updateBookingStatus = async (id: string, status: BookingStatus): Promise<void> => {
    const updated = await bookingService.updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
  };

  const cancelBooking = async (id: string): Promise<void> => {
    await updateBookingStatus(id, 'cancelled');
  };

  const updateBookingCondition = (
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
  };

  const addReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const resolveDispute = async (disputeId: string, winner: 'renter' | 'owner'): Promise<void> => {
    await apiClient.post(`/api/disputes/${disputeId}/resolve`, { winner });
    setDisputes((prev) => prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' as const } : d)));
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <DataContext.Provider
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
        markNotificationRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
