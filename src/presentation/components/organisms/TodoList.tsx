'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTodo } from '../../context/todo-context';

import { TodoItem } from '../molecules/TodoItem';
import { Badge } from '../atoms/Badge';

export const TodoList = () => {
    const { todos, loading, selectedDate, setSelectedDate } = useTodo();
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const filteredTodos = todos.filter((todo) => {
        // First filter by selected date if applicable
        if (selectedDate) {
            if (!todo.dueDate) return false;
            const todoDate = new Date(todo.dueDate).setHours(0, 0, 0, 0);
            if (todoDate !== selectedDate) return false;
        }

        // Then filter by status
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const stats = {
        total: filteredTodos.length,
        active: filteredTodos.filter((t) => !t.completed).length,
        completed: filteredTodos.filter((t) => t.completed).length,
    };


    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex gap-4">
                    {(['all', 'active', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`text-sm font-bold capitalize transition-all ${filter === f
                                ? 'text-indigo-600 dark:text-indigo-400 underline decoration-2 underline-offset-8'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            {f}
                        </button>

                    ))}
                </div>

                <div className="flex gap-2 items-center">
                    {selectedDate && (
                        <div
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800/50 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            onClick={() => setSelectedDate(null)}
                        >
                            <span>{new Date(selectedDate).toLocaleDateString()}</span>
                            <X className="w-3 h-3" />
                        </div>
                    )}
                    <Badge variant="primary">{stats.total} {selectedDate ? 'Found' : 'Total'}</Badge>
                    <Badge variant="success">{stats.completed} Done</Badge>
                </div>

            </div>

            <div className="flex flex-col gap-3 min-h-[300px]">
                <AnimatePresence mode="popLayout" initial={false}>
                    {filteredTodos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                </AnimatePresence>

                {filteredTodos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-400"
                    >
                        <p className="text-sm font-medium">No tasks found in this category.</p>
                    </motion.div>
                )}

            </div>
        </div>
    );
};
