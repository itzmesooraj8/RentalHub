import { useState, useEffect } from "react";
import axios from "axios";
import { ShieldCheck, Lock, Unlock, AlertTriangle, FileText, CheckCircle, RefreshCw } from "lucide-react";
export const EscrowLedgerCard = ({
  bookingId,
  currentUser,
  onLedgerUpdate
}) => {
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchLedger = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "jwt_mock_token_usr_cust_1";
      const res = await axios.get(`/api/payments/escrow-ledger/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setLedger(res.data.data);
      }
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to load escrow ledger.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLedger();
  }, [bookingId]);
  const handleReleaseEscrow = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || "jwt_mock_token_usr_cust_1";
      const res = await axios.post(
        "/api/payments/escrow-release",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setLedger(res.data.data);
        if (onLedgerUpdate) onLedgerUpdate(res.data.data);
      }
    } catch (err) {
      alert(err?.response?.data?.error?.message || "Failed to release escrow funds.");
    } finally {
      setActionLoading(false);
    }
  };
  const handleDisputeEscrow = async () => {
    const reason = prompt("Enter reason for escrow dispute hold:");
    if (!reason) return;
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || "jwt_mock_token_usr_cust_1";
      const res = await axios.post(
        "/api/payments/escrow-dispute",
        { bookingId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setLedger(res.data.data);
        if (onLedgerUpdate) onLedgerUpdate(res.data.data);
      }
    } catch (err) {
      alert(err?.response?.data?.error?.message || "Failed to flag escrow dispute.");
    } finally {
      setActionLoading(false);
    }
  };
  if (loading) {
    return <div className="bg-[#121212] p-6 rounded-2xl border border-[#262626] animate-pulse flex items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
        <span>Loading Webhook-Based Escrow Simulation Ledger...</span>
      </div>;
  }
  if (error || !ledger) {
    return null;
  }
  const getStatusBadge = (status) => {
    switch (status) {
      case "HELD":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-3.5 h-3.5" /> ESCROW HELD & SECURED
          </span>;
      case "RELEASED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Unlock className="w-3.5 h-3.5" /> PAYOUT RELEASED
          </span>;
      case "DISPUTED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> HELD IN DISPUTE
          </span>;
      default:
        return null;
    }
  };
  return <div className="bg-[#121212] rounded-3xl border border-[#262626] p-6 shadow-xl space-y-5 text-white font-mono">
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Webhook Escrow Ledger Simulation
            </h3>
            <p className="text-xs text-slate-400">MongoDB Transactional Escrow Vault • Stripe Event Ledger</p>
          </div>
        </div>
        <div>{getStatusBadge(ledger.status)}</div>
      </div>

      {
    /* Financial Breakdown */
  }
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#181818] p-4 rounded-2xl border border-[#262626]">
        <div>
          <span className="text-xs text-slate-400 block mb-1">Escrow Rental Fees</span>
          <span className="text-lg font-extrabold text-emerald-400">₹{ledger.amount.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Held Security Deposit</span>
          <span className="text-lg font-extrabold text-amber-400">₹{ledger.securityDeposit.toLocaleString()}</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 block mb-1">Total Vault Balance</span>
          <span className="text-lg font-extrabold text-cyan-400">₹{(ledger.amount + ledger.securityDeposit).toLocaleString()}</span>
        </div>
      </div>

      {
    /* Audit History Timeline */
  }
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-400" /> Transactional Ledger Audit History
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {ledger.ledgerHistory.map((item, idx) => <div key={idx} className="bg-[#181818] p-3 rounded-xl border border-[#262626] text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> {item.action}
                </span>
                <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-slate-400">{item.notes}</p>
              <div className="text-[10px] text-slate-500 italic">Actor: {item.actor}</div>
            </div>)}
        </div>
      </div>

      {
    /* Action Controls */
  }
      <div className="pt-2 flex flex-wrap gap-3">
        {ledger.status === "HELD" && <>
            <button
    onClick={handleReleaseEscrow}
    disabled={actionLoading}
    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
  >
              {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
              Simulate Post-Inspection Escrow Release
            </button>
            <button
    onClick={handleDisputeEscrow}
    disabled={actionLoading}
    className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
  >
              <AlertTriangle className="w-4 h-4" />
              Flag Dispute Hold
            </button>
          </>}
      </div>
    </div>;
};
