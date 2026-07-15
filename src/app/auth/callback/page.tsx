'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/infrastructure/supabase';
import { Input } from '@/presentation/components/atoms/Input';
import { Button } from '@/presentation/components/atoms/Button';
import { motion } from 'framer-motion';
import { Mountain, KeyRound, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const errorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

function ResetPasswordCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sessionReady, setSessionReady] = useState(false);

    useEffect(() => {
        const code = searchParams.get('code');
        let isMounted = true;
        let sessionCheckTimer: ReturnType<typeof setTimeout> | undefined;

        const finishWithError = (message: string) => {
            if (!isMounted) return;
            setErrorMsg(message);
            setLoading(false);
        };

        const finishWithSession = () => {
            if (!isMounted) return;
            setSessionReady(true);
            setLoading(false);
        };

        const handleCode = async () => {
            if (code) {
                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                    finishWithSession();
                } catch (error: unknown) {
                    finishWithError(errorMessage(error, 'Failed to establish password recovery session.'));
                }
            }
        };

        handleCode();

        // Listen for PASSWORD_RECOVERY or SIGNED_IN event (for implicit flow or successful PKCE)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
                finishWithSession();
            }
        });

        // Also check initial session as fallback
        const checkInitial = async () => {
            if (!code) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    finishWithSession();
                } else {
                    // Wait a tiny bit for hash parsing to complete
                    sessionCheckTimer = setTimeout(async () => {
                        const { data: { session: delayedSession } } = await supabase.auth.getSession();
                        if (delayedSession) {
                            finishWithSession();
                        } else {
                            finishWithError('No active password reset session found. Please request a new password reset link.');
                        }
                    }, 1500);
                }
            }
        };
        checkInitial();

        return () => {
            isMounted = false;
            if (sessionCheckTimer) clearTimeout(sessionCheckTimer);
            subscription.unsubscribe();
        };
    }, [searchParams]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            // Supabase establishes a short-lived recovery session so the password can
            // be changed. Clear it immediately: resetting a password should not also
            // authenticate the user into the app.
            const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });
            if (signOutError) throw signOutError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error: unknown) {
            setErrorMsg(errorMessage(error, 'Failed to update your password.'));
        } finally {
            setSubmitting(false);
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
                        Reset Password
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base"
                    >
                        Create a secure new password for your account
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 rounded-[32px] p-8 shadow-2xl shadow-indigo-500/10 dark:shadow-black/40"
                >
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                Verifying password reset session...
                            </p>
                        </div>
                    ) : success ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 animate-bounce" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Password Updated!</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                Your password has been successfully reset. Please sign in with your new password.
                            </p>
                            <Button
                                onClick={() => router.push('/')}
                                className="w-full mt-4"
                            >
                                Back to App
                            </Button>
                        </div>
                    ) : errorMsg && !sessionReady ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Session Expired</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                {errorMsg}
                            </p>
                            <Button
                                onClick={() => router.push('/')}
                                className="w-full mt-4"
                            >
                                Back to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {errorMsg && (
                                <div className="p-3.5 rounded-2xl text-sm font-medium flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest ml-1 text-slate-500 dark:text-slate-400">New Password</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center z-10">
                                        <KeyRound className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-11 bg-transparent dark:bg-transparent border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white focus:border-indigo-500/50 [color-scheme:light] dark:[color-scheme:dark] rounded-2xl h-12"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest ml-1 text-slate-500 dark:text-slate-400">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center z-10">
                                        <KeyRound className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-11 bg-transparent dark:bg-transparent border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white focus:border-indigo-500/50 [color-scheme:light] dark:[color-scheme:dark] rounded-2xl h-12"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 rounded-2xl group transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
                                disabled={submitting || !password.trim() || !confirmPassword.trim()}
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block" />
                                        Updating Password...
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Update Password
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ResetPasswordCallback />
        </Suspense>
    );
}
