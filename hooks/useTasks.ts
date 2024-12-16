import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completedAt: new Date().toISOString() } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updatedFields } : task
    ));
  };

  return { tasks, addTask, completeTask, deleteTask, updateTask };
}

