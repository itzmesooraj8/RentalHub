import React from 'react';
import { Leaf, Award, Zap } from 'lucide-react';

interface EsgImpactCardProps {
  co2SavedKg: number;
  title?: string;
}

export const EsgImpactCard: React.FC<EsgImpactCardProps> = ({ co2SavedKg, title = 'Circular Fleet ESG Impact' }) => {
  return (
    <div className="p-5 rounded-2xl bg-[#111111] border border-[#1F1F1F] text-white shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-emerald-400">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif italic text-base text-white">{title}</h4>
            <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">Certified Fleet Sharing Offset</span>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
          Verified Impact
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
        <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#222222]">
          <span className="text-[10px] text-[#666666] uppercase tracking-wider block">CO₂ Emissions Diverted</span>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">{co2SavedKg} kg CO₂e</div>
        </div>

        <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#222222]">
          <span className="text-[10px] text-[#666666] uppercase tracking-wider block">Manufacturing Saved</span>
          <div className="text-xl font-bold text-white mt-0.5">84% Offset</div>
        </div>
      </div>

      <p className="text-[11px] text-[#888888] font-mono leading-relaxed pt-1">
        Renting shared machinery prevents redundant heavy asset manufacturing and optimizes regional machinery lifecycle efficiency.
      </p>
    </div>
  );
};
