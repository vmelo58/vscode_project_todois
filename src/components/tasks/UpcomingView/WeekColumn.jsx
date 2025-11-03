import { memo, useMemo, useState } from 'react'
import TaskCard from './TaskCard.jsx'
import { formatColumnHeader, getLocalDateString } from '../../../utils/date.js'
import './WeekColumn.css'

function WeekColumn({ date, tasks, onAddTask, onToggleComplete, onEdit, onDelete, isToday = false }) {
  const [showAddInput, setShowAddInput] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const dateString = getLocalDateString(date)
  const columnHeader = formatColumnHeader(date)

  // Filtra tarefas para esta coluna (somente não-completadas e com data desta coluna)
  const columnTasks = useMemo(
    () => tasks.filter((task) => task.dueDate === dateString && !task.completed),
    [tasks, dateString],
  )

  const handleAddClick = () => {
    setShowAddInput(true)
  }

  const handleInputChange = (e) => {
    setNewTaskTitle(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const sanitizedTitle = newTaskTitle.trim()

    if (sanitizedTitle) {
      // Adiciona tarefa com a data desta coluna
      onAddTask(sanitizedTitle, { dueDate: dateString })
      setNewTaskTitle('')
      setShowAddInput(false)
    }
  }

  const handleCancel = () => {
    setNewTaskTitle('')
    setShowAddInput(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className={`week-column ${isToday ? 'week-column-today' : ''}`}>
      {/* Cabeçalho da coluna */}
      <div className="week-column-header">
        <h3 className="week-column-title">{columnHeader}</h3>
        <span className="week-column-count">{columnTasks.length}</span>
      </div>

      {/* Lista de tarefas */}
      <div className="week-column-tasks">
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {/* Botão para adicionar tarefa */}
        {!showAddInput ? (
          <button
            className="week-column-add-button"
            onClick={handleAddClick}
            type="button"
            aria-label={`Adicionar tarefa em ${columnHeader}`}
          >
            + Adicionar tarefa
          </button>
        ) : (
          <form className="week-column-add-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="week-column-add-input"
              placeholder="Nome da tarefa"
              value={newTaskTitle}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="week-column-add-actions">
              <button type="submit" className="week-column-add-submit">
                Adicionar
              </button>
              <button
                type="button"
                className="week-column-add-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default memo(WeekColumn)
