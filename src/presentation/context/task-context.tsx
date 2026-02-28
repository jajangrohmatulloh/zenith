'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Task } from '../../core/domain/task.entity';
import { TaskUseCases } from '../../core/usecases/task.usecases';
import { SupabaseTaskRepository } from '../../infrastructure/repositories/supabase-task.repository';
import { LocalStorageTaskRepository } from '../../infrastructure/repositories/local-storage-task.repository';
import { useAuth } from './auth-context';

interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    selectedDate: number | null;
    setSelectedDate: (date: number | null) => void;
    addTask: (title: string, params?: {
        description?: string;
        date?: number;
        time?: string;
        repeat?: Task['repeat'];
        repeatInterval?: number;
        repeatEndDate?: number;
        repeatWeekDays?: number[];
        repeatMonthlyType?: string;
        repeatMonthlyDay?: number | string;
        repeatMonthlyWeekOccurrence?: number | string;
        repeatMonthlyWeekDay?: number;
        repeatYearlyType?: string;
        repeatYearlyMonth?: number;
        repeatYearlyDay?: number | string;
        subtasks?: Task['subtasks'];
    }) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    reorderTasks: (activeId: string, overId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const supabaseRepository = new SupabaseTaskRepository();
const localStorageRepository = new LocalStorageTaskRepository();

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    // Dynamic userId and useCases
    const currentUserId = user?.id || 'guest';
    const repository = user ? supabaseRepository : localStorageRepository;
    const useCases = new TaskUseCases(repository);

    const fetchTasks = async (background = false) => {
        if (!background) setLoading(true);
        try {
            const data = await useCases.getTasks(currentUserId);

            // Initialize order for tasks that don't have it (backward compatibility)
            const tasksWithOrder = data.map((task, index) =>
                task.order === undefined ? { ...task, order: index } : task
            );

            setTasks(tasksWithOrder);
        } catch (error) {
            console.error('Failed to fetch tasks:', error instanceof Error ? error.message : error);
        } finally {
            if (!background) setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const addTask = async (title: string, params: any = {}) => {
        try {
            // Assign order to the end of the list
            const newOrder = tasks.length;
            await useCases.addTask(currentUserId, title, { ...params, order: newOrder });
            await fetchTasks(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to add task');
        }
    };

    const toggleTask = async (id: string) => {
        // Optimistic update - update UI immediately
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);

        try {
            await useCases.toggleTask(currentUserId, id);
            await fetchTasks(true); // Sync with backend
        } catch (error) {
            // Revert on error
            setTasks(tasks);
            alert(error instanceof Error ? error.message : 'Failed to toggle task');
        }
    };


    const deleteTask = async (id: string) => {
        try {
            await useCases.deleteTask(id);
            await fetchTasks(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to delete task');
        }
    };


    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            await useCases.updateTask(currentUserId, id, updates);
            await fetchTasks(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to update task');
        }
    };

    const reorderTasks = async (activeId: string, overId: string) => {
        try {
            const oldIndex = tasks.findIndex((task) => task.id === activeId);
            const newIndex = tasks.findIndex((task) => task.id === overId);

            if (oldIndex === -1 || newIndex === -1) return;

            // Create new array with reordered items
            const newTasks = [...tasks];
            const [removed] = newTasks.splice(oldIndex, 1);
            newTasks.splice(newIndex, 0, removed);

            // Assign new order values to ALL tasks (not just filtered ones)
            const updatedTasks = newTasks.map((task, index) => ({
                ...task,
                order: index,
            }));

            // Batch update all tasks
            for (const task of updatedTasks) {
                await useCases.updateTask(currentUserId, task.id, { order: task.order } as Partial<Task>);
            }

            setTasks(updatedTasks);
        } catch (error) {
            console.error('Failed to reorder tasks:', error);
        }
    };


    return (
        <TaskContext.Provider value={{ tasks, loading, selectedDate, setSelectedDate, addTask, toggleTask, deleteTask, updateTask, reorderTasks }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};
