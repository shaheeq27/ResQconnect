"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import Chat from "./chat";

type Request = {
  id: number;
  title: string;
  description?: string | null;
  request_type: string;
  emergency_type?: string | null;
  address?: string | null;
  status: string;
  requester_name?: string;
  requester_phone?: string;
  requester_email?: string;
  created_at: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

const statusLabels: Record<string, string> = {
  pending_verification: "Pending verification",
  approved: "Approved",
  assigned: "Assigned",
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
  rejected: "Rejected",
};

function useProviderRequests(available = false) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = available ? "/provider/requests/available" : "/provider/requests/mine";
      const data = await apiRequest(endpoint, {}, localStorage.getItem("token"));
      setRequests(data.requests || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load requests.");
    } finally {
      setLoading(false);
    }
  };

  // The request is loaded after mount so the page can render its loading state first.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [available]);
  return { requests, error, loading, reload: load };
}

function useLiveProviderLocation(active: boolean) {
  useEffect(() => {
    if (!active || !navigator.geolocation) return undefined;
    const sendLocation = (position: GeolocationPosition) => {
      void apiRequest("/profile/location", {
        method: "PATCH",
        body: JSON.stringify({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      }, localStorage.getItem("token"));
    };
    const watchId = navigator.geolocation.watchPosition(sendLocation, () => undefined, { enableHighAccuracy: true, maximumAge: 15000 });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [active]);
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800 sm:px-10"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-blue-600">HelpBridge Provider</p><h1 className="mt-1 text-3xl font-bold text-slate-900">{title}</h1></div><nav className="flex flex-wrap gap-2 text-sm"><Link className="rounded-lg border bg-white px-3 py-2" href="/provider/dashboard">Dashboard</Link><Link className="rounded-lg border bg-white px-3 py-2" href="/provider/available-requests">Available</Link><Link className="rounded-lg border bg-white px-3 py-2" href="/provider/active-help">My help</Link></nav></div>{children}</div></main>;
}

function RequestCard({ request, action }: { request: Request; action?: React.ReactNode }) {
  const mapUrl = request.latitude != null && request.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}` : null;
  return <article className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-900">{request.title}</h2><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{statusLabels[request.status] || request.status}</span></div><p className="mt-2 text-sm text-slate-600">{request.description || "Help requested"}</p><p className="mt-2 text-xs text-slate-500">{request.requester_name || "Requester"} · {request.address || "Location unavailable"}</p>{mapUrl && <a className="mt-2 inline-block text-xs font-semibold text-teal-700" href={mapUrl} target="_blank" rel="noreferrer">Open location in Google Maps</a>}</div>{action}</article>;
}

export function ProviderDashboardWorkflow() {
  const { requests, error, loading } = useProviderRequests();
  const active = requests.filter((request) => ["assigned", "accepted", "in_progress"].includes(request.status));
  const completed = requests.filter((request) => request.status === "completed");
  return <Shell title="Provider dashboard"><div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric label="Available requests" value="Browse" href="/provider/available-requests" /><Metric label="Active help" value={String(active.length)} href="/provider/active-help" /><Metric label="Completed help" value={String(completed.length)} href="/provider/completed-help" /></div><section className="mt-8 rounded-xl border bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-bold">Assigned requests</h2><Link className="text-sm font-semibold text-blue-600" href="/provider/active-help">View all</Link></div><div className="mt-4 space-y-3">{loading && <p className="text-sm text-slate-500">Loading requests...</p>}{error && <p className="text-sm text-red-600">{error}</p>}{!loading && !error && active.length === 0 && <p className="text-sm text-slate-500">No assigned requests yet.</p>}{active.map((request) => <RequestCard key={request.id} request={request} action={<Link className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href={`/provider/requests/${request.id}`}>Open</Link>} />)}</div></section></Shell>;
}

export function ProviderAvailableWorkflow() {
  const { requests, error, loading, reload } = useProviderRequests(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const accept = async (id: number) => {
    setBusyId(id);
    setActionError("");
    try { await apiRequest(`/provider/requests/${id}/accept`, { method: "PUT" }, localStorage.getItem("token")); await reload(); }
    catch (requestError) { setActionError(requestError instanceof Error ? requestError.message : "Unable to accept request."); }
    finally { setBusyId(null); }
  };
  return <Shell title="Available requests"><div className="mt-8 flex items-center justify-between gap-3"><p className="text-sm text-slate-500">Approved requests not assigned to another provider.</p><button type="button" onClick={() => void reload()} disabled={loading} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Refresh</button></div><div className="mt-3 space-y-3">{(error || actionError) && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error || actionError}</p>}{loading && <p className="text-sm text-slate-500">Loading available requests...</p>}{!loading && requests.length === 0 && <p className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">No approved requests are available.</p>}{requests.map((request) => <RequestCard key={request.id} request={request} action={<button disabled={busyId === request.id} onClick={() => accept(request.id)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busyId === request.id ? "Accepting..." : "Accept"}</button>} />)}</div></Shell>;
}

export function ProviderActiveWorkflow({ completedOnly = false }: { completedOnly?: boolean }) {
  const { requests, error, loading } = useProviderRequests();
  const filtered = requests.filter((request) => completedOnly ? request.status === "completed" : ["assigned", "accepted", "in_progress"].includes(request.status));
  useLiveProviderLocation(!completedOnly && filtered.some((request) => ["accepted", "in_progress"].includes(request.status)));
  return <Shell title={completedOnly ? "Completed help" : "My active help"}><div className="mt-8 space-y-3">{error && <p className="text-sm text-red-600">{error}</p>}{loading && <p className="text-sm text-slate-500">Loading requests...</p>}{!loading && filtered.length === 0 && <p className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">No requests in this section.</p>}{filtered.map((request) => <RequestCard key={request.id} request={request} action={<Link className="rounded-lg border px-4 py-2 text-sm font-semibold text-blue-700" href={`/provider/requests/${request.id}`}>Open</Link>} />)}</div></Shell>;
}

export function ProviderRequestWorkflow({ requestId }: { requestId: string }) {
  const { requests, error, loading, reload } = useProviderRequests();
  const request = requests.find((item) => String(item.id) === requestId);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  useLiveProviderLocation(Boolean(request && ["accepted", "in_progress"].includes(request.status)));
  const update = async (operation: "start" | "complete") => {
    setBusy(true); setActionError("");
    try { await apiRequest(`/provider/requests/${requestId}/${operation}`, { method: "PUT" }, localStorage.getItem("token")); await reload(); }
    catch (requestError) { setActionError(requestError instanceof Error ? requestError.message : "Unable to update request."); }
    finally { setBusy(false); }
  };
  if (loading) return <Shell title="Request details"><p className="mt-8 text-sm text-slate-500">Loading request...</p></Shell>;
  if (error || !request) return <Shell title="Request details"><p className="mt-8 text-sm text-red-600">{error || "Request not found or not assigned to you."}</p></Shell>;
  const accept = async () => {
    setBusy(true); setActionError("");
    try { await apiRequest(`/provider/requests/${requestId}/accept`, { method: "PUT" }, localStorage.getItem("token")); await reload(); }
    catch (requestError) { setActionError(requestError instanceof Error ? requestError.message : "Unable to accept request."); }
    finally { setBusy(false); }
  };
  return <Shell title={request.title}><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><section className="rounded-xl border bg-white p-6"><p className="text-sm text-slate-500">Request #{request.id}</p><p className="mt-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 w-fit">{statusLabels[request.status] || request.status}</p><p className="mt-5 text-slate-700">{request.description || "No description provided."}</p><dl className="mt-6 space-y-3 text-sm"><div><dt className="font-semibold">Requester</dt><dd>{request.requester_name} · {request.requester_phone}</dd></div><div><dt className="font-semibold">Location</dt><dd>{request.address || "Location unavailable"}</dd></div></dl><div className="mt-7 flex flex-wrap gap-3">{request.status === "assigned" && <button disabled={busy} onClick={accept} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Accept request</button>}{request.status === "accepted" && <button disabled={busy} onClick={() => update("start")} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Start help</button>}{request.status === "in_progress" && <button disabled={busy} onClick={() => update("complete")} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">Complete help</button>}{actionError && <p className="basis-full text-sm text-red-600">{actionError}</p>}</div></section>{["accepted", "in_progress"].includes(request.status) && <Chat requestId={request.id} token={localStorage.getItem("token")} userId={undefined} />}</div></Shell>;
}

function Metric({ label, value, href }: { label: string; value: string; href: string }) { return <Link href={href} className="rounded-xl border bg-white p-5 shadow-sm hover:border-blue-300"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></Link>; }
