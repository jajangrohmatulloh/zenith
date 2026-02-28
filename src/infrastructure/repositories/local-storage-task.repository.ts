import { Task } from '../../core/domain/task.entity';
import { ITaskRepository } from '../../core/domain/task.repository';

export class LocalStorageTaskRepository implements ITaskRepository {
    private readonly STORAGE_KEY = 'zenith_tasks_data';

    async getAll(userId: string): Promise<Task[]> {
        if (typeof window === 'undefined') return [];

        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return [];

        try {
            const tasks: Task[] = JSON.parse(data);
            return tasks.filter(t => t.userId === userId);
        } catch (error) {
            console.error('Failed to parse tasks from localStorage', error);
            return [];
        }
    }


    async add(task: Task): Promise<void> {
        if (typeof window === 'undefined') return;
        const tasks = await this.getAll(task.userId || '');
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([task, ...tasks]));
    }

    async update(task: Task): Promise<void> {
        if (typeof window === 'undefined') return;
        const tasks = await this.getAll(task.userId || '');
        const updated = tasks.map(t => t.id === task.id ? task : t);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }

    async delete(id: string): Promise<void> {
        // Since we don't have userId here, we'll have to either pass it or change how we store things.
        // For LocalStorage, we can just load EVERYTHING and filter by ID, then save back.
        if (typeof window === 'undefined') return;
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return;
        const tasks: Task[] = JSON.parse(data);
        const filtered = tasks.filter(t => t.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }

}
