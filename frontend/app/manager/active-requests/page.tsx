"use client";
import Link from "next/link";
import { useState } from "react";
import {LayoutDashboard,Siren,ClipboardCheck,Activity,Users,Bell,BarChart3,User,Settings,LogOut,Menu,X,Search,Filter,Download,Eye,MapPin,Clock,
          CheckCircle,ChevronLeft,ChevronRight,MessageCircle,ShieldCheck,Waves,Flame,Mountain,HeartPulse,Car,} from "lucide-react";
type ActiveRequest = {id: string;type: string;subtitle: string;requester: string;requesterPhone: string;provider: string;providerPhone: string;location: string;area: string;started: string;completion: string;status: string;icon: React.ReactNode;};
export default function ActiveRequestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const requests: ActiveRequest[] = [
    {
      id: "#ER-2026-0229",
      type: "Flood Emergency",
      subtitle: "Flood Situation",
      requester: "Suresh Babu",
      requesterPhone: "+91 99876 54321",
      provider: "Arjun Kumar",
      providerPhone: "+91 93456 11223",
      location: "Secunderabad, TS",
      area: "Bolarum",
      started: "35 min ago",
      completion: "1h 30m",
      status: "In Progress",
      icon: <Waves size={19} />,
    },
    {
      id: "#ER-2026-0227",
      type: "Fire Emergency",
      subtitle: "Fire Incident",
      requester: "Rohit Singh",
      requesterPhone: "+91 77665 55443",
      provider: "Venkatesh P.",
      providerPhone: "+91 91234 44556",
      location: "Hyderabad, TS",
      area: "Ameerpet",
      started: "1 hr ago",
      completion: "2h 10m",
      status: "In Progress",
      icon: <Flame size={19} />,
    },
    {
      id: "#ER-2026-0226",
      type: "Landslide",
      subtitle: "Landslide Area",
      requester: "Mahesh T.",
      requesterPhone: "+91 66554 33221",
      provider: "Karthik Reddy",
      providerPhone: "+91 99888 22110",
      location: "Ranga Reddy, TS",
      area: "Ibrahimpatnam",
      started: "1h 20 min ago",
      completion: "2h 40m",
      status: "In Progress",
      icon: <Mountain size={19} />,
    },
    {
      id: "#ER-2026-0222",
      type: "Medical Emergency",
      subtitle: "Patient Transport",
      requester: "Deepika N.",
      requesterPhone: "+91 81234 56789",
      provider: "Sanjay M.",
      providerPhone: "+91 90000 33445",
      location: "Hyderabad, TS",
      area: "LB Nagar",
      started: "1h 35 min ago",
      completion: "1h 50m",
      status: "In Progress",
      icon: <HeartPulse size={19} />,
    },
    {
      id: "#ER-2026-0219",
      type: "Accident",
      subtitle: "Road Accident",
      requester: "Kiran R.",
      requesterPhone: "+91 95555 66777",
      provider: "Naveen Kumar",
      providerPhone: "+91 99123 77889",
      location: "Hyderabad, TS",
      area: "Uppal",
      started: "2 hr ago",
      completion: "2h 30m",
      status: "In Progress",
      icon: <Car size={19} />,
    },
  ];
  const filteredRequests = requests.filter(
    (request) =>
      request.id.toLowerCase().includes(search.toLowerCase()) ||
      request.type.toLowerCase().includes(search.toLowerCase()) ||
      request.requester.toLowerCase().includes(search.toLowerCase()) ||
      request.provider.toLowerCase().includes(search.toLowerCase()) ||
      request.location.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <aside className={`fixed left-0 top-0 z-50 h-screen w-[260px] bg-[#082b63] text-white transition-transform duration-300 ${sidebarOpen
            ? "translate-x-0": "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-[90px] items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600">
              <ShieldCheck size={27} />
            </div>
            <div>
              <h1 className="text-xl font-bold">HelpBridge</h1>
              <p className="text-xs text-blue-200">Manager Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <X size={22} />
          </button>
        </div>
        <nav className="px-4 py-6">
          <NavItem href="/manager/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard"/>
          <NavItem href="/manager/emergency-requests" icon={<Siren size={20} />}label="Emergency Requests" badge="12"/>
          <NavItem href="/manager/pending-verification" icon={<ClipboardCheck size={20} />} label="Pending Verification"badge="8"/>
          <NavItem href="/manager/active-requests" icon={<Activity size={20} />} label="Active Requests" badge="5" active />
          <NavItem href="/manager/assigned-requests" icon={<Users size={20} />} label="Assigned Requests" badge="9" />
          <NavItem href="/manager/completed-requests" icon={<CheckCircle size={20} />} label="Completed Requests"/>
          <NavItem href="/manager/providers" icon={<Users size={20} />} label="Providers" />
          <NavItem href="/manager/notifications"icon={<Bell size={20} />}label="Notifications" badge="7"/>
          <NavItem href="/manager/reports" icon={<BarChart3 size={20} />} label="Reports & Analytics"/>
          <NavItem href="/manager/profile" icon={<User size={20} />} label="Profile"/>
          <NavItem href="/manager/settings" icon={<Settings size={20} />} label="Settings"/>
        </nav>
        <div className="absolute bottom-6 left-4 right-4 border-t border-white/10 pt-4">
          <Link href="/login" className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm text-red-300 hover:bg-white/10">
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}
      <main className="lg:ml-[260px]">
        <header className="flex h-[90px] items-center border-b bg-white px-5 sm:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" >
            <Menu size={25} />
          </button>
          <div className="ml-auto flex items-center gap-6">
            <button className="relative">
              <Bell size={23} className="text-slate-600"/>
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">7</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700"> M</div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold"> Manager</p>
                <p className="text-xs text-slate-500"> HelpBridge Manager </p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#12234b]">Active Requests</h2>
              <p className="mt-2 text-slate-500"> Requests that are currently being handled and in progress. </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search size={18}  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests..."
                  className="h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm outline-none sm:w-[250px]"/>
              </div>
              <button className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-5 text-sm font-semibold">
                <Filter size={17} /> Filter
              </button>
              <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white">
                <Download size={17} />Export
              </button>
            </div>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard value="5" title="Active Requests" description="Currently in progress" icon={<Activity size={23} />} type="blue" />
            <StatCard value="18 min" title="Avg. Response Time" description="From verification" icon={<Clock size={23} />} type="green" />
            <StatCard value="5" title="Providers Assigned" description="Helping now" icon={<Users size={23} />} type="purple"/>
            <StatCard value="2h 15m" title="Est. Completion" description="Average remaining time" icon={<Clock size={23} />} type="orange" />
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead className="border-b bg-slate-50">
                  <tr className="text-left text-xs uppercase text-slate-500">
                    <th className="px-5 py-4">Request ID</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Requester</th>
                    <th className="px-5 py-4">Provider</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Started</th>
                    <th className="px-5 py-4"> Est. Completion</th>
                    <th className="px-5 py-4"> Status</th>
                    <th className="px-5 py-4"> Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredRequests.map(
                    (request) => (
                      <tr key={request.id}className="hover:bg-slate-50" >
                        <td className="px-5 py-5">
                          <p className="text-sm font-bold">{request.id}</p>
                          <p className="text-xs text-slate-400">Req. ID </p>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">{request.icon} </div>
                            <div>
                              <p className="whitespace-nowrap text-sm font-bold">{request.type}</p>
                              <p className="text-xs text-slate-500"> {request.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <p className="whitespace-nowrap text-sm font-bold">{request.requester}</p>
                          <p className="text-xs text-slate-500"> {request.requesterPhone}</p>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{request.provider.charAt(0)} </div>
                            <div>
                              <p className="whitespace-nowrap text-sm font-semibold">  {request.provider}</p>
                              <p className="text-xs text-slate-500"> {request.providerPhone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex gap-2">
                            <MapPin size={17} className="text-blue-600" />
                            <div>
                              <p className="whitespace-nowrap text-sm font-semibold">{request.location}</p>
                              <p className="text-xs text-slate-500">{request.area}</p>
                            </div>
                          </div>
                        </td>
                       <td className="px-5 py-5">
                          <p className="whitespace-nowrap text-sm">{request.started}</p>
                          <p className="text-xs text-slate-400">  {request.started} </p>
                        </td>
                        <td className="px-5 py-5">
                          <p className="whitespace-nowrap text-sm font-semibold">{request.completion} </p>
                          <p className="text-xs text-slate-400"> remaining </p>
                        </td>
                        <td className="px-5 py-5">
                          <span className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                            <Activity size={13} />
                            In Progress
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex gap-2">
                            <Link href={`/manager/emergency-requests/${request.id.replace("#", "")}`}
                              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50" >
                              <Eye size={14} />View
                            </Link>
                            <button title="Open chat" className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-slate-50">
                              <MessageCircle size={15}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t px-5 py-5">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">{filteredRequests.length}</span>{" "}
                of 5 active requests
              </p>
              <div className="flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border"><ChevronLeft size={16} /></button>
                <button className="h-9 w-9 rounded-lg bg-blue-600 text-sm font-bold text-white">1</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <Activity size={20} className="mt-0.5 text-blue-600"/>
            <div>
              <p className="font-semibold text-blue-900"> Active request monitoring</p>
              <p className="mt-1 text-sm text-blue-700">These requests have been verified and assigned to help providers. Managers can monitor progress,  communicate with providers, and view request details. </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
function NavItem({href,icon,label,badge,active = false,}: {href: string;icon: React.ReactNode;label: string;badge?: string;active?: boolean;}) {
  return (
    <Link href={href}
      className={`mb-1 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium ${active
          ? "bg-blue-600 text-white": "text-blue-50 hover:bg-white/10"}`}>
      <span className="flex items-center gap-4">{icon}{label}</span>
      {badge && (
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">{badge}</span>
      )}
    </Link>
  );
}
function StatCard({value,title,description,icon,type,}: {value: string;title: string;description: string;icon: React.ReactNode;type: "blue" | "green" | "purple" | "orange";}) {
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
          <p className="text-3xl font-bold text-slate-800">{value} </p>
          <p className="mt-1 font-bold text-slate-800"> {title}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <div  className={`flex h-11 w-11 items-center justify-center rounded-full ${styles[type]}`}> {icon}</div>
      </div>
    </div>
  );
}