import type { PatchTask, ValidationResult } from '../types.ts'

export function isValidPatchTask(data: unknown): ValidationResult {



    if (
            data === null || 
            typeof data !== 'object' || 
            Array.isArray(data)
        ) {
            return {
                valid: false,
                message: 'Request must be a valid json object'
            }
        }

        const value = data as Record<string, unknown>

        const allowedFields = ['task', 'completed', 'priority']
        const keys = Object.keys(value)

        if (keys.length === 0) {
            return {
                valid: false,
                message: 'at least 1 update field is required'
            }
        }

        for (const field of keys) {
            if (!allowedFields.includes(field)) {
                return {
                    valid: false,
                    message: `${field} is not an allowed update field`
                }
            }
        }


        //'tasks',
        const hasTaskField = Object.hasOwn(value, 'task')
        if (hasTaskField) {
            if(typeof value.task !== 'string' || value.task.trim().length === 0) {
                    return {
                        valid: false,
                        message: 'Task must be a non empty string'
                    }
            }
        }        
        


        //'completed', 
        const hascompletedField = Object.hasOwn(value, 'completed')
        if (hascompletedField) {
            if(typeof value.completed !== 'boolean') {
                    return {
                        valid: false,
                        message: 'completed must be a boolean'
                    }
            }
        }    
        
        //'priority'
        const haspriorityField = Object.hasOwn(value, 'priority')
        if (haspriorityField) {
            if(
                    value.priority !== 'low' && 
                    value.priority !== 'medium' && 
                    value.priority !== 'high' 
            ) {
                    return {
                        valid: false,
                        message: 'priority must be low, medium or high'
                    }
            }
        } 

        return {
            valid: true,
            data: value as PatchTask
        }
}
