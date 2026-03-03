'use client';

import { WeekDay } from '../../../core/domain/task.entity';
import { cn } from './Button';

interface WeekDaySelectorProps {
    value: WeekDay[];
    onChange: (days: WeekDay[]) => void;
}

const weekDays: { value: WeekDay; label: string; full: string }[] = [
    { value: 0 as WeekDay, label: 'S', full: 'Sunday' },
    { value: 1 as WeekDay, label: 'M', full: 'Monday' },
    { value: 2 as WeekDay, label: 'T', full: 'Tuesday' },
    { value: 3 as WeekDay, label: 'W', full: 'Wednesday' },
    { value: 4 as WeekDay, label: 'T', full: 'Thursday' },
    { value: 5 as WeekDay, label: 'F', full: 'Friday' },
    { value: 6 as WeekDay, label: 'S', full: 'Saturday' },
];

export const WeekDaySelector = ({ value, onChange }: WeekDaySelectorProps) => {
    const toggleDay = (day: WeekDay) => {
        if (value.includes(day)) {
            onChange(value.filter(d => d !== day));
        } else {
            onChange([...value, day].sort((a, b) => (a as any) - (b as any)));
        }
    };

    return (
        <div className="flex gap-1.5">
            {weekDays.map((day) => {
                const isSelected = value.includes(day.value);
                return (
                    <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        title={day.full}
                        className={cn(
                            "w-9 h-9 rounded-full text-xs font-bold transition-all border-2",
                            isSelected
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                : "bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                        )}
                    >
                        {day.label}
                    </button>
                );
            })}
        </div>
    );
};
