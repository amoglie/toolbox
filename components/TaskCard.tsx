'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Trash2, ChevronDown } from 'lucide-react'
import { Task } from '../types/task'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import dynamic from 'next/dynamic'

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false })

interface TaskCardProps {
  task: Task
  onComplete: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updatedTask: Partial<Task>) => void
  isNew?: boolean
}

export function TaskCard({ task, onComplete, onDelete, onUpdate, isNew = false }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(isNew)
  const [editedTask, setEditedTask] = useState(task)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditedTask(task)
  }, [task])

  useEffect(() => {
    if (isEditing) {
      const handleClickOutside = (event: MouseEvent) => {
        if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
          handleSave()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isEditing, editedTask])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTask(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (editedTask.title.trim() || editedTask.description?.trim()) {
      onUpdate(task.id, editedTask)
      setIsEditing(false)
    } else if (isNew) {
      onDelete(task.id)
    }
  }

  const handleComplete = () => {
    if (!task.completedAt) {
      setShowConfetti(true)
    }
    onComplete(task.id)
  }

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const startEditing = () => {
    if (!isEditing) {
      setIsEditing(true)
      setIsExpanded(true)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      ref={cardRef}
      className={cn(
        "group relative p-3 mb-1 rounded-lg transition-colors",
        isEditing ? "bg-accent" : "hover:bg-accent/50",
        task.completedAt && "opacity-60"
      )}
    >
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-5 w-5 p-0 rounded-full",
            task.completedAt ? "text-primary" : "text-muted-foreground"
          )}
          onClick={handleComplete}
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>

        <div className="flex-grow min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                ref={titleInputRef}
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                placeholder="Título de la tarea"
                className="h-6 text-sm"
                autoFocus
              />
              <Textarea
                ref={descriptionTextareaRef}
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
                placeholder="Descripción de la tarea"
                className="min-h-[60px] text-sm"
              />
              <Button onClick={handleSave} size="sm">Guardar</Button>
            </div>
          ) : (
            <div className="space-y-1 cursor-pointer" onClick={startEditing}>
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-sm font-medium",
                  task.completedAt && "line-through"
                )}>
                  {task.title || "Nueva tarea"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={toggleExpand}
                >
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "transform rotate-180"
                  )} />
                </Button>
              </div>
              {(isExpanded || task.description) && (
                <p className="text-xs text-muted-foreground">
                  {task.description || "Añadir descripción..."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {!isEditing && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 absolute top-2 right-2 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      {!isEditing && (
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </motion.div>
  )
}

