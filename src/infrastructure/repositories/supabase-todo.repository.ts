import { Todo } from '../../core/domain/todo.entity';
import { ITodoRepository } from '../../core/domain/todo.repository';
import { supabase } from '../supabase';

export class SupabaseTodoRepository implements ITodoRepository {
    async getAll(userId: string): Promise<Todo[]> {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('userId', userId)
            .order('order', { ascending: true, nullsFirst: false });

        if (error) {
            throw new Error(`Supabase Fetch Error: ${error.message} (${error.code})`);
        }
        return data || [];
    }

    async add(todo: Todo): Promise<void> {
        const { error } = await supabase
            .from('todos')
            .insert([todo]);

        if (error) {
            throw new Error(`Supabase Insert Error: ${error.message} (${error.code})`);
        }
    }

    async update(todo: Todo): Promise<void> {
        const { error } = await supabase
            .from('todos')
            .update(todo)
            .eq('id', todo.id)
            .eq('userId', todo.userId);

        if (error) {
            throw new Error(`Supabase Update Error: ${error.message} (${error.code})`);
        }
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Supabase Delete Error: ${error.message} (${error.code})`);
        }
    }
}
