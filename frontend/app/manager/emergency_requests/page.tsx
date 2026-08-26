"use client";

import Link from "next/link";
import { useState } from "react";

import {LayoutDashboard,Siren,ClipboardCheck,Activity,Users,Bell,BarChart3,User,Settings,LogOut,Menu,X,Search,Filter,
        Download,Eye,MapPin,Clock,CheckCircle,AlertTriangle,ChevronLeft,ChevronRight,Car,Droplets,Waves,HeartPulse,Flame,
       Zap,Mountain,Headphones,ShieldCheck,} from "lucide-react";
export default function EmergencyRequestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Requests");
  const requests = [
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
      status: "Pending",
      time: "10 min ago",
      icon: <Car size={20} />,
      color: "red",
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
      status: "Pending",
      time: "25 min ago",
      icon: <Droplets size={20} />,
      color: "red",
    },
    {
      id: "#ER-2026-0229",
      type: "Flood Emergency",
      subtitle: "Flood Situation",
      requester: "Suresh Babu",
      phone: "+91 99876 54321",
      location: "Secunderabad, TS",
      area: "Bolarum",
      people: "5",
      priority: "Medium",
      status: "Verified",
      time: "35 min ago",
      icon: <Waves size={20} />,
      color: "blue",
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
      status: "Pending",
      time: "45 min ago",
      icon: <HeartPulse size={20} />,
      color: "purple",
    },
    {
      id: "#ER-2026-0227",
      type: "Fire Emergency",
      subtitle: "Fire Incident",
      requester: "Rohit Singh",
      phone: "+91 77665 55443",
      location: "Hyderabad, TS",
      area: "Ameerpet",
      people: "3",
      priority: "Medium",
      status: "Verified",
      time: "1 hr ago",
      icon: <Flame size={20} />,
      color: "orange",
    },
    {
      id: "#ER-2026-0226",
      type: "Landslide",
      subtitle: "Landslide Area",
      requester: "Mahesh T.",
      phone: "+91 66554 33221",
      location: "Ranga Reddy, TS",
      area: "Ibrahimpatnam",
      people: "4",
      priority: "High",
      status: "Active",
      time: "1 hr 20 min ago",
      icon: <Mountain size={20} />,
      color: "green",
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
      status: "Pending",
      time: "1 hr 35 min ago",
      icon: <Zap size={20} />,
      color: "orange",
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.type.toLowerCase().includes(search.toLowerCase()) ||
      request.requester.toLowerCase().includes(search.toLowerCase()) ||
      request.location.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase());
    const matchesTab =activeTab === "All Requests" ||request.status === activeTab;
    return matchesSearch && matchesTab;
  });
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-[260px]
          bg-[#082b63] text-white
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex h-[90px] items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600">
              <ShieldCheck size={27} />
            </div>
            <div>
              <h1 className="text-xl font-bold"> HelpBridge</h1>
              <p className="text-xs text-blue-200">  Manager Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden" >
            <X size={22} />
          </button>
        </div>
        <nav className="px-4 py-6">
          <SidebarItem href="/manager/dashboard"  icon={<LayoutDashboard size={20} />}  label="Dashboard" />
          <SidebarItem href="/manager/emergency-requests"icon={<Siren size={20} />} label="Emergency Requests" badge="12" active/>
          <SidebarItem href="/manager/verification" icon={<ClipboardCheck size={20} />}  label="Pending Verification"  badge="8" />
          <SidebarItem href="/manager/active-requests" icon={<Activity size={20} />}  label="Active Requests" badge="5"/>
          <SidebarItem href="/manager/assigned-requests"icon={<Users size={20} />} label="Assigned Requests"badge="9"/>
          <SidebarItem href="/manager/completed-requests"  icon={<CheckCircle size={20} />}  label="Completed Requests"/>
          <SidebarItem  href="/manager/providers"  icon={<Users size={20} />} label="Providers" />
          <SidebarItem href="/manager/notifications"  icon={<Bell size={20} />} label="Notifications" badge="7" />
          <SidebarItem href="/manager/reports"  icon={<BarChart3 size={20} />}  label="Reports & Analytics" />
          <SidebarItem href="/manager/profile"  icon={<User size={20} />} label="Profile" />
          <SidebarItem href="/manager/settings"  icon={<Settings size={20} />}  label="Settings" />
        </nav>

        <div className="absolute bottom-[125px] left-4 right-4 border-t border-white/10 pt-4">
          <Link href="/login"  className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-red-300 hover:bg-white/10">
            <LogOut size={20} /> Logout
          </Link>
        </div>
        <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/10 p-4 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <Headphones size={22} />
          </div>
          <p className="mt-3 font-semibold"> Need Help?</p>
          <p className="mt-1 text-xs text-blue-200"> Contact support anytime</p>
          <button className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold hover:bg-blue-700"> Contact Suppor</button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden"  onClick={() => setSidebarOpen(false)}/>
      )}
      <main className="lg:ml-[260px]">
        <header className="flex h-[90px] items-center border-b bg-white px-5 sm:px-8">
          <button onClick={() => setSidebarOpen(true)}  className="text-slate-600 lg:hidden">
            <Menu size={25} />
          </button>
          <div className="ml-auto flex items-center gap-6">
            <button className="relative">
              <Bell size={23} className="text-slate-600" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">7</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">M </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Manager</p>
                <p className="text-xs text-slate-500">  HelpBridge Manager</p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#12234b]">Emergency Requests </h2>
              <p className="mt-2 text-slate-500"> View and manage all incoming emergency requests. </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests..."
                  className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 sm:w-[255px]" />
              </div>
              <button className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <Filter size={17} />
                Filter
              </button>
              <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">
                <Download size={17} />Export
              </button>
            </div>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryCard  value="23"  title="Total Requests" description="All emergency requests" icon={<Siren size={23} />} color="red" />
            <SummaryCard value="12" title="Pending" description="Awaiting verification" icon={<Clock size={23} />}color="orange"/>
            <SummaryCard value="5"  title="Active" description="Currently in progress" icon={<Activity size={23} />} color="blue"/>
            <SummaryCard value="9" title="Verified" description="Verified as genuine" icon={<CheckCircle size={23} />}color="green" />
            <SummaryCard value="48" title="Completed"  description="Successfully resolved" icon={<CheckCircle size={23} />} color="purple" />
          </div>
          <div className="mt-7 overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b px-5 pt-2 sm:flex-row sm:items-center">
              <div className="flex overflow-x-auto">
                {[
                  "All Requests",
                  "Pending",
                  "Verified",
                  "Active",
                  "Completed",
                ].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={` whitespace-nowrap border-b-2 px-5 py-5 text-sm font-semibold
                      ${ activeTab === tab
                          ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
                      }
                    `}>
                    {tab}
                    {tab !== "All Requests" && (
                      <span className="ml-2 text-xs">
                        (
                        {tab === "Pending"
                          ? 12: tab === "Verified"? 9 : tab === "Active"? 5 : 48}
                        )
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 px-4">
                <span className="text-sm text-slate-500"> Sort by:  </span>
                <select className="rounded-lg border bg-white px-3 py-2 text-sm font-medium outline-none">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Highest Priority</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="border-b bg-slate-50">
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4"> Request ID </th>
                    <th className="px-5 py-4">  Type </th>
                    <th className="px-5 py-4">  Requester</th>
                    <th className="px-5 py-4">  Location  </th>
                    <th className="px-5 py-4"> People  </th>
                    <th className="px-5 py-4"> Priority  </th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4"> Time </th>
                    <th className="px-5 py-4">   Actions </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <RequestRow key={request.id} request={request} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center" >
                        <Search size={40}  className="mx-auto text-slate-300" />
                        <p className="mt-3 font-semibold text-slate-700">  No requests found  </p>
                        <p className="mt-1 text-sm text-slate-400">Try changing your search or filter. </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col justify-between gap-4 border-t px-5 py-5 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">{filteredRequests.length} </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700"> 23 </span>{" "}
                requests
              </p>
              <div className="flex items-center gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border text-slate-500 hover:bg-slate-50">
                  <ChevronLeft size={17} />
                </button>
                <button className="h-9 w-9 rounded-lg bg-blue-600 text-sm font-semibold text-white">  1</button>
                <button className="h-9 w-9 rounded-lg border text-sm font-semibold text-slate-600 hover:bg-slate-50"> 2 </button>
                <button className="h-9 w-9 rounded-lg border text-sm font-semibold text-slate-600 hover:bg-slate-50"> 3</button>
                <button className="h-9 w-9 rounded-lg border text-sm font-semibold text-slate-600 hover:bg-slate-50"> 4</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border text-slate-500 hover:bg-slate-50">
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <AlertTriangle size={20}  className="mt-0.5 shrink-0 text-blue-600"/>
            <div>
              <p className="font-semibold text-blue-900"> Manager verification required </p>
              <p className="mt-1 text-sm text-blue-700"> Emergency requests must be verified by a manager before a help provider can be assigned. </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
function SidebarItem({href,icon,label,active = false,badge,}: {href: string;icon: React.ReactNode;label: string;active?: boolean;badge?: string;}) {
  return (
    <Link href={href}className={`mb-1 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition
        ${
          active
            ? "bg-blue-600 text-white": "text-blue-50 hover:bg-white/10"
        }
      `}
    >
      <span className="flex items-center gap-4">
        {icon}
        {label}
      </span>
      {badge && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold
            ${ active ? "bg-white text-blue-600" : "bg-red-500 text-white"}
          `}>
          {badge}
        </span>
      )}
    </Link>
  );
}
function SummaryCard({value,title,description,icon,color}: {value: string;title: string;description: string;icon: React.ReactNode;color: "red" | "orange" | "blue" | "green" | "purple";}) {
  const styles = {
    red: "bg-red-50 text-red-500",
    orange: "bg-orange-50 text-orange-500",
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-3xl font-bold ${styles[color].split(" ")[1]}`}>{value} </p>
          <p className="mt-1 font-bold text-slate-800"> {title}</p>
          <p className="mt-1 text-xs text-slate-500"> {description} </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${styles[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
function RequestRow({request,}: {
  request: {
    id: string;
    type: string;
    subtitle: string;
    requester: string;
    phone: string;
    location: string;
    area: string;
    people: string;
    priority: string;
    status: string;
    time: string;
    icon: React.ReactNode;
    color: string;
  };
}) {
  const iconStyles: Record<string, string> = {
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-500",
    orange: "bg-orange-50 text-orange-500",
    green: "bg-green-50 text-green-600",
  };
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-5 py-5">
        <p className="whitespace-nowrap text-sm font-bold text-slate-800"> {request.id}</p>
        <p className="mt-1 text-xs text-slate-400"> Req. ID</p>
      </td>
      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconStyles[request.color]}`}>
            {request.icon}
          </div>
          <div>
            <p className="whitespace-nowrap text-sm font-bold text-slate-800">{request.type}</p>
            <p className="mt-1 whitespace-nowrap text-xs text-slate-500">{request.subtitle}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5">
        <p className="whitespace-nowrap text-sm font-bold text-slate-800">{request.requester } </p>
        <p className="mt-1 whitespace-nowrap text-xs text-slate-500">{request.phone}</p>
      </td>
      <td className="px-5 py-5">
        <div className="flex gap-2">
          <MapPin size={17} className="mt-0.5 shrink-0 text-blue-600"/>
          <div>
            <p className="whitespace-nowrap text-sm font-semibold text-slate-700">{request.location}</p>
            <p className="mt-1 text-xs text-slate-500">{request.area}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5">
        <p className="text-sm font-semibold text-slate-700">{request.people}</p>
      </td>
      <td className="px-5 py-5">
        <PriorityBadge priority={request.priority} />
      </td>
      <td className="px-5 py-5">
        <StatusBadge status={request.status} />
      </td>
      <td className="px-5 py-5">
        <p className="whitespace-nowrap text-sm text-slate-600">{request.time} </p>
        <p className="mt-1 whitespace-nowrap text-xs text-slate-400">Today</p>
      </td>
      <td className="px-5 py-5">
        <Link  href={`/manager/emergency-requests/${request.id.replace("#", "")}`}  className="flex w-fit items-center gap-2 rounded-lg border border-blue-100 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50">
          <Eye size={15} />
          View
        </Link>
      </td>
    </tr>
  );
}
function PriorityBadge({priority,}: {priority: string;}) {
  const styles: Record<string, string> = {
    High: "bg-red-50 text-red-600 border-red-100",
    Medium: "bg-orange-50 text-orange-600 border-orange-100",
    Low: "bg-green-50 text-green-600 border-green-100",
  };
  return (
    <span className={`inline-flex rounded-md border px-3 py-1.5 text-xs font-bold ${styles[priority]}`}>
      {priority}
    </span>
  );
}
function StatusBadge({status}: {status: string;}) {
  const config: Record<
    string,
    {
      style: string;
      icon: React.ReactNode;
      text: string;
    }
  > = {
    Pending: {
      style: "bg-orange-50 text-orange-600 border-orange-100",
      icon: <Clock size={13} />,
      text: "Verification",
    },
    Verified: {
      style: "bg-green-50 text-green-600 border-green-100",
      icon: <CheckCircle size={13} />,
      text: "Genuine",
    },
    Active: {
      style: "bg-blue-50 text-blue-600 border-blue-100",
      icon: <Activity size={13} />,
      text: "In Progress",
    },
    Completed: {
      style: "bg-purple-50 text-purple-600 border-purple-100",
      icon: <CheckCircle size={13} />,
      text: "Resolved",
    },
  };
  const item = config[status];
  return (
    <div className={`flex w-fit flex-col items-center rounded-md border px-3 py-1.5 ${item.style}`}>
      <span className="flex items-center gap-1 text-xs font-bold">
        {item.icon}
        {status}
      </span>
      <span className="mt-0.5 text-[10px]">
        {item.text}
      </span>
    </div>
  );
}