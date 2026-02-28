'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TaskForm } from '../organisms/TaskForm';
import { TaskList } from '../organisms/TaskList';
import { Mountain } from 'lucide-react';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { CalendarView } from '../organisms/CalendarView';
import { ProTip } from '../molecules/ProTip';
import { useAuth } from '@/presentation/context/auth-context';
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import { ProfileSettings } from '../organisms/ProfileSettings';

interface HomeTemplateProps {
    onLoginToggle?: () => void;
}

export const HomeTemplate = ({ onLoginToggle }: HomeTemplateProps) => {
    const { signOut, user } = useAuth();
    const [showProfile, setShowProfile] = React.useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] relative overflow-hidden transition-colors duration-500">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5 pointer-events-none"></div>

            <main className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24">
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/40 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/80 shadow-sm text-slate-600 dark:text-slate-200">
                                <span className="text-xs font-bold">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                            </div>
                            <ThemeToggle />
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className={`p-3 rounded-2xl backdrop-blur-md border border-slate-200/50 dark:border-slate-700/80 transition-all hover:scale-105 cursor-pointer ${showProfile ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/40 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300'}`}
                                title="Settings"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-all hover:scale-105 cursor-pointer"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <ThemeToggle />
                            <button
                                onClick={onLoginToggle}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                <UserIcon className="w-4 h-4" />
                                Sign In
                            </button>
                        </>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-xs font-bold mb-4 backdrop-blur-sm">
                        <Mountain className="w-3 h-3" />
                        <span>ZENITH • TASK MANAGER</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tight mb-4 text-balance">
                        Focus on what <span className="text-indigo-600 dark:text-indigo-400">matters.</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200 text-lg md:text-xl font-medium max-w-2xl mx-auto text-balance">
                        Elevate your daily flow with peak efficiency and surgical precision.
                    </p>

                </motion.div>


                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {showProfile ? (
                        <div className="lg:col-span-12 bg-white/60 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[32px] p-6 md:p-10 shadow-2xl shadow-indigo-500/10 dark:shadow-black/40">
                            <ProfileSettings onBack={() => setShowProfile(false)} />
                        </div>
                    ) : (
                        <>
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <CalendarView />
                                <ProTip />
                            </div>

                            <div className="lg:col-span-8 bg-white/60 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[32px] p-6 md:p-10 shadow-2xl shadow-indigo-500/10 dark:shadow-black/40">
                                <div className="mb-10">
                                    <TaskForm />
                                </div>

                                <TaskList />
                            </div>
                        </>
                    )}
                </motion.div>



                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium"
                >
                    Focus on what matters. Reach your Zenith.
                </motion.footer>


            </main>
        </div>
    );
};
