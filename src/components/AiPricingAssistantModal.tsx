import React, { useState, useEffect } from 'react';
import { Equipment, DynamicPricingSuggestion } from '../types';
import { Sparkles, TrendingUp, DollarSign, CheckCircle2, RefreshCw, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface AiPricingAssistantModalProps {
  equipment: Equipment;
  isOpen: boolean;
  onClose: () => void;
  onApplyNewPrice: (newRate: number) => void;
}

export const AiPricingAssistantModal: React.FC<AiPricingAssistantModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onApplyNewPrice
}) => {
  const [suggestion, setSuggestion] = useState<DynamicPricingSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPricingSuggestion = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/dynamic-pricing', { equipmentId: equipment.id });
      setSuggestion(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPricingSuggestion();
    }
  }, [isOpen, equipment.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg">AI Dynamic Pricing Optimizer</h3>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                Gemini AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">Marketplace Demand & Aggregation Pipeline Analysis</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-600">
              Analyzing regional demand pipeline for {equipment.title}...
            </p>
          </div>
        ) : suggestion ? (
          <div className="space-y-5">
            {/* Price Comparison Card */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Rate</span>
                <div className="text-xl font-bold text-slate-800">₹{suggestion.currentRate}/day</div>
              </div>

              <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 relative overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> AI Suggested
                </span>
                <div className="text-2xl font-black text-emerald-600">₹{suggestion.suggestedRate}/day</div>
                <div className="text-[10px] font-bold text-emerald-800 mt-0.5">
                  +{suggestion.projectedRevenueIncreasePct}% projected revenue
                </div>
              </div>
            </div>

            {/* Demand Metrics Badge */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-100 text-xs">
              <span className="text-slate-600 font-medium">Market Demand Status:</span>
              <span className="font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px]">
                {suggestion.demandLevel} Demand
              </span>
            </div>

            {/* AI Insights Bullets */}
            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                AI Demand Insights & Justification
              </h5>
              <ul className="space-y-2 text-xs text-slate-600">
                {suggestion.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={fetchPricingSuggestion}
                className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                title="Refresh Analysis"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onApplyNewPrice(suggestion.suggestedRate);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                Apply Suggested Rate (₹{suggestion.suggestedRate}/day)
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
