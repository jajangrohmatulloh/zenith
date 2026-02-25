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
    reorderTodos: (activeId: string, overId: string) => Promise<void>;
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
            
            // Initialize order for todos that don't have it (backward compatibility)
            const todosWithOrder = data.map((todo, index) => 
                todo.order === undefined ? { ...todo, order: index } : todo
            );
            
            setTodos(todosWithOrder);
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
            // Assign order to the end of the list
            const newOrder = todos.length;
            await useCases.addTodo(currentUserId, title, { ...params, order: newOrder });
            await fetchTodos(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to add todo');
        }
    };

    const toggleTodo = async (id: string) => {
        // Optimistic update - update UI immediately
        const updatedTodos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
        
        try {
            await useCases.toggleTodo(currentUserId, id);
            await fetchTodos(true); // Sync with backend
        } catch (error) {
            // Revert on error
            setTodos(todos);
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

    const reorderTodos = async (activeId: string, overId: string) => {
        try {
            const oldIndex = todos.findIndex((todo) => todo.id === activeId);
            const newIndex = todos.findIndex((todo) => todo.id === overId);
            
            if (oldIndex === -1 || newIndex === -1) return;
            
            // Create new array with reordered items
            const newTodos = [...todos];
            const [removed] = newTodos.splice(oldIndex, 1);
            newTodos.splice(newIndex, 0, removed);
            
            // Assign new order values to ALL todos (not just filtered ones)
            const updatedTodos = newTodos.map((todo, index) => ({
                ...todo,
                order: index,
            }));
            
            // Batch update all todos
            for (const todo of updatedTodos) {
                await useCases.updateTodo(currentUserId, todo.id, { order: todo.order } as Partial<Todo>);
            }
            
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Failed to reorder todos:', error);
        }
    };


    return (
        <TodoContext.Provider value={{ todos, loading, selectedDate, setSelectedDate, addTodo, toggleTodo, deleteTodo, updateTodo, reorderTodos }}>
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
