import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Truck,
  ShieldCheck,
  MessageSquare,
  Camera,
  Star,
  XCircle,
  Lock,
  Sparkles
} from "lucide-react";
import { ROUTES } from "../lib/routes";
import { DamageReportModal } from "../components/DamageReportModal";
import { EscrowLedgerCard } from "../components/EscrowLedgerCard";
import { AiPreDispatchModal } from "../components/AiPreDispatchModal";
export const BookingDetailsPage = ({
  currentUser,
  bookings,
  onSubmitConditionReport,
  onAddReview,
  onCancelBooking
}) => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [isAiPreDispatchOpen, setIsAiPreDispatchOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const booking = bookings.find(
    (b) => b.id === bookingId || b.id.toLowerCase() === bookingId?.toLowerCase()
  );
  if (!booking) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-mono text-white">
        <AlertTriangle className="w-12 h-12 text-[#F27D26] mx-auto" />
        <h2 className="font-serif italic text-2xl">Booking Not Found</h2>
        <p className="text-xs text-[#888888]">
          No rental record matches booking ID "{bookingId}".
        </p>
        <Link
      to={ROUTES.bookings}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F27D26] text-black font-bold text-xs uppercase tracking-wider"
    >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to My Bookings</span>
        </Link>
      </div>;
  }
  const timelineSteps = [
    { status: "pending", label: "Booked", description: "Reservation requested" },
    { status: "confirmed", label: "Confirmed", description: "Owner approved & locked" },
    { status: "pickup_ready", label: "Pickup Ready", description: "Pre-rental inspection done" },
    { status: "active", label: "Active Rental", description: "Equipment on job site" },
    { status: "return_pending", label: "Return Pending", description: "Post-rental return inspection" },
    { status: "completed", label: "Completed", description: "Escrow released & closed" }
  ];
  const getStepIndex = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
      case "locked":
        return 1;
      case "pickup_ready":
        return 2;
      case "active":
        return 3;
      case "return_pending":
        return 4;
      case "completed":
        return 5;
      case "disputed":
        return 4;
      case "cancelled":
        return -1;
      default:
        return 1;
    }
  };
  const currentStepIdx = getStepIndex(booking.status);
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (onAddReview && currentUser) {
      onAddReview({
        id: `rev-${Date.now()}`,
        bookingId: booking.id,
        equipmentId: booking.equipmentId,
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserAvatar: currentUser.avatar,
        rating: reviewRating,
        comment: reviewComment,
        createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      });
      setIsReviewModalOpen(false);
      setReviewComment("");
    }
  };
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-white">
      {
    /* Top Navigation */
  }
      <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
        <Link
    to={ROUTES.bookings}
    className="flex items-center gap-2 text-xs text-[#888888] hover:text-white transition"
  >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>
        <span className="text-xs text-[#666666] font-bold">
          Ref <strong className="text-[#F27D26]">#RH-{booking.id.substring(0, 8).toUpperCase()}</strong>
        </span>
      </div>

      {
    /* Header Banner */
  }
      <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border border-[#1F1F1F] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
    src={booking.equipmentImage}
    alt={booking.equipmentTitle}
    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#333333] shrink-0"
  />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30 text-[10px] uppercase font-bold tracking-wider mb-2">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Escrow Transaction</span>
            </div>
            <h1 className="font-serif italic text-2xl sm:text-3xl text-white">{booking.equipmentTitle}</h1>
            <p className="text-xs text-[#888888] mt-1 flex flex-wrap items-center gap-2">
              <span>Owner: <strong className="text-white">{booking.ownerName}</strong></span>
              <span>•</span>
              <span>Renter: <strong className="text-white">{booking.customerName}</strong></span>
            </p>
          </div>
        </div>

        <div className="text-right border-t md:border-t-0 pt-4 md:pt-0 border-[#1F1F1F]">
          <span className="text-3xl font-serif italic font-bold text-[#F27D26]">
            ₹{booking.priceBreakdown.total}
          </span>
          <span className="block text-[10px] text-emerald-400 uppercase font-bold mt-0.5">
            Status: {booking.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      {
    /* Rental Lifecycle Timeline */
  }
      <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#888888]">
          Rental Lifecycle Timeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {timelineSteps.map((step, idx) => {
    const isDone = currentStepIdx >= idx && booking.status !== "cancelled";
    const isCurrent = currentStepIdx === idx && booking.status !== "cancelled";
    return <div
      key={step.status}
      className={`p-3 rounded-2xl border text-center transition-all ${isCurrent ? "bg-[#F27D26]/10 border-[#F27D26] text-white shadow-lg" : isDone ? "bg-[#1A1A1A] border-emerald-500/40 text-emerald-400" : "bg-[#111111] border-[#222222] text-[#555555]"}`}
    >
                <div className="flex justify-center mb-1">
                  {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-[#555555]" />}
                </div>
                <div className="text-xs font-bold font-mono">{step.label}</div>
                <div className="text-[9px] text-[#888888] mt-0.5">{step.description}</div>
              </div>;
  })}
        </div>
      </div>

      {
    /* Two Column Layout: Details & Price Breakdown */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
    /* Left 2 Columns: Equipment & Logistics Details */
  }
        <div className="md:col-span-2 space-y-6">
          {
    /* Reservation Details */
  }
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white border-b border-[#1F1F1F] pb-3">
              Rental Terms & Fulfillment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222]">
                <span className="text-[10px] text-[#888888] font-bold uppercase block mb-1">Rental Period</span>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F27D26]" />
                  <span>{booking.startDate} → {booking.endDate}</span>
                </div>
                <span className="text-[10px] text-[#888888] mt-1 block">Total {booking.priceBreakdown.rentalDays} Rental Days</span>
              </div>

              <div className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222]">
                <span className="text-[10px] text-[#888888] font-bold uppercase block mb-1">Handover Method</span>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#F27D26]" />
                  <span>{booking.deliveryMethod === "delivery" ? "Job Site Delivery" : "Self Pickup at Yard"}</span>
                </div>
                <span className="text-[10px] text-[#888888] mt-1 block truncate">
                  {booking.deliveryAddress || "Standard Owner Depot Location"}
                </span>
              </div>
            </div>
          </div>

          {
    /* Webhook-Based Escrow Simulation Ledger */
  }
          <EscrowLedgerCard bookingId={booking.id} currentUser={currentUser} />

          {
    /* Condition Audit Report Section */
  }
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1F1F1F] pb-3 gap-2">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#F27D26]" />
                <span>Condition & Asset Inspection Log</span>
              </h3>
              <div className="flex gap-2">
                <button
    onClick={() => setIsAiPreDispatchOpen(true)}
    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-bold text-purple-300 uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
  >
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini AI Pre-Dispatch Audit
                </button>
                <button
    onClick={() => setIsConditionModalOpen(true)}
    className="px-3 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-xs font-bold text-white uppercase tracking-wider transition cursor-pointer"
  >
                  Upload Photos
                </button>
              </div>
            </div>

            {booking.condition?.pickupPhotos?.length || booking.condition?.returnPhotos?.length ? <div className="space-y-3 text-xs">
                {booking.condition?.pickupNotes && <p className="text-[#888888] bg-[#1A1A1A] p-3 rounded-2xl border border-[#222222]">
                    <strong className="text-white">Inspection Notes:</strong> {booking.condition.pickupNotes}
                  </p>}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-[#888888] font-bold uppercase block mb-1">Pickup Inspection</span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {(booking.beforePhotos || booking.condition?.pickupPhotos || []).map((img, i) => <img key={i} src={img} alt="Pickup" className="w-16 h-16 rounded-xl object-cover border border-[#333]" />)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#888888] font-bold uppercase block mb-1">Return Inspection</span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {(booking.afterPhotos || booking.condition?.returnPhotos || []).map((img, i) => <img key={i} src={img} alt="Return" className="w-16 h-16 rounded-xl object-cover border border-[#333]" />)}
                    </div>
                  </div>
                </div>
              </div> : <p className="text-xs text-[#888888] italic">
                No condition inspection photos uploaded yet. Upload pre-pickup or return condition photos to document asset state.
              </p>}
          </div>
        </div>

        {
    /* Right Column: Price Summary & Contextual Actions */
  }
        <div className="space-y-6">
          {
    /* Price Breakdown Card */
  }
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-4 text-xs font-mono">
            <h3 className="font-bold uppercase tracking-wider text-white border-b border-[#1F1F1F] pb-3">
              Financial Summary
            </h3>

            <div className="space-y-2 text-[#AAAAAA]">
              <div className="flex justify-between">
                <span>Daily Rate (₹{booking.priceBreakdown.dailyRate} x {booking.priceBreakdown.rentalDays}d)</span>
                <span className="text-white font-bold">₹{booking.priceBreakdown.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit (Refundable)</span>
                <span className="text-white font-bold">₹{booking.priceBreakdown.securityDeposit}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Fee</span>
                <span className="text-white font-bold">₹{booking.priceBreakdown.platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Equipment Insurance Protection</span>
                <span className="text-white font-bold">₹{booking.priceBreakdown.insuranceFee}</span>
              </div>

              <div className="border-t border-[#222222] pt-3 flex justify-between text-sm font-bold text-white">
                <span>Total Charge</span>
                <span className="text-[#F27D26]">₹{booking.priceBreakdown.total}</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-3 rounded-2xl border border-[#222222] text-[10px] text-[#888888] space-y-1">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Lock className="w-3 h-3" />
                <span>Security Deposit Authorization Hold</span>
              </div>
              <p>The ₹{booking.priceBreakdown.securityDeposit} deposit hold is released automatically upon return inspection confirmation.</p>
            </div>
          </div>

          {
    /* Contextual Action Buttons */
  }
          <div className="bg-[#111111] rounded-3xl p-6 border border-[#1F1F1F] shadow-xl space-y-3 font-mono text-xs">
            <h3 className="font-bold uppercase tracking-wider text-white mb-2">Actions</h3>

            <button
    onClick={() => setIsAiPreDispatchOpen(true)}
    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
  >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Gemini AI Inspection Logger</span>
            </button>

            <a
    href={`mailto:owner@rentalhub.com?subject=Inquiry regarding Booking ${booking.id}`}
    className="w-full py-2.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
  >
              <MessageSquare className="w-4 h-4 text-[#F27D26]" />
              <span>Contact Owner</span>
            </a>

            <button
    onClick={() => setIsConditionModalOpen(true)}
    className="w-full py-2.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
  >
              <Camera className="w-4 h-4 text-[#F27D26]" />
              <span>Upload Inspection Condition</span>
            </button>

            {booking.status === "completed" && <button
    onClick={() => setIsReviewModalOpen(true)}
    className="w-full py-2.5 px-4 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
  >
                <Star className="w-4 h-4 fill-current" />
                <span>Submit Experience Review</span>
              </button>}

            {(booking.status === "pending" || booking.status === "confirmed" || booking.status === "locked") && onCancelBooking && <button
    onClick={() => {
      onCancelBooking(booking.id);
      navigate(ROUTES.bookings);
    }}
    className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
  >
                <XCircle className="w-4 h-4" />
                <span>Cancel Reservation</span>
              </button>}
          </div>
        </div>
      </div>

      {
    /* Damage/Condition Inspection Modal */
  }
      {isConditionModalOpen && onSubmitConditionReport && <DamageReportModal
    booking={booking}
    onClose={() => setIsConditionModalOpen(false)}
    onSubmitConditionReport={onSubmitConditionReport}
  />}

      {
    /* Review Modal */
  }
      {isReviewModalOpen && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] rounded-3xl max-w-md w-full p-6 border border-[#1F1F1F] shadow-2xl space-y-4 font-mono text-white">
            <h3 className="font-serif italic text-lg text-white">Review {booking.equipmentTitle}</h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#888888] block mb-1 uppercase">Rating</label>
                <div className="flex gap-2 text-[#F27D26]">
                  {[1, 2, 3, 4, 5].map((star) => <button
    key={star}
    type="button"
    onClick={() => setReviewRating(star)}
    className="cursor-pointer"
  >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? "fill-[#F27D26]" : "text-[#333]"}`} />
                    </button>)}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#888888] block mb-1 uppercase">Comments</label>
                <textarea
    rows={4}
    value={reviewComment}
    onChange={(e) => setReviewComment(e.target.value)}
    placeholder="How was the machinery performance and owner communication?"
    className="w-full p-3 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
    required
  />
              </div>

              <div className="flex gap-2">
                <button
    type="button"
    onClick={() => setIsReviewModalOpen(false)}
    className="flex-1 py-2.5 rounded-xl border border-[#333] text-xs font-bold text-[#888888] hover:text-white uppercase"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="flex-1 py-2.5 rounded-xl bg-[#F27D26] text-black text-xs font-bold uppercase"
  >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>}

      {
    /* Gemini 2.5 Flash Automated AI Pre-Dispatch Inspection Logger Modal */
  }
      <AiPreDispatchModal
    booking={booking}
    isOpen={isAiPreDispatchOpen}
    onClose={() => setIsAiPreDispatchOpen(false)}
  />
    </div>;
};
