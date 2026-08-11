import React, { useState } from 'react';
import { Camera, X, Check, Upload, AlertTriangle, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Booking } from '../types';

interface DamageReportModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmitConditionReport: (
    bookingId: string,
    beforePhotos: string[],
    afterPhotos: string[],
    conditionNotes: string
  ) => void;
}

export const DamageReportModal: React.FC<DamageReportModalProps> = ({
  booking,
  onClose,
  onSubmitConditionReport,
}) => {
  const [activePhotoTab, setActivePhotoTab] = useState<'before' | 'after'>('after');

  const [beforePhotos, setBeforePhotos] = useState<string[]>(
    booking.beforePhotos || [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    ]
  );

  const [afterPhotos, setAfterPhotos] = useState<string[]>(
    booking.afterPhotos || [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600',
    ]
  );

  const [conditionNotes, setConditionNotes] = useState<string>(
    booking.conditionNotes || ''
  );

  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const samplePhotos = {
    cleanTrack: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600',
    scuffedEdge: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600',
    sealLeak: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhotoUrl.trim()) {
      if (activePhotoTab === 'before') {
        setBeforePhotos([...beforePhotos, newPhotoUrl.trim()]);
      } else {
        setAfterPhotos([...afterPhotos, newPhotoUrl.trim()]);
      }
      setNewPhotoUrl('');
    }
  };

  const handleAddQuickSample = (url: string) => {
    if (activePhotoTab === 'before') {
      setBeforePhotos([...beforePhotos, url]);
    } else {
      setAfterPhotos([...afterPhotos, url]);
    }
  };

  const handleSave = () => {
    onSubmitConditionReport(booking.id, beforePhotos, afterPhotos, conditionNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-[#111111] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#1F1F1F] text-white relative space-y-5 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#F27D26]">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif italic text-lg text-white">Equipment Condition & Damage Tracking</h3>
            <p className="text-xs text-[#888888]">
              {booking.equipmentTitle} • Ref #{booking.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222] text-xs text-[#888888] flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
          <span>
            Compare <strong>'Before Pickup'</strong> and <strong>'After Return'</strong> condition photos. Noted condition differences automatically open an administrator dispute hold.
          </span>
        </div>

        {/* Photo Stage Switcher Tabs */}
        <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 rounded-2xl border border-[#222222]">
          <button
            onClick={() => setActivePhotoTab('before')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activePhotoTab === 'before' ? 'bg-[#F27D26] text-black shadow-md' : 'text-[#888888] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Pickup 'Before' Photos ({beforePhotos.length})</span>
          </button>
          <button
            onClick={() => setActivePhotoTab('after')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activePhotoTab === 'after' ? 'bg-[#F27D26] text-black shadow-md' : 'text-[#888888] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Return 'After' Photos ({afterPhotos.length})</span>
          </button>
        </div>

        {/* Photos Grid for Active Tab */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#888888] uppercase tracking-wider">
              {activePhotoTab === 'before' ? 'Pickup Inspection Photos' : 'Return Inspection Photos'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#888888]">Add Quick Sample:</span>
              <button
                type="button"
                onClick={() => handleAddQuickSample(samplePhotos.cleanTrack)}
                className="px-2 py-0.5 rounded bg-[#1A1A1A] hover:bg-[#222] text-[#F27D26] border border-[#333] text-[9px] font-bold cursor-pointer"
              >
                + Track
              </button>
              <button
                type="button"
                onClick={() => handleAddQuickSample(samplePhotos.scuffedEdge)}
                className="px-2 py-0.5 rounded bg-[#1A1A1A] hover:bg-[#222] text-[#F27D26] border border-[#333] text-[9px] font-bold cursor-pointer"
              >
                + Scuff
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(activePhotoTab === 'before' ? beforePhotos : afterPhotos).map((photoUrl, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#333333] bg-[#1A1A1A]">
                <img src={photoUrl} alt="Inspection Photo" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 bg-black/80 text-[9px] text-white px-1.5 py-0.5 rounded border border-[#333]">
                  {activePhotoTab === 'before' ? 'BEFORE' : 'AFTER'} #{idx + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Add Photo Input */}
          <form onSubmit={handleAddPhoto} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder={`Paste ${activePhotoTab === 'before' ? 'pickup' : 'return'} photo URL...`}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#F27D26] border border-[#333333] text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Condition Differences Text Area Field */}
        <div className="space-y-2 pt-2 border-t border-[#1F1F1F]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#F27D26]" />
              <span>Condition Differences & Inspection Notes</span>
            </label>
            <span className="text-[10px] text-[#888888]">Noting differences auto-flags admin dispute</span>
          </div>

          <textarea
            rows={3}
            value={conditionNotes}
            onChange={(e) => setConditionNotes(e.target.value)}
            placeholder="Describe any unnoted scratches, hydraulic leaks, track wear, or missing attachments observed on return..."
            className="w-full p-3.5 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26] placeholder-[#555555]"
          ></textarea>

          {conditionNotes.trim().length > 0 && (
            <div className="p-3 rounded-xl bg-[#F27D26]/10 border border-[#F27D26]/30 text-[11px] text-[#F27D26] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Auto-Dispute Notice:</strong> Entering notes will automatically flag this booking for Administrator Review in the Dispute Resolution Center.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#1F1F1F] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#333333] text-xs font-bold text-[#888888] hover:text-white cursor-pointer uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span>Save Inspection & Audit Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
