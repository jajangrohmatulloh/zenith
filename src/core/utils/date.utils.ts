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
                // If repeatWeekDays is set, check if target day is in the selected days
                if (todo.repeatWeekDays && todo.repeatWeekDays.length > 0) {
                    const targetDayOfWeek = targetDateObj.getDay();
                    const isSelectedDay = todo.repeatWeekDays.includes(targetDayOfWeek as never);
                    if (!isSelectedDay) return false;
                    
                    // Check if it's within the repeat interval
                    const diffTime = Math.abs(targetTimestamp - taskTimestamp);
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                    const diffWeeks = Math.floor(diffDays / 7);
                    return diffWeeks % interval === 0;
                } else {
                    // Original behavior: same day of week as original task
                    const isSameDayOfWeek = targetDateObj.getDay() === taskDateObj.getDay();
                    if (!isSameDayOfWeek) return false;

                    // Calculate weeks difference
                    const diffTime = Math.abs(targetTimestamp - taskTimestamp);
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                    const diffWeeks = Math.floor(diffDays / 7);
                    return diffWeeks % interval === 0;
                }
            }
            case 'monthly': {
                // Handle monthly byWeekday pattern (e.g., First Monday of every month)
                if (todo.repeatMonthlyType === 'byWeekday' && todo.repeatMonthlyWeekOccurrence && todo.repeatMonthlyWeekDay !== undefined) {
                    const targetDayOfMonth = targetDateObj.getDate();
                    const targetDayOfWeek = targetDateObj.getDay();
                    const targetMonth = targetDateObj.getMonth();
                    const targetYear = targetDateObj.getFullYear();
                    
                    // Check if weekday matches
                    if (targetDayOfWeek !== todo.repeatMonthlyWeekDay) return false;
                    
                    // Calculate which occurrence of this weekday in the month
                    const occurrence = Math.ceil(targetDayOfMonth / 7);
                    const isLastOccurrence = occurrence === 5 || 
                        (targetDayOfMonth + 7 > new Date(targetYear, targetMonth + 1, 0).getDate());
                    
                    const targetOccurrence = todo.repeatMonthlyWeekOccurrence === 'last' 
                        ? (new Date(targetYear, targetMonth + 1, 0).getDate() - targetDayOfMonth < 7 ? 5 : occurrence)
                        : occurrence;
                    
                    const matchesOccurrence = todo.repeatMonthlyWeekOccurrence === 'last' 
                        ? isLastOccurrence 
                        : targetOccurrence === todo.repeatMonthlyWeekOccurrence;
                    
                    if (!matchesOccurrence) return false;
                    
                    // Check month interval
                    const monthDiff = (targetYear - taskDateObj.getFullYear()) * 12 + (targetMonth - taskDateObj.getMonth());
                    return monthDiff % interval === 0;
                } else {
                    // Handle monthly byDate pattern (default) - e.g., 15th of every month
                    // Use dueDate's day if repeatMonthlyDay is not set
                    const targetDayOfMonth = targetDateObj.getDate();
                    const taskDayOfMonth = todo.repeatMonthlyDay || taskDateObj.getDate();
                    
                    // Handle "last day of month" option
                    if (taskDayOfMonth === 'last') {
                        const lastDayOfMonth = new Date(targetDateObj.getFullYear(), targetDateObj.getMonth() + 1, 0).getDate();
                        return targetDayOfMonth === lastDayOfMonth;
                    }
                    
                    const isSameDayOfMonth = targetDayOfMonth === taskDayOfMonth;
                    if (!isSameDayOfMonth) return false;

                    const monthDiff = (targetDateObj.getFullYear() - taskDateObj.getFullYear()) * 12 + (targetDateObj.getMonth() - taskDateObj.getMonth());
                    return monthDiff % interval === 0;
                }
            }
            default:
                return false;
        }
    }

    return false;
};
