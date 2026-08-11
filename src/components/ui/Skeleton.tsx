import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#1C1C1C] rounded-xl border border-[#262626] ${className}`}
    />
  );
};
