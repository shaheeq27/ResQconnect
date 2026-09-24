"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  UserCheck,
} from "lucide-react";
import { apiRequest } from "../../../../lib/api";
import socket from "../../../../lib/socket";

type TrackingData = {
  request_id: number;
  title: string;
  status: string;
  request_latitude: number;
  request_longitude: number;
  request_address?: string;
  requester_id: number;
  requester_name: string;
  requester_phone?: string;
  requester_live_lat?: number;
  requester_live_lon?: number;
  provider_id?: number;
  provider_name?: string;
  provider_phone?: string;
  provider_live_lat?: number | null;
  provider_live_lon?: number | null;
  provider_last_located_at?: string;
  distance_km?: number | null;
};

type LocationUpdate = {
  requestId: number;
  providerId: number;
  latitude: number;
  longitude: number;
  timestamp: string;
};

const STEPS = [
  { key: "pending_verification", label: "Verifying request",  icon: <AlertTriangle size={16} /> },
  { key: "approved",             label: "Finding provider",   icon: <Navigation size={16} /> },
  { key: "assigned",             label: "Provider assigned",  icon: <UserCheck size={16} /> },
  { key: "accepted",             label: "Provider en route",  icon: <Navigation size={16} /> },
  { key: "in_progress",          label: "Help in progress",   icon: <ShieldCheck size={16} /> },
  { key: "completed",            label: "Completed",          icon: <CheckCircle size={16} /> },
];

function getStepIndex(status: string) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

