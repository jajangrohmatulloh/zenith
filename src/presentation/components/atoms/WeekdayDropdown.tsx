'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from './Button';

interface WeekdayDropdownProps {
    value: number;
    onChange: (value: number) => void;
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

export const WeekdayDropdown = ({ value, onChange }: WeekdayDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const selectedLabel = weekDays.find(d => d.value === value)?.label || '';

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-100 cursor-pointer hover:border-indigo-500/50 transition-all"
            >
                <span className="truncate">{selectedLabel}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpen ? "rotate-180" : "")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-9999 overflow-hidden"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgb(148, 163, 184) transparent'
                        }}
                    >
                        <div className="py-1 max-h-48 overflow-y-auto">
                            {weekDays.map((day) => (
                                <button
                                    key={day.label}
                                    type="button"
                                    onClick={() => {
                                        onChange(day.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-between",
                                        value === day.value
                                            ? "bg-indigo-600 text-white cursor-pointer"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                    )}
                                >
                                    {day.label}
                                    {value === day.value && <Check className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
