import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Calendar,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Notification, User } from '../types';
import { ROUTES } from '../lib/routes';

interface NotificationsPageProps {
  currentUser: User | null;
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  currentUser,
  notifications,
  onMarkAllRead,
  onMarkRead,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'bookings' | 'returns' | 'disputes' | 'system'>('all');

  const tabs = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    {
      id: 'bookings',
      label: 'Bookings',
      count: notifications.filter((n) => n.type === 'booking_request' || n.type === 'booking_confirmed').length,
    },
    {
      id: 'returns',
      label: 'Returns',
      count: notifications.filter((n) => n.type === 'pickup_reminder' || n.type === 'return_reminder').length,
    },
    {
      id: 'disputes',
      label: 'Disputes',
      count: notifications.filter((n) => n.type === 'dispute_alert').length,
    },
    {
      id: 'system',
      label: 'System',
      count: notifications.filter((n) => n.type === 'system').length,
    },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'bookings') return n.type === 'booking_request' || n.type === 'booking_confirmed';
    if (activeTab === 'returns') return n.type === 'pickup_reminder' || n.type === 'return_reminder';
    if (activeTab === 'disputes') return n.type === 'dispute_alert';
    if (activeTab === 'system') return n.type === 'system';
    return true;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking_request':
      case 'booking_confirmed':
        return <Calendar className="w-4 h-4 text-[#F27D26]" />;
      case 'pickup_reminder':
      case 'return_reminder':
        return <RotateCcw className="w-4 h-4 text-cyan-400" />;
      case 'dispute_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'system':
      default:
        return <Info className="w-4 h-4 text-purple-400" />;
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F27D26] uppercase font-bold tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Updates & Activity</span>
          </div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Notifications</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Real-time alerts for booking requests, rental lifecycle progress, return condition audits, and disputes.
          </p>
        </div>

        {onMarkAllRead && notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-[#F27D26]" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-[#1F1F1F]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#F27D26] text-black shadow-md'
                : 'bg-[#111111] text-[#888888] hover:text-white border border-[#1F1F1F]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-black text-white' : 'bg-[#1F1F1F] text-[#AAAAAA]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-[#111111] rounded-3xl p-12 text-center border border-[#1F1F1F] max-w-md mx-auto space-y-3 font-mono">
          <Bell className="w-10 h-10 text-[#444444] mx-auto" />
          <h3 className="font-serif italic text-white text-base">No Notifications</h3>
          <p className="text-xs text-[#888888]">
            You're all caught up! No recent alerts in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (onMarkRead && !n.read) onMarkRead(n.id);
                if (n.link) navigate(n.link);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-[#181818] border-[#F27D26]/50 shadow-md ring-1 ring-[#F27D26]/20'
                  : 'bg-[#111111] border-[#1F1F1F] hover:bg-[#161616]'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] shrink-0 mt-0.5">
                {getNotificationIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-sm font-mono truncate">{n.title}</span>
                  <span className="text-[10px] text-[#666666] shrink-0">{formatTimestamp(n.createdAt)}</span>
                </div>

                <p className="text-xs text-[#AAAAAA] leading-relaxed line-clamp-2">{n.message}</p>

                {n.link && (
                  <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#F27D26] hover:underline">
                    <span>View details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-[#F27D26] shrink-0 mt-2"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
