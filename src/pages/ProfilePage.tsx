import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Mail, Phone, MapPin, Calendar, Award, RefreshCw, Key, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';
import { TrustScoreBadge } from '../components/TrustScoreBadge';

interface ProfilePageProps {
  user: User;
  onUpdateUser?: (updated: User) => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onSwitchRole }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+1 (555) 234-5678');
  const [location, setLocation] = useState(user.location || 'Austin, TX');
  const [bio, setBio] = useState(user.bio || 'General contractor and heavy machinery equipment rental partner.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name,
        email,
        phone,
        location,
        bio,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Header Banner */}
      <div className="bg-[#111111] p-6 sm:p-8 rounded-3xl border border-[#1F1F1F] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#F27D26]"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-serif italic text-2xl text-white">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#333333] text-[#F27D26] text-[10px] font-bold uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#888888] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>
            <div className="flex items-center gap-3 text-[10px] text-[#666666] pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#F27D26]" />
                Member Since {user.memberSince || '2024'}
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <UserCheck className="w-3 h-3" />
                KYC Verified ID
              </span>
            </div>
          </div>
        </div>

        <TrustScoreBadge
          score={user.trustScore || 98}
          kycVerified={user.kycVerified ?? true}
          rating={4.9}
          completedRentals={user.completedRentalsCount || 24}
          onTimeRentals={user.completedRentalsCount || 24}
          userName={user.name}
          size="md"
        />
      </div>

      {/* Demo Switch Persona Bar (Controlled Demo) */}
      {onSwitchRole && (
        <div className="bg-[#111111] p-4 rounded-2xl border border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#888888]">
            <RefreshCw className="w-4 h-4 text-[#F27D26]" />
            <span>Interactive Demo Role Switcher:</span>
          </div>
          <div className="flex items-center gap-2">
            {(['customer', 'owner', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onSwitchRole(r)}
                className={`px-3 py-1.5 rounded-xl uppercase font-bold text-[10px] tracking-wider transition cursor-pointer border ${
                  user.role === r
                    ? 'bg-[#F27D26] text-black border-[#F27D26]'
                    : 'bg-[#1A1A1A] text-[#888888] hover:text-white border-[#333333]'
                }`}
              >
                {r} Mode
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Profile Settings Form */}
      <div className="bg-[#111111] p-6 sm:p-8 rounded-3xl border border-[#1F1F1F] shadow-xl space-y-6">
        <h2 className="font-serif italic text-xl text-white pb-3 border-b border-[#1F1F1F]">
          Account Details & Logistics Contact
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1">
                Full Name / Business Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1">
                Primary Dispatch / Depot Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1">
              Account Bio & Specialty
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                ✓ Account Profile Updated Successfully
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
