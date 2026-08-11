import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, X } from 'lucide-react';
import { Equipment } from '../types';

interface EquipmentMapProps {
  items: Equipment[];
}

export const EquipmentMap: React.FC<EquipmentMapProps> = ({ items }) => {
  const [selectedPin, setSelectedPin] = useState<Equipment | null>(items[0] || null);

  return (
    <div className="w-full h-[520px] rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
      {/* Map Header Overlay */}
      <div className="z-10 bg-[#111111]/90 backdrop-blur-md p-3 rounded-xl border border-[#1F1F1F] flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F27D26] animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F27D26]">Live Regional Equipment Map</span>
        </div>
        <span className="text-xs font-mono text-[#888888]">{items.length} verified items located in area</span>
      </div>

      {/* Simulated Interactive Vector Map Canvas */}
      <div className="absolute inset-0 z-0 bg-[#0A0A0A] overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F1F1F_1px,transparent_1px),linear-gradient(to_bottom,#1F1F1F_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

        {/* Visual Simulated Map Roads/Land */}
        <svg className="absolute inset-0 w-full h-full text-[#1A1A1A] stroke-[#333333]/60" fill="none">
          <path d="M 50 150 Q 250 100 450 250 T 850 180" strokeWidth="3" />
          <path d="M 120 380 Q 380 280 650 350 T 900 300" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="300" cy="220" r="140" fill="currentColor" fillOpacity="0.1" />
          <circle cx="700" cy="300" r="180" fill="currentColor" fillOpacity="0.1" />
        </svg>

        {/* Dynamic Interactive Pins */}
        {items.map((eq, idx) => {
          // Calculate relative position based on index / lat lng spread for visual demo
          const positions = [
            { top: '35%', left: '28%' },
            { top: '60%', left: '42%' },
            { top: '25%', left: '68%' },
            { top: '70%', left: '75%' },
            { top: '48%', left: '85%' },
          ];
          const pos = positions[idx % positions.length];
          const isSelected = selectedPin?.id === eq.id;

          return (
            <div
              key={eq.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              onClick={() => setSelectedPin(eq)}
            >
              {/* Pin Badge */}
              <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all transform flex items-center gap-1 shadow-lg border ${
                isSelected
                  ? 'bg-[#F27D26] text-black border-white scale-110 ring-4 ring-[#F27D26]/30'
                  : 'bg-[#111111] hover:bg-[#1A1A1A] text-white border-[#333333] hover:scale-105'
              }`}>
                <MapPin className="w-3.5 h-3.5" />
                <span>${eq.dailyRate}/d</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Item Quick View Overlay Card */}
      {selectedPin && (
        <div className="z-30 bg-[#111111]/95 backdrop-blur-md border border-[#1F1F1F] rounded-2xl p-4 text-white max-w-sm ml-auto shadow-2xl relative">
          <button
            onClick={() => setSelectedPin(null)}
            className="absolute top-3 right-3 text-[#888888] hover:text-white p-1 rounded-full hover:bg-[#1A1A1A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex gap-3 items-center">
            <img
              src={selectedPin.images[0]}
              alt={selectedPin.title}
              className="w-20 h-20 rounded-xl object-cover border border-[#333333]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F27D26]">
                {selectedPin.category}
              </span>
              <h4 className="font-serif italic text-base text-white truncate">{selectedPin.title}</h4>
              <div className="text-xs text-[#888888] mt-0.5 flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3 text-[#666666]" /> {selectedPin.location}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#F27D26] mt-1 font-mono">
                <Star className="w-3 h-3 fill-current" /> {selectedPin.rating} ({selectedPin.reviewCount} reviews)
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#1F1F1F] flex items-center justify-between">
            <div>
              <span className="text-lg font-serif font-bold text-white">${selectedPin.dailyRate}</span>
              <span className="text-xs text-[#888888]"> / day</span>
            </div>
            <Link
              to={`/equipment/${selectedPin.id}`}
              className="px-3 py-1.5 rounded-lg bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
