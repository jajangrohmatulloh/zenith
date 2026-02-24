'use client';

import React, { useState } from 'react';
import { Plus, Sparkles, Clock, Repeat, ListPlus, ChevronDown, ChevronUp, X, Calendar } from 'lucide-react';
import { useTodo } from '../../context/todo-context';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { cn } from '../atoms/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const TodoForm = () => {
    const { addTodo } = useTodo();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
    const [repeatInterval, setRepeatInterval] = useState(1);
    const [repeatEndDate, setRepeatEndDate] = useState('');
    const [subtasks, setSubtasks] = useState<{ id: string; text: string; title: string; completed: boolean; createdAt: number }[]>([]);
    const [newSubtask, setNewSubtask] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            const dueDate = date ? new Date(date).getTime() : undefined;
            const repeatEndDateMs = repeatEndDate ? new Date(repeatEndDate).getTime() : undefined;

            addTodo(title, {
                description: description.trim() || undefined,
                dueDate,
                dueTime: time || undefined,
                repeat,
                repeatInterval: repeat !== 'none' ? repeatInterval : undefined,
                repeatEndDate: repeat !== 'none' ? repeatEndDateMs : undefined,
                subtasks: subtasks.length > 0 ? subtasks : undefined,
            });
            // Reset state
            setTitle('');
            setDescription('');
            setDate('');
            setTime('');
            setRepeat('none');
            setRepeatInterval(1);
            setRepeatEndDate('');
            setSubtasks([]);
            setIsExpanded(false);
        }
    };

    const addSubtask = () => {
        if (newSubtask.trim()) {
            setSubtasks([...subtasks, { id: crypto.randomUUID(), text: newSubtask.trim(), title: newSubtask.trim(), completed: false, createdAt: Date.now() }]);
            setNewSubtask('');
        }
    };

    const removeSubtask = (id: string) => {
        setSubtasks(subtasks.filter(s => s.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-indigo-500/5">
            <div className="flex flex-col md:flex-row gap-3 items-start">
                <div className="flex-1 w-full flex gap-2">
                    <div className="relative flex-1">
                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={2.5} />
                        <Input
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-base pl-12 h-12 rounded-2xl border-slate-200/60 dark:border-slate-700/60"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn("h-12 w-12 rounded-2xl transition-colors", isExpanded ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "text-slate-400")}
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </Button>
                    <Button type="submit" size="lg" className="h-12 flex-1 md:flex-none px-8 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                        <Plus className="w-5 h-5 mr-2" />
                        Zenith Jump
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                <textarea
                                    placeholder="Add more details..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full min-h-[100px] bg-white/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                                            <Calendar className="w-2.5 h-2.5" /> Date
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-white/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                                            <Clock className="w-2.5 h-2.5" /> Time
                                        </label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full bg-white/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                                        <Repeat className="w-2.5 h-2.5" /> Repeat
                                    </label>
                                    <div className="flex gap-2">
                                        {(['none', 'daily', 'weekly', 'monthly'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setRepeat(type)}
                                                className={cn(
                                                    "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                    repeat === type
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                                                        : "bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-500/50"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    {repeat !== 'none' && (
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                                                    Repeats Every
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={repeatInterval}
                                                        onChange={(e) => setRepeatInterval(Math.max(1, parseInt(e.target.value) || 1))}
                                                        className="w-20 bg-white/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    />
                                                    <span className="text-xs text-slate-500 font-medium capitalize">
                                                        {repeat === 'daily' ? 'days' : repeat === 'weekly' ? 'weeks' : 'months'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                                                    Ends On (Optional)
                                                </label>
                                                <input
                                                    type="date"
                                                    value={repeatEndDate}
                                                    onChange={(e) => setRepeatEndDate(e.target.value)}
                                                    min={date} // Suggest ending after starting
                                                    className="w-full bg-white/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                                <ListPlus className="w-3 h-3" /> Subtasks
                            </label>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a subtask..."
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                                    className="text-xs h-10 rounded-xl"
                                />
                                <Button type="button" size="sm" onClick={addSubtask} className="rounded-xl px-4">
                                    Add
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {subtasks.map((st) => (
                                    <div
                                        key={st.id}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 group"
                                    >
                                        <span>{st.text}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSubtask(st.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
};
