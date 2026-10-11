import type { PostTask, ValidationResult } from '../types.ts'

export function isValidPostTask(data: unknown): ValidationResult<PostTask> {
    if (
        data === null||
        typeof data !== 'object' ||
        Array.isArray(data)) {
        return {
            valid: false,
            message: 'request must be a valid JSON object'
        }
    }

    const value = data as Record<string, unknown>

    const requiredFields = ['task', 'priority']
    const keys = Object.keys(value)

    for (const field of keys) {
        if (!requiredFields.includes(field)) {
            return {
                valid: false,
                message: `${field} is a not a required field`
            }
        }
    }

    if (typeof value.task !== 'string' || value.task.trim().length === 0) {
        return {
            valid: false,
            message: 'Task must be a non empty string'
        }
    }   


    if (
        value.priority !== 'low' && 
        value.priority !== 'medium' && 
        value.priority !== 'high' 
    ) {
        return {
            valid: false,
            message: 'priority must be low, medium or high'
        }
    }

    return {
        valid: true,
        data: value as PostTask
    }


}