'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
    DndContext,
    DragEndEvent,
    MeasuringStrategy,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useTask } from '../../context/task-context';

import { TaskItem } from '../molecules/TaskItem';
import { cn } from '../atoms/Button';
import { isTaskOnDate } from '../../../core/utils/date.utils';

export const TaskList = () => {
    const { tasks, loading, selectedDate, setSelectedDate, reorderTasks } = useTask();
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    // Require a 5px movement before drag activates — prevents accidental drags on click/tap
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const measuring = {
        droppable: { strategy: MeasuringStrategy.Always },
    };

    // Calculate stats from ALL tasks (before filtering)
    const stats = {
        total: tasks.length,
        active: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length,
    };

    const filteredTasks = tasks.filter((task) => {
        // First filter by selected date if applicable
        if (selectedDate && !isTaskOnDate(task, selectedDate)) {
            return false;
        }

        // Then filter by status
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    // Sort by order if available, otherwise by createdAt
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            reorderTasks(active.id as string, over.id as string);
        }
    };

    const handleMoveUp = (taskId: string, index: number) => {
        if (index > 0) {
            reorderTasks(taskId, sortedTasks[index - 1].id);
        }
    };

    const handleMoveDown = (taskId: string, index: number) => {
        if (index < sortedTasks.length - 1) {
            reorderTasks(taskId, sortedTasks[index + 1].id);
        }
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

            <div className="flex flex-col gap-3 min-h-[300px] overflow-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    measuring={measuring}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sortedTasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {sortedTasks.map((task, index) => {
                            const isFirst = index === 0;
                            const isLast = index === sortedTasks.length - 1;
                            return (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    isDraggable
                                    onMoveUp={isFirst ? undefined : () => handleMoveUp(task.id, index)}
                                    onMoveDown={isLast ? undefined : () => handleMoveDown(task.id, index)}
                                    showReorderButtons
                                />
                            );
                        })}
                    </SortableContext>
                </DndContext>

                {filteredTasks.length === 0 && (
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
