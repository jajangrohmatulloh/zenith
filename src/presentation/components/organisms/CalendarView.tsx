'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CircleDot } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../atoms/Button';
import { YearDropdown } from '../atoms/YearDropdown';
import { MonthDropdown } from '../atoms/MonthDropdown';
import { useTask } from '../../context/task-context';
import { isTaskOnDate } from '../../../core/utils/date.utils';

export const CalendarView = () => {
    const { tasks, selectedDate, setSelectedDate } = useTask();
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = daysInMonth(month, year);
    const offset = firstDayOfMonth(month, year);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const goToToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime());
    };

    const getDayTasks = (day: number) => {
        const d = new Date(year, month, day).setHours(0, 0, 0, 0);
        return tasks.filter(t => isTaskOnDate(t, d));
    };

    const handleDateClick = (day: number) => {
        const d = new Date(year, month, day).setHours(0, 0, 0, 0);
        if (selectedDate === d) {
            setSelectedDate(null);
        } else {
            setSelectedDate(d);
        }
    };


    return (
        <div className="flex flex-col gap-4 bg-white/40 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/5">
            <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-1 mb-4 relative z-50">
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setSelectedDate(null)}
                        className="p-1.5 -ml-1 rounded-lg text-indigo-500 dark:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Reset Filter"
                    >
                        <CalendarIcon className="w-4 h-4" />
                    </button>

                    <div className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-0.5 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                        <MonthDropdown
                            value={month}
                            onChange={(newMonth) => setCurrentDate(new Date(year, newMonth, 1))}
                        />
                        <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-0.5"></div>
                        <YearDropdown
                            value={year}
                            onChange={(newYear) => setCurrentDate(new Date(newYear, month, 1))}
                            minYear={1900}
                            maxYear={2099}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={goToToday}
                        className="flex items-center gap-1.5 px-2 py-1 h-7 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border-none shrink-0 cursor-pointer"
                    >
                        <CircleDot className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Today</span>
                    </Button>
                    <div className="flex items-center gap-0.5">
                        <Button variant="secondary" size="icon" onClick={prevMonth} className="h-7 w-7 rounded-lg cursor-pointer">
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="secondary" size="icon" onClick={nextMonth} className="h-7 w-7 rounded-lg cursor-pointer">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-100 pb-2">
                        {d}
                    </div>
                ))}

                {Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const dayTasks = getDayTasks(day);
                    const timestamp = new Date(year, month, day).setHours(0, 0, 0, 0);
                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                    const isSelected = selectedDate === timestamp;

                    return (
                        <div
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={cn(
                                'aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all relative cursor-pointer',
                                isSelected
                                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg'
                                    : isToday
                                        ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                            )}
                        >
                            {day}
                            {dayTasks.length > 0 && !isSelected && (
                                <span className={cn(
                                    'absolute bottom-1 w-1 h-1 rounded-full',
                                    isToday ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-indigo-400'
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
