import { Task } from './task.entity';

export interface ITaskRepository {
    getAll(userId: string): Promise<Task[]>;

    add(task: Task): Promise<void>;
    update(task: Task): Promise<void>;
    delete(id: string): Promise<void>;
}

