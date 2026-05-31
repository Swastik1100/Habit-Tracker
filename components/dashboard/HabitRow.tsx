"use client";

import type { Habit } from "@/types/habit";

type HabitRowProps = {
  habit: Habit;
  dates: string[];
  completionRate: number;
  getCompleted: (habitId: string, date: string) => boolean;
  onToggle: (habitId: string, date: string) => void;
};

export function HabitRow({
  habit,
  dates,
  completionRate,
  getCompleted,
  onToggle,
}: HabitRowProps) {
  return (
    <div className="grid min-w-max grid-cols-[220px_repeat(var(--days),28px)_70px] items-center gap-2 border-b border-slate-100 px-2 py-2 last:border-b-0 dark:border-slate-800">
      <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{habit.name}</span>

      {dates.map((date) => {
        const completed = getCompleted(habit.id, date);

        return (
          <button
            key={date}
            type="button"
            aria-label={`Toggle ${habit.name} on ${date}`}
            onClick={() => onToggle(habit.id, date)}
            className={`h-6 w-6 rounded-md border transition ${
              completed
                ? "border-emerald-600/50 bg-emerald-500"
                : "border-slate-200 bg-slate-100 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            }`}
          />
        );
      })}

      <span className="text-right text-xs font-medium text-slate-500 dark:text-slate-400">{completionRate}%</span>
    </div>
  );
}
