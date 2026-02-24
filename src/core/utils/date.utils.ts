import { Todo } from '../domain/todo.entity';

/**
 * Checks if a task is scheduled for a given target date, taking into account its repeat configuration.
 * @param todo The task to evaluate.
 * @param targetTimestamp The beginning of the day timestamp for the target date.
 * @returns boolean True if the task falls on the target date.
 */
export const isTaskOnDate = (todo: Todo, targetTimestamp: number): boolean => {
    if (!todo.dueDate) {
        return false;
    }

    const taskDate = new Date(todo.dueDate);
    const taskTimestamp = taskDate.setHours(0, 0, 0, 0);

    // If the target date is before the initial task due date, it shouldn't show up.
    if (targetTimestamp < taskTimestamp) {
        return false;
    }

    // Exact match (applies to 'none' or the very first occurrence of a repeating task)
    if (targetTimestamp === taskTimestamp) {
        return true;
    }

    // Handle repeating logic
    if (todo.repeat && todo.repeat !== 'none') {
        const targetDateObj = new Date(targetTimestamp);
        const taskDateObj = new Date(taskTimestamp);

        // End Date Check
        if (todo.repeatEndDate) {
            const endDateObj = new Date(todo.repeatEndDate);
            const endTimestamp = endDateObj.setHours(23, 59, 59, 999);
            if (targetTimestamp > endTimestamp) {
                return false;
            }
        }

        const interval = todo.repeatInterval && todo.repeatInterval > 0 ? todo.repeatInterval : 1;

        switch (todo.repeat) {
            case 'daily': {
                const diffTime = Math.abs(targetTimestamp - taskTimestamp);
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                return diffDays % interval === 0;
            }
            case 'weekly': {
                const isSameDayOfWeek = targetDateObj.getDay() === taskDateObj.getDay();
                if (!isSameDayOfWeek) return false;

                // Calculate weeks difference
                const diffTime = Math.abs(targetTimestamp - taskTimestamp);
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                const diffWeeks = Math.floor(diffDays / 7);
                return diffWeeks % interval === 0;
            }
            case 'monthly': {
                const isSameDayOfMonth = targetDateObj.getDate() === taskDateObj.getDate();
                if (!isSameDayOfMonth) return false;

                const monthDiff = (targetDateObj.getFullYear() - taskDateObj.getFullYear()) * 12 + (targetDateObj.getMonth() - taskDateObj.getMonth());
                return monthDiff % interval === 0;
            }
            default:
                return false;
        }
    }

    return false;
};
