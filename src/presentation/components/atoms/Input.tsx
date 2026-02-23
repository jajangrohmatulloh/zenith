import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = ({ className, error, ...props }: InputProps) => {
    return (
        <div className="w-full flex flex-col gap-1.5">
            <input
                className={cn(
                    'w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:bg-slate-900/50 dark:border-slate-800 dark:text-white',
                    error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500 font-medium px-1">{error}</span>}
        </div>
    );
};
