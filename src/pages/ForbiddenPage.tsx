import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#111111] border border-[#222222] text-center space-y-5 text-white font-mono shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h1 className="font-serif italic text-2xl text-white">403 — Access Restricted</h1>
        <p className="text-xs text-[#888888] leading-relaxed">
          Your account role does not have authorization to view this workspace. Please switch personas or request higher privileges.
        </p>
      </div>
      <div className="pt-2 flex items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="px-4 py-2.5 rounded-xl bg-[#F27D26] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#d96a1a] transition"
        >
          <Home className="w-4 h-4" />
          <span>My Dashboard</span>
        </Link>
        <Link
          to="/browse"
          className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-[#333333] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#222222] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Market</span>
        </Link>
      </div>
    </div>
  );
};
