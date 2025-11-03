import { useMemo, useState } from 'react'
import WeekColumn from './WeekColumn.jsx'
import { useWeekNavigation } from '../../../hooks/useWeekNavigation.js'
import { DEFAULT_PROJECT_ID, PROJECTS } from '../../../constants/projects.js'
import { PRIORITY_OPTIONS } from '../../../constants/priorities.js'
import { getLocalDateString } from '../../../utils/date.js'
import './UpcomingView.css'

function UpcomingView({
  tasks,
  onAddTask,
  onDeleteTask,
  onToggleComplete,
  onUpdateTitle,
  onUpdatePriority,
  onUpdateDueDate,
  onUpdateProject,
}) {
  const { weekDays, nextWeek, prevWeek, goToToday, isCurrentWeek } = useWeekNavigation(7)
  const [editingTask, setEditingTask] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingPriority, setEditingPriority] = useState('')
  const [editingDueDate, setEditingDueDate] = useState('')
  const [editingProject, setEditingProject] = useState(DEFAULT_PROJECT_ID)
  const scheduledCount = useMemo(
    () => tasks.filter((task) => task.dueDate && !task.completed).length,
    [tasks],
  )
  // Encontra índice da coluna de hoje
  const todayIndex = weekDays.findIndex(
    (date) => getLocalDateString(date) === getLocalDateString(new Date())
  )

  const handleEdit = (task) => {
    setEditingTask(task)
    setEditingText(task.title)
    setEditingPriority(task.priority ? String(task.priority) : '')
    setEditingDueDate(task.dueDate || '')
    setEditingProject(task.projectId)
  }

  const handleSaveEdit = () => {
    if (!editingTask) return

    const sanitizedTitle = editingText.trim()
    if (sanitizedTitle) {
      const priorityValue = editingPriority ? parseInt(editingPriority, 10) : null
      const dueDateValue = editingDueDate || null
      const projectValue = editingProject || DEFAULT_PROJECT_ID

      onUpdateTitle(editingTask.id, sanitizedTitle)
      onUpdatePriority(editingTask.id, priorityValue)
      onUpdateDueDate(editingTask.id, dueDateValue)
      onUpdateProject(editingTask.id, projectValue)
    }

    handleCancelEdit()
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setEditingText('')
    setEditingPriority('')
    setEditingDueDate('')
    setEditingProject(DEFAULT_PROJECT_ID)
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <main className="upcoming-view">
      {/* Cabeçalho com navegação */}
      <div className="upcoming-header">
        <div className="upcoming-title-section">
          <h1>Em Breve</h1>
          <p className="upcoming-subtitle">
            {scheduledCount} {scheduledCount === 1 ? 'tarefa agendada' : 'tarefas agendadas'}
          </p>
        </div>

        <div className="upcoming-navigation">
          <button
            className="nav-button"
            onClick={prevWeek}
            title="Semana anterior"
            aria-label="Semana anterior"
          >
            ←
          </button>
          <button
            className={`nav-today ${isCurrentWeek ? 'active' : ''}`}
            onClick={goToToday}
            title="Ir para hoje"
          >
            Hoje
          </button>
          <button
            className="nav-button"
            onClick={nextWeek}
            title="Próxima semana"
            aria-label="Próxima semana"
          >
            →
          </button>
        </div>
      </div>

      {/* Colunas da semana */}
      <div className="upcoming-columns">
        {weekDays.map((date, index) => (
          <WeekColumn
            key={date.toISOString()}
            date={date}
            tasks={tasks}
            onAddTask={onAddTask}
            onToggleComplete={onToggleComplete}
            onEdit={handleEdit}
            onDelete={onDeleteTask}
            isToday={index === todayIndex}
          />
        ))}
      </div>

      {/* Modal de edição */}
      {editingTask && (
        <div className="edit-modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Editar Tarefa</h2>
              <button
                className="edit-modal-close"
                onClick={handleCancelEdit}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="edit-modal-body">
              <div className="edit-field">
                <label htmlFor="edit-title">Título</label>
                <input
                  id="edit-title"
                  type="text"
                  className="edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  autoFocus
                />
              </div>

              <div className="edit-field">
                <label htmlFor="edit-priority">🚩 Prioridade</label>
                <select
                  id="edit-priority"
                  value={editingPriority}
                  onChange={(e) => setEditingPriority(e.target.value)}
                  className="edit-select"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value || 'none'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="edit-field">
                <label htmlFor="edit-date">📅 Data</label>
                <input
                  id="edit-date"
                  type="date"
                  value={editingDueDate}
                  onChange={(e) => setEditingDueDate(e.target.value)}
                  className="edit-input"
                />
              </div>

              <div className="edit-field">
                <label htmlFor="edit-project">📁 Projeto</label>
                <select
                  id="edit-project"
                  value={editingProject}
                  onChange={(e) => setEditingProject(e.target.value)}
                  className="edit-select"
                >
                  {Object.values(PROJECTS).map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.icon} {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="edit-modal-footer">
              <button className="edit-cancel-button" onClick={handleCancelEdit}>
                Cancelar
              </button>
              <button className="edit-save-button" onClick={handleSaveEdit}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default UpcomingView
