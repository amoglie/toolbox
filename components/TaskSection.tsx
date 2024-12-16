'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus } from 'lucide-react'
import { Section, Task } from '../types/task'
import { TaskCard } from './TaskCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Droppable, Draggable } from 'react-beautiful-dnd'

interface TaskSectionProps {
  section: Section
  onAddTask: (sectionId: string) => void
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, updatedTask: Partial<Task>) => void
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void
}

export function TaskSection({
  section,
  onAddTask,
  onComplete,
  onDelete,
  onUpdate,
  onUpdateSection,
}: TaskSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(section.title)

  const completedTasks = section.tasks.filter(task => task.completedAt)
  const progress = section.tasks.length ? (completedTasks.length / section.tasks.length) * 100 : 0

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      onUpdateSection(section.id, { title: editedTitle })
      setIsEditing(false)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:bg-transparent"
            onClick={() => onUpdateSection(section.id, { isExpanded: !section.isExpanded })}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                section.isExpanded ? 'transform rotate-0' : 'transform -rotate-90'
              }`}
            />
          </Button>
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
              className="h-7 text-lg font-semibold bg-transparent border-none focus:ring-0 p-0"
              autoFocus
            />
          ) : (
            <h2 
              className="text-lg font-semibold cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {section.title}{' '}
              <span className="text-sm text-muted-foreground">
                {section.tasks.length}
              </span>
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {completedTasks.length}/{section.tasks.length}
          </div>
          <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTask(section.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {section.isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Droppable droppableId={section.id}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {section.tasks.map((task, index) => (
                    task.completedAt ? (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={onComplete}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        isNew={!task.title}
                      />
                    ) : (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onComplete={onComplete}
                              onDelete={onDelete}
                              onUpdate={onUpdate}
                              isNew={!task.title}
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

