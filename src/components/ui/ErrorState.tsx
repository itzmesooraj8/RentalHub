import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'We encountered an error while retrieving data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="bg-[#111111] rounded-3xl p-8 text-center border border-rose-500/20 max-w-md mx-auto space-y-4 font-sans text-white">
      <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
      <h3 className="font-serif italic text-white text-lg">{title}</h3>
      <p className="text-xs text-[#888888] leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#333333] text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#F27D26]" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
