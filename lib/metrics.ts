import { formatDateKey, getDaysInMonth } from "@/lib/date";
import type { DailyPoint, Habit } from "@/types/habit";

export type LogMap = Record<string, boolean>;

export const makeLogKey = (habitId: string, date: string) => `${habitId}:${date}`;

export const getHabitMonthRate = (
  habit: Habit,
  logs: LogMap,
  monthDate: Date,
): number => {
  const days = getDaysInMonth(monthDate);
  if (!days) return 0;

  let completed = 0;
  for (let day = 1; day <= days; day += 1) {
    const date = formatDateKey(
      new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
    );
    if (logs[makeLogKey(habit.id, date)]) completed += 1;
  }

  return Math.round((completed / days) * 100);
};

export const getHabitCurrentStreak = (
  habit: Habit,
  logs: LogMap,
  monthDate: Date,
): number => {
  const today = new Date();
  const isSameMonth =
    today.getFullYear() === monthDate.getFullYear() &&
    today.getMonth() === monthDate.getMonth();
  const days = isSameMonth ? today.getDate() : getDaysInMonth(monthDate);

  let streak = 0;
  for (let day = days; day >= 1; day -= 1) {
    const date = formatDateKey(
      new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
    );
    if (logs[makeLogKey(habit.id, date)]) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

export const getHabitSevenDayConsistency = (
  habit: Habit,
  logs: LogMap,
  monthDate: Date,
): number => {
  const endDate = new Date();
  const isSameMonth =
    endDate.getFullYear() === monthDate.getFullYear() &&
    endDate.getMonth() === monthDate.getMonth();

  const anchor = isSameMonth
    ? endDate
    : new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

  let completed = 0;
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(anchor);
    day.setDate(anchor.getDate() - i);

    if (
      day.getFullYear() !== monthDate.getFullYear() ||
      day.getMonth() !== monthDate.getMonth()
    ) {
      continue;
    }

    const date = formatDateKey(day);
    if (logs[makeLogKey(habit.id, date)]) completed += 1;
  }

  return completed;
};

export const getDailyCompliance = (
  habits: Habit[],
  logs: LogMap,
  date: string,
): number => {
  if (!habits.length) return 0;

  const completed = habits.reduce(
    (count, habit) =>
      count + Number(Boolean(logs[makeLogKey(habit.id, date)])),
    0,
  );

  return Math.round((completed / habits.length) * 100);
};

export const getTotalCompletedTasks = (habits: Habit[], logs: LogMap): number => {
  if (!habits.length) return 0;

  return Object.entries(logs).reduce((count, [key, completed]) => {
    if (!completed) return count;

    const habitId = key.split(":")[0];
    const belongsToUserHabit = habits.some((habit) => habit.id === habitId);
    return belongsToUserHabit ? count + 1 : count;
  }, 0);
};

export const getOverallStreak = (
  habits: Habit[],
  logs: LogMap,
  monthDate: Date,
): number => {
  if (!habits.length) return 0;

  const now = new Date();
  const isSameMonth =
    now.getFullYear() === monthDate.getFullYear() &&
    now.getMonth() === monthDate.getMonth();
  const days = isSameMonth ? now.getDate() : getDaysInMonth(monthDate);
  let streak = 0;

  for (let day = days; day >= 1; day -= 1) {
    const date = formatDateKey(
      new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
    );

    const allComplete = habits.every((habit) => logs[makeLogKey(habit.id, date)]);
    if (!allComplete) break;
    streak += 1;
  }

  return streak;
};

export const getDailyPoints = (
  habits: Habit[],
  logs: LogMap,
  monthDate: Date,
): DailyPoint[] => {
  const days = getDaysInMonth(monthDate);

  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const date = formatDateKey(
      new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
    );

    return {
      day,
      percentage: getDailyCompliance(habits, logs, date),
    };
  });
};
