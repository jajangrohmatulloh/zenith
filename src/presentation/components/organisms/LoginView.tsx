'use client';

import React, { useState } from 'react';
import { supabase } from '../../../infrastructure/supabase';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8 relative">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            title="Back to App"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/20 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 text-slate-100" strokeWidth={2.5} />
                        <span>ZENITH</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        {isResettingPassword ? 'Reset Password' : isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-400 font-medium">
                        {isResettingPassword
                            ? "We'll send you a link to recover your account"
                            : isRegistering
                                ? 'Start your journey to peak productivity'
                                : 'Sign in to reach your zenith'
                        }
                    </p>
                </div>


                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleAuth} className="space-y-4">
                        {isRegistering && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                    <Input
                                        type="text"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="bg-slate-800/50 border-slate-700/50 text-white focus:border-indigo-500/50"
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
                                        className="bg-slate-800/50 border-slate-700/50 text-white focus:border-indigo-500/50"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest ml-1 text-white">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-100 z-10" strokeWidth={2.5} />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 bg-slate-800/50 border-slate-700/50 text-white focus:border-indigo-500/50"
                                    required
                                />
                            </div>
                        </div>

                        {!isResettingPassword && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white">Password</label>
                                    {!isRegistering && (
                                        <button
                                            type="button"
                                            onClick={() => setIsResettingPassword(true)}
                                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-100 z-10" strokeWidth={2.5} />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 bg-slate-800/50 border-slate-700/50 text-white focus:border-indigo-500/50"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}
                            >
                                {message.text}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl group transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : isResettingPassword ? 'Send Reset Link' : isRegistering ? 'Sign Up' : 'Sign In'}
                            {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        {isResettingPassword ? (
                            <button
                                onClick={() => setIsResettingPassword(false)}
                                className="text-sm text-slate-400 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4"
                            >
                                Back to Sign In
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-sm text-slate-400 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4 block w-full"
                            >
                                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
