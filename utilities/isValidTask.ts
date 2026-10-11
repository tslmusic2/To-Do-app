import type { TaskList, Task } from '../types.ts'

       //use if its the entire tasklist
export function isValidTaskList(data:unknown): data is TaskList {
    return Array.isArray(data) && data.every(isValidTask)

}

        //use if its just 1 task
export function isValidTask(data:unknown): data is Task {
    
    if (
        typeof data !== 'object' || 
        data === null || 
        Array.isArray(data)
    ) {
        return false
    }

    const value = data as Record<string, unknown>

    return (
        typeof value.id === 'number' &&
        Number.isInteger(value.id) &&
        typeof value.task === 'string' &&
        typeof value.complete === 'boolean' &&
        (value.priority === 'low' || value.priority === 'medium' || value.priority === 'high')
    )




}