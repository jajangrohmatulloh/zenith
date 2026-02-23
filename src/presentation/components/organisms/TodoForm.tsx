'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTodo } from '../../context/todo-context';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export const TodoForm = () => {
    const { addTodo } = useTodo();
    const [text, setText] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            const dueDate = date ? new Date(date).getTime() : undefined;
            addTodo(text, dueDate);
            setText('');
            setDate('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 items-start">
            <div className="flex-1 w-full flex gap-2">
                <Input
                    placeholder="Add a new task..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="text-base"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
            </div>
            <Button type="submit" size="lg" className="h-[46px] w-full md:w-auto px-6 rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Add Task
            </Button>
        </form>
    );
};
