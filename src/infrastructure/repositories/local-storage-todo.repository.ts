import { Todo } from '../../core/domain/todo.entity';
import { ITodoRepository } from '../../core/domain/todo.repository';

export class LocalStorageTodoRepository implements ITodoRepository {
    private readonly STORAGE_KEY = 'next_todo_app_data';

    async getAll(userId: string): Promise<Todo[]> {
        if (typeof window === 'undefined') return [];

        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return [];

        try {
            const todos: Todo[] = JSON.parse(data);
            return todos.filter(t => t.userId === userId);
        } catch (error) {
            console.error('Failed to parse todos from localStorage', error);
            return [];
        }
    }


    async add(todo: Todo): Promise<void> {
        if (typeof window === 'undefined') return;
        const todos = await this.getAll(todo.userId || '');
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([todo, ...todos]));
    }

    async update(todo: Todo): Promise<void> {
        if (typeof window === 'undefined') return;
        const todos = await this.getAll(todo.userId || '');
        const updated = todos.map(t => t.id === todo.id ? todo : t);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }

    async delete(id: string): Promise<void> {
        // Since we don't have userId here, we'll have to either pass it or change how we store things.
        // For LocalStorage, we can just load EVERYTHING and filter by ID, then save back.
        if (typeof window === 'undefined') return;
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return;
        const todos: Todo[] = JSON.parse(data);
        const filtered = todos.filter(t => t.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }

}
