"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Flame, Target, Trophy } from "lucide-react";
import { getMonthLabel } from "@/lib/date";

type HabitHeaderStats = {
  habitId: string;
  name: string;
  streak: number;
  sevenDay: number;
  progress: number;
};

type DashboardHeaderProps = {
  monthDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  dailyCompliance: number;
  overallStreak: number;
  overallProgress: number;
  totalCompleted: number;
  habitStats: HabitHeaderStats[];
};

export function DashboardHeader({
  monthDate,
  onPreviousMonth,
  onNextMonth,
  dailyCompliance,
  overallStreak,
  overallProgress,
  totalCompleted,
  habitStats,
}: DashboardHeaderProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={onPreviousMonth}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-36 text-center text-sm font-medium text-slate-800 dark:text-slate-100">
            {getMonthLabel(monthDate)}
          </span>
          <button
            type="button"
            onClick={onNextMonth}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
          <Metric label="Daily Compliance" value={`${dailyCompliance}%`} icon={<Target size={16} />} />
          <Metric label="Overall Streak" value={`${overallStreak}d`} icon={<Flame size={16} />} />
          <Metric label="Overall Progress" value={`${overallProgress}%`} icon={<Trophy size={16} />} />
          <Metric label="Tasks Completed" value={`${totalCompleted}`} icon={<Target size={16} />} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-2 rounded-full bg-emerald-500/80"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Overall visual progress for selected month
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {habitStats.map((habit) => (
          <article
            key={habit.habitId}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/80"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{habit.name}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{habit.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-emerald-500/80"
                style={{ width: `${habit.progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Streak: {habit.streak}d</span>
              <span>7D: {habit.sevenDay}/7</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-1 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>
      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
