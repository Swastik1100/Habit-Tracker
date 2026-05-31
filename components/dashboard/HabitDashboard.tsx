"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Moon, Sun } from "lucide-react";
import { Auth } from "@/components/auth/Auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HabitGrid } from "@/components/dashboard/HabitGrid";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import {
  formatDateKey,
  getDaysInMonth,
  getMonthRange,
} from "@/lib/date";
import {
  getDailyCompliance,
  getDailyPoints,
  getHabitCurrentStreak,
  getHabitMonthRate,
  getHabitSevenDayConsistency,
  getOverallStreak,
  getTotalCompletedTasks,
  makeLogKey,
} from "@/lib/metrics";
import type { Habit, HabitLog } from "@/types/habit";

export function HabitDashboard() {
  const supabase = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logMap, setLogMap] = useState<Record<string, boolean>>({});
  const [monthDate, setMonthDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const monthRef = useRef(monthDate);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    monthRef.current = monthDate;
  }, [monthDate]);

  const loadDashboardData = useCallback(
    async (selectedMonth: Date, userId: string) => {
      setError(null);

      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("id,user_id,name,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (habitsError) {
        setError(habitsError.message);
        return;
      }

      const { start, end } = getMonthRange(selectedMonth);

      const { data: logsData, error: logsError } = await supabase
        .from("habit_logs")
        .select("id,habit_id,date,completed")
        .gte("date", start)
        .lte("date", end);

      if (logsError) {
        setError(logsError.message);
        return;
      }

      const mappedLogs = ((logsData ?? []) as HabitLog[]).reduce<Record<string, boolean>>(
        (acc, log) => {
          acc[makeLogKey(log.habit_id, log.date)] = log.completed;
          return acc;
        },
        {},
      );

      setHabits(
        ((habitsData ?? []) as Habit[]).sort((a, b) =>
          a.created_at.localeCompare(b.created_at),
        ),
      );
      setLogMap(mappedLogs);
    },
    [supabase],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);

      if (data.session?.user.id) {
        void loadDashboardData(monthRef.current, data.session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, currentSession) => {
      setSession(currentSession);

      if (!currentSession?.user.id) {
        setHabits([]);
        setLogMap({});
        return;
      }

      void loadDashboardData(monthRef.current, currentSession.user.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadDashboardData, supabase]);

  const dates = useMemo(() => {
    const days = getDaysInMonth(monthDate);

    return Array.from({ length: days }, (_, index) => {
      const day = index + 1;
      return formatDateKey(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
    });
  }, [monthDate]);

  const getCompleted = useCallback(
    (habitId: string, date: string) => Boolean(logMap[makeLogKey(habitId, date)]),
    [logMap],
  );

  const toggleHabit = useCallback(
    async (habitId: string, date: string) => {
      const key = makeLogKey(habitId, date);
      const current = Boolean(logMap[key]);
      const nextValue = !current;

      setLogMap((prev) => ({
        ...prev,
        [key]: nextValue,
      }));

      const { error: upsertError } = await supabase.from("habit_logs").upsert(
        {
          habit_id: habitId,
          date,
          completed: nextValue,
        },
        { onConflict: "habit_id,date" },
      );

      if (upsertError) {
        setLogMap((prev) => ({
          ...prev,
          [key]: current,
        }));
        setError(upsertError.message);
      }
    },
    [logMap, supabase],
  );

  const userId = session?.user.id;

  const addHabit = useCallback(async () => {
    const name = window.prompt("Habit name");
    if (!name?.trim() || !userId) return;

    const { data, error: insertError } = await supabase
      .from("habits")
      .insert({
        name: name.trim(),
        user_id: userId,
      })
      .select("id,user_id,name,created_at")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setHabits((prev) => [...prev, data as Habit]);
  }, [supabase, userId]);

  const today = formatDateKey(new Date());
  const dailyCompliance = useMemo(
    () => getDailyCompliance(habits, logMap, today),
    [habits, logMap, today],
  );

  const overallProgress = useMemo(() => {
    if (!habits.length) return 0;
    const total = habits.reduce(
      (sum, habit) => sum + getHabitMonthRate(habit, logMap, monthDate),
      0,
    );
    return Math.round(total / habits.length);
  }, [habits, logMap, monthDate]);

  const overallStreak = useMemo(
    () => getOverallStreak(habits, logMap, monthDate),
    [habits, logMap, monthDate],
  );

  const totalCompleted = useMemo(
    () => getTotalCompletedTasks(habits, logMap),
    [habits, logMap],
  );

  const chartPoints = useMemo(
    () => getDailyPoints(habits, logMap, monthDate),
    [habits, logMap, monthDate],
  );

  const habitStats = useMemo(
    () =>
      habits.map((habit) => ({
        habitId: habit.id,
        name: habit.name,
        streak: getHabitCurrentStreak(habit, logMap, monthDate),
        sevenDay: getHabitSevenDayConsistency(habit, logMap, monthDate),
        progress: getHabitMonthRate(habit, logMap, monthDate),
      })),
    [habits, logMap, monthDate],
  );

  if (authLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading authentication...</p>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setDarkMode((mode) => !mode)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          {darkMode ? "Light" : "Dark"}
        </button>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>

      <DashboardHeader
        monthDate={monthDate}
        onPreviousMonth={() => {
          const nextMonth = new Date(
            monthDate.getFullYear(),
            monthDate.getMonth() - 1,
            1,
          );
          setMonthDate(nextMonth);
          if (session.user.id) void loadDashboardData(nextMonth, session.user.id);
        }}
        onNextMonth={() => {
          const nextMonth = new Date(
            monthDate.getFullYear(),
            monthDate.getMonth() + 1,
            1,
          );
          setMonthDate(nextMonth);
          if (session.user.id) void loadDashboardData(nextMonth, session.user.id);
        }}
        dailyCompliance={dailyCompliance}
        overallStreak={overallStreak}
        overallProgress={overallProgress}
        totalCompleted={totalCompleted}
        habitStats={habitStats}
      />

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      )}

      <HabitGrid
        habits={habits}
        dates={dates}
        getCompleted={getCompleted}
        onToggle={toggleHabit}
        getHabitRate={(habit) => getHabitMonthRate(habit, logMap, monthDate)}
        getDailyRate={(date) => getDailyCompliance(habits, logMap, date)}
        onAddHabit={addHabit}
      />
      <ProgressChart points={chartPoints} />
    </div>
  );
}
