export interface SubTask {
    id: string;
    text: string;
    title?: string;
    description?: string;
    completed: boolean;
    createdAt?: number;
    date?: number;
    time?: string;
    repeat?: RepeatType;
    repeatInterval?: number;
    repeatEndDate?: number;
}

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday, 1=Monday, etc.
export type MonthlyRepeatType = 'byDate' | 'byWeekday'; // byDate = 15th of month, byWeekday = First Monday
export type WeekOccurrence = 1 | 2 | 3 | 4 | 'last'; // First, Second, Third, Fourth, Last
export type MonthlyDay = number | 'last'; // 1-31 or 'last' for last day of month

export interface Task {
    id: string;
    title: string; // Task title
    description?: string;
    completed: boolean;
    createdAt: number;
    date?: number; // timestamp (date only)
    time?: string; // HH:mm format
    repeat?: RepeatType;
    repeatInterval?: number;
    repeatEndDate?: number;
    repeatWeekDays?: WeekDay[]; // For weekly repeat: which days of week [0,2,4] = Sun,Tue,Thu
    repeatMonthlyType?: MonthlyRepeatType; // For monthly: byDate or byWeekday
    repeatMonthlyDay?: MonthlyDay; // For monthly byDate: which day of month (1-31 or 'last')
    repeatMonthlyWeekOccurrence?: WeekOccurrence; // For monthly byWeekday: which occurrence (1,2,3,4,last)
    repeatMonthlyWeekDay?: WeekDay; // For monthly byWeekday: which weekday (0-6)
    repeatYearlyType?: string; // For yearly: byDate or byWeekday
    repeatYearlyMonth?: number; // For yearly: which month (0-11)
    repeatYearlyDay?: MonthlyDay; // For yearly byDate: which day
    subtasks?: SubTask[];
    userId?: string;
    order?: number; // For custom ordering
}

