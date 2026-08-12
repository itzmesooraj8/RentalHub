import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Star, ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { TrustScoreBadge } from "../components/TrustScoreBadge.jsx";
import { AvailabilityCalendar } from "../components/AvailabilityCalendar.jsx";
import { EsgImpactCard } from "../components/EsgImpactCard.jsx";
export const EquipmentDetailPage = ({
  equipmentList,
  reviewsList,
  favorites,
  onToggleFavorite
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const equipment = equipmentList.find((e) => e.id === id) || equipmentList[0];
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    start: "2026-08-15",
    end: "2026-08-18"
  });
  const equipmentReviews = reviewsList.filter((r) => r.equipmentId === equipment.id);
  const isFav = favorites.includes(equipment.id);
  const handleSelectDates = (start, end) => {
    setSelectedDates({ start, end });
  };
  const handleProceedBooking = () => {
    navigate(`/equipment/${equipment.id}/book?start=${selectedDates.start}&end=${selectedDates.end}`);
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {
    /* Back Button */
  }
      <Link
    to="/browse"
    className="inline-flex items-center gap-2 text-xs font-bold text-[#888888] hover:text-white uppercase tracking-wider transition"
  >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Equipment Marketplace</span>
      </Link>

      {
    /* Main Grid: Left Photos & Specs, Right Booking Widget */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {
    /* Left Column (2 Cols wide) */
  }
        <div className="lg:col-span-2 space-y-8">
          {
    /* Main Photo Gallery */
  }
          <div className="space-y-3">
            <div className="relative aspect-16/10 rounded-3xl overflow-hidden bg-[#111111] border border-[#1F1F1F] shadow-2xl">
              <img
    src={equipment.images[activeImgIndex] || equipment.images[0]}
    alt={equipment.title}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.src = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000";
    }}
  />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#0A0A0A]/90 backdrop-blur-md text-[#F27D26] text-xs font-bold uppercase tracking-wider border border-[#333333]">
                {equipment.category}
              </span>

              <button
    onClick={() => onToggleFavorite(equipment.id)}
    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition cursor-pointer ${isFav ? "bg-[#F27D26] text-black" : "bg-[#0A0A0A]/70 text-white hover:bg-[#0A0A0A]"}`}
  >
                <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
              </button>
            </div>

            {
    /* Thumbnail Row */
  }
            {equipment.images.length > 1 && <div className="flex gap-3">
                {equipment.images.map((img, idx) => <button
    key={idx}
    onClick={() => setActiveImgIndex(idx)}
    className={`w-20 h-20 rounded-2xl overflow-hidden border transition cursor-pointer ${activeImgIndex === idx ? "border-[#F27D26] ring-2 ring-[#F27D26]/40" : "border-[#1F1F1F] opacity-60 hover:opacity-100"}`}
  >
                    <img
    src={img}
    alt="Thumbnail"
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.src = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000";
    }}
  />
                  </button>)}
              </div>}
          </div>

          {
    /* Title & Description */
  }
          <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border border-[#1F1F1F] shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#888888]">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#F27D26]" /> {equipment.location}
              </span>
              <span className="flex items-center gap-1 text-[#F27D26] font-bold">
                <Star className="w-4 h-4 fill-current" /> {equipment.rating} ({equipment.reviewCount} verified reviews)
              </span>
            </div>

            <h1 className="font-serif italic text-3xl sm:text-4xl font-normal text-white">{equipment.title}</h1>

            <p className="text-xs sm:text-sm text-[#888888] font-mono leading-relaxed">{equipment.description}</p>
          </div>

          {
    /* Specs Table */
  }
          <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border border-[#1F1F1F] shadow-xl space-y-4 font-mono">
            <h3 className="font-serif italic text-xl text-white">Technical Machinery Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(equipment.specs).map(([key, val]) => <div key={key} className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222] flex justify-between items-center text-xs">
                  <span className="text-[#666666] font-bold uppercase tracking-wider">{key}</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>)}
            </div>
          </div>

          {
    /* Owner Profile */
  }
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl flex items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-4">
              <img
    src={equipment.ownerAvatar}
    alt={equipment.ownerName}
    className="w-14 h-14 rounded-2xl object-cover border border-[#333333]"
  />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif italic text-base text-white">{equipment.ownerName}</h4>
                  <TrustScoreBadge score={equipment.ownerTrustScore} kycVerified={equipment.ownerKyVerified} />
                </div>
                <p className="text-xs text-[#888888] mt-0.5">Verified Equipment Provider • Instant Reservation On</p>
              </div>
            </div>
          </div>

          {
    /* Customer Reviews List */
  }
          <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border border-[#1F1F1F] shadow-xl space-y-4 font-mono">
            <h3 className="font-serif italic text-xl text-white">Verified Customer Reviews</h3>
            {equipmentReviews.length === 0 ? <p className="text-xs text-[#666666] italic">No verified reviews submitted yet for this machine.</p> : <div className="space-y-4">
                {equipmentReviews.map((rev) => <div key={rev.id} className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.fromUserAvatar} alt={rev.fromUserName} className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-bold text-white">{rev.fromUserName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#F27D26]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold">{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-[#888888] leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-[#555555] block">{rev.createdAt}</span>
                  </div>)}
              </div>}
          </div>
        </div>

        {
    /* Right Column: Availability Calendar & Booking CTA */
  }
        <div className="space-y-6 font-mono">
          <AvailabilityCalendar dailyRate={equipment.dailyRate} onSelectDates={handleSelectDates} />

          {
    /* Pricing Breakdown Box */
  }
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#888888] uppercase tracking-wider">Daily Rate</span>
              <div className="text-right">
                <span className="text-2xl font-serif italic text-[#F27D26] font-bold">₹{equipment.dailyRate}</span>
                <span className="text-xs text-[#888888]"> / day</span>
              </div>
            </div>

            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#222222] text-xs text-[#888888] space-y-1.5">
              <div className="flex justify-between">
                <span>Weekly Discounted Rate:</span>
                <span className="text-white font-bold">₹{equipment.weeklyRate}/wk</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit Hold:</span>
                <span className="text-[#F27D26] font-bold">₹{equipment.securityDeposit}</span>
              </div>
            </div>

            <button
    onClick={handleProceedBooking}
    className="w-full py-4 px-4 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
  >
              <span>Proceed to Lock Reservation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-[#666666] text-center">
              256-bit Encrypted Escrow • Deposit pre-authorization
            </div>
          </div>

          <EsgImpactCard co2SavedKg={equipment.co2SavedPerDayKg * 3} title="Equipment CO₂ Impact" />
        </div>
      </div>
    </div>;
};
