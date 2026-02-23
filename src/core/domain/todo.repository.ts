import { Todo } from './todo.entity';

export interface ITodoRepository {
    getAll(userId: string): Promise<Todo[]>;

    add(todo: Todo): Promise<void>;
    update(todo: Todo): Promise<void>;
    delete(id: string): Promise<void>;
}

