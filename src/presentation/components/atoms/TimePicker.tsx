'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from './Button';

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    className?: string;
}

export const TimePicker = ({ value, onChange, className }: TimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'hours' | 'minutes'>('hours');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [selectedHour, selectedMinute] = value ? value.split(':') : ['00', '00'];
    const hourNum = parseInt(selectedHour, 10);
    const minuteNum = parseInt(selectedMinute, 10);

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

    const handleHourSelect = (hour: number) => {
        const newHour = hour.toString().padStart(2, '0');
        onChange(`${newHour}:${selectedMinute}`);
        setActiveTab('minutes');
    };

    const handleMinuteSelect = (minute: number) => {
        const newMinute = minute.toString().padStart(2, '0');
        onChange(`${selectedHour}:${newMinute}`);
        setIsOpen(false);
    };

    const formatDisplayTime = () => {
        if (!value) return <span className="text-slate-400 dark:text-slate-500">Select time</span>;
        const h = parseInt(selectedHour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return <span className="text-slate-800 dark:text-slate-100">{h12}:{selectedMinute} {ampm}</span>;
    };

    // Generate hours (00-23)
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Generate minutes (00-59)
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div ref={dropdownRef} className="relative w-full">
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
                <div className="flex-1 flex items-center">
                    {value ? (
                        <span className="flex-1 text-left">{formatDisplayTime()}</span>
                    ) : (
                        formatDisplayTime()
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {value && (
                        <div
                            role="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                            }}
                            className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        </div>
                    )}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "")} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-99999 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {hourNum > 12 ? hourNum - 12 : hourNum || 12}:{selectedMinute}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {hourNum >= 12 ? 'PM' : 'AM'}
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => setActiveTab('hours')}
                                className={cn(
                                    "flex-1 py-2.5 text-xs font-bold transition-colors",
                                    activeTab === 'hours'
                                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 cursor-pointer"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                                )}
                            >
                                HOURS
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('minutes')}
                                className={cn(
                                    "flex-1 py-2.5 text-xs font-bold transition-colors",
                                    activeTab === 'minutes'
                                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 cursor-pointer"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                                )}
                            >
                                MINUTES
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            className="p-3 max-h-64 overflow-y-auto"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgb(148, 163, 184) transparent'
                            }}
                        >
                            {activeTab === 'hours' ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {hours.map((hour) => {
                                        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        const isSelected = hourNum === hour;

                                        return (
                                            <button
                                                key={hour}
                                                type="button"
                                                onClick={() => handleHourSelect(hour)}
                                                className={cn(
                                                    "py-2.5 px-3 rounded-xl text-xs font-bold transition-all",
                                                    isSelected
                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 cursor-pointer"
                                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                )}
                                            >
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span>{hour12}</span>
                                                    <span className="text-[9px] font-medium opacity-60">{ampm}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-5 gap-2">
                                    {minutes.map((minute) => {
                                        const isSelected = minuteNum === minute;

                                        return (
                                            <button
                                                key={minute}
                                                type="button"
                                                onClick={() => handleMinuteSelect(minute)}
                                                className={cn(
                                                    "py-2.5 px-3 rounded-xl text-xs font-bold transition-all",
                                                    isSelected
                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 cursor-pointer"
                                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                )}
                                            >
                                                {minute.toString().padStart(2, '0')}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <button
                                type="button"
                                onClick={() => {
                                    const now = new Date();
                                    const h = now.getHours().toString().padStart(2, '0');
                                    const m = now.getMinutes().toString().padStart(2, '0');
                                    onChange(`${h}:${m}`);
                                    setIsOpen(false);
                                }}
                                className="w-full py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors cursor-pointer"
                            >
                                Set to Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
