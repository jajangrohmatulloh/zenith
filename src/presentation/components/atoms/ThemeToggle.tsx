'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/theme-context';
import { Button } from './Button';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="secondary"
            size="icon"
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-none shadow-none"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                >
                    {theme === 'light' ? (
                        <Sun className="w-5 h-5 text-amber-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-indigo-400" />
                    )}
                </motion.div>
            </AnimatePresence>
        </Button>

    );
};