function eta(distanceKm: number) {
  const minutes = Math.ceil((distanceKm / 30) * 60); // assume 30 km/h
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default function SeekerTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = Number(id);

  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [liveProviderLat, setLiveProviderLat] = useState<number | null>(null);
  const [liveProviderLon, setLiveProviderLon] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTracking = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest(`/location/track/${requestId}`, {}, token);
      setTracking(data.tracking);
      // Seed live coords from REST response if not yet received via socket
      setLiveProviderLat((prev) => prev ?? data.tracking.provider_live_lat ?? null);
      setLiveProviderLon((prev) => prev ?? data.tracking.provider_live_lon ?? null);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load tracking data");
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    void fetchTracking();

    // Poll every 8 seconds as fallback
    intervalRef.current = setInterval(() => void fetchTracking(), 8000);

    // Socket — get real-time location pushes
    socket.auth = { token };
    socket.connect();
    socket.emit("join_request", requestId);

    const onTrackingUpdate = (data: LocationUpdate) => {
      if (data.requestId !== requestId) return;
      setLiveProviderLat(data.latitude);
      setLiveProviderLon(data.longitude);
      setLastUpdated(new Date(data.timestamp));
    };
    socket.on("tracking_update", onTrackingUpdate);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      socket.emit("leave_request", requestId);
      socket.off("tracking_update", onTrackingUpdate);
      socket.disconnect();
    };
  }, [requestId, router, fetchTracking]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-900 text-white">
        <Loader2 className="animate-spin text-blue-400" size={36} />
        <p className="text-sm text-slate-400">Initialising live tracker...</p>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-center">
        <AlertTriangle size={40} className="text-red-500" />
        <p className="text-red-600">{error || "Tracking data not available"}</p>
        <Link href="/dashboard/seeker" className="text-blue-600 underline">← Back to dashboard</Link>
      </div>
    );
  }

  const seekerLat = tracking.requester_live_lat ?? tracking.request_latitude;
  const seekerLon = tracking.requester_live_lon ?? tracking.request_longitude;
  const provLat  = liveProviderLat ?? tracking.provider_live_lat;
  const provLon  = liveProviderLon ?? tracking.provider_live_lon;

  // Recalculate live distance if we have both points
  let liveDistance: number | null = tracking.distance_km ?? null;
  if (seekerLat && seekerLon && provLat && provLon) {
    const R = 6371;
    const dLat = ((provLat - seekerLat) * Math.PI) / 180;
    const dLon = ((provLon - seekerLon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((seekerLat * Math.PI) / 180) *
        Math.cos((provLat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    liveDistance = Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100;
  }

  const stepIdx = getStepIndex(tracking.status);
  const isActive = ["assigned", "accepted", "in_progress"].includes(tracking.status);
  const isCompleted = tracking.status === "completed";

  // Map center: midpoint between seeker and provider (or just seeker)
  const mapLat = provLat ? (seekerLat + provLat) / 2 : seekerLat;
  const mapLon = provLon ? (seekerLon + provLon) / 2 : seekerLon;
  const zoomDelta = liveDistance && liveDistance > 5 ? 0.1 : 0.03;

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
      {/* Header */}
      <header className="z-10 flex items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3">
        <Link
          href="/dashboard/seeker"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-white">{tracking.title}</p>
          <p className="text-xs text-slate-400">Request #{tracking.request_id}</p>
        </div>
        <div className="flex items-center gap-2">
          {tracking.provider_phone && (
            <a
              href={`tel:${tracking.provider_phone}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              aria-label="Call provider"
            >
              <Phone size={17} />
            </a>
          )}
          <Link
            href={`/requests/${requestId}/chat`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            aria-label="Open chat"
          >
            <MessageCircle size={17} />
          </Link>
        </div>
      </header>

      {/* Live map */}
      <div className="relative" style={{ height: "45vh", minHeight: 260 }}>
        {/* Radar grid background */}
        <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px]" />

        <iframe
          key={`${mapLat}-${mapLon}`}
          title="Live Tracking Map"
          width="100%"
          height="100%"
          className="relative z-10 opacity-90 contrast-110"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLon - zoomDelta}%2C${mapLat - zoomDelta}%2C${mapLon + zoomDelta}%2C${mapLat + zoomDelta}&layer=mapnik&marker=${seekerLat}%2C${seekerLon}`}
        />

        {/* Overlay badges */}
        <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 backdrop-blur-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <MapPin size={14} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Your location</p>
            <p className="text-xs font-semibold text-white">{tracking.requester_name}</p>
          </div>
        </div>

        {tracking.provider_name && (
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 backdrop-blur-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <UserCheck size={14} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Provider</p>
              <p className="text-xs font-semibold text-white flex items-center gap-1">
                {tracking.provider_name}
                <ShieldCheck size={11} className="text-emerald-400" />
              </p>
            </div>
          </div>
        )}

        {/* Live / last-updated badge */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[10px] font-semibold text-slate-300">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={() => void fetchTracking()}
            className="ml-1 text-slate-400 hover:text-white"
            aria-label="Refresh"
          >
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="flex-1 overflow-y-auto rounded-t-3xl bg-slate-950 px-5 py-6 shadow-2xl">

        {/* Distance + ETA chips */}
        {isActive && liveDistance !== null && (
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
              <p className="text-xs text-slate-400">Live Distance</p>
              <p className="mt-1 text-2xl font-bold font-mono text-emerald-400">{liveDistance} km</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                <Clock size={11} /> Est. Arrival
              </div>
              <p className="mt-1 text-2xl font-bold font-mono text-indigo-300">{eta(liveDistance)}</p>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-800/40 bg-emerald-900/20 p-4">
            <CheckCircle size={24} className="shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-300">Help completed!</p>
              <p className="text-xs text-slate-400 mt-0.5">Your request has been fulfilled.</p>
            </div>
          </div>
        )}

        {/* Progress stepper */}
        <div className="mb-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Request Progress</h2>
          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const done    = i < stepIdx;
              const current = i === stepIdx;
              const future  = i > stepIdx;
              return (
                <div key={step.key} className="flex items-start gap-3">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                      done    ? "border-emerald-500 bg-emerald-500 text-white" :
                      current ? "border-blue-500 bg-blue-500 text-white animate-pulse" :
                                "border-slate-700 bg-slate-800 text-slate-500"
                    }`}>
                      {done ? <CheckCircle size={14} /> : step.icon}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`my-1 w-0.5 flex-1 ${done ? "bg-emerald-500" : "bg-slate-800"}`} style={{ height: 20 }} />
                    )}
                  </div>
                  {/* Label */}
                  <div className={`pb-4 pt-1 text-sm ${
                    current ? "font-bold text-blue-300" :
                    done    ? "text-emerald-300" :
                    future  ? "text-slate-500" : ""
                  }`}>
                    {step.label}
                    {current && (
                      <span className="ml-2 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">NOW</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Provider info card */}
        {tracking.provider_name ? (
          <div className="mb-4 flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-lg font-bold text-blue-300">
              {tracking.provider_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">{tracking.provider_name}</p>
              <p className="text-xs text-slate-400">Assigned Provider · HelpBridge Verified</p>
              {tracking.provider_phone && (
                <p className="mt-0.5 text-xs text-emerald-400">{tracking.provider_phone}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {tracking.provider_phone && (
                <a
                  href={`tel:${tracking.provider_phone}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  aria-label="Call"
                >
                  <Phone size={16} />
                </a>
              )}
              <Link
                href={`/requests/${requestId}/chat`}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                aria-label="Chat"
              >
                <MessageCircle size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <Loader2 className="shrink-0 animate-spin text-blue-400" size={20} />
            <div>
              <p className="font-semibold text-slate-300">Searching for nearest provider...</p>
              <p className="text-xs text-slate-500">
                HelpBridge GIS is calculating the closest available helper using Haversine distance.
              </p>
            </div>
          </div>
        )}

        {/* Location info */}
        <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-rose-400" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Location</p>
              <p className="mt-1 text-sm text-white">
                {tracking.request_address ?? `${seekerLat?.toFixed(5)}, ${seekerLon?.toFixed(5)}`}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${seekerLat},${seekerLon}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300"
              >
                <Navigation size={11} /> Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href={`/requests/${requestId}/chat`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            <MessageCircle size={17} /> Chat with Provider
          </Link>
          <Link
            href="/dashboard/seeker"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft size={17} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
