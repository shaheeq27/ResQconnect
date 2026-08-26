"use client";

import Link from "next/link";
import { useState } from "react";
import {LayoutDashboard,Siren,ClipboardCheck,Activity,Users,Bell,BarChart3,User,Settings,LogOut,Menu,X,ChevronDown,ChevronRight,MapPin,Eye,CheckCircle,Clock,ShieldCheck,
         AlertTriangle,Car,Droplets,Waves,HeartPulse,Flame,Headphones,CalendarDays,} from "lucide-react";
export default function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <aside className={`fixed left-0 top-0 z-50 h-screen w-[260px]bg-[#082b63] text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-[90px] items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0b63e5]">
              <ShieldCheck size={27} />
            </div>
            <div>
              <h1 className="text-xl font-bold">HelpBridge</h1>
              <p className="text-xs text-blue-200"> Manager Panel </p>
            </div>
          </div>
           <button>
            <X size={22} />
          </button>
        </div>
        <nav className="px-4 py-6">
          <SidebarItem href="/manager/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard"  active/>
          <SidebarItem  href="/manager/emergency-requests" icon={<Siren size={20} />} label="Emergency Requests"badge="12"/>
          <SidebarItem href="/manager/verification" icon={<ClipboardCheck size={20} />} label="Pending Verification" badge="8" />
          <SidebarItem href="/manager/active-requests" icon={<Activity size={20} />}label="Active Requests" badge="5" /> 
          <SidebarItem href="/manager/completed-requests" icon={<CheckCircle size={20} />} label="Completed Requests" />
          <SidebarItem href="/manager/providers" icon={<Users size={20} />}  label="Providers"/>
          <SidebarItem href="/manager/notifications" icon={<Bell size={20} />} label="Notifications" badge="7" />
          <SidebarItem href="/manager/reports"icon={<BarChart3 size={20} />} label="Reports & Analytics"/>
          <SidebarItem href="/manager/profile" icon={<User size={20} />}  label="Profile" />
          <SidebarItem href="/manager/settings" icon={<Settings size={20} />} label="Settings"/>
        </nav>
        <div className="absolute bottom-[125px] left-4 right-4 border-t border-white/10 pt-4">
          <Link href="/login" className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-white/10" >
            <LogOut size={20} />
            Logout
          </Link>
        </div>
        <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/10 p-4 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <Headphones size={22} />
          </div>
          <p className="mt-3 font-semibold">Need Help? </p>
          <p className="mt-1 text-xs text-blue-200">Contact support anytime </p>
          <button className="mt-3 w-full rounded-lg bg-[#1769e8] py-2 text-sm font-semibold hover:bg-[#0d5ed7]"> Contact Support</button>
        </div>
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)}/>)}
      <main className="lg:ml-[260px]">
        <header className="flex h-[90px] items-center justify-between border-b bg-white px-5 sm:px-8">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 lg:hidden">
            <Menu size={25} />
          </button>
          <div className="ml-auto flex items-center gap-5">
            <button className="relative text-slate-600">
              <Bell size={23} />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">7</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700"> M</div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800"> Manager  </p>
                <p className="text-xs text-slate-500"> HelpBridge Manager </p>
              </div>
              <ChevronDown  size={18}className="text-slate-500" />
            </div>
          </div>
        </header>
        <div className="p-5 sm:p-8">
          <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#12234b]">Welcome back, Manager!</h2>
              <p className="mt-2 text-slate-500"> Monitor, verify and manage emergency requests efficiently. </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border bg-white px-5 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <CalendarDays size={21} className="text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800"> August 13, 2026</p>
                <p className="text-xs text-slate-500"> Thursday, 10:30 AM </p>
              </div>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Pending Verification" value="12"  description="Requires your attention" icon={<ClipboardCheck size={25} />} color="red" />
            <StatCard title="Active Requests" value="5" description="Currently in progress"icon={<Activity size={25} />}  color="blue" />
            <StatCard title="Assigned Requests" value="9" description="Provider assigned" icon={<Users size={25} />} color="green"/>
            <StatCard title="Completed Requests" value="48" description="This month" icon={<CheckCircle size={25} />} color="purple"  />
          </div>

          <div className="mt-7 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b px-6 py-5">
                <div>
                  <h3 className="text-lg font-bold text-[#12234b]">Recent Emergency Requests </h3>
                </div>
                <Link href="/manager/emergency-requests" className="text-sm font-semibold text-blue-600 hover:text-blue-700"> View All  </Link>
              </div>

              <div className="divide-y">
                <RequestItem icon={<Car size={20} />} iconColor="red" title="Accident" description="A person met with road accident" location="Hyderabad, Madhapur"
                  distance="2.4 km" status="Pending" time="10 min ago" />
                <RequestItem icon={<Droplets size={20} />} iconColor="red"  title="Blood Requirement" description="O+ blood urgently required" location="Hyderabad, Kukatpally" distance="4.1 km" status="Pending"time="25 min ago"/>
                <RequestItem icon={<Waves size={20} />} iconColor="blue"title="flood Emergency" description="Water level rising in residential area"location="Secunderabad, Bolarum"
                  distance="5.8 km" status="Verified" time="35 min ago"/>
                <RequestItem icon={<HeartPulse size={20} />} iconColor="purple" title="Medical Emergency" description="Elderly person needs immediate help" location="Hyderabad, Gachibowli"
                  distance="3.2 km" status="Pending" time="45 min ago" />
                <RequestItem icon={<Flame size={20} />} iconColor="orange"  title="Fire Emergency"  description="Fire reported in commercial building" location="Hyderabad, Ameerpet"
                  distance="6.3 km"status="Verified"time="1 hr ago" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#12234b]"> Request Status Overview</h3>
                <div className="mt-7 flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#f59e0b_0_40%,#3b82f6_40%_60%,#22c55e_60%_90%,#8b5cf6_90%_100%)]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
                      <div className="text-center">
                        <p className="text-xl font-bold text-slate-800"> 74 </p>
                        <p className="text-[10px] text-slate-500"> Total </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-7 space-y-3">
                  <StatusLegend color="bg-amber-500" label="Pending" value="12" />
                  <StatusLegend color="bg-blue-500" label="Active" value="5"/>
                  <StatusLegend color="bg-green-500" label="Verified" value="9"/>
                  <StatusLegend color="bg-purple-500" label="Completed"  value="48" />
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#12234b]"> Quick Actions </h3>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <QuickAction href="/manager/verification" icon={<ClipboardCheck size={20} />} title="Verify Requests" color="red" />
                  <QuickAction  href="/manager/providers"icon={<Users size={20} />}  title="View Providers"  color="blue"/>
                   <QuickAction href="/manager/active-requests" icon={<Activity size={20} />} title="Active Requests" color="green"/>
                  <QuickAction href="/manager/reports" icon={<BarChart3 size={20} />}   title="Reports"color="purple"/>
                </div>
                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-100">
                  <MapPin size={19} />
                  Emergency Map
                </button>
              </div>
            </div>
          </div>
          <div className="mt-7 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="flex items-center gap-5 rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <ShieldCheck size={29} />
              </div>
              <div>
                <h3 className="font-bold text-[#12234b]">Important Reminder </h3>
                <p className="mt-1 text-sm text-slate-600"> Always verify emergency requests carefully before   assigning providers. </p>
                <p className="mt-1 text-sm font-medium text-blue-600"> Your verification can save lives. </p>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-bold text-[#12234b]">Manager Performance </h3>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">You have verified
                    <span className="font-bold text-slate-900">  {" "}23 requests </span>
                    {" "}this week.
                  </p>
                  <p className="mt-1 text-sm text-slate-500"> Keep up the good work!  </p>
                </div>
                <span className="ml-auto rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">+15%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
function SidebarItem({
  href,
  icon,
  label,
  active = false,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`
        mb-1 flex items-center justify-between rounded-lg
        px-4 py-3 text-sm font-medium
        transition
        ${
          active
            ? "bg-[#1769e8] text-white"
            : "text-blue-50 hover:bg-white/10"
        }
      `}
    >

      <span className="flex items-center gap-4">

        {icon}

        {label}

      </span>

      {badge && (
        <span
          className={`
            rounded-full px-2 py-0.5 text-xs font-bold
            ${
              active
                ? "bg-white text-blue-600"
                : "bg-red-500 text-white"
            }
          `}
        >
          {badge}
        </span>
      )}

    </Link>
  );
}


function StatCard({title,value,description,icon,color}: {title: string;value: string;description: string;icon: React.ReactNode;color: "red" | "blue" | "green" | "purple";}) {
  const styles = {
    red: {
      bg: "bg-red-50",
      icon: "text-red-500",
      number: "text-red-500",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-500",
      number: "text-blue-600",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-500",
      number: "text-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-500",
      number: "text-purple-600",
    },
  };
  const style = styles[color];
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600"> {title}  </p>
          <p className={`mt-2 text-4xl font-bold ${style.number}`}> {value} </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${style.bg} ${style.icon}`}>{icon}</div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-slate-500"> {description} </p>
        <ChevronRight size={17}  className="text-slate-400" />
      </div>
    </div>
  );
}
function RequestItem({icon,iconColor,title,description,location,distance,status,time,}: {
  icon: React.ReactNode;iconColor: "red" | "blue" | "purple" | "orange";title: string;description: string;
  location: string;distance: string;status: "Pending" | "Verified";time: string;}) {
  const iconStyles = {
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-500",
    orange: "bg-orange-50 text-orange-500",
  };
  return (
    <div className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyles[iconColor]}`}>{icon} </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-800">{title}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{description} </p>
        </div>
      </div>
      <div className="flex min-w-[160px] items-center gap-2">
        <MapPin size={17}  className="shrink-0 text-blue-500" />
        <p className="text-xs text-slate-600"> {location}</p>
      </div>
      <p className="min-w-[65px] text-sm font-semibold text-red-500"> {distance}</p>
      <div className="min-w-[90px]">
        {status === "Pending" ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-3 py-1.5 text-[11px] font-bold uppercase text-orange-600">
            <Clock size={13} /> Pending
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-3 py-1.5 text-[11px] font-bold uppercase text-green-600">
            <CheckCircle size={13} /> Verified
          </span>
        )}
      </div>
      <p className="min-w-[75px] text-xs text-slate-500"> {time}</p>
      <button className="flex h-9 w-9 items-center justify-center rounded-lg border text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
        <Eye size={17} />

      </button>

    </div>
  );
}
function StatusLegend({color,label,value,}: { color: string;label: string;value: string;}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm text-slate-600"> {label}</span>
      </div>
      <span className="text-sm font-bold text-slate-800"> {value} </span>
    </div>
  );
}
function QuickAction({href,icon, title,color}: {href: string;icon: React.ReactNode;title: string;color: "red" | "blue" | "green" | "purple";}) {
  const styles = {
    red: "border-red-100 bg-red-50 text-red-600 hover:bg-red-100",
    blue: "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100",
    green: "border-green-100 bg-green-50 text-green-600 hover:bg-green-100",
    purple: "border-purple-100 bg-purple-50 text-purple-600 hover:bg-purple-100",
  };

  return (
    <Link href={href} className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition ${styles[color]}`}>
      {icon}
      {title}
    </Link>
  );
}