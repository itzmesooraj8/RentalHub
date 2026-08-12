import { Link } from "react-router-dom";
import { MapPin, Star, Heart, ArrowRight } from "lucide-react";
import { TrustScoreBadge } from "./TrustScoreBadge";
export const EquipmentCard = ({
  equipment,
  isFavorite = false,
  onToggleFavorite
}) => {
  return <div className="group bg-[#111111] rounded-3xl border border-[#1F1F1F] hover:border-[#333333] transition-all duration-200 overflow-hidden shadow-xl flex flex-col justify-between">
      <div className="space-y-4 p-4">
        {
    /* Image Container with Badge & Favorite */
  }
        <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#1A1A1A]">
          <img
    src={equipment.images[0]}
    alt={equipment.title}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    onError={(e) => {
      e.target.src = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000";
    }}
  />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0A0A0A]/90 backdrop-blur-md text-[#F27D26] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#333333]">
            {equipment.category}
          </span>

          <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite?.(equipment.id);
    }}
    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition cursor-pointer ${isFavorite ? "bg-[#F27D26] text-black shadow-md" : "bg-[#0A0A0A]/70 text-white hover:bg-[#0A0A0A]"}`}
    title="Bookmark Listing"
  >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <TrustScoreBadge score={equipment.ownerTrustScore} kycVerified={equipment.ownerKyVerified} />
            <span className="px-2 py-1 rounded bg-[#0A0A0A]/90 text-emerald-400 font-mono text-[10px] font-bold border border-[#333333]">
              -{Number(equipment.co2SavedPerDayKg || 0).toFixed(1)}kg CO₂/d
            </span>
          </div>
        </div>

        {
    /* Info */
  }
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888] font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#666666]" /> {equipment.location}
            </span>
            <span className="flex items-center gap-1 text-[#F27D26] font-bold">
              <Star className="w-3.5 h-3.5 fill-current" /> {equipment.rating} ({equipment.reviewCount})
            </span>
          </div>

          <h3 className="font-serif italic text-white text-lg group-hover:text-[#F27D26] transition line-clamp-1">
            {equipment.title}
          </h3>

          <p className="text-xs text-[#888888] line-clamp-2 leading-relaxed">
            {equipment.description}
          </p>
        </div>
      </div>

      {
    /* Footer Rate & CTA */
  }
      <div className="p-4 pt-3 border-t border-[#1F1F1F] bg-[#141414] flex items-center justify-between rounded-b-3xl">
        <div>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xl font-serif italic font-bold text-white">₹{equipment.dailyRate}</span>
            <span className="text-xs text-[#888888]">/ day</span>
          </div>
          <span className="text-[10px] text-[#666666] font-mono">Deposit: ₹{equipment.securityDeposit}</span>
        </div>

        <Link
    to={`/equipment/${equipment.id}`}
    className="px-3.5 py-2 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
  >
          <span>Rent Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>;
};
