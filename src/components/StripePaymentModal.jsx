import { useState } from "react";
import { CreditCard, ShieldCheck, Sparkles, X, Lock } from "lucide-react";
export const StripePaymentModal = ({
  equipmentTitle,
  priceBreakdown,
  onClose,
  onSuccess
}) => {
  const [cardName, setCardName] = useState("Ananya Iyer");
  const [cardNumber, setCardNumber] = useState("4242 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("988");
  const [isProcessing, setIsProcessing] = useState(false);
  const handleAutoFillTestCard = () => {
    setCardName("Ananya Iyer (Test Renter)");
    setCardNumber("4242 4242 4242 4242");
    setCardExp("08/28");
    setCardCvc("123");
  };
  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1500);
  };
  return <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111111] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#1F1F1F] text-white relative animate-in fade-in zoom-in-95 duration-200">
        <button
    onClick={onClose}
    className="absolute top-4 right-4 text-[#888888] hover:text-white p-1 rounded-full hover:bg-[#1A1A1A] cursor-pointer"
  >
          <X className="w-5 h-5" />
        </button>

        {
    /* Header */
  }
        <div className="flex items-center gap-3 mb-6 font-mono">
          <div className="w-11 h-11 rounded-2xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#F27D26] font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif italic text-white text-lg">Secure Stripe Checkout</h3>
              <span className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#333333] text-[#F27D26] text-[10px] font-mono font-bold uppercase tracking-wider">
                Test Mode
              </span>
            </div>
            <p className="text-xs text-[#888888] font-mono">256-bit Encrypted Rental Deposit & Fee Processing</p>
          </div>
        </div>

        {
    /* Itemized Summary */
  }
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#222222] mb-6 space-y-2 text-xs font-mono">
          <div className="font-serif italic text-white text-base mb-1">{equipmentTitle}</div>
          <div className="flex justify-between text-[#888888]">
            <span>Rental Duration:</span>
            <span className="font-semibold text-white">{priceBreakdown.rentalDays} days</span>
          </div>
          <div className="flex justify-between text-[#888888]">
            <span>Subtotal (₹{priceBreakdown.dailyRate}/day):</span>
            <span className="font-semibold text-white">₹{priceBreakdown.subtotal}</span>
          </div>
          <div className="flex justify-between text-[#888888]">
            <span>Security Deposit Hold (Refundable):</span>
            <span className="font-semibold text-[#F27D26]">₹{priceBreakdown.securityDeposit}</span>
          </div>
          <div className="flex justify-between text-[#888888]">
            <span>Platform Service & Protection Fee:</span>
            <span className="font-semibold text-white">₹{priceBreakdown.platformFee + priceBreakdown.insuranceFee}</span>
          </div>
          <div className="pt-2 border-t border-[#333333] flex justify-between text-sm font-bold text-white">
            <span>Total Charge:</span>
            <span className="text-[#F27D26] text-base font-serif italic">₹{priceBreakdown.total}</span>
          </div>
        </div>

        {
    /* Payment Form */
  }
        <form onSubmit={handlePay} className="space-y-4">
          <div className="flex items-center justify-between font-mono">
            <label className="text-xs font-bold text-[#888888] uppercase tracking-wider">Cardholder Name</label>
            <button
    type="button"
    onClick={handleAutoFillTestCard}
    className="text-[10px] font-bold text-[#F27D26] hover:text-[#d96a1a] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
  >
              <Sparkles className="w-3 h-3" /> Auto-fill Stripe Test Card
            </button>
          </div>
          <input
    type="text"
    value={cardName}
    onChange={(e) => setCardName(e.target.value)}
    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
    required
  />

          <div>
            <label className="text-xs font-mono font-bold text-[#888888] block mb-1 uppercase tracking-wider">Card Number</label>
            <div className="relative">
              <input
    type="text"
    value={cardNumber}
    onChange={(e) => setCardNumber(e.target.value)}
    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26] pl-10"
    required
  />
              <CreditCard className="w-4 h-4 text-[#666666] absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-[#888888] block mb-1 uppercase tracking-wider">Expiry Date</label>
              <input
    type="text"
    value={cardExp}
    onChange={(e) => setCardExp(e.target.value)}
    placeholder="MM/YY"
    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
    required
  />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#888888] block mb-1 uppercase tracking-wider">CVC / CVV</label>
              <input
    type="text"
    value={cardCvc}
    onChange={(e) => setCardCvc(e.target.value)}
    placeholder="123"
    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
    required
  />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1A1A1A] border border-[#333333] text-[10px] font-mono text-[#888888] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
            <span>
              The <strong className="text-white">₹{priceBreakdown.securityDeposit} security deposit</strong> will be placed as an authorization hold and released automatically upon safe return.
            </span>
          </div>

          <button
    type="submit"
    disabled={isProcessing}
    className="w-full py-3.5 px-4 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
  >
            {isProcessing ? <span className="flex items-center gap-2 font-mono">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing Lock & Payment...
              </span> : <span className="flex items-center gap-2 font-mono">
                <Lock className="w-4 h-4" />
                Authorize ₹{priceBreakdown.total} & Lock Equipment
              </span>}
          </button>
        </form>
      </div>
    </div>;
};
