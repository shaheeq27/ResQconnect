"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { apiRequest } from "../../../lib/api";

export default function AdminSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/admin-setup", {
        method: "POST",
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      setMessage("Administrator created. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600">
          <ArrowLeft size={16} /> Back to login
        </Link>
        <div className="mt-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white"><ShieldCheck size={25} /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Set up administrator</h1>
            <p className="text-sm text-slate-500">This works only for the first administrator account.</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Field label="Full name" value={form.name} onChange={(value) => update("name", value)} />
          <Field label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} />
          <Field label="Phone" type="tel" value={form.phone} onChange={(value) => update("phone", value)} />
          <Field label="Password" type="password" minLength={8} value={form.password} onChange={(value) => update("password", value)} />
          <Field label="Confirm password" type="password" value={form.confirmPassword} onChange={(value) => update("confirmPassword", value)} />
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          <button disabled={loading} type="submit" className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
            {loading ? "Creating administrator..." : "Create administrator"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, type = "text", minLength, value, onChange }: { label: string; type?: string; minLength?: number; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input required minLength={minLength} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
    </label>
  );
}
