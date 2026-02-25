'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from './Button';

interface YearDropdownProps {
    value: number;
    onChange: (year: number) => void;
    minYear?: number;
    maxYear?: number;
}

export const YearDropdown = ({ value, onChange, minYear = 1900, maxYear = 2099 }: YearDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLButtonElement>(null);

    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

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

    // Auto-scroll to selected year when dropdown opens
    useEffect(() => {
        if (isOpen && selectedRef.current) {
            selectedRef.current.scrollIntoView({
                block: 'center',
                behavior: 'smooth'
            });
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 appearance-none bg-transparent px-2 py-0.5 text-xs font-bold text-slate-900 dark:text-slate-100 transition-all cursor-pointer focus:outline-none hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg"
            >
                {value}
                <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-24 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[9999] overflow-hidden"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgb(148, 163, 184) transparent'
                        }}
                    >
                        <div className="py-1 max-h-48 overflow-y-auto">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    ref={value === year ? selectedRef : null}
                                    type="button"
                                    onClick={() => {
                                        onChange(year);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-between",
                                        value === year
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    {year}
                                    {value === year && <Check className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
