'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/presentation/context/auth-context';
import { supabase } from '@/infrastructure/supabase';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { motion } from 'framer-motion';
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';

interface ProfileSettingsProps {
    onBack: () => void;
}

export const ProfileSettings = ({ onBack }: ProfileSettingsProps) => {
    const { user } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.user_metadata?.first_name || '');
            setLastName(user.user_metadata?.last_name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const updates: any = {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`.trim()
                }
            };

            // Only include email if it changed
            if (email !== user?.email) {
                updates.email = email;
            }

            // Only include password if it's not empty
            if (password) {
                updates.password = password;
            }

            const { error } = await supabase.auth.updateUser(updates);

            if (error) throw error;

            setMessage({
                type: 'success',
                text: email !== user?.email
                    ? 'Profile updated! Please check your new email for a confirmation link.'
                    : 'Profile updated successfully!'
            });
            setPassword(''); // Clear password field after success
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Profile Settings</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage your personal information and security</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-100" strokeWidth={2.5} />
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="pl-12"
                                placeholder="John"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-100" strokeWidth={2.5} />
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="pl-12"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-100" strokeWidth={2.5} />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12"
                            placeholder="name@example.com"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1 italic">* Email changes require confirmation</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">New Password (Optional)</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-100" strokeWidth={2.5} />
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12"
                            placeholder="••••••••"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1 italic">* Leave blank to keep current password</p>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        <span className="text-sm font-medium leading-tight">{message.text}</span>
                    </motion.div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <Button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-2xl shadow-lg shadow-indigo-500/20"
                        disabled={loading}
                    >
                        {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                        <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onBack}
                        className="sm:px-8 rounded-2xl"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};
