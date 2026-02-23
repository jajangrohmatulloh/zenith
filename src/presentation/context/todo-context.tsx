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
    addTodo: (text: string, dueDate?: number) => Promise<void>;
    toggleTodo: (id: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    updateTodo: (id: string, text: string) => Promise<void>;
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

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const data = await useCases.getTodos(currentUserId);
            setTodos(data);
        } catch (error) {
            console.error('Failed to fetch todos:', error instanceof Error ? error.message : error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [user]);

    const addTodo = async (text: string, dueDate?: number) => {
        try {
            await useCases.addTodo(currentUserId, text, dueDate);
            await fetchTodos();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to add todo');
        }
    };

    const toggleTodo = async (id: string) => {
        try {
            await useCases.toggleTodo(currentUserId, id);
            await fetchTodos();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to toggle todo');
        }
    };


    const deleteTodo = async (id: string) => {
        try {
            await useCases.deleteTodo(id);
            await fetchTodos();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to delete todo');
        }
    };


    const updateTodo = async (id: string, text: string) => {
        try {
            await useCases.updateTodo(currentUserId, id, text);
            await fetchTodos();
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
