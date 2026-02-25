'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                        onClick={onCancel}
                    />
                    
                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[9999] overflow-hidden"
                    >
                        {/* Header */}
                        <div className={cn(
                            "flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-700",
                            variant === 'danger' ? "bg-red-50 dark:bg-red-900/20" : "bg-amber-50 dark:bg-amber-900/20"
                        )}>
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                variant === 'danger' ? "bg-red-100 dark:bg-red-900/40" : "bg-amber-100 dark:bg-amber-900/40"
                            )}>
                                <AlertTriangle className={cn(
                                    "w-5 h-5",
                                    variant === 'danger' ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                                )} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex-1">{title}</h3>
                            <button
                                onClick={onCancel}
                                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4">
                            <p className="text-slate-600 dark:text-slate-300">{message}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <Button
                                variant="secondary"
                                onClick={onCancel}
                                className="flex-1 rounded-xl"
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant={variant === 'danger' ? 'destructive' : 'secondary'}
                                onClick={onConfirm}
                                className={cn(
                                    "flex-1 rounded-xl",
                                    variant === 'danger' ? "bg-red-600 hover:bg-red-500 text-white" : ""
                                )}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
