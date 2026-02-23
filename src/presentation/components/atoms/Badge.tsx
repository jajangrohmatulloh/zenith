import React from 'react';
import { cn } from './Button';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning';
}

export const Badge = ({ children, variant = 'primary' }: BadgeProps) => {
    const variants = {
        primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    };

    return (
        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', variants[variant])}>
            {children}
        </span>
    );
};
