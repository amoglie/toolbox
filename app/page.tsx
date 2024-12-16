import { Metadata } from 'next'
import TaskList from '@/components/TaskList'

export const metadata: Metadata = {
  title: 'Tareas | Gestor de Tareas Avanzado',
}

export default function TasksPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Tareas</h2>
      <TaskList />
    </div>
  )
}

