'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from './Button';

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    className?: string;
}

export const NumberInput = ({ value, onChange, min = 1, max = 999, className }: NumberInputProps) => {
    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            onChange(Math.min(max, Math.max(min, newValue)));
        }
    };

    return (
        <div className={cn("inline-flex items-center gap-1", className)}>
            <button
                type="button"
                onClick={handleDecrement}
                disabled={value <= min}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
                <Minus className="w-4 h-4" />
            </button>
            <input
                type="number"
                value={value}
                onChange={handleInputChange}
                min={min}
                max={max}
                className="w-12 h-8 text-center text-sm font-semibold bg-transparent border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
                type="button"
                onClick={handleIncrement}
                disabled={value >= max}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
};
