import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all active:scale-95',
        secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800',
        danger: 'bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95',
        destructive: 'bg-red-600 text-white hover:bg-red-500 shadow-md transition-all active:scale-95',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
        md: 'px-4 py-2 text-sm font-medium rounded-xl',
        lg: 'px-6 py-3 text-base font-semibold rounded-2xl',
        icon: 'p-2 rounded-lg',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
