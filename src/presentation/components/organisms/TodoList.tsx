'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, MeasuringStrategy, DefaultDropAnimation, Modifier, DragStartEvent, DragMoveEvent, DragCancelEvent, rectIntersection } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useTodo } from '../../context/todo-context';

import { TodoItem } from '../molecules/TodoItem';
import { Badge } from '../atoms/Badge';
import { cn } from '../atoms/Button';
import { isTaskOnDate } from '../../../core/utils/date.utils';

// Custom modifier to offset the dragged item so cursor position matches grab point
const createCursorModifier = (offsetY: number) => {
    const modifier: Modifier = ({ transform }) => {
        return {
            ...transform,
            y: transform.y + offsetY,
        };
    };
    return modifier;
};

export const TodoList = () => {
    const { todos, loading, selectedDate, setSelectedDate, reorderTodos } = useTodo();
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [cursorOffset, setCursorOffset] = useState(0);

    // Configure sensor for instant drag activation
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 0, // Instant activation for immediate feedback
            },
        })
    );

    // Custom drop animation
    const dropAnimation: DefaultDropAnimation = {
        duration: 200,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    };

    // Configure measuring for real-time sliding
    const measuring = {
        droppable: {
            strategy: MeasuringStrategy.Always,
        },
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id as string);

        // Calculate cursor offset from top of element
        const node = event.active.element as HTMLElement | null;
        if (node) {
            const rect = node.getBoundingClientRect();
            const offsetY = event.active.event.clientY - rect.top;
            setCursorOffset(offsetY - 40);
        }
    };

    // Calculate stats from ALL todos (before filtering)
    const stats = {
        total: todos.length,
        active: todos.filter(t => !t.completed).length,
        completed: todos.filter(t => t.completed).length,
    };

    const filteredTodos = todos.filter((todo) => {
        // First filter by selected date if applicable
        if (selectedDate && !isTaskOnDate(todo, selectedDate)) {
            return false;
        }

        // Then filter by status
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    // Sort by order if available, otherwise by createdAt
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            reorderTodos(active.id as string, over.id as string);
        }
        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    // Find the active todo for the overlay
    const activeTodo = activeId ? sortedTodos.find(t => t.id === activeId) : null;


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
                    {(['all', 'active', 'completed'] as const).map((f) => {
                        const count = f === 'all' ? stats.total : f === 'active' ? stats.active : stats.completed;
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex items-center gap-2 text-sm font-bold capitalize transition-all cursor-pointer ${filter === f
                                    ? 'text-indigo-600 dark:text-indigo-400 underline decoration-2 underline-offset-8'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100'
                                    }`}
                            >
                                {f}
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                    filter === f
                                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-2 items-center">
                    {selectedDate && (
                        <div
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800/50 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            onClick={() => setSelectedDate(null)}
                        >
                            <span>{new Date(selectedDate).toLocaleDateString()}</span>
                            <X className="w-3 h-3 text-indigo-600 dark:text-indigo-300" />
                        </div>
                    )}
                </div>

            </div>

            <div className="flex flex-col gap-3 min-h-[300px]">
                <DndContext 
                    collisionDetection={rectIntersection}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                    sensors={sensors}
                    measuring={measuring}
                >
                    <SortableContext items={sortedTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <AnimatePresence mode="popLayout" initial={false}>
                            {sortedTodos.map((todo) => (
                                <TodoItem key={todo.id} todo={todo} isDraggable />
                            ))}
                        </AnimatePresence>
                    </SortableContext>
                    <DragOverlay 
                        dropAnimation={dropAnimation}
                        modifiers={[createCursorModifier(cursorOffset)]}
                    >
                        {activeTodo ? (
                            <div className="transform scale-105 shadow-xl">
                                <TodoItem todo={activeTodo} isDraggable />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {filteredTodos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-300"
                    >
                        <p className="text-sm font-medium">No tasks found in this category.</p>
                    </motion.div>
                )}

            </div>
        </div>
    );
};
