export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    dueDate?: number; // timestamp
    userId?: string;
}

