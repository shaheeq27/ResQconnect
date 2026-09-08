"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import { Activity, AlertTriangle, CheckCircle, ClipboardCheck, Eye, LoaderCircle, MapPin, Search, Siren, X } from "lucide-react";

type Request = {
  id: number;
  title: string;
  emergency_type: string | null;
  description: string | null;
  address: string | null;
  requester_name: string;
  requester_phone: string;
  created_at: string;
};

export default function PendingVerificationPage() {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [currentTime] = useState(() => Date.now());

  const loadRequests = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError("");
    try {
      const data = await apiRequest("/manager/requests/pending", {}, localStorage.getItem("token"));
      setRequests(data.requests || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load pending requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadInitialRequests = async () => {
      try {
        const data = await apiRequest("/manager/requests/pending", {}, localStorage.getItem("token"));
        if (!cancelled) setRequests(data.requests || []);
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Unable to load pending requests.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void loadInitialRequests();
    return () => { cancelled = true; };
  }, []);

  const updateRequest = async (request: Request, action: "approve" | "reject") => {
    setBusyId(request.id);
    setError("");
    try {
      await apiRequest(`/manager/requests/${request.id}/${action}`, { method: "PUT" }, localStorage.getItem("token"));
      setRequests((current) => current.filter((item) => item.id !== request.id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update this request.");
    } finally {
      setBusyId(null);
    }
  };

  const filteredRequests = requests.filter((request) => [request.title, request.emergency_type, request.address, request.requester_name].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div><h1 className="text-3xl font-bold text-[#12234b]">Pending Verification</h1><p className="mt-2 text-slate-500">Review emergency requests before providers are assigned.</p></div>
        <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search requests..." className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 sm:w-[280px]" /></div>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Summary value={String(requests.length)} label="Waiting for verification" icon={<ClipboardCheck size={22} />} />
        <Summary value={String(requests.filter((request) => request.emergency_type).length)} label="Categorized requests" icon={<Siren size={22} />} />
        <Summary value={String(requests.filter((request) => currentTime - new Date(request.created_at).getTime() > 60 * 60 * 1000).length)} label="Waiting over one hour" icon={<AlertTriangle size={22} />} />
      </div>
      {error && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="mt-7 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4"><h2 className="font-bold text-[#12234b]">Requests awaiting review</h2><button onClick={() => loadRequests()} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Refresh</button></div>
        {isLoading ? <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={18} /> Loading requests...</div> : filteredRequests.length === 0 ? <p className="px-6 py-16 text-center text-sm text-slate-500">No pending emergency requests found.</p> : <div className="divide-y">{filteredRequests.map((request) => <div key={request.id} className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex min-w-0 items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Siren size={20} /></div><div className="min-w-0"><p className="font-bold text-slate-800">{request.title}</p><p className="mt-1 text-sm text-slate-500">{request.description || "Emergency assistance requested"}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span>{request.requester_name} · {request.requester_phone}</span><span className="inline-flex items-center gap-1"><MapPin size={13} />{request.address || "Location unavailable"}</span><span>{formatRelativeTime(request.created_at)}</span></div></div></div><div className="flex shrink-0 items-center gap-2"><Link href={`/manager/emergency-requests/${request.id}`} className="flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Eye size={15} /> View</Link><button disabled={busyId === request.id} onClick={() => updateRequest(request, "approve")} className="flex h-9 items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 text-xs font-bold text-green-700 hover:bg-green-100 disabled:opacity-50"><CheckCircle size={15} /> Approve</button><button disabled={busyId === request.id} onClick={() => updateRequest(request, "reject")} className="flex h-9 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"><X size={15} /> Reject</button></div></div>)}</div>}
      </div>
    </>
  );
}

function formatRelativeTime(createdAt: string) { const minutes = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)); if (minutes < 1) return "Just now"; if (minutes < 60) return `${minutes} min ago`; const hours = Math.floor(minutes / 60); return hours < 24 ? `${hours} hr ago` : `${Math.floor(hours / 24)} days ago`; }
function Summary({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) { return <div className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-3xl font-bold text-slate-800">{value}</p><p className="mt-1 text-sm font-semibold text-slate-600">{label}</p></div><div className="rounded-full bg-red-50 p-3 text-red-600">{icon}</div></div></div>; }