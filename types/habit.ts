export type Habit = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type HabitLog = {
  id: number;
  habit_id: string;
  date: string;
  completed: boolean;
};

export type DailyPoint = {
  day: number;
  percentage: number;
};
