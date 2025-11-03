import { memo } from 'react'
import { PRIORITIES } from '../../../constants/priorities.js'
import { PROJECTS, DEFAULT_PROJECT_ID } from '../../../constants/projects.js'
import './TaskCard.css'

function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const cardClassName = `task-card ${task.completed ? 'completed' : ''}`
  const priorityInfo = task.priority ? PRIORITIES[task.priority] : null

  return (
    <div className={cardClassName}>
      {/* Checkbox */}
      <div className="task-card-checkbox">
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
        <div className="task-card-header">
          <span className="task-card-title">{task.title}</span>
          {/* Prioridade - ícone pequeno */}
          {priorityInfo && (
            <span
              className="task-card-priority"
              style={{ color: priorityInfo.color }}
              title={priorityInfo.name}
            >
              {priorityInfo.icon}
            </span>
          )}
        </div>

        {/* Projeto - tag */}
        {task.projectId && task.projectId !== DEFAULT_PROJECT_ID && PROJECTS[task.projectId] && (
          <span className="task-card-project">
            {PROJECTS[task.projectId].icon} {PROJECTS[task.projectId].name}
          </span>
        )}
      </div>

      {/* Botões de ação - aparecem no hover */}
      <div className="task-card-actions">
        <button
          className="task-card-edit"
          onClick={() => onEdit(task)}
          title="Editar tarefa"
          aria-label="Editar tarefa"
        >
          ✏️
        </button>
        <button
          className="task-card-delete"
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
