"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Siren,
  ClipboardCheck,
  Activity,
  Users,
  Bell,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Plus,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  PauseCircle,
  Star,
  ShieldCheck,
} from "lucide-react";

type Provider = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  area: string;
  status: "Verified" | "Pending" | "Inactive";
  rating: string;
  joined: string;
  avatar: string;
};

const providers: Provider[] = [
  {
    id: "#PRV-2026-0128",
    name: "Arjun Kumar",
    phone: "+91 93456 11223",
    email: "arjun.kumar@email.com",
    service: "Ambulance",
    location: "Hyderabad, TS",
    area: "Madhapur",
    status: "Verified",
    rating: "4.8",
    joined: "May 10, 2026",
    avatar: "AK",
  },
  {
    id: "#PRV-2026-0127",
    name: "Venkatesh P.",
    phone: "+91 91234 44556",
    email: "venkatesh@email.com",
    service: "Fire Service",
    location: "Hyderabad, TS",
    area: "Ameerpet",
    status: "Verified",
    rating: "4.7",
    joined: "May 08, 2026",
    avatar: "VP",
  },
  {
    id: "#PRV-2026-0126",
    name: "Karthik Reddy",
    phone: "+91 99888 22110",
    email: "karthikreddy@email.com",
    service: "Rescue Team",
    location: "Ranga Reddy, TS",
    area: "Ibrahimpatnam",
    status: "Verified",
    rating: "4.9",
    joined: "May 05, 2026",
    avatar: "KR",
  },
  {
    id: "#PRV-2026-0125",
    name: "Sanjay M.",
    phone: "+91 90000 33445",
    email: "sanjaym@email.com",
    service: "Medical Support",
    location: "Hyderabad, TS",
    area: "LB Nagar",
    status: "Pending",
    rating: "--",
    joined: "May 12, 2026",
    avatar: "SM",
  },
  {
    id: "#PRV-2026-0124",
    name: "Naveen Kumar",
    phone: "+91 99123 77889",
    email: "naveenkumar@email.com",
    service: "Vehicle Assistance",
    location: "Hyderabad, TS",
    area: "Uppal",
    status: "Verified",
    rating: "4.6",
    joined: "May 03, 2026",
    avatar: "NK",
  },
  {
    id: "#PRV-2026-0123",
    name: "Ramesh Yadav",
    phone: "+91 87900 11223",
    email: "rameshyadav@email.com",
    service: "Blood Support",
    location: "Hyderabad, TS",
    area: "Kukatpally",
    status: "Inactive",
    rating: "4.2",
    joined: "Apr 20, 2026",
    avatar: "RY",
  },
];

