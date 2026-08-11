import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck, Store, Calendar as CalendarIcon, CreditCard, ShieldCheck } from 'lucide-react';
import { Equipment, Booking, PriceBreakdown, User } from '../types';
import { StripePaymentModal } from '../components/StripePaymentModal';

interface BookingFlowPageProps {
  equipmentList: Equipment[];
  currentUser: User | null;
  onAddBooking: (newBooking: Booking) => void;
}

export const BookingFlowPage: React.FC<BookingFlowPageProps> = ({
  equipmentList,
  currentUser,
  onAddBooking,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialStart = searchParams.get('start') || new Date().toISOString().split('T')[0];
  // Default 3 day rental if end date missing
  const defaultEnd = searchParams.get('end') || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const equipment = equipmentList.find((e) => e.id === id) || equipmentList[0];

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.location || '742 Industrial Pkwy, Austin TX');
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  // Price calculations
  const startObj = new Date(startDate);
  const endObj = new Date(endDate);
  const diffTime = Math.max(1000 * 60 * 60 * 24, endObj.getTime() - startObj.getTime());
  const rentalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const subtotal = equipment.dailyRate * rentalDays;
  const deliveryFee = deliveryMethod === 'delivery' ? 45 : 0;
  const platformFee = Math.round(subtotal * 0.10);
  const insuranceFee = Math.round(subtotal * 0.05);
  const securityDeposit = equipment.securityDeposit;

  const totalCharge = subtotal + deliveryFee + platformFee + insuranceFee + securityDeposit;

  const priceBreakdown: PriceBreakdown = {
    dailyRate: equipment.dailyRate,
    rentalDays,
    subtotal,
    deliveryFee,
    securityDeposit,
    platformFee,
    insuranceFee,
    total: totalCharge,
  };

  const handlePaymentSuccess = () => {
    const renterId = currentUser?.id || 'usr_cust_1';
    const renterName = currentUser?.name || 'Authorized Customer';

    const newBooking: Booking = {
      id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentId: equipment.id,
      equipmentTitle: equipment.title,
      equipmentImage: equipment.images[0],
      customerId: renterId,
      customerName: renterName,
      renterId,
      renterName,
      ownerId: equipment.ownerId,
      ownerName: equipment.ownerName,
      startDate,
      endDate,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
      status: 'locked',
      priceBreakdown,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddBooking(newBooking);
    setIsStripeModalOpen(false);
    navigate('/dashboard/customer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      {/* Back Button */}
      <Link
        to={`/equipment/${equipment.id}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#888888] hover:text-white uppercase tracking-wider transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Equipment Details</span>
      </Link>

      <div className="border-b border-[#1F1F1F] pb-4">
        <h1 className="font-serif italic text-3xl font-normal text-white">Equipment Reservation Lock</h1>
        <p className="text-xs text-[#888888] mt-1">
          Review rental dates, job site logistics, and pre-authorized security deposit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Dates & Logistics */}
        <div className="md:col-span-2 space-y-6">
          {/* Equipment Summary Banner */}
          <div className="bg-[#111111] p-5 rounded-3xl border border-[#1F1F1F] flex items-center gap-4 shadow-xl">
            <img
              src={equipment.images[0]}
              alt={equipment.title}
              className="w-20 h-20 rounded-2xl object-cover border border-[#333333]"
            />
            <div>
              <span className="text-[10px] text-[#F27D26] font-bold uppercase tracking-wider">{equipment.category}</span>
              <h3 className="font-serif italic text-lg text-white">{equipment.title}</h3>
              <p className="text-xs text-[#888888] mt-0.5">{equipment.location}</p>
            </div>
          </div>

          {/* Date Picker Range Inputs */}
          <div className="bg-[#111111] p-6 rounded-3xl border border-[#1F1F1F] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-white">
              <CalendarIcon className="w-5 h-5 text-[#F27D26]" />
              <h3 className="font-serif italic text-xl">Select Rental Schedule</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#222222] text-xs text-[#888888] flex justify-between items-center">
              <span>Calculated Rental Duration:</span>
              <span className="text-[#F27D26] font-bold">{rentalDays} Day{rentalDays > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Delivery Method Selection */}
          <div className="bg-[#111111] p-6 rounded-3xl border border-[#1F1F1F] shadow-xl space-y-4">
            <h3 className="font-serif italic text-xl text-white">Dispatch & Logistics Method</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  deliveryMethod === 'delivery'
                    ? 'bg-[#1A1A1A] border-[#F27D26] text-white shadow-md'
                    : 'bg-[#111111] border-[#222222] text-[#888888] hover:border-[#333333]'
                }`}
              >
                <Truck className="w-5 h-5 text-[#F27D26] mb-2" />
                <div className="font-bold text-white uppercase tracking-wider">Job Site Delivery</div>
                <div className="text-[10px] text-[#888888] mt-0.5">Heavy transport flatbed dispatch (+$45)</div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  deliveryMethod === 'pickup'
                    ? 'bg-[#1A1A1A] border-[#F27D26] text-white shadow-md'
                    : 'bg-[#111111] border-[#222222] text-[#888888] hover:border-[#333333]'
                }`}
              >
                <Store className="w-5 h-5 text-[#F27D26] mb-2" />
                <div className="font-bold text-white uppercase tracking-wider">Depot Self Pickup</div>
                <div className="text-[10px] text-[#888888] mt-0.5">Pickup at regional yard depot ($0)</div>
              </button>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Site Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter job site address..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Payment CTA */}
        <div className="bg-[#111111] p-6 rounded-3xl border border-[#1F1F1F] shadow-xl space-y-4 text-xs h-fit">
          <h3 className="font-serif italic text-xl text-white">Itemized Calculation</h3>

          <div className="space-y-2 text-[#888888]">
            <div className="flex justify-between">
              <span>Rental ({rentalDays} d @ ${equipment.dailyRate}/d):</span>
              <span className="text-white font-bold">${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Logistics Delivery Fee:</span>
              <span className="text-white font-bold">${deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform & Protection Fee:</span>
              <span className="text-white font-bold">${platformFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Job Protection Guarantee:</span>
              <span className="text-white font-bold">${insuranceFee}</span>
            </div>
            <div className="flex justify-between text-[#F27D26]">
              <span>Refundable Deposit Hold:</span>
              <span className="font-bold">${securityDeposit}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1F1F1F] flex justify-between text-sm font-bold text-white">
            <span>Total Pre-Authorized:</span>
            <span className="text-lg font-serif italic text-[#F27D26]">${totalCharge}</span>
          </div>

          <button
            onClick={() => setIsStripeModalOpen(true)}
            className="w-full py-3.5 px-4 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay & Lock via Stripe</span>
          </button>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {isStripeModalOpen && (
        <StripePaymentModal
          equipmentTitle={equipment.title}
          priceBreakdown={priceBreakdown}
          onClose={() => setIsStripeModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
