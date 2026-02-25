'use client';

import React from 'react';
import { cn } from './Button';

interface MonthlyRepeatSelectorProps {
    monthlyType: 'byDate' | 'byWeekday';
    onTypeChange: (type: 'byDate' | 'byWeekday') => void;
    dayOfMonth: number | 'last';
    onDayOfMonthChange: (day: number | 'last') => void;
    weekOccurrence: number | 'last';
    onWeekOccurrenceChange: (occurrence: number | 'last') => void;
    weekDay: number;
    onWeekDayChange: (day: number) => void;
}

const weekDays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
];

const occurrences = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
    { value: 4, label: 'Fourth' },
    { value: 'last', label: 'Last' },
];

export const MonthlyRepeatSelector = ({
    monthlyType,
    onTypeChange,
    dayOfMonth,
    onDayOfMonthChange,
    weekOccurrence,
    onWeekOccurrenceChange,
    weekDay,
    onWeekDayChange,
}: MonthlyRepeatSelectorProps) => {
    return (
        <div className="space-y-3">
            {/* Type Selector */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => onTypeChange('byDate')}
                    className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold transition-all border",
                        monthlyType === 'byDate'
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-500/50"
                    )}
                >
                    By Date
                </button>
                <button
                    type="button"
                    onClick={() => onTypeChange('byWeekday')}
                    className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold transition-all border",
                        monthlyType === 'byWeekday'
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-500/50"
                    )}
                >
                    By Weekday
                </button>
            </div>

            {/* By Date Option */}
            {monthlyType === 'byDate' && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Day</span>
                    <select
                        value={dayOfMonth}
                        onChange={(e) => onDayOfMonthChange(e.target.value === 'last' ? 'last' : parseInt(e.target.value, 10))}
                        className="flex-1 bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>
                                Day {day}
                            </option>
                        ))}
                        <option value="last">Last day of month</option>
                    </select>
                </div>
            )}

            {/* By Weekday Option */}
            {monthlyType === 'byWeekday' && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Occurrence</span>
                        <select
                            value={weekOccurrence}
                            onChange={(e) => onWeekOccurrenceChange(e.target.value === 'last' ? 'last' : parseInt(e.target.value, 10))}
                            className="flex-1 bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                        >
                            {occurrences.map((occ) => (
                                <option key={occ.label} value={occ.value}>
                                    {occ.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Weekday</span>
                        <select
                            value={weekDay}
                            onChange={(e) => onWeekDayChange(parseInt(e.target.value, 10))}
                            className="flex-1 bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                        >
                            {weekDays.map((day) => (
                                <option key={day.label} value={day.value}>
                                    {day.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};
