import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#111111] border border-[#222222] text-center space-y-5 text-white font-mono shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-[#F27D26] flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h1 className="font-serif italic text-2xl text-white">404 — Listing Not Found</h1>
        <p className="text-xs text-[#888888] leading-relaxed">
          The requested equipment asset, booking record, or route does not exist or has been archived.
        </p>
      </div>
      <div className="pt-2 flex items-center justify-center gap-3">
        <Link
          to="/browse"
          className="px-4 py-2.5 rounded-xl bg-[#F27D26] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#d96a1a] transition"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Equipment</span>
        </Link>
        <Link
          to="/"
          className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-[#333333] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#222222] transition"
        >
          <Home className="w-4 h-4" />
          <span>Homepage</span>
        </Link>
      </div>
    </div>
  );
};
