"use client";

import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useSupabase } from "@/components/providers/SupabaseProvider";

export function Auth() {
  const supabase = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (mode: "login" | "signup") => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: authError } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
    } else if (mode === "signup") {
      setMessage("Account created. Check your email for confirmation if required.");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Habit Tracker</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Sign in to access your minimalist monthly habit system.
      </p>

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />

        {error && <p className="text-sm text-rose-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleAuth("login")}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={16} />
            Login
          </button>
          <button
            type="button"
            onClick={() => handleAuth("signup")}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <UserPlus size={16} />
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
