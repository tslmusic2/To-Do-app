export type TaskList = Task[]

export type Task = {
    id: number
    task: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
  }

export type PostTask = Omit<Task, 'id' | 'completed'>

export type PatchTask = Partial<Omit<Task, 'id'>>

export type ValidationResult<T> = 
  { valid: true; data: T } |
  { valid: false; message: string }