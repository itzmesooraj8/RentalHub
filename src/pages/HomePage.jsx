import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck, ArrowRight, Leaf, Truck, CheckCircle2, Wrench } from "lucide-react";
import { EquipmentCard } from "../components/EquipmentCard";
import { EquipmentMap } from "../components/EquipmentMap";
import { EsgImpactCard } from "../components/EsgImpactCard";
export const HomePage = ({
  equipmentList,
  favorites,
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    { name: "All", count: equipmentList.length },
    { name: "Heavy Machinery", count: equipmentList.filter((e) => e.category === "Heavy Machinery").length },
    { name: "Agriculture & Farming", count: equipmentList.filter((e) => e.category === "Agriculture & Farming").length },
    { name: "Photography & Drones", count: equipmentList.filter((e) => e.category === "Photography & Drones").length },
    { name: "Event & Audio", count: equipmentList.filter((e) => e.category === "Event & Audio").length },
    { name: "Power Tools", count: equipmentList.filter((e) => e.category === "Power Tools").length },
    { name: "Logistics & Cargo", count: equipmentList.filter((e) => e.category === "Logistics & Cargo").length }
  ];
  const filteredItems = equipmentList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });
  return <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {
    /* Modern High-Contrast Hero Section */
  }
      <section className="relative rounded-3xl bg-[#111111] border border-[#1F1F1F] p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F27D26]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#333333] font-mono text-xs text-[#F27D26] uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5" />
            <span>Universal Peer-to-Peer Equipment Network</span>
          </div>

          <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-white tracking-tight">
            Rent Equipment. <span className="text-[#F27D26]">Run Your Work.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#888888] font-mono leading-relaxed max-w-2xl">
            One unified marketplace for construction, media, events, agriculture, logistics, and industrial tools. Verified owner trust scores, real-time availability locks, and escrow protection.
          </p>

          {
    /* Search Bar */
  }
          <div className="bg-[#1A1A1A] p-2 rounded-2xl border border-[#333333] shadow-xl flex flex-col sm:flex-row items-center gap-2 font-mono">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
              <Search className="w-5 h-5 text-[#666666]" />
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search excavators, cinema cameras, tractors, sound rigs, forklifts..."
    className="w-full bg-transparent text-sm text-white placeholder-[#666666] focus:outline-none"
  />
            </div>

            <Link
    to="/browse"
    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
  >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {
    /* Trust Value Badges */
  }
          <div className="pt-2 flex flex-wrap items-center gap-6 font-mono text-xs text-[#888888]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escrow Protected Deposits</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#F27D26]" />
              <span>Job Site & Venue Delivery</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>ESG Carbon Offsets</span>
            </span>
          </div>
        </div>
      </section>

      {
    /* Category Pills */
  }
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif italic text-2xl text-white">Equipment Categories</h2>
          <span className="text-xs font-mono text-[#888888]">Multi-industry selection</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono scrollbar-none">
          {categories.map((cat) => <button
    key={cat.name}
    onClick={() => setSelectedCategory(cat.name)}
    className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer border ${selectedCategory === cat.name ? "bg-[#F27D26] text-black border-white shadow-md" : "bg-[#111111] text-[#888888] border-[#1F1F1F] hover:border-[#333333] hover:text-white"}`}
  >
              {cat.name} ({cat.count})
            </button>)}
        </div>
      </section>

      {
    /* Live Geolocation Regional Map Preview */
  }
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif italic text-2xl text-white">Regional Fleet Interactive Map</h2>
            <p className="text-xs text-[#888888] font-mono mt-0.5">Real-time GPS proximity and daily rates across regional equipment hubs</p>
          </div>
          <Link
    to="/map"
    className="text-xs font-mono font-bold text-[#F27D26] hover:text-white flex items-center gap-1 uppercase tracking-wider"
  >
            <span>Full Map Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <EquipmentMap items={filteredItems} />
      </section>

      {
    /* Featured Fleet Grid */
  }
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif italic text-2xl text-white">Featured Equipment</h2>
            <p className="text-xs text-[#888888] font-mono mt-0.5">Verified heavy machinery, cinema gear & professional power tools ready for dispatch</p>
          </div>

          <Link
    to="/browse"
    className="px-4 py-2 rounded-xl bg-[#111111] border border-[#1F1F1F] text-xs font-mono font-bold text-[#F27D26] hover:text-white hover:border-[#333333] uppercase tracking-wider transition"
  >
            Browse All ({equipmentList.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => <EquipmentCard
    key={item.id}
    equipment={item}
    isFavorite={favorites.includes(item.id)}
    onToggleFavorite={onToggleFavorite}
  />)}
        </div>
      </section>

      {
    /* ESG Offset Spotlight */
  }
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] rounded-3xl p-8 border border-[#1F1F1F] shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 font-mono text-xs text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Platform Trust Guarantee</span>
          </div>

          <h3 className="font-serif italic text-3xl text-white">
            Built for Contractor Safety & Zero-Downtime Reliability
          </h3>

          <p className="text-xs text-[#888888] font-mono leading-relaxed">
            Every piece of heavy machinery, camera kit, and agricultural tool undergoes verified pre-dispatch audits. Security deposit authorizations are held securely via Stripe and automatically unlocked upon safe return inspection.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1F1F1F] font-mono text-center">
            <div>
              <div className="text-2xl font-serif italic text-[#F27D26] font-bold">100%</div>
              <div className="text-[10px] text-[#666666] uppercase tracking-wider">KYC Verified Owners</div>
            </div>
            <div>
              <div className="text-2xl font-serif italic text-white font-bold">$0</div>
              <div className="text-[10px] text-[#666666] uppercase tracking-wider">Hidden Surcharges</div>
            </div>
            <div>
              <div className="text-2xl font-serif italic text-emerald-400 font-bold">328kg</div>
              <div className="text-[10px] text-[#666666] uppercase tracking-wider">Avg CO₂ Saved / Rental</div>
            </div>
          </div>
        </div>

        <EsgImpactCard co2SavedKg={317} title="Circular Asset Economy" />
      </section>
    </div>;
};
