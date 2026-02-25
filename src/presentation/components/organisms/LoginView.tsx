'use client';

import React, { useState } from 'react';
import { supabase } from '../../../infrastructure/supabase';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, Mountain, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginViewProps {
    onBack?: () => void;
}

export const LoginView = ({ onBack }: LoginViewProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);


    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isResettingPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Password reset link sent! Please check your email.' });
            } else if (isRegistering) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                            full_name: `${firstName} ${lastName}`.trim()
                        }
                    }
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Authentication failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8 relative">
                    {onBack && (
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={onBack}
                            className="absolute left-0 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-white/40 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/80 transition-all cursor-pointer group hover:scale-105"
                            title="Back to App"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </motion.button>
                    )}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold mb-5"
                    >
                        <Mountain className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span>ZENITH</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tight"
                    >
                        {isResettingPassword ? 'Reset Password' : isRegistering ? 'Create Account' : 'Welcome Back'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base"
                    >
                        {isResettingPassword
                            ? "We'll send you a link to recover your account"
                            : isRegistering
                                ? 'Start your journey to peak productivity'
                                : 'Sign in to reach your zenith'
                        }
                    </motion.p>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 rounded-[32px] p-8 shadow-2xl shadow-indigo-500/10 dark:shadow-black/40"
                >
                    <form onSubmit={handleAuth} className="space-y-5">
                        {isRegistering && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                    <Input
                                        type="text"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white focus:border-indigo-500/50 [color-scheme:light] dark:[color-scheme:dark] rounded-2xl h-12"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white focus:border-indigo-500/50 [color-scheme:light] dark:[color-scheme:dark] rounded-2xl h-12"
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <label className="text-xs font-bold uppercase tracking-widest ml-1 text-slate-500 dark:text-slate-400">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center z-10 backdrop-blur-none">
                                    <Mail className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                </div>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 bg-transparent dark:bg-transparent border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white focus:border-indigo-500/50 [color-scheme:light] dark:[color-scheme:dark] rounded-2xl h-12"
                                    required
                                />
                            </div>
                        </motion.div>

                        {!isResettingPassword && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
                                    {!isRegistering && (
                                        <button
                                            type="button"
                                            onClick={() => setIsResettingPassword(true)}
                                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider cursor-pointer"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center z-10 backdrop-blur-none">
                                        <Lock className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-11 bg-transparent dark:bg-transparent border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white focus:border-indigo-500/50 [color-scheme:light] dark:[color-scheme:dark] rounded-2xl h-12"
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                className={`p-3.5 rounded-2xl text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                    }`}
                            >
                                {message.type === 'success' ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <AlertCircle className="w-4 h-4" />
                                )}
                                {message.text}
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 rounded-2xl group transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
                                disabled={loading || (isResettingPassword && !email.trim()) || (isRegistering && (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim())) || (!isResettingPassword && !isRegistering && (!email.trim() || !password.trim()))}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block" />
                                        Processing...
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        {isResettingPassword ? 'Send Reset Link' : isRegistering ? 'Create Account' : 'Sign In'}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mt-6 text-center space-y-2"
                    >
                        {isResettingPassword ? (
                            <button
                                onClick={() => setIsResettingPassword(false)}
                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4 cursor-pointer"
                            >
                                Back to Sign In
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4 block w-full cursor-pointer"
                            >
                                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
