import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-3 text-slate-600">Choose your dashboard to continue.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/seeker"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Seeker Dashboard
          </Link>
          <Link
            href="/user/dashboard"
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            User Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}