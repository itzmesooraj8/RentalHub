import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Compass,
  MapPin,
  LogIn,
  LogOut,
  User as UserIcon,
  Bookmark,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Calendar,
  BarChart3,
  Users,
  Layers,
  Scale,
  Bell,
  CheckSquare,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { ROUTES } from '../lib/routes';

interface NavbarProps {
  currentUser: User | null;
  onLogout?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  favoritesCount?: number;
  notificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onSwitchRole,
  favoritesCount = 0,
  notificationsCount = 0,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { label: 'Explore', path: ROUTES.browse, icon: Compass },
        { label: 'Map', path: ROUTES.browseMap, icon: MapPin },
      ];
    }

    if (currentUser.role === 'customer') {
      return [
        { label: 'Explore', path: ROUTES.browse, icon: Compass },
        { label: 'Map', path: ROUTES.browseMap, icon: MapPin },
        { label: 'Bookings', path: ROUTES.bookings, icon: CheckSquare },
        { label: 'Saved', path: ROUTES.favorites, icon: Bookmark, badge: favoritesCount },
        { label: 'Notifications', path: ROUTES.notifications, icon: Bell, badge: notificationsCount },
      ];
    } else if (currentUser.role === 'owner') {
      return [
        { label: 'Dashboard', path: ROUTES.ownerDashboard, icon: LayoutDashboard },
        { label: 'Equipment', path: ROUTES.ownerEquipment, icon: Wrench },
        { label: 'Bookings', path: ROUTES.ownerBookings, icon: Calendar },
        { label: 'Calendar', path: ROUTES.ownerCalendar, icon: Calendar },
        { label: 'Analytics', path: ROUTES.ownerAnalytics, icon: BarChart3 },
      ];
    } else {
      return [
        { label: 'Overview', path: ROUTES.adminDashboard, icon: LayoutDashboard },
        { label: 'Users', path: ROUTES.adminUsers, icon: Users },
        { label: 'Equipment', path: ROUTES.adminEquipment, icon: Wrench },
        { label: 'Categories', path: ROUTES.adminCategories, icon: Layers },
        { label: 'Bookings', path: ROUTES.adminBookings, icon: Calendar },
        { label: 'Disputes', path: ROUTES.adminDisputes, icon: Scale },
        { label: 'Analytics', path: ROUTES.adminAnalytics, icon: BarChart3 },
      ];
    }
  };

  const navLinks = getNavLinks();

  const isLinkActive = (path: string) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    setIsUserMenuOpen(false);
    navigate(ROUTES.auth);
  };

  return (
    <header className="sticky top-3 z-50 max-w-7xl mx-auto my-2 px-3 sm:px-4 py-2.5 rounded-2xl md:rounded-full bg-[#0D0D0D]/90 backdrop-blur-xl border border-[#222222] shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white transition-all duration-300">
      <div className="flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0 pl-1">
          <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#F27D26] group-hover:scale-105 transition-transform duration-200">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="font-serif italic text-lg text-white font-normal tracking-tight group-hover:text-[#F27D26] transition-colors">
            RentalHub
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#141414] p-1 rounded-full border border-[#222222]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
                  active
                    ? 'bg-[#F27D26] text-black shadow-[0_0_12px_rgba(242,125,38,0.3)]'
                    : 'text-[#888888] hover:text-white hover:bg-[#1C1C1C]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] rounded-full font-bold ${
                      active ? 'bg-black text-white' : 'bg-[#F27D26] text-black'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Menu / Auth Button */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-[#141414] hover:bg-[#1A1A1A] p-1.5 pl-2.5 rounded-full border border-[#222222] transition cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#333333]"
                />
                <span className="text-xs font-mono font-bold text-white max-w-[90px] truncate hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#F27D26] border border-[#333333]">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#111111] border border-[#222222] rounded-2xl shadow-2xl p-2 space-y-1 font-mono text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#222222]">
                    <div className="font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-[#888888] truncate">{currentUser.email}</div>
                  </div>

                  <Link
                    to={ROUTES.profile}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#F27D26]" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to={ROUTES.dashboard}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#F27D26]" />
                    <span>Workspace Dashboard</span>
                  </Link>

                  {/* Isolated Hackathon Demo Persona Switcher */}
                  {onSwitchRole && (
                    <div className="pt-2 border-t border-[#222222] space-y-1">
                      <div className="px-3 text-[9px] text-[#666666] uppercase font-bold tracking-wider">
                        Demo Account Switch:
                      </div>
                      <div className="grid grid-cols-3 gap-1 px-2">
                        {(['customer', 'owner', 'admin'] as UserRole[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              onSwitchRole(r);
                              setIsUserMenuOpen(false);
                            }}
                            className={`py-1 text-[9px] uppercase font-bold rounded-lg border transition cursor-pointer ${
                              currentUser.role === r
                                ? 'bg-[#F27D26] text-black border-[#F27D26]'
                                : 'bg-[#1A1A1A] text-[#888888] hover:text-white border-[#333333]'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition mt-1 pt-2 border-t border-[#222222] cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={ROUTES.auth}
              className="px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 bg-[#F27D26] hover:bg-[#d96a1a] text-black transition-all duration-200 cursor-pointer shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#888888] hover:text-white rounded-xl bg-[#141414] border border-[#222222] cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#222222] space-y-1.5 font-mono text-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl transition ${
                  active ? 'bg-[#F27D26] text-black font-bold' : 'bg-[#141414] text-[#888888]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px]">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
