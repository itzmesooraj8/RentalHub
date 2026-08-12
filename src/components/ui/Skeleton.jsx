export const Skeleton = ({ className = "" }) => {
  return <div
    className={`animate-pulse bg-[#1C1C1C] rounded-xl border border-[#262626] ${className}`}
  />;
};
