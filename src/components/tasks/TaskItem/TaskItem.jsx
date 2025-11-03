import { memo } from 'react'
import TaskMetadata from '../shared/TaskMetadata.jsx'
import './TaskItem.css'

function TaskItem({ task, onToggleComplete, onEdit, onDelete, onSchedule, onPriorityChange, dragHandleProps, isDragging }) {
  const itemClassName = `task-item-flat ${task.completed ? 'task-item-completed' : ''} ${isDragging ? 'task-item-dragging' : ''}`
  const checkboxClassName = `task-checkbox ${task.priority ? `priority-${task.priority}` : ''}`

  const handleScheduleClick = (e) => {
    e.stopPropagation()
    if (onSchedule) {
      onSchedule(task)
    }
  }

  const handlePriorityClick = (e) => {
    e.stopPropagation()
    if (onPriorityChange) {
      onPriorityChange(task)
    }
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    onEdit(task)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    onDelete(task.id)
  }

  return (
    <div className={itemClassName}>
      {/* Drag Handle - só aparece quando dragHandleProps está definido */}
      {dragHandleProps && (
        <button
          type="button"
          className="drag-handle"
          aria-label="Arrastar para reordenar"
          {...dragHandleProps}
        >
          <span className="drag-handle-icon">⋮⋮</span>
        </button>
      )}

      {/* Checkbox com borda colorida baseada na prioridade */}
      <div className={checkboxClassName}>
        <input
          type="checkbox"
          id={`task-${task.id}`}
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={`Marcar tarefa "${task.title}" como concluída`}
        />
        <label htmlFor={`task-${task.id}`}></label>
      </div>

      {/* Conteúdo da tarefa */}
      <div className="task-content-flat">
        <div className="task-title-flat">{task.title}</div>
        {task.description && (
          <div className="task-description-flat">{task.description}</div>
        )}
        <TaskMetadata task={task} compact />
      </div>

      {/* Quick Actions - sempre visíveis no hover */}
      <div className="task-quick-actions">
        <button
          type="button"
          className="quick-action-btn"
          onClick={handleEditClick}
          title="Editar"
          aria-label="Editar tarefa"
        >
          <span className="quick-action-icon">✏️</span>
        </button>
        <button
          type="button"
          className="quick-action-btn"
          onClick={handleScheduleClick}
          title="Agendar"
          aria-label="Agendar tarefa"
        >
          <span className="quick-action-icon">📅</span>
        </button>
        <button
          type="button"
          className="quick-action-btn"
          onClick={handlePriorityClick}
          title="Prioridade"
          aria-label="Alterar prioridade"
        >
          <span className="quick-action-icon">🚩</span>
        </button>
        <button
          type="button"
          className="quick-action-btn"
          onClick={handleDeleteClick}
          title="Deletar"
          aria-label="Deletar tarefa"
        >
          <span className="quick-action-icon">✕</span>
        </button>
      </div>
    </div>
  )
}

export default memo(TaskItem)
