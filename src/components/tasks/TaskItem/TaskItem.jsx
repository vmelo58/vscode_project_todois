import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { PRIORITIES } from '../../../constants/priorities.js'
import TaskMetadata from '../shared/TaskMetadata.jsx'
import './TaskItem.css'

function TaskItem({
  task,
  depth = 0,
  hasChildren = false,
  canIndent = false,
  canOutdent = false,
  onToggleComplete,
  onEdit,
  onDelete,
  onSchedule,
  onPriorityChange,
  onAddComment,
  onDuplicate,
  onAddSubtask,
  onIndent,
  onOutdent,
  dragHandleProps,
  isDragging,
  isDragEnabled = true,
}) {
  const itemStyle = depth > 0 ? { '--task-depth': depth } : undefined
  const itemClassName = `task-item-flat ${task.completed ? 'task-item-completed' : ''} ${isDragging ? 'task-item-dragging' : ''} ${hasChildren ? 'task-item-has-children' : ''}`
  const checkboxClassName = ['task-checkbox', task.priority ? `priority-p${task.priority}` : '']
    .filter(Boolean)
    .join(' ')
  const [openMenu, setOpenMenu] = useState(null)
  const [commentDraft, setCommentDraft] = useState('')
  const quickActionsRef = useRef(null)
  const commentCount = task.comments ? task.comments.length : 0

  useEffect(() => {
    if (!openMenu) {
      return
    }

    const handleOutsideClick = (event) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setOpenMenu(null)
        setCommentDraft('')
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [openMenu])

  useEffect(() => {
    setOpenMenu(null)
    setCommentDraft('')
  }, [task.id])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleNavigation = () => {
      setOpenMenu(null)
      setCommentDraft('')
    }

    window.addEventListener('hashchange', handleNavigation)
    window.addEventListener('popstate', handleNavigation)

    return () => {
      window.removeEventListener('hashchange', handleNavigation)
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [])

  const handleToggleMenu = (event, menu) => {
    event.stopPropagation()
    setOpenMenu((prev) => (prev === menu ? null : menu))
    if (menu !== 'comment') {
      setCommentDraft('')
    }
  }

  const handleScheduleOption = (option) => {
    if (onSchedule) {
      onSchedule(task, option)
    }
    setOpenMenu(null)
  }

  const handlePriorityOption = (priority) => {
    if (onPriorityChange) {
      onPriorityChange(task, priority)
    }
    setOpenMenu(null)
  }

  const handleAddComment = () => {
    if (commentDraft.trim() && onAddComment) {
      onAddComment(task, commentDraft)
    }
    setCommentDraft('')
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(task)
    }
    setOpenMenu(null)
  }

  const handleCreateSubtask = (event) => {
    event.stopPropagation()
    if (onAddSubtask) {
      onAddSubtask(task.id)
    }
    setOpenMenu(null)
  }

  const handleIndentAction = (event) => {
    event.stopPropagation()
    if (onIndent) {
      onIndent(task.id)
    }
    setOpenMenu(null)
  }

  const handleOutdentAction = (event) => {
    event.stopPropagation()
    if (onOutdent) {
      onOutdent(task.id)
    }
    setOpenMenu(null)
  }

  const handleDelete = (event) => {
    event.stopPropagation()
    setOpenMenu(null)
    setCommentDraft('')
    onDelete(task.id)
  }

  const scheduleOptions = useMemo(() => ([
    { value: 'today', label: 'Hoje' },
    { value: 'tomorrow', label: 'Amanhã' },
    { value: 'nextWeek', label: 'Próxima semana' },
    { value: 'noDate', label: 'Sem data' },
  ]), [])

  const priorityOptions = useMemo(() => ([
    { value: null, label: 'Sem prioridade' },
    { value: 1, label: 'P1 - Urgente' },
    { value: 2, label: 'P2 - Alta' },
    { value: 3, label: 'P3 - Média' },
    { value: 4, label: 'P4 - Baixa' },
  ]), [])

  return (
    <div className={itemClassName} style={itemStyle}>
      {isDragEnabled && dragHandleProps && (
        <button
          type="button"
          className="drag-handle"
          aria-label="Arrastar para reordenar"
          {...dragHandleProps}
        >
          <span className="drag-handle-icon">⋮⋮</span>
        </button>
      )}

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

      <div className="task-content-flat">
        <div className="task-title-flat">{task.title}</div>
        {task.description && (
          <div className="task-description-flat">{task.description}</div>
        )}
        <TaskMetadata task={task} compact />
      </div>

      <div className="task-quick-actions" ref={quickActionsRef}>
        <button
          type="button"
          className="quick-action-btn"
          onClick={(event) => {
            event.stopPropagation()
            onEdit(task)
            setOpenMenu(null)
          }}
          title="Editar"
          aria-label="Editar tarefa"
        >
          <span className="quick-action-icon">✏️</span>
        </button>
        <button
          type="button"
          className="quick-action-btn"
          onClick={(event) => handleToggleMenu(event, 'schedule')}
          title="Agendar"
          aria-label="Agendar tarefa"
        >
          <span className="quick-action-icon">📅</span>
        </button>
        <button
          type="button"
          className="quick-action-btn"
          onClick={(event) => handleToggleMenu(event, 'priority')}
          title="Prioridade"
          aria-label="Alterar prioridade"
        >
          <span className="quick-action-icon">🚩</span>
        </button>
        {onAddSubtask && (
          <button
            type="button"
            className="quick-action-btn"
            onClick={handleCreateSubtask}
            title="Adicionar subtarefa"
            aria-label="Adicionar subtarefa"
          >
            <span className="quick-action-icon">↳</span>
          </button>
        )}
        {onIndent && canIndent && (
          <button
            type="button"
            className="quick-action-btn"
            onClick={handleIndentAction}
            title="Indentar"
            aria-label="Mover tarefa para um nível abaixo"
          >
            <span className="quick-action-icon">→</span>
          </button>
        )}
        {onOutdent && canOutdent && (
          <button
            type="button"
            className="quick-action-btn"
            onClick={handleOutdentAction}
            title="Desindentar"
            aria-label="Mover tarefa para o nível acima"
          >
            <span className="quick-action-icon">←</span>
          </button>
        )}
        <button
          type="button"
          className="quick-action-btn quick-action-btn--comment"
          onClick={(event) => handleToggleMenu(event, 'comment')}
          title="Comentários"
          aria-label="Adicionar comentário"
        >
          <span className="quick-action-icon">💬</span>
          {commentCount > 0 && <span className="quick-action-badge">{commentCount}</span>}
        </button>
        <button
          type="button"
          className="quick-action-btn quick-action-btn--more"
          onClick={(event) => handleToggleMenu(event, 'more')}
          title="Mais ações"
          aria-label="Mais ações"
        >
          <span className="quick-action-icon">⋯</span>
        </button>

        {openMenu === 'schedule' && (
          <div className="quick-menu">
            {scheduleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="quick-menu-item"
                onClick={() => handleScheduleOption(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {openMenu === 'priority' && (
          <div className="quick-menu">
            {priorityOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className="quick-menu-item"
                onClick={() => handlePriorityOption(option.value)}
              >
                {option.label}
                {option.value && PRIORITIES[option.value] && (
                  <span className="quick-menu-priority-icon" aria-hidden="true">
                    {PRIORITIES[option.value].icon}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {openMenu === 'comment' && (
          <div className="quick-menu quick-menu--wide">
            <div className="quick-menu-comments">
              {commentCount === 0 ? (
                <p className="quick-menu-placeholder">Nenhum comentário ainda.</p>
              ) : (
                task.comments.map((comment) => (
                  <div key={comment.id} className="quick-menu-comment">
                    <p>{comment.text}</p>
                    <span>{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                ))
              )}
            </div>
            <textarea
              className="quick-menu-textarea"
              placeholder="Adicionar comentário"
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              rows={3}
            />
            <button
              type="button"
              className="quick-menu-primary"
              onClick={handleAddComment}
            >
              Salvar comentário
            </button>
          </div>
        )}

        {openMenu === 'more' && (
          <div className="quick-menu">
            <button
              type="button"
              className="quick-menu-item"
              onClick={handleDuplicate}
            >
              Duplicar tarefa
            </button>
            <button
              type="button"
              className="quick-menu-item"
              onClick={(event) => {
                event.stopPropagation()
                onEdit(task)
                setOpenMenu(null)
              }}
            >
              Abrir edição
            </button>
            <button
              type="button"
              className="quick-menu-item quick-menu-danger"
              onClick={handleDelete}
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(TaskItem)
