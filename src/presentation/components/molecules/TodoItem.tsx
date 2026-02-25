'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Check, X, Clock, Repeat, ListPlus, ChevronDown, ChevronUp, Calendar, GripVertical, Plus } from 'lucide-react';
import { Todo, SubTask, RepeatType } from '../../../core/domain/todo.entity';
import { useTodo } from '../../context/todo-context';
import { Checkbox } from '../atoms/Checkbox';
import { Button } from '../atoms/Button';
import { TimePicker } from '../atoms/TimePicker';
import { DatePicker } from '../atoms/DatePicker';
import { NumberInput } from '../atoms/NumberInput';
import { WeekDaySelector } from '../atoms/WeekDaySelector';
import { MonthlyRepeatSelector } from '../atoms/MonthlyRepeatSelector';
import { ConfirmDialog } from '../atoms/ConfirmDialog';
import { cn } from '../atoms/Button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItemProps {
    todo: Todo | SubTask;
    isSubtask?: boolean;
    onToggleOverride?: (id: string) => void;
    onUpdateOverride?: (id: string, updates: Partial<Todo | SubTask>) => void;
    onDeleteOverride?: (id: string) => void;
    isDraggable?: boolean;
}

export const TodoItem = ({ todo, isSubtask, onToggleOverride, onUpdateOverride, onDeleteOverride, isDraggable = false }: TodoItemProps) => {
    const { toggleTodo, deleteTodo, updateTodo } = useTodo();
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editText, setEditText] = useState(todo.title || todo.text);
    const [editDesc, setEditDesc] = useState(todo.description || '');
    const [editDate, setEditDate] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
    const [editTime, setEditTime] = useState(todo.dueTime || '');
    const [editRepeat, setEditRepeat] = useState<RepeatType>(todo.repeat || 'none');
    const [editRepeatInterval, setEditRepeatInterval] = useState(todo.repeatInterval || 1);
    const [editRepeatEndDate, setEditRepeatEndDate] = useState(todo.repeatEndDate ? new Date(todo.repeatEndDate).toISOString().split('T')[0] : '');
    const [editRepeatWeekDays, setEditRepeatWeekDays] = useState<number[]>(todo.repeatWeekDays || []);
    const [editRepeatMonthlyType, setEditRepeatMonthlyType] = useState<'byDate' | 'byWeekday'>(todo.repeatMonthlyType || 'byDate');
    const [editRepeatMonthlyDay, setEditRepeatMonthlyDay] = useState(todo.repeatMonthlyDay || 1);
    const [editRepeatMonthlyOccurrence, setEditRepeatMonthlyOccurrence] = useState<number | 'last'>(todo.repeatMonthlyWeekOccurrence || 1);
    const [editRepeatMonthlyWeekDay, setEditRepeatMonthlyWeekDay] = useState<number>(todo.repeatMonthlyWeekDay || 0);
    const [newSubtask, setNewSubtask] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: todo.id, 
        disabled: !isDraggable,
        animation: 150,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    const handleEditStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditText(todo.title || todo.text);
        setEditDesc(todo.description || '');
        setEditDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
        setEditTime(todo.dueTime || '');
        setEditRepeat(todo.repeat || 'none');
        setEditRepeatInterval(todo.repeatInterval || 1);
        setEditRepeatEndDate(todo.repeatEndDate ? new Date(todo.repeatEndDate).toISOString().split('T')[0] : '');
        setIsEditing(true);
        setIsExpanded(true);
    };

    const doToggle = () => {
        if (onToggleOverride) onToggleOverride(todo.id);
        else toggleTodo(todo.id);
    };

    const doDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (onDeleteOverride) {
            onDeleteOverride(todo.id);
        } else {
            deleteTodo(todo.id);
        }
        setShowDeleteConfirm(false);
    };

    const doUpdate = (updates: Partial<Todo | SubTask>) => {
        if (onUpdateOverride) onUpdateOverride(todo.id, updates);
        else updateTodo(todo.id, updates as Partial<Todo>);
    };

    const handleUpdate = () => {
        if (editText.trim()) {
            const dueDate = editDate ? new Date(editDate).getTime() : undefined;
            const repeatEndDateMs = editRepeatEndDate ? new Date(editRepeatEndDate).getTime() : undefined;
            doUpdate({
                title: editText.trim(),
                text: editText.trim(),
                description: editDesc.trim() || undefined,
                dueDate,
                dueTime: editTime || undefined,
                repeat: editRepeat,
                repeatInterval: editRepeat !== 'none' ? editRepeatInterval : undefined,
                repeatEndDate: editRepeat !== 'none' ? repeatEndDateMs : undefined,
                repeatWeekDays: editRepeat === 'weekly' && editRepeatWeekDays.length > 0 ? editRepeatWeekDays : undefined,
                repeatMonthlyType: editRepeat === 'monthly' ? editRepeatMonthlyType : undefined,
                repeatMonthlyDay: editRepeat === 'monthly' && editRepeatMonthlyType === 'byDate' ? editRepeatMonthlyDay : undefined,
                repeatMonthlyWeekOccurrence: editRepeat === 'monthly' && editRepeatMonthlyType === 'byWeekday' ? editRepeatMonthlyOccurrence : undefined,
                repeatMonthlyWeekDay: editRepeat === 'monthly' && editRepeatMonthlyType === 'byWeekday' ? editRepeatMonthlyWeekDay : undefined,
                repeatYearlyType: editRepeat === 'yearly' ? 'byDate' : undefined,
            });
            setIsEditing(false);
        }
    };

    const toggleSubtask = (subtaskId: string) => {
        if (isSubtask) return; // Paranoia check
        const parentTodo = todo as Todo;
        const updatedSubtasks = parentTodo.subtasks?.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        doUpdate({ subtasks: updatedSubtasks } as Partial<Todo>);
    };

    const handleSubtaskToggle = () => {
        if (isSubtask && onToggleOverride) {
            onToggleOverride(todo.id);
        } else {
            doToggle();
        }
    };

    const parentTodo = todo as Todo;
    const subtaskProgress = parentTodo.subtasks?.length
        ? Math.round((parentTodo.subtasks.filter(s => s.completed).length / parentTodo.subtasks.length) * 100)
        : 0;

    const formattedDate = todo.dueDate
        ? new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : null;

    const todoContent = (
        <motion.div
            ref={isDraggable ? setNodeRef : undefined}
            style={isDraggable ? style : undefined}
            layout
            layoutId={todo.id}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{
                opacity: isDragging ? 0 : 1,
                scale: 1,
                y: 0,
            }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
                layout: { duration: 0.15, ease: 'easeInOut' },
                opacity: { duration: 0.15 },
                scale: { duration: 0.15 },
            }}
            className={cn(
                'group flex flex-col gap-0 p-1.5 rounded-[28px] border transition-all duration-300',
                isExpanded ? 'bg-white/60 dark:bg-slate-900/60 shadow-xl border-indigo-200/50 dark:border-indigo-900/30 backdrop-blur-xl' : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-slate-900/80 backdrop-blur-md',
                todo.completed && !isExpanded ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/20 grayscale-[0.2]' : 'opacity-100',
                isDragging ? 'z-40' : 'z-auto'
            )}
        >
            <div className="flex items-center gap-3 p-3.5 px-4">
                <div className="flex items-center gap-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className={cn(
                            'cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 transition-opacity -ml-2',
                            isDraggable ? 'opacity-100 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
                        )}
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>
                    <Checkbox 
                        checked={todo.completed} 
                        onChange={() => handleSubtaskToggle()} 
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    {isEditing ? (
                        <div className="relative z-10" onClick={e => e.stopPropagation()}>
                            <input
                                autoFocus
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 rounded-lg px-3 py-1.5 outline-none text-base font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                            />
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <span
                                className={cn(
                                    'block text-lg font-semibold transition-all duration-300 pr-4',
                                    todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                                )}
                            >
                                {todo.title || todo.text}
                            </span>
                            {!isExpanded && todo.description && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 max-w-[80%] leading-relaxed">
                                    {todo.description}
                                </p>
                            )}
                            {!isExpanded && (formattedDate || todo.dueTime || (todo.repeat && todo.repeat !== 'none') || (!isSubtask && parentTodo.subtasks && parentTodo.subtasks.length > 0)) && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    {formattedDate && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[9px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                                            <Calendar className="w-3 h-3" />
                                            {formattedDate}
                                        </div>
                                    )}
                                    {todo.dueTime && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/30">
                                            <Clock className="w-3 h-3" />
                                            {todo.dueTime}
                                        </div>
                                    )}
                                    {todo.repeat && todo.repeat !== 'none' && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                                            <Repeat className="w-3 h-3" />
                                            <span className="capitalize">
                                                {todo.repeatInterval && todo.repeatInterval > 1 ? `Every ${todo.repeatInterval} ${todo.repeat === 'daily' ? 'days' : todo.repeat === 'weekly' ? 'weeks' : 'months'}` : todo.repeat}
                                                {todo.repeat === 'weekly' && todo.repeatWeekDays && todo.repeatWeekDays.length > 0 && (
                                                    <span className="ml-0.5">{todo.repeatWeekDays.map(d => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]).join('')}</span>
                                                )}
                                                {todo.repeat === 'monthly' && todo.repeatMonthlyType === 'byWeekday' && todo.repeatMonthlyWeekOccurrence && todo.repeatMonthlyWeekDay !== undefined && (
                                                    <span className="ml-0.5">{['1st', '2nd', '3rd', '4th', 'Last'][todo.repeatMonthlyWeekOccurrence === 'last' ? 4 : todo.repeatMonthlyWeekOccurrence - 1]}{['S', 'M', 'T', 'W', 'T', 'F', 'S'][todo.repeatMonthlyWeekDay]}</span>
                                                )}
                                                {todo.repeat === 'monthly' && todo.repeatMonthlyType === 'byDate' && todo.repeatMonthlyDay && (
                                                    <span className="ml-0.5">{todo.repeatMonthlyDay === 'last' ? 'Last' : `D${todo.repeatMonthlyDay}`}</span>
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {!isSubtask && parentTodo.subtasks && parentTodo.subtasks.length > 0 && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-[9px] font-bold text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30">
                                            <ListPlus className="w-3 h-3" />
                                            {parentTodo.subtasks.filter(s => s.completed).length}/{parentTodo.subtasks.length}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-100 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className={cn("h-8 w-8 rounded-xl transition-all cursor-pointer", isExpanded ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" : "hover:bg-slate-100 dark:hover:bg-slate-700/50")}
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        {!isEditing && (
                            <Button size="icon" variant="ghost" onClick={handleEditStart} className="h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 hover:text-indigo-500 cursor-pointer">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                doDelete();
                            }}
                            className="h-8 w-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-2 space-y-6">

                            {/* Editor or Display Description */}
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Description</h4>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <textarea
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-200 resize-none outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-inner"
                                            value={editDesc}
                                            placeholder="Add more details about this task..."
                                            onChange={(e) => setEditDesc(e.target.value)}
                                            rows={2}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                    Date
                                                </label>
                                                <DatePicker
                                                    value={editDate}
                                                    onChange={setEditDate}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                    Time
                                                </label>
                                                <TimePicker
                                                    value={editTime}
                                                    onChange={setEditTime}
                                                    className="w-full"
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
                                                        onClick={(e) => { e.preventDefault(); setEditRepeat(type); }}
                                                        className={cn(
                                                            "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer",
                                                            editRepeat === type
                                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                                                                : "bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-500/50",
                                                            !editDate && type !== 'none' && "opacity-50 cursor-not-allowed hover:border-slate-200 dark:hover:border-slate-700"
                                                        )}
                                                        disabled={!editDate && type !== 'none'}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                            {!editDate && (
                                                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">
                                                    * Select a date first to enable repeat options
                                                </p>
                                            )}
                                            {editRepeat !== 'none' && (
                                                <div className="space-y-3 pt-2">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                            Repeats Every
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <NumberInput
                                                                value={editRepeatInterval}
                                                                onChange={setEditRepeatInterval}
                                                                min={1}
                                                                max={999}
                                                            />
                                                            <span className="text-xs text-slate-500 font-medium capitalize">
                                                                {editRepeat === 'daily' ? 'days' : editRepeat === 'weekly' ? 'weeks' : editRepeat === 'monthly' ? 'months' : editRepeat === 'yearly' ? 'years' : 'days'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Weekly: Select Days */}
                                                    {editRepeat === 'weekly' && (
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                                On Days
                                                            </label>
                                                            <WeekDaySelector
                                                                value={editRepeatWeekDays}
                                                                onChange={setEditRepeatWeekDays}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Monthly: By Date or By Weekday */}
                                                    {editRepeat === 'monthly' && (
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                                                Repeat On
                                                            </label>
                                                            <MonthlyRepeatSelector
                                                                monthlyType={editRepeatMonthlyType}
                                                                onTypeChange={setEditRepeatMonthlyType}
                                                                dayOfMonth={editRepeatMonthlyDay}
                                                                onDayOfMonthChange={setEditRepeatMonthlyDay}
                                                                weekOccurrence={editRepeatMonthlyOccurrence}
                                                                onWeekOccurrenceChange={setEditRepeatMonthlyOccurrence}
                                                                weekDay={editRepeatMonthlyWeekDay}
                                                                onWeekDayChange={setEditRepeatMonthlyWeekDay}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Yearly */}
                                                    {editRepeat === 'yearly' && (
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
                                                            value={editRepeatEndDate}
                                                            onChange={setEditRepeatEndDate}
                                                            className="w-full"
                                                            minDate={editDate}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Editor Actions */}
                                            {isEditing && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60"
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => setIsEditing(false)}
                                                        className="rounded-xl px-4 h-10 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleUpdate}
                                                        disabled={!editText.trim()}
                                                        className="rounded-xl px-6 h-10 shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                                    >
                                                        <Check className="w-4 h-4 mr-2" /> Save Details
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    todo.description ? (
                                        <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {todo.description}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs italic text-slate-400 dark:text-slate-500 px-2">No description provided.</p>
                                    )
                                )}
                            </div>

                            {/* Info Badges (Moved to expanded view) */}
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                {formattedDate && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[10px] font-bold text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formattedDate}
                                    </div>
                                )}
                                {todo.dueTime && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                                        <Clock className="w-3.5 h-3.5" />
                                        {todo.dueTime}
                                    </div>
                                )}
                                {todo.repeat && todo.repeat !== 'none' && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
                                        <Repeat className="w-3.5 h-3.5" />
                                        <span>
                                            <span className="capitalize">{todo.repeatInterval && todo.repeatInterval > 1 ? `Every ${todo.repeatInterval} ${todo.repeat === 'daily' ? 'days' : todo.repeat === 'weekly' ? 'weeks' : 'months'}` : todo.repeat}</span>
                                            {todo.repeat === 'weekly' && todo.repeatWeekDays && todo.repeatWeekDays.length > 0 && (
                                                <span className="ml-1">on {todo.repeatWeekDays.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}</span>
                                            )}
                                            {todo.repeat === 'monthly' && todo.repeatMonthlyType === 'byWeekday' && todo.repeatMonthlyWeekOccurrence && todo.repeatMonthlyWeekDay !== undefined && (
                                                <span className="ml-1">on {['First', 'Second', 'Third', 'Fourth', 'Last'][todo.repeatMonthlyWeekOccurrence === 'last' ? 4 : todo.repeatMonthlyWeekOccurrence - 1]} {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][todo.repeatMonthlyWeekDay]}</span>
                                            )}
                                            {todo.repeat === 'monthly' && todo.repeatMonthlyType === 'byDate' && todo.repeatMonthlyDay && (
                                                <span className="ml-1">on {todo.repeatMonthlyDay === 'last' ? 'Last day' : `Day ${todo.repeatMonthlyDay}`}</span>
                                            )}
                                            {todo.repeatEndDate && ` until ${new Date(todo.repeatEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                                        </span>
                                    </div>
                                )}
                                {!isSubtask && parentTodo.subtasks && parentTodo.subtasks.length > 0 && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-[10px] font-bold text-amber-600 dark:text-amber-400 shadow-sm border border-amber-100 dark:border-amber-800/30">
                                        <ListPlus className="w-3.5 h-3.5" />
                                        {parentTodo.subtasks.filter(s => s.completed).length}/{parentTodo.subtasks.length}
                                    </div>
                                )}
                            </div>

                            {/* Subtasks Section */}
                            {!isSubtask && (
                                <div className="space-y-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 rounded-3xl p-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                                <ListPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Action Plan</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                {(parentTodo.subtasks || []).filter(s => s.completed).length} of {(parentTodo.subtasks || []).length}
                                            </span>
                                            <span className="text-xs font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">{subtaskProgress}%</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full overflow-hidden shrink-0">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${subtaskProgress}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="h-full bg-linear-to-r from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </motion.div>
                                    </div>

                                    {/* Interactive Subtask List */}
                                    <div className="grid grid-cols-1 gap-2 pt-2">
                                        {(parentTodo.subtasks || []).map((st) => (
                                            <TodoItem
                                                key={st.id}
                                                todo={st as Todo}
                                                isSubtask={true}
                                                onToggleOverride={() => toggleSubtask(st.id)}
                                                onUpdateOverride={(id, updates) => {
                                                    const updatedSubtasks = parentTodo.subtasks?.map(sub =>
                                                        sub.id === id ? { ...sub, ...updates } : sub
                                                    );
                                                    doUpdate({ subtasks: updatedSubtasks } as Partial<Todo>);
                                                }}
                                                onDeleteOverride={(id) => {
                                                    const updatedSubtasks = parentTodo.subtasks?.filter(sub => sub.id !== id);
                                                    doUpdate({ subtasks: updatedSubtasks } as Partial<Todo>);
                                                }}
                                            />
                                        ))}

                                        {/* Add New Subtask inline */}
                                        <div className="flex items-center gap-2 p-2 px-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 group/add">
                                            <ListPlus className="w-4 h-4 text-slate-400 group-focus-within/add:text-indigo-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Add new subtask..."
                                                value={newSubtask}
                                                onChange={(e) => setNewSubtask(e.target.value)}
                                                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400/70"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                        e.preventDefault();
                                                        const newSubtaskText = e.currentTarget.value.trim();
                                                        const currentSubtasks = parentTodo.subtasks || [];
                                                        doUpdate({
                                                            subtasks: [...currentSubtasks, { id: crypto.randomUUID(), text: newSubtaskText, title: newSubtaskText, completed: false }]
                                                        } as Partial<Todo>);
                                                        setNewSubtask('');
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (newSubtask.trim()) {
                                                        const currentSubtasks = parentTodo.subtasks || [];
                                                        doUpdate({
                                                            subtasks: [...currentSubtasks, { id: crypto.randomUUID(), text: newSubtask.trim(), title: newSubtask.trim(), completed: false }]
                                                        } as Partial<Todo>);
                                                        setNewSubtask('');
                                                    }
                                                }}
                                                disabled={!newSubtask.trim()}
                                                className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-50 dark:disabled:hover:bg-indigo-900/20 disabled:hover:text-indigo-500"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <>
            {todoContent}
            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title={isSubtask ? 'Delete Subtask?' : 'Delete Task?'}
                message={isSubtask
                    ? 'Are you sure you want to delete this subtask? This action cannot be undone.'
                    : 'Are you sure you want to delete this task? All subtasks will also be deleted.'
                }
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
};