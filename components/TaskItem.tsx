import { motion } from 'framer-motion';
import { Task } from '../hooks/useTasks';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const priorityColors = {
    low: 'bg-green-200',
    medium: 'bg-yellow-200',
    high: 'bg-red-200',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`p-4 mb-2 rounded shadow ${priorityColors[task.priority]}`}
    >
      <h3 className="font-bold">{task.title}</h3>
      {task.description && <p className="text-sm">{task.description}</p>}
      <p className="text-xs mt-1">Creada: {new Date(task.createdAt).toLocaleString()}</p>
      {task.completedAt && (
        <p className="text-xs">Completada: {new Date(task.completedAt).toLocaleString()}</p>
      )}
      {!task.completedAt && (
        <button
          onClick={() => onComplete(task.id)}
          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Completar
        </button>
      )}
      <button
        onClick={() => onDelete(task.id)}
        className="mt-2 ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
      >
        Eliminar
      </button>
    </motion.div>
  );
}

