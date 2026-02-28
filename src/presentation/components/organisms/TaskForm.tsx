'use client';

import React, { useState } from 'react';
import { Plus, Clock, Repeat, ListPlus, ChevronDown, ChevronUp, X, Calendar } from 'lucide-react';
import { useTask } from '../../context/task-context';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { TimePicker } from '../atoms/TimePicker';
import { DatePicker } from '../atoms/DatePicker';
import { NumberInput } from '../atoms/NumberInput';
import { WeekDaySelector } from '../atoms/WeekDaySelector';
import { MonthlyRepeatSelector } from '../atoms/MonthlyRepeatSelector';
import { cn } from '../atoms/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskForm = () => {
    const { addTask } = useTask();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('none');
    const [repeatInterval, setRepeatInterval] = useState(1);
    const [repeatEndDate, setRepeatEndDate] = useState('');
    const [repeatWeekDays, setRepeatWeekDays] = useState<number[]>([]);
    const [repeatMonthlyType, setRepeatMonthlyType] = useState<'byDate' | 'byWeekday'>('byDate');
    const [repeatMonthlyDay, setRepeatMonthlyDay] = useState(1);
    const [repeatMonthlyOccurrence, setRepeatMonthlyOccurrence] = useState<number | 'last'>(1);
    const [repeatMonthlyWeekDay, setRepeatMonthlyWeekDay] = useState(0);
    const [subtasks, setSubtasks] = useState<{ id: string; text: string; title: string; completed: boolean; createdAt: number }[]>([]);
    const [newSubtask, setNewSubtask] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!title.trim()) {
            setError('Task title is required');
            return;
        }

        if (title.trim().length > 100) {
            setError('Task title must be less than 100 characters');
            return;
        }

        if (repeatEndDate && date && new Date(repeatEndDate) < new Date(date)) {
            setError('End date cannot be before the start date');
            return;
        }

        if (repeat === 'weekly' && repeatWeekDays.length === 0) {
            setError('Please select at least one day for weekly repeat');
            return;
        }

        const taskDate = date ? new Date(date).getTime() : undefined;
        const repeatEndDateMs = repeatEndDate ? new Date(repeatEndDate).getTime() : undefined;

        addTask(title, {
            description: description.trim() || undefined,
            date: taskDate,
            time: time || undefined,
            repeat,
            repeatInterval: repeat !== 'none' ? repeatInterval : undefined,
            repeatEndDate: repeat !== 'none' ? repeatEndDateMs : undefined,
            repeatWeekDays: repeat === 'weekly' && repeatWeekDays.length > 0 ? repeatWeekDays : undefined,
            repeatMonthlyType: repeat === 'monthly' ? repeatMonthlyType : undefined,
            repeatMonthlyDay: repeat === 'monthly' && repeatMonthlyType === 'byDate' ? repeatMonthlyDay : undefined,
            repeatMonthlyWeekOccurrence: repeat === 'monthly' && repeatMonthlyType === 'byWeekday' ? repeatMonthlyOccurrence : undefined,
            repeatMonthlyWeekDay: repeat === 'monthly' && repeatMonthlyType === 'byWeekday' ? repeatMonthlyWeekDay : undefined,
            repeatYearlyType: repeat === 'yearly' ? 'byDate' : undefined,
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
        setRepeatWeekDays([]);
        setRepeatMonthlyType('byDate');
        setRepeatMonthlyDay(1);
        setRepeatMonthlyOccurrence(1);
        setRepeatMonthlyWeekDay(0);
        setSubtasks([]);
        setIsExpanded(false);
    };

    const addSubtask = () => {
        if (!newSubtask.trim()) {
            setError('Subtask cannot be empty');
            return;
        }
        if (subtasks.length >= 50) {
            setError('Maximum 50 subtasks allowed');
            return;
        }
        setError('');
        setSubtasks([...subtasks, { id: crypto.randomUUID(), text: newSubtask.trim(), title: newSubtask.trim(), completed: false, createdAt: Date.now() }]);
        setNewSubtask('');
    };

    const removeSubtask = (id: string) => {
        setSubtasks(subtasks.filter(s => s.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-indigo-500/5">
            <div className="flex flex-col md:flex-row gap-3 items-start">
                <div className="flex-1 w-full flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-base h-12 rounded-2xl border-slate-200/60 dark:border-slate-700/60"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn("h-12 w-12 rounded-2xl transition-colors cursor-pointer", isExpanded ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "text-slate-400")}
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </Button>
                    <Button type="submit" size="lg" className="h-12 flex-1 md:flex-none px-8 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer">
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
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
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
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                            Date
                                        </label>
                                        <DatePicker
                                            value={date}
                                            onChange={setDate}
                                            className="w-full bg-white/50 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-700/60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                            Time
                                        </label>
                                        <TimePicker
                                            value={time}
                                            onChange={setTime}
                                            className="w-full bg-white/50 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-700/60"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                        Repeat
                                    </label>
                                    <div className="flex gap-2">
                                        {(['none', 'daily', 'weekly', 'monthly', 'yearly'] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setRepeat(type)}
                                                disabled={!date && type !== 'none'}
                                                className={cn(
                                                    "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer",
                                                    repeat === type
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                                                        : "bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-500/50",
                                                    !date && type !== 'none' && "opacity-50 cursor-not-allowed hover:border-slate-200 dark:hover:border-slate-700"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    {!date && (
                                        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">
                                            * Select a date first to enable repeat options
                                        </p>
                                    )}

                                    {repeat !== 'none' && (
                                        <div className="space-y-3 pt-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                    Repeats Every
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <NumberInput
                                                        value={repeatInterval}
                                                        onChange={setRepeatInterval}
                                                        min={1}
                                                        max={999}
                                                    />
                                                    <span className="text-xs text-slate-500 font-medium capitalize">
                                                        {repeat === 'daily' ? 'days' : repeat === 'weekly' ? 'weeks' : repeat === 'monthly' ? 'months' : 'years'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Weekly: Select Days */}
                                            {repeat === 'weekly' && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                        On Days
                                                    </label>
                                                    <WeekDaySelector
                                                        value={repeatWeekDays}
                                                        onChange={setRepeatWeekDays}
                                                    />
                                                </div>
                                            )}

                                            {/* Monthly: By Date or By Weekday */}
                                            {repeat === 'monthly' && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                        Pattern
                                                    </label>
                                                    <MonthlyRepeatSelector
                                                        monthlyType={repeatMonthlyType}
                                                        onTypeChange={setRepeatMonthlyType}
                                                        dayOfMonth={repeatMonthlyDay}
                                                        onDayOfMonthChange={setRepeatMonthlyDay}
                                                        weekOccurrence={repeatMonthlyOccurrence}
                                                        onWeekOccurrenceChange={setRepeatMonthlyOccurrence}
                                                        weekDay={repeatMonthlyWeekDay}
                                                        onWeekDayChange={setRepeatMonthlyWeekDay}
                                                    />
                                                </div>
                                            )}

                                            {/* Yearly */}
                                            {repeat === 'yearly' && (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Repeats every year on the same date as the task date.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                    Ends On (Optional)
                                                </label>
                                                <DatePicker
                                                    value={repeatEndDate}
                                                    onChange={setRepeatEndDate}
                                                    className="w-full"
                                                    minDate={date}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                Subtasks
                            </label>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a subtask..."
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                                    className="text-xs h-10 rounded-xl"
                                />
                                <Button 
                                    type="button" 
                                    size="sm" 
                                    onClick={addSubtask}
                                    disabled={!newSubtask.trim()}
                                    className="rounded-xl px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
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
                                            className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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
