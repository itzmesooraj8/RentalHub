import React, { useState } from 'react';
import { Booking } from '../types';
import { Camera, AlertTriangle, CheckCircle, Upload, FileText, X } from 'lucide-react';
import axios from 'axios';

interface DamageTrackerModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const DamageTrackerModal: React.FC<DamageTrackerModalProps> = ({
  booking,
  isOpen,
  onClose,
  onUpdated
}) => {
  const [returnNotes, setReturnNotes] = useState(booking.condition.returnNotes || '');
  const [damageDetected, setDamageDetected] = useState(booking.condition.damageDetected || false);
  const [returnPhotos, setReturnPhotos] = useState<string[]>(
    booking.condition.returnPhotos?.length
      ? booking.condition.returnPhotos
      : ['https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`/api/bookings/${booking.id}/damage-track`, {
        returnPhotos,
        returnNotes,
        damageDetected
      });
      setIsSubmitting(false);
      onUpdated();
      onClose();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const samplePhotoOptions = [
    'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Equipment Damage & Condition Tracker</h3>
            <p className="text-xs text-slate-500">Before & After Condition Audit for {booking.equipmentTitle}</p>
          </div>
        </div>

        {/* Before vs After Visual Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* PICKUP / BEFORE CONDITION */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Pickup Condition (Before)
              </span>
              <span className="text-[10px] text-slate-400">Verified at Pickup</span>
            </div>
            <img
              src={booking.condition.pickupPhotos[0] || booking.equipmentImage}
              alt="Pickup condition"
              className="w-full h-36 object-cover rounded-xl border border-slate-200 mb-2"
            />
            <p className="text-xs text-slate-600 italic">
              "{booking.condition.pickupNotes || 'Inspected at pickup. No pre-existing damages noted.'}"
            </p>
          </div>

          {/* RETURN / AFTER CONDITION */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                Return Condition (After)
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">Return Inspection</span>
            </div>
            {returnPhotos.length > 0 ? (
              <img
                src={returnPhotos[0]}
                alt="Return condition"
                className="w-full h-36 object-cover rounded-xl border border-slate-200 mb-2"
              />
            ) : (
              <div className="w-full h-36 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs mb-2">
                <Upload className="w-6 h-6 mb-1 text-slate-300" />
                <span>Upload Return Inspection Photo</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 font-semibold">Add Sample Photo:</span>
              {samplePhotoOptions.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReturnPhotos([url])}
                  className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] hover:bg-slate-100 cursor-pointer"
                >
                  Photo #{i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes & Damage Flag Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Condition Notes & Diff Description
            </label>
            <textarea
              rows={3}
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Describe equipment cleanliness, fuel level, or any scratch/dent detected during return..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            ></textarea>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <div>
                <div className="text-xs font-bold text-rose-900">Flag Damage / Dispute Needed?</div>
                <div className="text-[11px] text-rose-700">Check this box if damage requires deposit hold or admin dispute resolution.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={damageDetected}
              onChange={(e) => setDamageDetected(e.target.checked)}
              className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? 'Saving Condition Report...' : 'Submit Condition Inspection Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
