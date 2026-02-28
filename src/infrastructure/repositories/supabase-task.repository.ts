import { Task } from '../../core/domain/task.entity';
import { ITaskRepository } from '../../core/domain/task.repository';
import { supabase } from '../supabase';

export class SupabaseTaskRepository implements ITaskRepository {
    async getAll(userId: string): Promise<Task[]> {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('userId', userId)
            .order('order', { ascending: true, nullsFirst: false });

        if (error) {
            throw new Error(`Supabase Fetch Error: ${error.message} (${error.code})`);
        }
        return data || [];
    }

    async add(task: Task): Promise<void> {
        const { error } = await supabase
            .from('tasks')
            .insert([task]);

        if (error) {
            throw new Error(`Supabase Insert Error: ${error.message} (${error.code})`);
        }
    }

    async update(task: Task): Promise<void> {
        const { error } = await supabase
            .from('tasks')
            .update(task)
            .eq('id', task.id)
            .eq('userId', task.userId);

        if (error) {
            throw new Error(`Supabase Update Error: ${error.message} (${error.code})`);
        }
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Supabase Delete Error: ${error.message} (${error.code})`);
        }
    }
}
