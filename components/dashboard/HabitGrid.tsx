"use client";

import type { CSSProperties } from "react";
import { Plus } from "lucide-react";
import { HabitRow } from "@/components/dashboard/HabitRow";
import type { Habit } from "@/types/habit";

type HabitGridProps = {
  habits: Habit[];
  dates: string[];
  getCompleted: (habitId: string, date: string) => boolean;
  getHabitRate: (habit: Habit) => number;
  getDailyRate: (date: string) => number;
  onToggle: (habitId: string, date: string) => void;
  onAddHabit: () => void;
};

export function HabitGrid({
  habits,
  dates,
  getCompleted,
  getHabitRate,
  getDailyRate,
  onToggle,
  onAddHabit,
}: HabitGridProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 overflow-x-auto">
        <div className="min-w-max" style={{ "--days": dates.length } as CSSProperties}>
          <div className="grid grid-cols-[220px_repeat(var(--days),28px)_70px] items-center gap-2 border-b border-slate-200 px-2 pb-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <button
              type="button"
              onClick={onAddHabit}
              className="inline-flex w-fit items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Plus size={14} />
              Add Habit
            </button>
            {dates.map((date, index) => (
              <span key={date} className="text-center">
                {index + 1}
              </span>
            ))}
            <span className="text-right">Rate</span>
          </div>

          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              dates={dates}
              getCompleted={getCompleted}
              onToggle={onToggle}
              completionRate={getHabitRate(habit)}
            />
          ))}

          <div className="mt-2 grid grid-cols-[220px_repeat(var(--days),28px)_70px] items-center gap-2 px-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-200">Daily Completion Rate</span>
            {dates.map((date) => (
              <span key={date} className="text-center font-medium text-slate-600 dark:text-slate-300">
                {getDailyRate(date)}%
              </span>
            ))}
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
