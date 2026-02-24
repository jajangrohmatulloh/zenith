export interface SubTask {
    id: string;
    text: string;
    title?: string;
    description?: string;
    completed: boolean;
    createdAt?: number;
    dueDate?: number;
    dueTime?: string;
    repeat?: RepeatType;
    repeatInterval?: number;
    repeatEndDate?: number;
}

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Todo {
    id: string;
    text: string; // Keep for backward compatibility (maps to title)
    title?: string; // Explicit title
    description?: string;
    completed: boolean;
    createdAt: number;
    dueDate?: number; // timestamp (date only)
    dueTime?: string; // HH:mm format
    repeat?: RepeatType;
    repeatInterval?: number;
    repeatEndDate?: number;
    subtasks?: SubTask[];
    userId?: string;
}

