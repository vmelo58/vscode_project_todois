import { memo, useMemo, useState } from 'react'
import { DEFAULT_FILTER, FILTERS } from '../../../constants/filters.js'
import { DEFAULT_PROJECT_ID, PROJECTS } from '../../../constants/projects.js'
import { PRIORITY_OPTIONS } from '../../../constants/priorities.js'
import TaskItem from '../TaskItem/TaskItem.jsx'
import './TaskList.css'

function TaskList({
  tasks,
  currentFilter,
  onAddTask,
  onDeleteTask,
  onToggleComplete,
  onUpdateTitle,
  onUpdatePriority,
  onUpdateDueDate,
  onUpdateProject,
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingPriority, setEditingPriority] = useState('')
  const [editingDueDate, setEditingDueDate] = useState('')
  const [editingProject, setEditingProject] = useState(DEFAULT_PROJECT_ID)

  // Label amigável do filtro atual
  const filterName = useMemo(() => {
    const fallbackFilter = FILTERS[DEFAULT_FILTER]
    return FILTERS[currentFilter]?.label ?? fallbackFilter.label
  }, [currentFilter])

  const tasksCountLabel = useMemo(() => (
    `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`
  ), [tasks.length])

  // Função chamada quando o usuário digita no input
  const handleInputChange = (e) => {
    setNewTaskTitle(e.target.value)
  }

  // Função chamada quando o usuário aperta Enter ou clica em Adicionar
  const handleSubmit = (e) => {
    e.preventDefault() // Previne o reload da página

    const sanitizedTitle = newTaskTitle.trim()

    if (sanitizedTitle) {
      onAddTask(sanitizedTitle)
      setNewTaskTitle('')
    }
  }

  // Inicia edição de uma tarefa
  const startEditing = (task) => {
    setEditingTaskId(task.id)
    setEditingText(task.title)
    setEditingPriority(task.priority ? String(task.priority) : '')
    setEditingDueDate(task.dueDate || '')
    setEditingProject(task.projectId)
  }

  // Salva a edição
  const saveEdit = (taskId) => {
    const sanitizedTitle = editingText.trim()

    if (sanitizedTitle) {
      const priorityValue = editingPriority ? parseInt(editingPriority, 10) : null
      const dueDateValue = editingDueDate || null
      const projectValue = editingProject || DEFAULT_PROJECT_ID

      onUpdateTitle(taskId, sanitizedTitle)
      onUpdatePriority(taskId, priorityValue)
      onUpdateDueDate(taskId, dueDateValue)
      onUpdateProject(taskId, projectValue)
    }

    setEditingTaskId(null)
    setEditingText('')
    setEditingPriority('')
    setEditingDueDate('')
    setEditingProject(DEFAULT_PROJECT_ID)
  }

  // Cancela a edição
  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditingText('')
    setEditingPriority('')
    setEditingDueDate('')
    setEditingProject(DEFAULT_PROJECT_ID)
  }

  // Handler para tecla Enter ao editar
  const handleEditKeyPress = (e, taskId) => {
    if (e.key === 'Enter') {
      saveEdit(taskId)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <main className="task-list-container">
      <div className="task-list-header">
        <h1>{filterName}</h1>
        <p className="task-count">{tasksCountLabel}</p>
      </div>

      {/* Formulário para adicionar nova tarefa */}
      <form className="add-task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="task-input"
          placeholder="+ Adicionar tarefa"
          value={newTaskTitle}
          onChange={handleInputChange}
          aria-label="Descrição da nova tarefa"
          autoComplete="off"
        />
        <button type="submit" className="add-task-button">
          <span aria-hidden="true">＋</span>
          <span>Adicionar tarefa</span>
        </button>
      </form>

      {/* Lista de tarefas */}
      {tasks.length === 0 ? (
        <div className="task-empty-state" role="status" aria-live="polite">
          <span className="task-empty-icon" aria-hidden="true">🗒️</span>
          <p>Nenhuma tarefa por aqui. Que tal adicionar a próxima?</p>
        </div>
      ) : (
        <div className="tasks-flat-list">
          {tasks.map((task) => (
            editingTaskId === task.id ? (
              <div key={task.id} className="task-edit-expanded-wrapper">
                <div className="task-edit-expanded">
                  <input
                    type="text"
                    className="task-edit-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                    autoFocus
                  />

                  <div className="task-metadata-edit">
                    {/* Prioridade */}
                    <div className="metadata-field">
                      <label>🚩 Prioridade:</label>
                      <select
                        value={editingPriority}
                        onChange={(e) => setEditingPriority(e.target.value)}
                        className="metadata-select"
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value || 'none'} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Data */}
                    <div className="metadata-field">
                      <label>📅 Data:</label>
                      <input
                        type="date"
                        value={editingDueDate}
                        onChange={(e) => setEditingDueDate(e.target.value)}
                        className="metadata-input"
                      />
                    </div>

                    {/* Projeto */}
                    <div className="metadata-field">
                      <label>📁 Projeto:</label>
                      <select
                        value={editingProject}
                        onChange={(e) => setEditingProject(e.target.value)}
                        className="metadata-select"
                      >
                        {Object.values(PROJECTS).map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.icon} {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button type="button" className="save-button" onClick={() => saveEdit(task.id)}>
                      Salvar
                    </button>
                    <button type="button" className="cancel-button" onClick={cancelEdit}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={startEditing}
                onDelete={onDeleteTask}
              />
            )
          ))}
        </div>
      )}
    </main>
  )
}

export default memo(TaskList)
