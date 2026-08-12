import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Grid, Map as MapIcon, RotateCcw } from "lucide-react";
import { EquipmentCard } from "../components/EquipmentCard.jsx";
import { EquipmentMap } from "../components/EquipmentMap.jsx";
export const BrowsePage = ({
  equipmentList,
  favorites,
  onToggleFavorite
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramCategory = searchParams.get("category") || "All";
  const paramSearch = searchParams.get("search") || "";
  const paramView = searchParams.get("view") || "grid";
  const paramMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 1200;
  const [searchInput, setSearchInput] = useState(paramSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(paramSearch);
  const [category, setCategory] = useState(paramCategory);
  const [maxRate, setMaxRate] = useState(paramMaxPrice);
  const [viewMode, setViewMode] = useState(paramView);
  useEffect(() => {
    const newCat = searchParams.get("category") || "All";
    const newSearch = searchParams.get("search") || "";
    const newView = searchParams.get("view") || "grid";
    const newMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 1200;
    setCategory(newCat);
    setSearchInput(newSearch);
    setDebouncedSearch(newSearch);
    setViewMode(newView);
    setMaxRate(newMaxPrice);
  }, [searchParams]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      updateUrlParams(category, searchInput, viewMode, maxRate);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);
  const updateUrlParams = (cat, q, v, price) => {
    const params = {};
    if (cat && cat !== "All") params.category = cat;
    if (q) params.search = q;
    if (v && v !== "grid") params.view = v;
    if (price < 1200) params.maxPrice = price.toString();
    setSearchParams(params, { replace: true });
  };
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    updateUrlParams(newCat, searchInput, viewMode, maxRate);
  };
  const handleViewModeChange = (newView) => {
    setViewMode(newView);
    updateUrlParams(category, searchInput, newView, maxRate);
  };
  const handleMaxRateChange = (newRate) => {
    setMaxRate(newRate);
    updateUrlParams(category, searchInput, viewMode, newRate);
  };
  const categories = [
    "All",
    "Heavy Machinery",
    "Agriculture & Farming",
    "Photography & Drones",
    "Event & Audio",
    "Power Tools",
    "Logistics & Cargo",
    "Manufacturing & Industrial",
    "Science & Lab"
  ];
  const filteredItems = equipmentList.filter((item) => {
    const q = debouncedSearch.toLowerCase().trim();
    const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const matchesCat = category === "All" || item.category === category;
    const matchesPrice = item.dailyRate <= maxRate;
    return matchesSearch && matchesCat && matchesPrice;
  });
  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setCategory("All");
    setMaxRate(1200);
    setViewMode("grid");
    setSearchParams({}, { replace: true });
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {
    /* Page Title & View Mode Toggle Header */
  }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Equipment Marketplace</h1>
          <p className="text-xs text-[#888888] font-mono mt-1">
            Browse verified heavy machinery, cinema gear, agricultural equipment & industrial power tools
          </p>
        </div>

        {
    /* View Mode Switch */
  }
        <div className="flex items-center gap-2 bg-[#111111] p-1.5 rounded-2xl border border-[#1F1F1F] font-mono">
          <button
    onClick={() => handleViewModeChange("grid")}
    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${viewMode === "grid" ? "bg-[#F27D26] text-black shadow-md" : "text-[#888888] hover:text-white"}`}
  >
            <Grid className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
    onClick={() => handleViewModeChange("map")}
    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${viewMode === "map" ? "bg-[#F27D26] text-black shadow-md" : "text-[#888888] hover:text-white"}`}
  >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {
    /* Search & Filters Controls */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#111111] p-5 rounded-3xl border border-[#1F1F1F] font-mono text-xs shadow-xl">
        {
    /* Search Input */
  }
        <div className="md:col-span-2 relative">
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">
            Keyword & Location Search
          </label>
          <div className="relative">
            <input
    type="text"
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    placeholder="Search excavators, RED cameras, tractors, Austin, CA..."
    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  />
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
          </div>
        </div>

        {
    /* Category Dropdown */
  }
        <div>
          <label className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">
            Equipment Category
          </label>
          <select
    value={category}
    onChange={(e) => handleCategoryChange(e.target.value)}
    className="w-full px-3 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
  >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {
    /* Max Daily Rate Slider */
  }
        <div>
          <div className="flex justify-between text-[10px] text-[#666666] font-bold uppercase tracking-wider mb-1">
            <span>Max Daily Rate</span>
            <span className="text-[#F27D26]">₹{maxRate}/day</span>
          </div>
          <input
    type="range"
    min="30"
    max="1200"
    step="20"
    value={maxRate}
    onChange={(e) => handleMaxRateChange(Number(e.target.value))}
    className="w-full accent-[#F27D26] cursor-pointer"
  />
        </div>
      </div>

      {
    /* Filter Stats & Reset */
  }
      <div className="flex items-center justify-between text-xs font-mono text-[#888888] px-1">
        <span>Showing <strong className="text-white">{filteredItems.length}</strong> equipment listings</span>
        {(searchInput || category !== "All" || maxRate < 1200 || viewMode !== "grid") && <button
    onClick={handleResetFilters}
    className="flex items-center gap-1.5 text-[#F27D26] hover:underline cursor-pointer"
  >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>}
      </div>

      {
    /* Content Rendering */
  }
      {viewMode === "map" ? <EquipmentMap items={filteredItems} /> : filteredItems.length === 0 ? <div className="bg-[#111111] rounded-3xl p-12 text-center border border-[#1F1F1F] max-w-md mx-auto space-y-3 font-mono">
          <SlidersHorizontal className="w-10 h-10 text-[#666666] mx-auto" />
          <h3 className="font-serif italic text-white text-base">No Equipment Matches Search</h3>
          <p className="text-xs text-[#888888]">Try loosening search keywords or resetting filters.</p>
          <button
    onClick={handleResetFilters}
    className="px-4 py-2 rounded-xl bg-[#F27D26] text-black font-bold text-xs uppercase tracking-wider mt-2 cursor-pointer"
  >
            Reset Filters
          </button>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => <EquipmentCard
    key={item.id}
    equipment={item}
    isFavorite={favorites.includes(item.id)}
    onToggleFavorite={onToggleFavorite}
  />)}
        </div>}
    </div>;
};
