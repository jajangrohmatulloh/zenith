'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, Zap, Target, Rocket, Star } from 'lucide-react';

const tips = [
    {
        icon: Lightbulb,
        title: 'Quick Edit',
        text: 'Click any task to expand and edit all details inline. Your changes are saved automatically.',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: Zap,
        title: 'Keyboard Shortcuts',
        text: 'Press Enter to quickly add subtasks. Use the date picker to schedule tasks efficiently.',
        color: 'from-yellow-500 to-amber-500',
    },
    {
        icon: Target,
        title: 'Stay Focused',
        text: 'Use filters (All/Active/Completed) to focus on what matters most right now.',
        color: 'from-red-500 to-pink-500',
    },
    {
        icon: Rocket,
        title: 'Boost Productivity',
        text: 'Break big tasks into subtasks. Small wins lead to big accomplishments!',
        color: 'from-indigo-500 to-purple-500',
    },
    {
        icon: Star,
        title: 'Peak Performance',
        text: 'Review completed tasks daily. Celebrate your progress and stay motivated.',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        icon: Sparkles,
        title: 'Zenith Mode',
        text: 'Toggle dark mode for comfortable viewing during late-night productivity sessions.',
        color: 'from-violet-500 to-fuchsia-500',
    },
];

export const ProTip = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % tips.length);
        }, 5000); // Change tip every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const currentTip = tips[currentIndex];
    const Icon = currentTip.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-900/80 dark:to-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-xl shadow-lg shadow-indigo-500/10"
        >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTip.color} opacity-5 dark:opacity-10 transition-opacity duration-500`} />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <motion.div
                        key={currentIndex}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTip.color} flex items-center justify-center shadow-lg`}
                    >
                        <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Pro Tip</h4>
                        <div className="flex items-center gap-1">
                            {tips.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? 'w-6 bg-gradient-to-r ' + currentTip.color
                                            : 'w-1 bg-slate-300 dark:bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tip content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.p
                            key={currentTip.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                        >
                            <span className="font-bold text-slate-900 dark:text-white">{currentTip.title}:</span>{' '}
                            {currentTip.text}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
