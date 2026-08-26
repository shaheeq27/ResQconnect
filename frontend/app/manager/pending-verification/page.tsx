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
  Download,
  Eye,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Car,
  Droplets,
  HeartPulse,
  Zap,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type Request = {
  id: string;
  type: string;
  subtitle: string;
  requester: string;
  phone: string;
  location: string;
  area: string;
  people: string;
  priority: "High" | "Medium" | "Low";
  time: string;
  icon: React.ReactNode;
};

export default function PendingVerificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "#ER-2026-0231",
      type: "Accident",
      subtitle: "Road Accident",
      requester: "Ravi Kumar",
      phone: "+91 98765 43210",
      location: "Hyderabad, TS",
      area: "Madhapur",
      people: "2",
      priority: "High",
      time: "10 min ago",
      icon: <Car size={19} />,
    },
    {
      id: "#ER-2026-0230",
      type: "Blood Requirement",
      subtitle: "O+ Blood",
      requester: "Anita Verma",
      phone: "+91 91234 56789",
      location: "Hyderabad, TS",
      area: "Kukatpally",
      people: "1",
      priority: "High",
      time: "25 min ago",
      icon: <Droplets size={19} />,
    },
    {
      id: "#ER-2026-0228",
      type: "Medical Emergency",
      subtitle: "Medical Help",
      requester: "Priya Sharma",
      phone: "+91 88990 11223",
      location: "Hyderabad, TS",
      area: "Gachibowli",
      people: "1",
      priority: "High",
      time: "45 min ago",
      icon: <HeartPulse size={19} />,
    },
    {
      id: "#ER-2026-0225",
      type: "Electrical Hazard",
      subtitle: "Power Line Down",
      requester: "Vikram Reddy",
      phone: "+91 99887 66554",
      location: "Hyderabad, TS",
      area: "Begumpet",
      people: "--",
      priority: "Low",
      time: "1 hr 35 min ago",
      icon: <Zap size={19} />,
    },
    {
      id: "#ER-2026-0223",
      type: "Elderly Assistance",
      subtitle: "Need Help",
      requester: "Suresh R.",
      phone: "+91 93456 77890",
      location: "Hyderabad, TS",
      area: "Nizampet",
      people: "1",
      priority: "Medium",
      time: "1 hr 50 min ago",
      icon: <UserRound size={19} />,
    },
  ]);

  const filteredRequests = requests.filter(
    (request) =>
      request.id.toLowerCase().includes(search.toLowerCase()) ||
      request.type.toLowerCase().includes(search.toLowerCase()) ||
      request.requester.toLowerCase().includes(search.toLowerCase()) ||
      request.location.toLowerCase().includes(search.toLowerCase())
  );

  const verifyRequest = (id: string) => {
    setRequests((current) =>
      current.filter((request) => request.id !== id)
    );

    alert(`${id} has been verified successfully.`);
  };

  const rejectRequest = (id: string) => {
    setRequests((current) =>
      current.filter((request) => request.id !== id)
    );

    alert(`${id} has been rejected.`);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">

      {/* SIDEBAR */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] bg-[#082b63] text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >

        <div className="flex h-[90px] items-center border-b border-white/10 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600">
              <ShieldCheck size={27} />
            </div>

            <div>
              <h1 className="text-xl font-bold">HelpBridge</h1>
              <p className="text-xs text-blue-200">
                Manager Panel
              </p>
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
            active
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
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-red-300 hover:bg-white/10"
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

                <p className="text-sm font-bold">
                  Manager
                </p>

                <p className="text-xs text-slate-500">
                  HelpBridge Manager
                </p>

              </div>

            </div>

          </div>

        </header>

        <div className="p-5 sm:p-8">

          {/* TITLE */}

          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">

            <div>

              <h2 className="text-3xl font-bold text-[#12234b]">
                Pending Verification
              </h2>

              <p className="mt-2 text-slate-500">
                Requests that are waiting for your verification and approval.
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
                  placeholder="Search requests..."
                  className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none sm:w-[250px]"
                />

              </div>

              <button className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-5 text-sm font-semibold">
                <Filter size={17} />
                Filter
              </button>

              <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white">
                <Download size={17} />
                Export
              </button>

            </div>

          </div>

          {/* STATISTICS */}

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              value={requests.length.toString()}
              title="Pending Verification"
              description="Requires your review"
              icon={<Siren size={23} />}
              type="red"
            />

            <StatCard
              value="32 min"
              title="Avg. Waiting Time"
              description="Time since request"
              icon={<Clock size={23} />}
              type="orange"
            />

            <StatCard
              value="23"
              title="People Affected"
              description="Total in pending requests"
              icon={<Users size={23} />}
              type="blue"
            />

            <StatCard
              value="5"
              title="High Priority"
              description="Requires immediate action"
              icon={<AlertTriangle size={23} />}
              type="purple"
            />

          </div>

          {/* TABLE */}

          <div className="mt-7 overflow-hidden rounded-2xl border bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1150px]">

                <thead className="border-b bg-slate-50">

                  <tr className="text-left text-xs uppercase text-slate-500">

                    <th className="px-5 py-4">Request ID</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Requester</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">People</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Time Since</th>
                    <th className="px-5 py-4">Actions</th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {filteredRequests.map((request) => (

                    <tr
                      key={request.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-5">

                        <p className="text-sm font-bold">
                          {request.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Req. ID
                        </p>

                      </td>

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                            {request.icon}
                          </div>

                          <div>

                            <p className="text-sm font-bold">
                              {request.type}
                            </p>

                            <p className="text-xs text-slate-500">
                              {request.subtitle}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-5">

                        <p className="text-sm font-bold">
                          {request.requester}
                        </p>

                        <p className="text-xs text-slate-500">
                          {request.phone}
                        </p>

                      </td>

                      <td className="px-5 py-5">

                        <div className="flex gap-2">

                          <MapPin
                            size={17}
                            className="text-blue-600"
                          />

                          <div>

                            <p className="text-sm font-semibold">
                              {request.location}
                            </p>

                            <p className="text-xs text-slate-500">
                              {request.area}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-5 font-semibold">
                        {request.people}
                      </td>

                      <td className="px-5 py-5">
                        <PriorityBadge
                          priority={request.priority}
                        />
                      </td>

                      <td className="px-5 py-5">

                        <p className="text-sm">
                          {request.time}
                        </p>

                        <p className="text-xs text-slate-400">
                          Today
                        </p>

                      </td>

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              verifyRequest(request.id)
                            }
                            className="flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-600 hover:bg-green-100"
                          >
                            <CheckCircle size={14} />
                            Verify
                          </button>

                          <button
                            onClick={() =>
                              rejectRequest(request.id)
                            }
                            className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                          >
                            <X size={14} />
                            Reject
                          </button>

                          <Link
                            href={`/manager/emergency-requests/${request.id.replace(
                              "#",
                              ""
                            )}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-slate-50"
                          >
                            <Eye size={16} />
                          </Link>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div className="flex items-center justify-between border-t px-5 py-5">

              <p className="text-sm text-slate-500">
                Showing {filteredRequests.length} of 8 requests
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


/* ================= NAV ITEM ================= */

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


/* ================= STAT CARD ================= */

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
  type: "red" | "orange" | "blue" | "purple";
}) {

  const styles = {
    red: "bg-red-50 text-red-500",
    orange: "bg-orange-50 text-orange-500",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-3xl font-bold">
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


/* ================= PRIORITY ================= */

function PriorityBadge({
  priority,
}: {
  priority: "High" | "Medium" | "Low";
}) {

  const styles = {
    High: "bg-red-50 text-red-600 border-red-100",
    Medium: "bg-orange-50 text-orange-600 border-orange-100",
    Low: "bg-green-50 text-green-600 border-green-100",
  };

  return (
    <span
      className={`rounded-md border px-3 py-1.5 text-xs font-bold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}