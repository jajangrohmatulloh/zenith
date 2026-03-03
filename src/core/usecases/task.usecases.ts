import { Task, RepeatType, SubTask, MonthlyRepeatType, WeekDay, MonthlyDay, WeekOccurrence } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository';

export class TaskUseCases {
    constructor(private taskRepository: ITaskRepository) { }

    async getTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.getAll(userId);
    }

    async addTask(
        userId: string,
        title: string,
        params: {
            description?: string;
            date?: number;
            time?: string;
            repeat?: RepeatType;
            repeatInterval?: number;
            repeatEndDate?: number;
            repeatWeekDays?: WeekDay[];
            repeatMonthlyType?: MonthlyRepeatType;
            repeatMonthlyDay?: MonthlyDay;
            repeatMonthlyWeekOccurrence?: WeekOccurrence;
            repeatMonthlyWeekDay?: WeekDay;
            repeatYearlyType?: string;
            repeatYearlyMonth?: number;
            repeatYearlyDay?: MonthlyDay;
            subtasks?: SubTask[];
            order?: number;
        } = {}
    ): Promise<Task> {
        if (!title.trim()) {
            throw new Error('Task title cannot be empty');
        }

        const newTask: Task = {
            id: crypto.randomUUID(),
            title: title.trim(),
            description: params.description,
            completed: false,
            createdAt: Date.now(),
            date: params.date,
            time: params.time,
            repeat: params.repeat || 'none',
            repeatInterval: params.repeatInterval,
            repeatEndDate: params.repeatEndDate,
            repeatWeekDays: params.repeatWeekDays,
            repeatMonthlyType: params.repeatMonthlyType,
            repeatMonthlyDay: params.repeatMonthlyDay,
            repeatMonthlyWeekOccurrence: params.repeatMonthlyWeekOccurrence,
            repeatMonthlyWeekDay: params.repeatMonthlyWeekDay,
            repeatYearlyType: params.repeatYearlyType,
            repeatYearlyMonth: params.repeatYearlyMonth,
            repeatYearlyDay: params.repeatYearlyDay,
            subtasks: params.subtasks || [],
            userId,
            order: params.order,
        };

        await this.taskRepository.add(newTask);
        return newTask;
    }

    async toggleTask(userId: string, id: string): Promise<void> {
        const tasks = await this.taskRepository.getAll(userId);
        const task = tasks.find(t => t.id === id);
        if (task) {
            await this.taskRepository.update({ ...task, completed: !task.completed });
        }
    }

    async deleteTask(id: string): Promise<void> {
        await this.taskRepository.delete(id);
    }

    async updateTask(userId: string, id: string, updates: Partial<Task>): Promise<void> {
        const tasks = await this.taskRepository.getAll(userId);
        const task = tasks.find(t => t.id === id);
        if (task) {
            if (updates.title !== undefined) {
                const newTitle = updates.title.trim();
                if (!newTitle) throw new Error('Task title cannot be empty');
                updates.title = newTitle;
            }
            await this.taskRepository.update({ ...task, ...updates });
        }
    }
}
