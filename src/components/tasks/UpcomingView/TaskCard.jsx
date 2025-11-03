import { memo } from 'react'
import TaskMetadata from '../shared/TaskMetadata.jsx'
import './TaskCard.css'

function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const cardClassName = `task-card ${task.completed ? 'completed' : ''}`
  const checkboxClassName = `task-card-checkbox ${task.priority ? `priority-${task.priority}` : ''}`

  return (
    <div className={cardClassName}>
      {/* Checkbox com borda colorida por prioridade */}
      <div className={checkboxClassName}>
        <input
          type="checkbox"
          id={`card-${task.id}`}
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={`Marcar tarefa "${task.title}" como concluída`}
        />
        <label htmlFor={`card-${task.id}`}></label>
      </div>

      {/* Content */}
      <div className="task-card-content">
        <span className="task-card-title">{task.title}</span>
        {task.description && (
          <div className="task-card-description">{task.description}</div>
        )}
        <TaskMetadata task={task} compact />
      </div>

      {/* Botões de ação - aparecem no hover */}
      <div className="task-card-actions">
        <button
          type="button"
          className="task-card-action-btn"
          onClick={() => onEdit(task)}
          title="Editar tarefa"
          aria-label="Editar tarefa"
        >
          ✏️
        </button>
        <button
          type="button"
          className="task-card-action-btn"
          onClick={() => onDelete(task.id)}
          title="Deletar tarefa"
          aria-label="Deletar tarefa"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default memo(TaskCard)
