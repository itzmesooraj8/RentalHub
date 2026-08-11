import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}) => {
  return (
    <div className="bg-[#111111] rounded-3xl p-12 text-center border border-[#1F1F1F] max-w-md mx-auto space-y-4 font-sans">
      <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center text-[#F27D26] mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif italic text-white text-xl font-normal">{title}</h3>
      <p className="text-xs text-[#888888] leading-relaxed">{description}</p>

      {actionLabel && actionPath && (
        <Link
          to={actionPath}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F27D26] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d96a1a] transition"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && !actionPath && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F27D26] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d96a1a] transition cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
