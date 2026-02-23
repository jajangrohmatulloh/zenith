'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Todo } from '../../../core/domain/todo.entity';
import { useTodo } from '../../context/todo-context';
import { Checkbox } from '../atoms/Checkbox';
import { Button } from '../atoms/Button';
import { cn } from '../atoms/Button';

interface TodoItemProps {
    todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
    const { toggleTodo, deleteTodo, updateTodo } = useTodo();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleUpdate = () => {
        if (editText.trim() && editText !== todo.text) {
            updateTodo(todo.id, editText);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className={cn(
                'group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md',
                'bg-white/40 border-slate-200 shadow-sm hover:shadow-md dark:bg-slate-800/40 dark:border-slate-700/50 dark:hover:bg-slate-800/60',
                todo.completed ? 'opacity-50' : 'opacity-100'
            )}

        >
            <Checkbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />

            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            autoFocus
                            className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                            onBlur={handleUpdate}
                        />
                    </div>
                ) : (
                    <span
                        className={cn(
                            'block truncate transition-all duration-300 select-none cursor-pointer',
                            todo.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                        )}
                        onDoubleClick={() => setIsEditing(true)}
                    >
                        {todo.text}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isEditing ? (
                    <>
                        <Button size="icon" variant="ghost" onClick={handleUpdate}>
                            <Check className="w-4 h-4 text-emerald-500" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={handleCancel}>
                            <X className="w-4 h-4 text-slate-400" />
                        </Button>
                    </>
                ) : (
                    <>
                        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                            <Edit2 className="w-4 h-4 text-indigo-500" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteTodo(todo.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </>
                )}
            </div>
        </motion.div>
    );
};
