export type TaskList = Task[]

export type Task = {
    id: number
    task: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
  }

export type PatchTask = Partial<Omit<Task, 'id'>>

export type ValidationResult = 
  {valid: true; data: PatchTask} |
  {valid: false; message: string }