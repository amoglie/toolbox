'use client'

import { Plus } from 'lucide-react'
import { Task } from '../hooks/useTasks'
import { Button } from "@/components/ui/button"

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const handleAddTask = () => {
    onAddTask({
      title: '',
      description: '',
      priority: 'medium',
    })
  }

  return (
    <Button onClick={handleAddTask}>
      <Plus className="mr-2 h-4 w-4" />
      Nueva Tarea
    </Button>
  )
}

