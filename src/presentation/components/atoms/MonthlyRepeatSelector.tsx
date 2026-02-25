'use client';

import React from 'react';
import { cn } from './Button';
import { OccurrenceDropdown } from './OccurrenceDropdown';
import { WeekdayDropdown } from './WeekdayDropdown';
import { DayOfMonthDropdown } from './DayOfMonthDropdown';

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
                    <DayOfMonthDropdown
                        value={dayOfMonth}
                        onChange={onDayOfMonthChange}
                    />
                </div>
            )}

            {/* By Weekday Option */}
            {monthlyType === 'byWeekday' && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Occurrence</span>
                        <OccurrenceDropdown
                            value={weekOccurrence}
                            onChange={onWeekOccurrenceChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Weekday</span>
                        <WeekdayDropdown
                            value={weekDay}
                            onChange={onWeekDayChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
