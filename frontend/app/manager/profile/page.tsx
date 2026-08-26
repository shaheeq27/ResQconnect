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
  Pencil,
  Lock,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  BarChart3 as StatsIcon,
  Monitor,
  Smartphone,
  Moon,
  ChevronRight,
} from "lucide-react";

export default function ManagerProfilePage() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [smsNotifications, setSmsNotifications] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  return (

    <div className="min-h-screen bg-[#f7f9fc]">

      {/* SIDEBAR */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] bg-[#082b63] text-white transition-transform ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >

        <div className="flex h-[90px] items-center border-b border-white/10 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700">
              <ShieldCheck size={27} />
            </div>

            <div>

              <h1 className="text-xl font-bold">
                HelpBridge
              </h1>

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
            icon={<Activity size={20} />}
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
            active
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

              <Bell
                size={23}
                className="text-slate-600"
              />

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


        {/* CONTENT */}

        <div className="p-5 sm:p-8">

          {/* TITLE */}

          <div>

            <h2 className="text-3xl font-bold text-[#12234b]">
              Manager Profile
            </h2>

            <p className="mt-2 text-slate-500">
              View and manage your personal information and account settings.
            </p>

          </div>


          {/* GRID */}

          <div className="mt-7 grid gap-6 xl:grid-cols-2">


            {/* PERSONAL INFORMATION */}

            <section className="rounded-2xl border bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between border-b pb-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <User size={20} />
                  </div>

                  <h3 className="font-bold text-[#12234b]">
                    Personal Information
                  </h3>

                </div>

                <button className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50">
                  <Pencil size={14} />
                  Edit Profile
                </button>

              </div>


              <div className="mt-6 flex flex-col gap-6 sm:flex-row">

                {/* PROFILE IMAGE */}

                <div className="flex justify-center sm:block">

                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-3xl font-bold text-blue-700 ring-4 ring-white shadow">
                    M
                  </div>

                </div>


                {/* DETAILS */}

                <div className="flex-1 space-y-4">

                  <ProfileRow
                    label="Full Name"
                    value="Manager"
                  />

                  <ProfileRow
                    label="Email Address"
                    value="manager@helpbridge.com"
                  />

                  <ProfileRow
                    label="Phone Number"
                    value="+91 98765 43210"
                  />

                  <ProfileRow
                    label="Role"
                    value="HelpBridge Manager"
                  />

                  <ProfileRow
                    label="Employee ID"
                    value="HBM-2026-0001"
                  />

                  <ProfileRow
                    label="Joined Date"
                    value="February 15, 2026"
                  />

                </div>

              </div>

            </section>


            {/* MANAGER STATISTICS */}

            <section className="rounded-2xl border bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between border-b pb-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <StatsIcon size={20} />
                  </div>

                  <h3 className="font-bold text-[#12234b]">
                    Manager Statistics
                  </h3>

                </div>

                <Link
                  href="/manager/reports"
                  className="rounded-lg border border-blue-200 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                >
                  View Analytics
                </Link>

              </div>


              <div className="mt-6 grid grid-cols-2 gap-4">

                <MiniStat
                  value="248"
                  title="Total Requests Managed"
                  subtitle="All time"
                  type="blue"
                />

                <MiniStat
                  value="186"
                  title="Requests Verified"
                  subtitle="All time"
                  type="green"
                />

                <MiniStat
                  value="96"
                  title="Providers Assigned"
                  subtitle="All time"
                  type="purple"
                />

                <MiniStat
                  value="18 min"
                  title="Average Response Time"
                  subtitle="This month"
                  type="orange"
                />

              </div>

            </section>


            {/* SECURITY */}

            <section className="rounded-2xl border bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3 border-b pb-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <ShieldCheck size={20} />
                </div>

                <h3 className="font-bold text-[#12234b]">
                  Security Information
                </h3>

              </div>


              <div className="mt-4 divide-y">

                <SecurityRow
                  icon={<Lock size={18} />}
                  title="Password"
                  description="Your password is securely protected"
                  action="Change Password"
                />

                <SecurityRow
                  icon={<ShieldCheck size={18} />}
                  title="Two-Factor Authentication"
                  description="Extra protection for your account"
                  action="Manage 2FA"
                  status="Enabled"
                />

                <SecurityRow
                  icon={<Monitor size={18} />}
                  title="Login Sessions"
                  description="Devices currently signed in"
                  action="View Sessions"
                  status="3 active sessions"
                />

              </div>

            </section>


            {/* ACCOUNT SETTINGS */}

            <section className="rounded-2xl border bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3 border-b pb-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Settings size={20} />
                </div>

                <h3 className="font-bold text-[#12234b]">
                  Account Settings
                </h3>

              </div>


              <div className="mt-4 divide-y">

                <ToggleRow
                  icon={<Mail size={18} />}
                  title="Email Notifications"
                  description="Receive important updates via email"
                  enabled={emailNotifications}
                  onChange={() =>
                    setEmailNotifications(!emailNotifications)
                  }
                />

                <ToggleRow
                  icon={<Phone size={18} />}
                  title="SMS Notifications"
                  description="Receive important updates via SMS"
                  enabled={smsNotifications}
                  onChange={() =>
                    setSmsNotifications(!smsNotifications)
                  }
                />

                <ToggleRow
                  icon={<Moon size={18} />}
                  title="Dark Mode"
                  description="Enable dark mode for better experience"
                  enabled={darkMode}
                  onChange={() =>
                    setDarkMode(!darkMode)
                  }
                />

              </div>

            </section>

          </div>


          {/* ACTIVE SESSIONS */}

          <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between border-b pb-5">

              <div>

                <h3 className="font-bold text-[#12234b]">
                  Recent Login Activity
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Recent devices used to access your account.
                </p>

              </div>

              <button className="text-sm font-semibold text-blue-600">
                View All
              </button>

            </div>


            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <LoginDevice
                icon={<Monitor size={20} />}
                device="Windows PC"
                location="Hyderabad, India"
                time="Active now"
                current
              />

              <LoginDevice
                icon={<Smartphone size={20} />}
                device="Android Phone"
                location="Hyderabad, India"
                time="2 hours ago"
              />

              <LoginDevice
                icon={<Monitor size={20} />}
                device="Chrome Browser"
                location="Hyderabad, India"
                time="Yesterday"
              />

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* NAV ITEM */

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


/* PROFILE ROW */

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}


/* MINI STAT */

function MiniStat({
  value,
  title,
  subtitle,
  type,
}: {
  value: string;
  title: string;
  subtitle: string;
  type: "blue" | "green" | "purple" | "orange";
}) {

  const styles = {
    blue: "border-blue-100 bg-blue-50",
    green: "border-green-100 bg-green-50",
    purple: "border-purple-100 bg-purple-50",
    orange: "border-orange-100 bg-orange-50",
  };

  return (
    <div className={`rounded-xl border p-5 ${styles[type]}`}>

      <p className="text-2xl font-bold text-[#12234b]">
        {value}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}


/* SECURITY ROW */

function SecurityRow({
  icon,
  title,
  description,
  action,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  status?: string;
}) {

  return (
    <div className="flex items-center justify-between gap-4 py-5">

      <div className="flex items-center gap-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

        <div>

          <p className="text-sm font-bold">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>


      <div className="flex items-center gap-3">

        {status && (
          <span className="hidden rounded-md bg-green-50 px-3 py-1 text-xs font-bold text-green-600 sm:block">
            {status}
          </span>
        )}

        <button className="rounded-lg border px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50">
          {action}
        </button>

      </div>

    </div>
  );
}


/* TOGGLE */

function ToggleRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {

  return (
    <div className="flex items-center justify-between py-5">

      <div className="flex items-center gap-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

        <div>

          <p className="text-sm font-bold">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>


      <button
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-slate-300"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}


/* LOGIN DEVICE */

function LoginDevice({
  icon,
  device,
  location,
  time,
  current = false,
}: {
  icon: React.ReactNode;
  device: string;
  location: string;
  time: string;
  current?: boolean;
}) {

  return (
    <div className="rounded-xl border p-4">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>

          <div>

            <p className="text-sm font-bold">
              {device}
            </p>

            <p className="text-xs text-slate-500">
              {location}
            </p>

          </div>

        </div>

        {current && (
          <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
            Active
          </span>
        )}

      </div>

      <p className="mt-4 text-xs text-slate-500">
        {time}
      </p>

    </div>
  );
}