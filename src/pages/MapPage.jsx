import { useState, useMemo } from "react";
import { MapPin, Search, Compass } from "lucide-react";
import { EquipmentMap } from "../components/EquipmentMap.jsx";
const CATEGORIES = [
  "All",
  "Heavy Machinery",
  "Agriculture & Farming",
  "Power Tools",
  "Photography & Drones",
  "Event & Audio",
  "Logistics & Cargo",
  "Manufacturing & Industrial",
  "Science & Lab"
];
export const MapPage = ({ equipmentList }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(equipmentList[0] || null);
  const filteredItems = useMemo(() => {
    return equipmentList.filter((eq) => {
      const matchesCategory = selectedCategory === "All" || eq.category === selectedCategory;
      const matchesSearch = eq.title.toLowerCase().includes(searchQuery.toLowerCase()) || eq.location.toLowerCase().includes(searchQuery.toLowerCase()) || eq.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [equipmentList, selectedCategory, searchQuery]);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-white font-mono">
      {
    /* Map Header */
  }
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

        {
    /* Filter & Search Bar */
  }
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
            {CATEGORIES.map((cat) => <button
    key={cat}
    onClick={() => setSelectedCategory(cat)}
    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition cursor-pointer ${selectedCategory === cat ? "bg-[#F27D26] text-black shadow-md" : "bg-[#181818] text-[#888888] hover:text-white border border-[#262626]"}`}
  >
                {cat}
              </button>)}
          </div>
        </div>
      </div>

      {
    /* Main Map View Container */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Map Canvas Column (2 Columns on large screens) */
  }
        <div className="lg:col-span-2">
          <EquipmentMap items={filteredItems} />
        </div>

        {
    /* Side Equipment List Column */
  }
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 no-scrollbar font-mono">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#888888] px-1 flex items-center justify-between">
            <span>Pinned Equipment List</span>
            <span className="text-[#F27D26]">{filteredItems.length} Available</span>
          </h3>

          {filteredItems.length === 0 ? <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-8 text-center text-[#888888]">
              <Compass className="w-8 h-8 text-[#444444] mx-auto mb-2" />
              <p className="text-sm">No items found matching your filter criteria.</p>
            </div> : filteredItems.map((eq) => {
    const isSelected = selectedItem?.id === eq.id;
    return <div
      key={eq.id}
      onClick={() => setSelectedItem(eq)}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected ? "bg-[#181818] border-[#F27D26] ring-1 ring-[#F27D26]/30 shadow-lg" : "bg-[#111111] hover:bg-[#161616] border-[#1F1F1F]"}`}
    >
                  <div className="flex gap-3">
                    <img
      src={eq.images[0]}
      alt={eq.title}
      className="w-16 h-16 rounded-lg object-cover border border-[#2B2B2B] shrink-0"
      onError={(e) => {
        e.target.src = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000";
      }}
    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold">
                          {eq.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">₹{eq.dailyRate}/d</span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-white truncate mt-0.5">
                        {eq.title}
                      </h4>
                      <p className="text-xs text-[#888888] font-mono flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-[#555555]" /> {eq.location}
                      </p>
                    </div>
                  </div>
                </div>;
  })}
        </div>
      </div>
    </div>;
};