export default function ProvidersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.id.toLowerCase().includes(search.toLowerCase()) ||
      provider.service.toLowerCase().includes(search.toLowerCase()) ||
      provider.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc]">

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] bg-[#082b63] text-white transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[90px] items-center border-b border-white/10 px-6">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700">
              <ShieldCheck size={27} />
            </div>

            <div>
              <h1 className="text-xl font-bold">HelpBridge</h1>
              <p className="text-xs text-blue-200">Manager Panel</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="px-4 py-6">

          <NavItem
            href="/manager/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />

          <NavItem
            href="/manager/emergency-requests"
            icon={<Siren size={20} />}
            label="Emergency Requests"
            badge="12"
          />

          <NavItem
            href="/manager/pending-verification"
            icon={<ClipboardCheck size={20} />}
            label="Pending Verification"
            badge="8"
          />

          <NavItem
            href="/manager/active-requests"
            icon={<Activity size={20} />}
            label="Active Requests"
            badge="5"
          />

          <NavItem
            href="/manager/assigned-requests"
            icon={<Users size={20} />}
            label="Assigned Requests"
            badge="9"
          />

          <NavItem
            href="/manager/completed-requests"
            icon={<CheckCircle size={20} />}
            label="Completed Requests"
          />

          <NavItem
            href="/manager/providers"
            icon={<Users size={20} />}
            label="Providers"
            active
          />

          <NavItem
            href="/manager/notifications"
            icon={<Bell size={20} />}
            label="Notifications"
            badge="7"
          />

          <NavItem
            href="/manager/reports"
            icon={<BarChart3 size={20} />}
            label="Reports & Analytics"
          />

          <NavItem
            href="/manager/profile"
            icon={<User size={20} />}
            label="Profile"
          />

          <NavItem
            href="/manager/settings"
            icon={<Settings size={20} />}
            label="Settings"
          />

        </nav>

        <div className="absolute bottom-6 left-4 right-4 border-t border-white/10 pt-4">

          <Link
            href="/login"
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm text-red-300 hover:bg-white/10"
          >
            <LogOut size={20} />
            Logout
          </Link>

        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <main className="lg:ml-[260px]">

        {/* HEADER */}
        <header className="flex h-[90px] items-center border-b bg-white px-5 sm:px-8">

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu size={25} />
          </button>

          <div className="ml-auto flex items-center gap-6">

            <button className="relative">
              <Bell size={23} className="text-slate-600" />

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                7
              </span>
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                M
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-bold">Manager</p>
                <p className="text-xs text-slate-500">
                  HelpBridge Manager
                </p>
              </div>

            </div>

          </div>
        </header>

        {/* CONTENT */}
        <div className="p-5 sm:p-8">

          {/* TITLE */}
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">

            <div>
              <h2 className="text-3xl font-bold text-[#12234b]">
                Providers
              </h2>

              <p className="mt-2 text-slate-500">
                View and manage all registered help providers in the system.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search providers..."
                  className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none sm:w-[250px]"
                />

              </div>

              <button className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-5 text-sm font-semibold">
                <Filter size={17} />
                Filter
              </button>

              <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">
                <Plus size={17} />
                Add Provider
              </button>

            </div>
          </div>

          {/* STATISTICS */}
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              value="128"
              title="Total Providers"
              description="All registered providers"
              icon={<Users size={23} />}
              type="blue"
            />

            <StatCard
              value="96"
              title="Verified Providers"
              description="Active and verified"
              icon={<CheckCircle size={23} />}
              type="green"
            />

            <StatCard
              value="18"
              title="Pending Verification"
              description="Awaiting approval"
              icon={<Clock size={23} />}
              type="purple"
            />

            <StatCard
              value="14"
              title="Inactive Providers"
              description="Currently inactive"
              icon={<PauseCircle size={23} />}
              type="orange"
            />

          </div>

          {/* TABLE */}
          <div className="mt-7 overflow-hidden rounded-2xl border bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1250px]">

                <thead className="border-b bg-slate-50">

                  <tr className="text-left text-xs uppercase text-slate-500">

                    <th className="px-5 py-4">Provider ID</th>
                    <th className="px-5 py-4">Provider Name</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Service Type</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Rating</th>
                    <th className="px-5 py-4">Joined On</th>
                    <th className="px-5 py-4">Actions</th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {filteredProviders.map((provider) => (

                    <tr
                      key={provider.id}
                      className="hover:bg-slate-50"
                    >

                      {/* ID */}
                      <td className="px-5 py-5">
                        <p className="text-sm font-bold">
                          {provider.id}
                        </p>
                      </td>

                      {/* NAME */}
                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            {provider.avatar}
                          </div>

                          <p className="text-sm font-bold">
                            {provider.name}
                          </p>

                        </div>

                      </td>

                      {/* CONTACT */}
                      <td className="px-5 py-5">

                        <p className="text-sm font-semibold">
                          {provider.phone}
                        </p>

                        <p className="text-xs text-slate-500">
                          {provider.email}
                        </p>

                      </td>

                      {/* SERVICE */}
                      <td className="px-5 py-5">

                        <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                          {provider.service}
                        </span>

                      </td>

                      {/* LOCATION */}
                      <td className="px-5 py-5">

                        <p className="text-sm font-semibold">
                          {provider.location}
                        </p>

                        <p className="text-xs text-slate-500">
                          {provider.area}
                        </p>

                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-5">
                        <StatusBadge status={provider.status} />
                      </td>

                      {/* RATING */}
                      <td className="px-5 py-5">

                        <div className="flex items-center gap-1">

                          <span className="text-sm font-semibold">
                            {provider.rating}
                          </span>

                          {provider.rating !== "--" && (
                            <Star
                              size={14}
                              className="fill-yellow-400 text-yellow-400"
                            />
                          )}

                        </div>

                      </td>

                      {/* JOINED */}
                      <td className="px-5 py-5">

                        <p className="text-sm">
                          {provider.joined}
                        </p>

                        <p className="text-xs text-slate-400">
                          2 months ago
                        </p>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-5">

                        <div className="flex items-center gap-2">

                          <button
                            className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-blue-50"
                            title="View provider"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-slate-50"
                            title="More options"
                          >
                            <MoreVertical size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t px-5 py-5">

              <p className="text-sm text-slate-500">
                Showing 1 to {filteredProviders.length} of 128 providers
              </p>

              <div className="flex gap-2">

                <button className="flex h-9 w-9 items-center justify-center rounded-lg border">
                  <ChevronLeft size={16} />
                </button>

                <button className="h-9 w-9 rounded-lg bg-blue-600 text-sm font-bold text-white">
                  1
                </button>

                <button className="h-9 w-9 rounded-lg border">
                  2
                </button>

                <button className="h-9 w-9 rounded-lg border">
                  3
                </button>

                <button className="h-9 w-9 rounded-lg border">
                  4
                </button>

                <button className="flex h-9 w-9 items-center justify-center rounded-lg border">
                  <ChevronRight size={16} />
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* NAVIGATION */

function NavItem({
  href,
  icon,
  label,
  badge,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`mb-1 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium ${
        active
          ? "bg-blue-600 text-white"
          : "text-blue-50 hover:bg-white/10"
      }`}
    >
      <span className="flex items-center gap-4">
        {icon}
        {label}
      </span>

      {badge && (
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">
          {badge}
        </span>
      )}
    </Link>
  );
}


/* STAT CARD */

function StatCard({
  value,
  title,
  description,
  icon,
  type,
}: {
  value: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "blue" | "green" | "purple" | "orange";
}) {

  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-3xl font-bold text-slate-800">
            {value}
          </p>

          <p className="mt-1 font-bold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${styles[type]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* STATUS */

function StatusBadge({
  status,
}: {
  status: "Verified" | "Pending" | "Inactive";
}) {

  const styles = {
    Verified: "bg-green-50 text-green-600 border-green-100",
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
    Inactive: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <span
      className={`rounded-md border px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}