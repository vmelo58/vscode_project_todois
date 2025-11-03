import { useState } from 'react'
import './TaskList.css'

// Configuração de projetos
const PROJECTS = {
  inbox: { id: 'inbox', name: 'Entrada', icon: '📥' },
  personal: { id: 'personal', name: 'Pessoal', icon: '📌' },
  work: { id: 'work', name: 'Trabalho', icon: '💼' }
}

// Configuração de prioridades
const PRIORITIES = {
  1: { level: 1, name: 'P1', color: '#d1453b', icon: '🚩' },
  2: { level: 2, name: 'P2', color: '#eb8909', icon: '🚩' },
  3: { level: 3, name: 'P3', color: '#246fe0', icon: '🚩' },
  4: { level: 4, name: 'P4', color: '#999', icon: '🚩' }
}

// Função auxiliar para formatar data
const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Hoje'
  if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã'

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function TaskList({ tasks, onAddTask, onDeleteTask, onToggleComplete, onUpdateTitle, onUpdatePriority, onUpdateDueDate, onUpdateProject }) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingPriority, setEditingPriority] = useState(null)
  const [editingDueDate, setEditingDueDate] = useState(null)
  const [editingProject, setEditingProject] = useState('inbox')

  // Função chamada quando o usuário digita no input
  const handleInputChange = (e) => {
    setNewTaskTitle(e.target.value)
  }

  // Função chamada quando o usuário aperta Enter ou clica em Adicionar
  const handleSubmit = (e) => {
    e.preventDefault() // Previne o reload da página

    if (newTaskTitle.trim() !== '') {
      onAddTask(newTaskTitle) // Chama a função do App.jsx
      setNewTaskTitle('') // Limpa o input
    }
  }

  // Inicia edição de uma tarefa
  const startEditing = (task) => {
    setEditingTaskId(task.id)
    setEditingText(task.title)
    setEditingPriority(task.priority)
    setEditingDueDate(task.dueDate || '')
    setEditingProject(task.projectId)
  }

  // Salva a edição
  const saveEdit = (taskId) => {
    if (editingText.trim() !== '') {
      onUpdateTitle(taskId, editingText)
      onUpdatePriority(taskId, editingPriority)
      onUpdateDueDate(taskId, editingDueDate || null)
      onUpdateProject(taskId, editingProject)
    }
    setEditingTaskId(null)
    setEditingText('')
    setEditingPriority(null)
    setEditingDueDate(null)
    setEditingProject('inbox')
  }

  // Cancela a edição
  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditingText('')
    setEditingPriority(null)
    setEditingDueDate(null)
    setEditingProject('inbox')
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
        <h1>Entrada</h1>
        <p className="task-count">{tasks.length} tarefas</p>
      </div>

      {/* Formulário para adicionar nova tarefa */}
      <form className="add-task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="task-input"
          placeholder="+ Adicionar tarefa"
          value={newTaskTitle}
          onChange={handleInputChange}
        />
        <button type="submit" className="add-task-button">
          Adicionar
        </button>
      </form>

      {/* Lista de tarefas */}
      <ul className="tasks">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-checkbox">
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
              />
              <label htmlFor={`task-${task.id}`}></label>
            </div>

            {/* Modo de edição */}
            {editingTaskId === task.id ? (
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
                      value={editingPriority || ''}
                      onChange={(e) => setEditingPriority(e.target.value ? parseInt(e.target.value) : null)}
                      className="metadata-select"
                    >
                      <option value="">Sem prioridade</option>
                      <option value="1">P1 - Urgente</option>
                      <option value="2">P2 - Alta</option>
                      <option value="3">P3 - Média</option>
                      <option value="4">P4 - Baixa</option>
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
                      <option value="inbox">📥 Entrada</option>
                      <option value="personal">📌 Pessoal</option>
                      <option value="work">💼 Trabalho</option>
                    </select>
                  </div>
                </div>

                <div className="edit-actions">
                  <button className="save-button" onClick={() => saveEdit(task.id)}>
                    Salvar
                  </button>
                  <button className="cancel-button" onClick={cancelEdit}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <span className="task-title">
                    {task.title}
                  </span>

                  <div className="task-metadata">
                    {/* Prioridade */}
                    {task.priority && (
                      <span
                        className="task-priority"
                        style={{ color: PRIORITIES[task.priority].color }}
                        title={PRIORITIES[task.priority].name}
                      >
                        {PRIORITIES[task.priority].icon}
                      </span>
                    )}

                    {/* Data */}
                    {task.dueDate && (
                      <span className="task-date" title={task.dueDate}>
                        📅 {formatDate(task.dueDate)}
                      </span>
                    )}

                    {/* Projeto */}
                    {task.projectId && task.projectId !== 'inbox' && (
                      <span className="task-project" title={PROJECTS[task.projectId].name}>
                        {PROJECTS[task.projectId].icon} {PROJECTS[task.projectId].name}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="edit-button"
                  onClick={() => startEditing(task)}
                  title="Editar tarefa"
                >
                  ✏️
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDeleteTask(task.id)}
                  title="Deletar tarefa"
                >
                  ✕
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default TaskList
