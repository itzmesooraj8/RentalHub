import { useState } from "react";
import { ShieldCheck, Star, Clock, CheckCircle2, Award, X } from "lucide-react";
export const TrustScoreBadge = ({
  score,
  kycVerified = true,
  rating = 4.9,
  completedRentals = 14,
  onTimeRentals = 14,
  size = "sm",
  showDetailsOnClick = true,
  userName = "Contractor Profile"
}) => {
  const [showModal, setShowModal] = useState(false);
  const ratingScoreComponent = Math.round(rating / 5 * 60);
  const onTimeRatio = Math.min(1, onTimeRentals / Math.max(1, completedRentals));
  const onTimeScoreComponent = Math.round(onTimeRatio * 30);
  const kycScoreComponent = kycVerified ? 10 : 0;
  const calculatedTrustScore = score ?? ratingScoreComponent + onTimeScoreComponent + kycScoreComponent;
  const getTier = (s) => {
    if (s >= 90) return { label: "Tier 1 Platinum Asset", color: "text-[#F27D26]", badgeBg: "bg-[#F27D26]/10 border-[#F27D26]/40" };
    if (s >= 75) return { label: "Tier 2 Gold Verified", color: "text-emerald-400", badgeBg: "bg-emerald-500/10 border-emerald-500/40" };
    return { label: "Tier 3 Standard Member", color: "text-amber-400", badgeBg: "bg-amber-500/10 border-amber-500/40" };
  };
  const tier = getTier(calculatedTrustScore);
  return <>
      <button
    type="button"
    onClick={() => showDetailsOnClick && setShowModal(true)}
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#333333] hover:border-[#F27D26] ${tier.color} font-mono font-bold text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs active:scale-95`}
    title="Click to view Trust & Safety Score breakdown"
  >
        <ShieldCheck className={size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"} />
        <span>Trust {calculatedTrustScore}%</span>
        {kycVerified && <span className="ml-1 pl-1.5 border-l border-[#333333] text-[#888888] font-mono text-[9px]">
            KYC OK
          </span>}
      </button>

      {
    /* Trust & Safety Score Calculation Breakdown Modal */
  }
      {showModal && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-white">
          <div className="bg-[#111111] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#1F1F1F] relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button
    onClick={() => setShowModal(false)}
    className="absolute top-4 right-4 text-[#888888] hover:text-white p-1 rounded-full cursor-pointer"
  >
              <X className="w-5 h-5" />
            </button>

            {
    /* Header */
  }
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#F27D26]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif italic text-lg text-white">Trust & Safety Score</h3>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${tier.badgeBg} ${tier.color}`}>
                    {tier.label}
                  </span>
                </div>
                <p className="text-xs text-[#888888]">
                  Verified Rating & On-Time Performance Audit for {userName}
                </p>
              </div>
            </div>

            {
    /* Big Score Gauge */
  }
            <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#222222] text-center space-y-1">
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                Calculated Trust Index Score
              </span>
              <div className={`text-4xl font-serif italic font-bold ${tier.color}`}>
                {calculatedTrustScore} / 100
              </div>
              <p className="text-[11px] text-[#888888]">
                Based on real peer reviews, on-time asset return metrics, and business KYC verification.
              </p>
            </div>

            {
    /* Formula Breakdown */
  }
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#222222] pb-1">
                Score Formula Breakdown
              </span>

              {
    /* Factor 1: Review Ratings */
  }
              <div className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Customer Review Rating ({rating} / 5.0)</span>
                  </span>
                  <span className="text-white">+{ratingScoreComponent} pts (Max 60)</span>
                </div>
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${rating / 5 * 100}%` }} />
                </div>
              </div>

              {
    /* Factor 2: On-time Rentals */
  }
              <div className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>On-Time Return Rate ({onTimeRentals}/{completedRentals} Rentals)</span>
                  </span>
                  <span className="text-white">+{onTimeScoreComponent} pts (Max 30)</span>
                </div>
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${onTimeRatio * 100}%` }} />
                </div>
              </div>

              {
    /* Factor 3: KYC Verification */
  }
              <div className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#F27D26]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>KYC Business & Identity Verified</span>
                  </span>
                  <span className="text-white">+{kycScoreComponent} pts (Max 10)</span>
                </div>
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#F27D26] h-full" style={{ width: kycVerified ? "100%" : "0%" }} />
                </div>
              </div>
            </div>

            <button
    onClick={() => setShowModal(false)}
    className="w-full py-3 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
  >
              Close Breakdown
            </button>
          </div>
        </div>}
    </>;
};
