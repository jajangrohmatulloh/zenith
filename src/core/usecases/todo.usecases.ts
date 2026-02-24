import { Todo, RepeatType, SubTask } from '../domain/todo.entity';
import { ITodoRepository } from '../domain/todo.repository';

export class TodoUseCases {
    constructor(private todoRepository: ITodoRepository) { }

    async getTodos(userId: string): Promise<Todo[]> {
        return await this.todoRepository.getAll(userId);
    }

    async addTodo(
        userId: string,
        title: string,
        params: {
            description?: string;
            dueDate?: number;
            dueTime?: string;
            repeat?: RepeatType;
            repeatInterval?: number;
            repeatEndDate?: number;
            subtasks?: SubTask[];
        } = {}
    ): Promise<Todo> {
        if (!title.trim()) {
            throw new Error('Task title cannot be empty');
        }

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: title.trim(), // Keep text for backward compatibility
            title: title.trim(),
            description: params.description,
            completed: false,
            createdAt: Date.now(),
            dueDate: params.dueDate,
            dueTime: params.dueTime,
            repeat: params.repeat || 'none',
            repeatInterval: params.repeatInterval,
            repeatEndDate: params.repeatEndDate,
            subtasks: params.subtasks || [],
            userId,
        };

        await this.todoRepository.add(newTodo);
        return newTodo;
    }

    async toggleTodo(userId: string, id: string): Promise<void> {
        const todos = await this.todoRepository.getAll(userId);
        const todo = todos.find(t => t.id === id);
        if (todo) {
            await this.todoRepository.update({ ...todo, completed: !todo.completed });
        }
    }

    async deleteTodo(id: string): Promise<void> {
        await this.todoRepository.delete(id);
    }

    async updateTodo(userId: string, id: string, updates: Partial<Todo>): Promise<void> {
        const todos = await this.todoRepository.getAll(userId);
        const todo = todos.find(t => t.id === id);
        if (todo) {
            if (updates.title !== undefined || updates.text !== undefined) {
                const newTitle = (updates.title || updates.text || '').trim();
                if (!newTitle) throw new Error('Task title cannot be empty');
                updates.text = newTitle;
                updates.title = newTitle;
            }
            await this.todoRepository.update({ ...todo, ...updates });
        }
    }
}
