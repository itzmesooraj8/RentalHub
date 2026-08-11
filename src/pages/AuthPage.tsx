import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Database, Key, Terminal, Code, Wrench, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { User, UserRole } from '../types';
import { TrustScoreBadge } from '../components/TrustScoreBadge';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onLogin: (user: User) => void;
  currentUser: User | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, currentUser }) => {
  const navigate = useNavigate();
  const { login, register, loginRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPipeline, setShowPipeline] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('aarav@heavyrentals.in');
  const [password, setPassword] = useState('password123');
  const [companyName, setCompanyName] = useState('Aarav Heavy Infra Pvt Ltd');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [licenseNumber, setLicenseNumber] = useState('MH-EXC-992014');
  const [pipelineOutput, setPipelineOutput] = useState<string | null>(null);
  const [isExecutingPipeline, setIsExecutingPipeline] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Demo User Profiles
  const demoAccounts: User[] = [
    {
      id: 'usr_cust_1',
      name: 'Ananya Iyer',
      email: 'ananya.i@contracting.in',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
      role: 'customer',
      trustScore: 99,
      kycVerified: true,
      memberSince: 'March 2024',
    },
    {
      id: 'usr_owner_1',
      name: 'Aarav Sharma',
      email: 'aarav@heavyrentals.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      role: 'owner',
      trustScore: 98,
      kycVerified: true,
      memberSince: 'January 2023',
    },
    {
      id: 'usr_admin_1',
      name: 'Super Admin',
      email: 'admin@rentalhub.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      role: 'admin',
      trustScore: 100,
      kycVerified: true,
      memberSince: 'November 2022',
    },
  ];

  const mongoAuthPipelineCode = `db.users.aggregate([
  // 1. Match Active Account & Email Credentials
  {
    $match: {
      email: "${email}",
      status: "active"
    }
  },
  // 2. Lookup Historical Booking Ledger to Compute Trust & Safety Index
  {
    $lookup: {
      from: "bookings",
      localField: "_id",
      foreignField: "renterId",
      as: "bookingHistory"
    }
  },
  // 3. Compute Dynamic Trust Score Math Pipeline
  {
    $project: {
      _id: 1,
      name: 1,
      email: 1,
      role: 1,
      kycVerified: 1,
      totalCompletedRentals: { $size: "$bookingHistory" },
      calculatedTrustScore: {
        $add: [
          { $multiply: [4.9, 12] }, // Review Weight
          30,                       // On-Time Record
          { $cond: ["$kycVerified", 10, 0] }
        ]
      }
    }
  }
])`;

  const handleSelectDemoUser = async (user: User) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      await loginRole(user.role);
      onLogin(user);
      if (user.role === 'customer') navigate('/dashboard/customer');
      else if (user.role === 'owner') navigate('/dashboard/owner');
      else navigate('/dashboard/admin');
    } catch (err: any) {
      setAuthError(err?.message || 'Demo sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    const actualPassword = password === '••••••••••••' ? 'password123' : password;

    try {
      let authenticatedUser: User;

      if (activeTab === 'login') {
        authenticatedUser = await login(email, actualPassword);
      } else {
        authenticatedUser = await register({
          name: companyName || email.split('@')[0],
          email,
          password: actualPassword,
          role: selectedRole,
          phone: '+91 98110 54321',
          location: 'Mumbai, MH',
        });
      }

      onLogin(authenticatedUser);
      if (authenticatedUser.role === 'customer') navigate('/dashboard/customer');
      else if (authenticatedUser.role === 'owner') navigate('/dashboard/owner');
      else navigate('/dashboard/admin');
    } catch (err: any) {
      setAuthError(err?.message || (activeTab === 'login' ? 'Authentication failed. Invalid email or password.' : 'Account registration failed. Email may already be registered.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestPipeline = () => {
    setIsExecutingPipeline(true);
    setTimeout(() => {
      setPipelineOutput(
        JSON.stringify(
          {
            status: 200,
            mongodbEngine: 'MongoDB 7.0 Enterprise Community Cluster',
            pipelineMatchedDocs: 1,
            userPayload: {
              _id: 'usr-mongodb-auth-8812',
              email: email,
              role: selectedRole,
              kycVerified: true,
              contractorLicense: licenseNumber,
              calculatedTrustScore: 96,
            },
          },
          null,
          2
        )
      );
      setIsExecutingPipeline(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-mono text-white">
      {/* Title & Header */}
      <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#1F1F1F] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#F27D26]">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif italic text-white tracking-tight">RentalHub Sign In</h1>
              <p className="text-xs text-[#888888] mt-0.5">
                Authenticate your account or select an instant demo persona to explore the marketplace.
              </p>
            </div>
          </div>

          <TrustScoreBadge
            score={currentUser?.trustScore || 96}
            kycVerified={currentUser?.kycVerified ?? true}
            rating={4.9}
            completedRentals={14}
            onTimeRentals={14}
            userName={currentUser?.name}
            size="md"
          />
        </div>

        {/* Quick Demo Sign In Cards */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#888888] uppercase tracking-wider block">
            Instant Demo Persona Sign-In
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleSelectDemoUser(account)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                  currentUser?.id === account.id
                    ? 'bg-[#1A1A1A] border-[#F27D26] shadow-[0_0_15px_rgba(242,125,38,0.2)]'
                    : 'bg-[#141414] border-[#222222] hover:border-[#333333] hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-xl object-cover border border-[#333333]" />
                  <div>
                    <div className="font-bold text-white text-xs line-clamp-1">{account.name}</div>
                    <span className="text-[10px] text-[#F27D26] uppercase font-bold">{account.role}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#888888] pt-2 border-t border-[#222222]">
                  <span>Trust Score: <strong className="text-white">{account.trustScore}%</strong></span>
                  <span className="text-[#F27D26] font-bold">Sign In →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border border-[#1F1F1F] shadow-xl space-y-6">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-[#1A1A1A] p-1.5 rounded-2xl border border-[#222222]">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'login' ? 'bg-[#F27D26] text-black shadow-md' : 'text-[#888888] hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'register' ? 'bg-[#F27D26] text-black shadow-md' : 'text-[#888888] hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {authError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div>
            <label className="font-bold text-[#888888] block mb-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#888888] block mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
              required
            />
          </div>

          {activeTab === 'register' && (
            <>
              <div>
                <label className="font-bold text-[#888888] block mb-1 uppercase tracking-wider">Full / Business Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#888888] block mb-1 uppercase tracking-wider">Account Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  >
                    <option value="customer">Renter Customer</option>
                    <option value="owner">Fleet Owner</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#888888] block mb-1 uppercase tracking-wider">Verification ID #</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with MongoDB Atlas...</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>{activeTab === 'login' ? 'Authenticate Account' : 'Create KYC Verified Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Collapsible Developer Pipeline Inspection */}
        <div className="pt-4 border-t border-[#1F1F1F]">
          <button
            type="button"
            onClick={() => setShowPipeline(!showPipeline)}
            className="flex items-center gap-2 text-[#888888] hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Code className="w-4 h-4 text-[#F27D26]" />
            <span>{showPipeline ? 'Hide' : 'Inspect'} Technical MongoDB Aggregation Pipeline</span>
          </button>

          {showPipeline && (
            <div className="mt-4 p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">db.users.aggregate()</span>
                <span className="text-[10px] text-[#666666]">MongoDB 7.0 Enterprise</span>
              </div>
              <pre className="p-3 rounded-xl bg-[#050505] border border-[#222222] text-[10px] text-emerald-400 overflow-x-auto max-h-48 font-mono">
                <code>{mongoAuthPipelineCode}</code>
              </pre>
              <button
                onClick={handleTestPipeline}
                disabled={isExecutingPipeline}
                className="w-full py-2 px-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#F27D26] border border-[#333333] font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isExecutingPipeline ? (
                  <span>Executing Pipeline...</span>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Run Query Simulation</span>
                  </>
                )}
              </button>
              {pipelineOutput && (
                <pre className="p-3 rounded-xl bg-[#050505] border border-[#222222] text-[10px] text-emerald-300 overflow-x-auto max-h-32 font-mono">
                  <code>{pipelineOutput}</code>
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
