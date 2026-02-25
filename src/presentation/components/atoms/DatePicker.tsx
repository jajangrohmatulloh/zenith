'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { cn } from './Button';
import { MonthDropdown } from './MonthDropdown';
import { YearDropdown } from './YearDropdown';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    className?: string;
    minDate?: string;
}

export const DatePicker = ({ value, onChange, className, minDate }: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const prevMonth = () => {
        setViewDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setViewDate(new Date(year, month + 1, 1));
    };

    const handleDateSelect = (day: number) => {
        // Format date manually to avoid timezone issues
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(formattedDate);
        setIsOpen(false);
    };

    const isSelected = (day: number) => {
        if (!value) return false;
        const selectedDate = new Date(value);
        return selectedDate.getFullYear() === year && 
               selectedDate.getMonth() === month && 
               selectedDate.getDate() === day;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getFullYear() === year && 
               today.getMonth() === month && 
               today.getDate() === day;
    };

    const isDisabled = (day: number) => {
        if (!minDate) return false;
        const selectedDate = new Date(year, month, day);
        const min = new Date(minDate);
        return selectedDate < min;
    };

    // Generate calendar days
    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(
            <button
                key={day}
                type="button"
                onClick={() => handleDateSelect(day)}
                disabled={isDisabled(day)}
                className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                    isSelected(day)
                        ? "bg-indigo-600 text-white"
                        : isToday(day)
                            ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                    isDisabled(day) && "opacity-30 cursor-not-allowed"
                )}
            >
                {day}
            </button>
        );
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return <span className="text-slate-400 dark:text-slate-500">Select date</span>;
        const date = new Date(dateStr);
        return <span className="text-slate-800 dark:text-slate-100">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>;
    };

    return (
        <div className="relative flex items-center" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-medium rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                    "bg-white/50 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-slate-100",
                    "hover:border-indigo-500/50 dark:hover:border-indigo-500/50",
                    className
                )}
            >
                {value ? (
                    <span className="flex-1 text-left">{formatDate(value)}</span>
                ) : (
                    formatDate(value)
                )}
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "")} />
            </button>
            {value && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange('');
                    }}
                    className="absolute right-10 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors z-10"
                >
                    <X className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                    >
                        {/* Header with Month/Year Selectors */}
                        <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all hover:scale-110"
                            >
                                <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </button>
                            <div className="flex items-center gap-2">
                                <MonthDropdown
                                    value={month}
                                    onChange={(newMonth) => setViewDate(new Date(year, newMonth, 1))}
                                />
                                <YearDropdown
                                    value={year}
                                    onChange={(newYear) => setViewDate(new Date(newYear, month, 1))}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all hover:scale-110"
                            >
                                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        {/* Day names */}
                        <div className="grid grid-cols-7 gap-0.5 p-3 pb-2">
                            {dayNames.map((day) => (
                                <div key={day} className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-0.5 p-3 pt-0">
                            {days}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();
                                    const formatted = today.toISOString().split('T')[0];
                                    onChange(formatted);
                                    setIsOpen(false);
                                }}
                                className="w-full py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            >
                                Go to Today
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
