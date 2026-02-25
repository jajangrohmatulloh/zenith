import React from 'react';
import { cn } from './Button';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    checked: boolean;
}

export const Checkbox = ({ checked, onChange, className, ...props }: CheckboxProps) => {
    return (
        <div className="relative inline-flex items-center">
            <input
                type="checkbox"
                className={cn(
                    'peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-lg cursor-pointer transition-all checked:bg-indigo-600 checked:border-indigo-600 dark:border-slate-600',
                    className
                )}
                checked={checked}
                onChange={onChange}
                {...props}
            />
            <Check
                className={cn(
                    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none opacity-0 transition-opacity peer-checked:opacity-100'
                )}
            />
        </div>
    );
};
