import { Todo } from '../domain/todo.entity';
import { ITodoRepository } from '../domain/todo.repository';

export class TodoUseCases {
    constructor(private todoRepository: ITodoRepository) { }

    async getTodos(userId: string): Promise<Todo[]> {
        return await this.todoRepository.getAll(userId);
    }

    async addTodo(userId: string, text: string, dueDate?: number): Promise<Todo> {
        if (!text.trim()) {
            throw new Error('Todo text cannot be empty');
        }

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now(),
            dueDate,
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

    async updateTodo(userId: string, id: string, text: string): Promise<void> {
        if (!text.trim()) {
            throw new Error('Todo text cannot be empty');
        }
        const todos = await this.todoRepository.getAll(userId);
        const todo = todos.find(t => t.id === id);
        if (todo) {
            await this.todoRepository.update({ ...todo, text: text.trim() });
        }
    }


}
