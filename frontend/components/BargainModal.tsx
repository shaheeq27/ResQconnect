"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, CheckCircle2, XCircle, ArrowRightLeft, ShieldAlert } from "lucide-react";

interface BargainModalProps {
  requestId: number;
  providerId: number;
  isOpen: boolean;
  onClose: () => void;
  onAgreed?: (finalPrice: number) => void;
}

interface OfferHistory {
  id: number;
  sender_role: string;
  offered_price: string;
  status: string;
  round_number: number;
  created_at: string;
  provider_name?: string;
  seeker_name?: string;
}

export default function BargainModal({
  requestId,
  providerId,
  isOpen,
  onClose,
  onAgreed,
}: BargainModalProps) {
  const [history, setHistory] = useState<OfferHistory[]>([]);
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bargain/history/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Failed to load bargain history:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, requestId]);

  if (!isOpen) return null;

  const handleSendOffer = async () => {
    if (!offerPrice || parseFloat(offerPrice) <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bargain/offer`,
        {
          request_id: requestId,
          provider_id: providerId,
          offered_price: parseFloat(offerPrice),
          round_number: history.length + 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOfferPrice("");
      await fetchHistory();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to submit price offer.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (offerId: number, price: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bargain/accept/${offerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onAgreed) onAgreed(parseFloat(price));
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to accept offer.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (offerId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bargain/reject/${offerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to reject offer.");
    } finally {
      setLoading(false);
    }
  };

  const latestOffer = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Money Price Bargain</h3>
              <p className="text-slate-400 text-xs mt-0.5">Negotiate non-emergency help service fee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Offer Timeline History */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 py-6 text-sm">
              No price offers submitted yet. Enter a proposed amount below to initiate bargaining.
            </div>
          ) : (
            history.map((offer) => (
              <div
                key={offer.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  offer.sender_role === "seeker"
                    ? "bg-slate-800/60 border-slate-700 text-slate-200"
                    : "bg-indigo-950/40 border-indigo-800/50 text-indigo-200"
                }`}
              >
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    Round #{offer.round_number} • Proposed by <span className="capitalize text-white font-semibold">{offer.sender_role}</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    ${parseFloat(offer.offered_price).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border capitalize ${
                      offer.status === "accepted"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : offer.status === "rejected"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {offer.status}
                  </span>

                  {offer.status === "pending" && (
                    <div className="flex gap-1.5 ml-2">
                      <button
                        onClick={() => handleAccept(offer.id, offer.offered_price)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => handleReject(offer.id)}
                        className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {errorMsg && (
          <div className="px-5 py-2 bg-rose-500/10 text-rose-400 text-xs border-t border-rose-500/20 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Input New Offer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800">
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Counter / Propose Price Offer ($)
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-slate-400 font-mono">$</span>
              <input
                type="number"
                min="1"
                step="0.5"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="e.g. 25.00"
                className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 text-white pl-7 pr-3 py-2 rounded-xl text-sm outline-none"
              />
            </div>
            <button
              onClick={handleSendOffer}
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-4 h-4" /> Send Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
