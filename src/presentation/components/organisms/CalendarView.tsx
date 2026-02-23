'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../atoms/Button';
import { useTodo } from '../../context/todo-context';

export const CalendarView = () => {
    const { todos, selectedDate, setSelectedDate } = useTodo();
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = daysInMonth(month, year);
    const offset = firstDayOfMonth(month, year);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDayTodos = (day: number) => {
        const d = new Date(year, month, day).setHours(0, 0, 0, 0);
        return todos.filter(t => t.dueDate && new Date(t.dueDate).setHours(0, 0, 0, 0) === d);
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
            <div className="flex items-center justify-between mb-4">
                <div
                    className="cursor-pointer group"
                    onClick={() => setSelectedDate(null)}
                >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 group-hover:text-indigo-500 transition-colors">
                        <CalendarIcon className="w-5 h-5 text-indigo-500" />
                        {monthNames[month]} {year}
                    </h3>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="icon" onClick={nextMonth}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-400 pb-2">
                        {d}
                    </div>
                ))}

                {Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const dayTodos = getDayTodos(day);
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
                            {dayTodos.length > 0 && !isSelected && (
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
