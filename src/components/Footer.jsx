import { Link } from "react-router-dom";
import { Wrench, ShieldCheck, Leaf, Lock, CheckCircle2 } from "lucide-react";
import { ROUTES } from "../lib/routes";
export const Footer = () => {
  return <footer className="bg-[#050505] text-[#666666] text-xs border-t border-[#1F1F1F] pt-12 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {
    /* Col 1 */
  }
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#F27D26]">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-serif italic text-[#F27D26] tracking-tight">
                RentalHub
              </span>
            </Link>
            <p className="text-[#888888] text-xs leading-relaxed">
              Universal peer-to-peer equipment rental marketplace connecting contractors, cinema creators, event managers, and equipment owners.
            </p>
            <div className="flex items-center gap-2 text-[#F27D26] font-medium text-xs">
              <Leaf className="w-4 h-4 text-[#F27D26]" />
              <span>ESG Commitment: Environmental Offset Estimation</span>
            </div>
          </div>

          {
    /* Col 2 */
  }
          <div>
            <h5 className="text-[#999999] font-bold mb-3 text-[11px] tracking-wider uppercase font-mono">Marketplace</h5>
            <ul className="space-y-2 text-[#888888]">
              <li><Link to={ROUTES.browseCategory("Heavy Machinery")} className="hover:text-[#F27D26] transition">Heavy Machinery</Link></li>
              <li><Link to={ROUTES.browseCategory("Power Tools")} className="hover:text-[#F27D26] transition">Power Tools & Drills</Link></li>
              <li><Link to={ROUTES.browseCategory("Event & Audio")} className="hover:text-[#F27D26] transition">Audio & Sound Systems</Link></li>
              <li><Link to={ROUTES.browseCategory("Photography & Drones")} className="hover:text-[#F27D26] transition">Cinema Cameras & Drones</Link></li>
              <li><Link to={ROUTES.browseCategory("Agriculture & Farming")} className="hover:text-[#F27D26] transition">Agriculture & Farming</Link></li>
            </ul>
          </div>

          {
    /* Col 3 */
  }
          <div>
            <h5 className="text-[#999999] font-bold mb-3 text-[11px] tracking-wider uppercase font-mono">For Owners</h5>
            <ul className="space-y-2 text-[#888888]">
              <li><Link to={ROUTES.ownerEquipment} className="hover:text-[#F27D26] transition">Fleet Equipment Management</Link></li>
              <li><Link to={ROUTES.ownerAnalytics} className="hover:text-[#F27D26] transition">AI-Assisted Pricing Recommendation Preview</Link></li>
              <li><Link to={ROUTES.profile} className="hover:text-[#F27D26] transition">Identity Verification</Link></li>
              <li><Link to={ROUTES.favorites} className="hover:text-[#F27D26] transition">Saved Equipment Assets</Link></li>
            </ul>
          </div>

          {
    /* Col 4 */
  }
          <div>
            <h5 className="text-[#999999] font-bold mb-3 text-[11px] tracking-wider uppercase font-mono">Trust & Governance</h5>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-[#888888]">
                <ShieldCheck className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <span>Verified Equipment Owners</span>
              </div>
              <div className="flex items-start gap-2 text-[#888888]">
                <Lock className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <span>Security Deposit Hold Workflow</span>
              </div>
              <div className="flex items-start gap-2 text-[#888888]">
                <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <span>KYC Identity & Trust Score Reputation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#666666]">
          <div>© 2026 RentalHub Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link to={ROUTES.browse} className="hover:text-[#999999]">Browse Gear</Link>
            <Link to={ROUTES.profile} className="hover:text-[#999999]">My Account</Link>
            <Link to={ROUTES.dashboard} className="hover:text-[#999999]">Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>;
};
