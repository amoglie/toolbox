'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Task, Section } from '../types/task'
import { TaskSection } from './TaskSection'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

const LOCAL_STORAGE_KEY = 'taskList'

export default function TaskList() {
  const [isClient, setIsClient] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  useEffect(() => {
    setIsClient(true)
    const savedSections = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedSections) {
      setSections(JSON.parse(savedSections))
    } else {
      setSections([
        {
          id: '1',
          title: 'Tareas Personales',
          tasks: [],
          isExpanded: true
        },
        {
          id: '2',
          title: 'Trabajo',
          tasks: [],
          isExpanded: true
        }
      ])
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sections))
    }
  }, [sections, isClient])

  const addSection = () => {
    if (newSectionTitle.trim()) {
      setSections([
        ...sections,
        {
          id: Date.now().toString(),
          title: newSectionTitle,
          tasks: [],
          isExpanded: true
        }
      ])
      setNewSectionTitle('')
      setIsDialogOpen(false)
    }
  }

  const addTask = useCallback((sectionId: string) => {
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: [
            ...section.tasks,
            {
              id: Date.now().toString(),
              title: '',
              description: '',
              createdAt: new Date().toISOString(),
              sectionId
            }
          ]
        }
      }
      return section
    }))
  }, [])

  const updateTask = (taskId: string, updatedFields: Partial<Task>) => {
    setSections(sections.map(section => ({
      ...section,
      tasks: section.tasks.map(task =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
    })))
  }

  const completeTask = (taskId: string) => {
    setSections(sections.map(section => ({
      ...section,
      tasks: section.tasks.map(task =>
        task.id === taskId ? { ...task, completedAt: task.completedAt ? undefined : new Date().toISOString() } : task
      )
    })))
  }

  const deleteTask = (taskId: string) => {
    setSections(sections.map(section => ({
      ...section,
      tasks: section.tasks.filter(task => task.id !== taskId)
    })))
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    ))
  }

  const onDragEnd = (result: DropResult) => {
    if (activeTab !== 'active') return;
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const sectionIndex = sections.findIndex(s => s.id === source.droppableId)
      const newTasks = Array.from(sections[sectionIndex].tasks)
      const [reorderedItem] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, reorderedItem)

      const newSections = [...sections]
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        tasks: newTasks
      }

      setSections(newSections)
    } else {
      const sourceSectionIndex = sections.findIndex(s => s.id === source.droppableId)
      const destSectionIndex = sections.findIndex(s => s.id === destination.droppableId)
      const sourceTasks = Array.from(sections[sourceSectionIndex].tasks)
      const destTasks = Array.from(sections[destSectionIndex].tasks)
      const [movedItem] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, { ...movedItem, sectionId: destination.droppableId })

      const newSections = [...sections]
      newSections[sourceSectionIndex] = {
        ...newSections[sourceSectionIndex],
        tasks: sourceTasks
      }
      newSections[destSectionIndex] = {
        ...newSections[destSectionIndex],
        tasks: destTasks
      }

      setSections(newSections)
    }
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'n') {
      event.preventDefault()
      const firstActiveSection = sections.find(section => section.tasks.some(task => !task.completedAt))
      if (firstActiveSection) {
        addTask(firstActiveSection.id)
      }
    }
  }, [sections, addTask])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const activeSections = sections.map(section => ({
    ...section,
    tasks: section.tasks.filter(task => !task.completedAt)
  }))

  const completedSections = sections.map(section => ({
    ...section,
    tasks: section.tasks.filter(task => task.completedAt)
  }))

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Presiona Ctrl+N para crear una nueva tarea rápidamente
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Sección
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Sección</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Nombre de la sección"
              />
              <Button onClick={addSection} className="w-full">
                Crear Sección
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed')}>
          <TabsList>
            <TabsTrigger value="active">Tareas Activas</TabsTrigger>
            <TabsTrigger value="completed">Tareas Completadas</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <AnimatePresence mode="popLayout">
              {activeSections.map(section => (
                <TaskSection
                  key={section.id}
                  section={section}
                  onAddTask={addTask}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                  onUpdateSection={updateSection}
                />
              ))}
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="completed">
            <AnimatePresence mode="popLayout">
              {completedSections.map(section => (
                <TaskSection
                  key={section.id}
                  section={section}
                  onAddTask={addTask}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                  onUpdateSection={updateSection}
                />
              ))}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </DragDropContext>
    </div>
  )
}

