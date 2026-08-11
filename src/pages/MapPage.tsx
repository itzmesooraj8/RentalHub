import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Star, ArrowRight, Compass } from 'lucide-react';
import { Equipment, EquipmentCategory } from '../types';

interface MapPageProps {
  equipmentList: Equipment[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const CATEGORIES: (EquipmentCategory | string)[] = [
  'All',
  'Heavy Machinery',
  'Agriculture & Farming',
  'Power Tools',
  'Photography & Drones',
  'Event & Audio',
  'Logistics & Cargo',
  'Manufacturing & Industrial',
  'Science & Lab',
];

export const MapPage: React.FC<MapPageProps> = ({ equipmentList }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(equipmentList[0] || null);

  const filteredItems = useMemo(() => {
    return equipmentList.filter((eq) => {
      const matchesCategory =
        selectedCategory === 'All' || eq.category === selectedCategory;
      const matchesSearch =
        eq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [equipmentList, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-white font-mono">
      {/* Map Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F27D26]/10 border border-[#F27D26]/30 text-[#F27D26] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Regional Discovery Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white italic">
              Equipment Location Map
            </h1>
            <p className="text-xs text-[#888888] font-mono mt-1">
              Locate verified rental machinery, camera rigs, and industrial tools near your job site.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#888888]">
              <strong className="text-white text-base">{filteredItems.length}</strong> assets pinned
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 pt-4 border-t border-[#1F1F1F]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, asset name, or industry spec..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#222222] focus:border-[#F27D26] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#F27D26] text-black shadow-md'
                    : 'bg-[#181818] text-[#888888] hover:text-white border border-[#262626]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas Column (2 Columns on large screens) */}
        <div className="lg:col-span-2 bg-[#0C0C0C] border border-[#1F1F1F] rounded-2xl relative min-h-[550px] overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
          {/* Top Status Bar */}
          <div className="z-10 bg-[#141414]/90 backdrop-blur-md p-3 rounded-xl border border-[#222222] flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Regional Equipment Map
              </span>
            </div>
            <span className="text-xs font-mono text-[#888888]">
              {selectedCategory === 'All' ? 'Showing All Industries' : selectedCategory}
            </span>
          </div>

          {/* Map Vector Graphic Background */}
          <div className="absolute inset-0 z-0 bg-[#0A0A0A] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30"></div>

            <svg className="absolute inset-0 w-full h-full text-[#141414] stroke-[#2A2A2A]/80" fill="none">
              <path d="M 80 120 Q 300 80 550 220 T 950 160" strokeWidth="3" />
              <path d="M 100 420 Q 400 300 700 380 T 980 320" strokeWidth="2" strokeDasharray="6 6" />
              <path d="M 350 50 Q 380 300 420 550" strokeWidth="2.5" />
              <circle cx="350" cy="220" r="160" fill="currentColor" fillOpacity="0.15" />
              <circle cx="750" cy="320" r="210" fill="currentColor" fillOpacity="0.15" />
            </svg>

            {/* Render Interactive Map Pins */}
            {filteredItems.map((eq, idx) => {
              const positions = [
                { top: '32%', left: '25%' },
                { top: '55%', left: '38%' },
                { top: '22%', left: '62%' },
                { top: '68%', left: '70%' },
                { top: '42%', left: '82%' },
                { top: '75%', left: '28%' },
                { top: '38%', left: '48%' },
                { top: '80%', left: '52%' },
                { top: '18%', left: '88%' },
              ];
              const pos = positions[idx % positions.length];
              const isSelected = selectedItem?.id === eq.id;

              return (
                <div
                  key={eq.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedItem(eq)}
                >
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all transform flex items-center gap-1.5 shadow-xl border ${
                      isSelected
                        ? 'bg-[#F27D26] text-black border-white scale-110 ring-4 ring-[#F27D26]/40 z-30'
                        : 'bg-[#141414] hover:bg-[#1F1F1F] text-white border-[#333333] hover:scale-105'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>${eq.dailyRate}/d</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Item Floating Banner on Map */}
          {selectedItem && (
            <div className="z-30 bg-[#121212]/95 backdrop-blur-md border border-[#262626] rounded-2xl p-4 text-white max-w-md ml-auto shadow-2xl relative mt-auto">
              <div className="flex gap-3 items-center">
                <img
                  src={selectedItem.images[0]}
                  alt={selectedItem.title}
                  className="w-20 h-20 rounded-xl object-cover border border-[#333333] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F27D26]">
                    {selectedItem.category}
                  </span>
                  <h4 className="font-serif italic text-base text-white truncate">
                    {selectedItem.title}
                  </h4>
                  <div className="text-xs text-[#888888] mt-0.5 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-[#666666]" /> {selectedItem.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#AAAAAA] mt-1">
                    <span className="flex items-center gap-1 text-[#F27D26] font-bold">
                      <Star className="w-3 h-3 fill-current" /> {selectedItem.rating}
                    </span>
                    <span>• Owner: {selectedItem.ownerName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#1F1F1F] flex items-center justify-between">
                <div>
                  <span className="text-xl font-serif font-bold text-white">${selectedItem.dailyRate}</span>
                  <span className="text-xs text-[#888888]"> / day</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/equipment/${selectedItem.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>View Asset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Equipment List Column */}
        <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1 no-scrollbar">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#888888] px-1 flex items-center justify-between">
            <span>Pinned Equipment List</span>
            <span className="text-[#F27D26]">{filteredItems.length} Available</span>
          </h3>

          {filteredItems.length === 0 ? (
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-8 text-center text-[#888888]">
              <Compass className="w-8 h-8 text-[#444444] mx-auto mb-2" />
              <p className="text-sm">No items found matching your filter criteria.</p>
            </div>
          ) : (
            filteredItems.map((eq) => {
              const isSelected = selectedItem?.id === eq.id;
              return (
                <div
                  key={eq.id}
                  onClick={() => setSelectedItem(eq)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181818] border-[#F27D26] ring-1 ring-[#F27D26]/30 shadow-lg'
                      : 'bg-[#111111] hover:bg-[#161616] border-[#1F1F1F]'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={eq.images[0]}
                      alt={eq.title}
                      className="w-16 h-16 rounded-lg object-cover border border-[#2B2B2B] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold">
                          {eq.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">${eq.dailyRate}/d</span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-white truncate mt-0.5">
                        {eq.title}
                      </h4>
                      <p className="text-xs text-[#888888] font-mono flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-[#555555]" /> {eq.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
