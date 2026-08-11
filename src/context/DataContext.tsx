import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, Booking, Review, Dispute, Notification, BookingStatus } from '../types';
import {
  MOCK_EQUIPMENT,
  MOCK_BOOKINGS,
  MOCK_REVIEWS,
  MOCK_DISPUTES,
  MOCK_NOTIFICATIONS,
} from '../data/mockData';
import { equipmentService } from '../services/equipmentService';
import { bookingService } from '../services/bookingService';

interface DataContextType {
  equipmentList: Equipment[];
  bookings: Booking[];
  reviews: Review[];
  disputes: Dispute[];
  notifications: Notification[];
  loading: boolean;
  addEquipment: (newEq: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  updateEquipmentRate: (id: string, newRate: number) => void;
  addBooking: (newBooking: Booking) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  cancelBooking: (id: string) => void;
  updateBookingCondition: (
    bookingId: string,
    beforePhotos: string[],
    afterPhotos: string[],
    conditionNotes: string
  ) => void;
  addReview: (newReview: Review) => void;
  resolveDispute: (disputeId: string, winner: 'renter' | 'owner') => void;
  markNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState<boolean>(false);

  const addEquipment = (newEq: Equipment) => {
    setEquipmentList((prev) => [newEq, ...prev]);
    equipmentService.createEquipment(newEq).catch(() => {});
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipmentList((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    equipmentService.updateEquipment(id, updates).catch(() => {});
  };

  const deleteEquipment = (id: string) => {
    setEquipmentList((prev) => prev.filter((e) => e.id !== id));
    equipmentService.deleteEquipment(id).catch(() => {});
  };

  const updateEquipmentRate = (id: string, newRate: number) => {
    setEquipmentList((prev) => prev.map((e) => (e.id === id ? { ...e, dailyRate: newRate } : e)));
  };

  const addBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    bookingService.updateBookingStatus(id, status).catch(() => {});
  };

  const cancelBooking = (id: string) => {
    updateBookingStatus(id, 'cancelled');
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

  const addReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const resolveDispute = (disputeId: string, winner: 'renter' | 'owner') => {
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
