'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Todo } from '../../core/domain/todo.entity';
import { TodoUseCases } from '../../core/usecases/todo.usecases';
import { SupabaseTodoRepository } from '../../infrastructure/repositories/supabase-todo.repository';
import { LocalStorageTodoRepository } from '../../infrastructure/repositories/local-storage-todo.repository';
import { useAuth } from './auth-context';

interface TodoContextType {
    todos: Todo[];
    loading: boolean;
    selectedDate: number | null;
    setSelectedDate: (date: number | null) => void;
    addTodo: (title: string, params?: {
        description?: string;
        dueDate?: number;
        dueTime?: string;
        repeat?: Todo['repeat'];
        repeatInterval?: number;
        repeatEndDate?: number;
        subtasks?: Todo['subtasks'];
    }) => Promise<void>;
    toggleTodo: (id: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const supabaseRepository = new SupabaseTodoRepository();
const localStorageRepository = new LocalStorageTodoRepository();

export const TodoProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    // Dynamic userId and useCases
    const currentUserId = user?.id || 'guest';
    const repository = user ? supabaseRepository : localStorageRepository;
    const useCases = new TodoUseCases(repository);

    const fetchTodos = async (background = false) => {
        if (!background) setLoading(true);
        try {
            const data = await useCases.getTodos(currentUserId);
            setTodos(data);
        } catch (error) {
            console.error('Failed to fetch todos:', error instanceof Error ? error.message : error);
        } finally {
            if (!background) setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [user]);

    const addTodo = async (title: string, params: any = {}) => {
        try {
            await useCases.addTodo(currentUserId, title, params);
            await fetchTodos(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to add todo');
        }
    };

    const toggleTodo = async (id: string) => {
        try {
            await useCases.toggleTodo(currentUserId, id);
            await fetchTodos(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to toggle todo');
        }
    };


    const deleteTodo = async (id: string) => {
        try {
            await useCases.deleteTodo(id);
            await fetchTodos(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to delete todo');
        }
    };


    const updateTodo = async (id: string, updates: Partial<Todo>) => {
        try {
            await useCases.updateTodo(currentUserId, id, updates);
            await fetchTodos(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to update todo');
        }
    };


    return (
        <TodoContext.Provider value={{ todos, loading, selectedDate, setSelectedDate, addTodo, toggleTodo, deleteTodo, updateTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo must be used within a TodoProvider');
    }
    return context;
};
