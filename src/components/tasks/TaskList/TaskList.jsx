import { memo, useCallback, useMemo, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { DEFAULT_FILTER, FILTERS } from '../../../constants/filters.js'
import { DEFAULT_PROJECT_ID, PROJECTS } from '../../../constants/projects.js'
import { PRIORITY_OPTIONS } from '../../../constants/priorities.js'
import SortableTaskItem from '../TaskItem/SortableTaskItem.jsx'
import ListToolbar from '../ListToolbar/ListToolbar.jsx'
import { getLocalDateString } from '../../../utils/date.js'
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
  onUpdateDescription,
  onUpdateLabels,
  onAddComment,
  onDuplicateTask,
  onAddSubtask,
  onIndentTask,
  onOutdentTask,
  onMoveTask,
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [editingPriority, setEditingPriority] = useState('')
  const [editingDueDate, setEditingDueDate] = useState('')
  const [editingProject, setEditingProject] = useState(DEFAULT_PROJECT_ID)
  const [editingLabels, setEditingLabels] = useState([])
  const [newLabelInput, setNewLabelInput] = useState('')

  // Add task state
  const [isAddingTask, setIsAddingTask] = useState(false)

  // Toolbar state
  const [showFilter, setShowFilter] = useState('all') // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('manual') // 'manual', 'date', 'priority', 'name'

  // Filter tasks based on showFilter
  const statusFilteredTasks = useMemo(() => {
    if (showFilter === 'active') {
      return tasks.filter(task => !task.completed)
    } else if (showFilter === 'completed') {
      return tasks.filter(task => task.completed)
    }
    return tasks // 'all'
  }, [tasks, showFilter])

  // Sort tasks based on sortBy
  const sortedTasks = useMemo(() => {
    if (sortBy === 'manual') {
      return statusFilteredTasks
    }

    const tasksToSort = [...statusFilteredTasks]

    return tasksToSort.sort((a, b) => {
      if (sortBy === 'date') {
        // Sort by due date (tasks without date go to the end)
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      } else if (sortBy === 'priority') {
        // Sort by priority (higher priority first, null at the end)
        const priorityA = a.priority ?? -1
        const priorityB = b.priority ?? -1
        return priorityB - priorityA
      } else if (sortBy === 'name') {
        // Sort alphabetically by title
        return a.title.localeCompare(b.title, 'pt-BR')
      }
      return 0
    })
  }, [statusFilteredTasks, sortBy])

  // Count tasks by status
  const activeCount = useMemo(() =>
    tasks.filter(task => !task.completed).length, [tasks]
  )
  const completedCount = useMemo(() =>
    tasks.filter(task => task.completed).length, [tasks]
  )

  const childrenMap = useMemo(() => {
    const map = new Map()

    tasks.forEach((task) => {
      const parentKey = task.parentId ? String(task.parentId) : null
      if (!map.has(parentKey)) {
        map.set(parentKey, [])
      }
      map.get(parentKey).push(task.id)
    })

    return map
  }, [tasks])

  const manualRows = useMemo(() => {
    if (sortBy !== 'manual') {
      return null
    }

    const nodesById = new Map()
    statusFilteredTasks.forEach((task) => {
      nodesById.set(task.id, { task, children: [] })
    })

    const roots = []

    statusFilteredTasks.forEach((task) => {
      const node = nodesById.get(task.id)
      const parentId = task.parentId ? String(task.parentId) : null

      if (parentId && nodesById.has(parentId)) {
        nodesById.get(parentId).children.push(node)
      } else {
        roots.push(node)
      }
    })

    const rows = []

    const traverse = (node, depth) => {
      rows.push({
        task: node.task,
        depth,
        hasChildren: node.children.length > 0,
      })

      node.children.forEach((child) => traverse(child, depth + 1))
    }

    roots.forEach((root) => traverse(root, 0))
    return rows
  }, [sortBy, statusFilteredTasks])

  const visibleRows = useMemo(() => {
    if (sortBy === 'manual') {
      const rows = manualRows || []

      return rows.map((row, index) => {
        const previousRow = index > 0 ? rows[index - 1] : null
        const canIndent = Boolean(previousRow && previousRow.depth >= row.depth)

        return {
          ...row,
          canIndent,
          canOutdent: row.depth > 0,
        }
      })
    }

    return sortedTasks.map((task) => ({
      task,
      depth: 0,
      hasChildren: (childrenMap.get(task.id) || []).length > 0,
      canIndent: false,
      canOutdent: false,
    }))
  }, [sortBy, manualRows, sortedTasks, childrenMap])

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimento antes de começar o drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Task IDs para o DndContext (baseados na lista visível)
  const taskIds = useMemo(() => visibleRows.map((row) => row.task.id), [visibleRows])

  // Handler para quando o drag termina
  const handleDragEnd = useCallback((event) => {
    if (sortBy !== 'manual' || !manualRows || !onMoveTask) {
      return
    }

    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const activeIndex = manualRows.findIndex((row) => row.task.id === active.id)
    const overIndex = manualRows.findIndex((row) => row.task.id === over.id)

    if (activeIndex === -1 || overIndex === -1) {
      return
    }

    const position = activeIndex < overIndex ? 'after' : 'before'
    onMoveTask(active.id, over.id, { position })
  }, [manualRows, onMoveTask, sortBy])

  // Label amigável do filtro atual
  const filterName = useMemo(() => {
    const fallbackFilter = FILTERS[DEFAULT_FILTER]
    return FILTERS[currentFilter]?.label ?? fallbackFilter.label
  }, [currentFilter])

  const tasksCountLabel = useMemo(() => (
    `${visibleRows.length} ${visibleRows.length === 1 ? 'tarefa' : 'tarefas'}`
  ), [visibleRows.length])

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
      setIsAddingTask(false) // Fecha o input após adicionar
    }
  }

  // Abre o input de adicionar tarefa
  const openAddTask = () => {
    setIsAddingTask(true)
  }

  // Cancela a adição de tarefa
  const cancelAddTask = () => {
    setIsAddingTask(false)
    setNewTaskTitle('')
  }

  // Handler para tecla Escape no input de nova tarefa
  const handleAddTaskKeyDown = (e) => {
    if (e.key === 'Escape') {
      cancelAddTask()
    }
  }

  // Inicia edição de uma tarefa
  const startEditing = (task) => {
    setEditingTaskId(task.id)
    setEditingText(task.title)
    setEditingDescription(task.description || '')
    setEditingPriority(task.priority ? String(task.priority) : '')
    setEditingDueDate(task.dueDate || '')
    setEditingProject(task.projectId)
    setEditingLabels(task.labels || [])
    setNewLabelInput('')
  }

  // Salva a edição
  const saveEdit = (taskId) => {
    const sanitizedTitle = editingText.trim()

    if (sanitizedTitle) {
      const priorityValue = editingPriority ? parseInt(editingPriority, 10) : null
      const dueDateValue = editingDueDate || null
      const projectValue = editingProject || DEFAULT_PROJECT_ID

      onUpdateTitle(taskId, sanitizedTitle)
      onUpdateDescription(taskId, editingDescription)
      onUpdatePriority(taskId, priorityValue)
      onUpdateDueDate(taskId, dueDateValue)
      onUpdateProject(taskId, projectValue)
      onUpdateLabels(taskId, editingLabels)
    }

    setEditingTaskId(null)
    setEditingText('')
    setEditingDescription('')
    setEditingPriority('')
    setEditingDueDate('')
    setEditingProject(DEFAULT_PROJECT_ID)
    setEditingLabels([])
    setNewLabelInput('')
  }

  // Cancela a edição
  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditingText('')
    setEditingDescription('')
    setEditingPriority('')
    setEditingDueDate('')
    setEditingProject(DEFAULT_PROJECT_ID)
    setEditingLabels([])
    setNewLabelInput('')
  }

  // Adiciona nova label
  const handleAddLabel = (e) => {
    e.preventDefault()
    const trimmedLabel = newLabelInput.trim()

    if (trimmedLabel && !editingLabels.includes(trimmedLabel)) {
      setEditingLabels([...editingLabels, trimmedLabel])
      setNewLabelInput('')
    }
  }

  // Remove label
  const handleRemoveLabel = (labelToRemove) => {
    setEditingLabels(editingLabels.filter(label => label !== labelToRemove))
  }

  // Handler para tecla Enter no input de label
  const handleLabelKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddLabel(e)
    }
  }

  // Handler para tecla Enter ao editar
  const handleEditKeyPress = (e, taskId) => {
    if (e.key === 'Enter') {
      saveEdit(taskId)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const handleQuickSchedule = useCallback((task, option) => {
    let dueDate = task.dueDate
    const base = new Date()

    switch (option) {
      case 'today':
        dueDate = getLocalDateString(base)
        break
      case 'tomorrow':
        base.setDate(base.getDate() + 1)
        dueDate = getLocalDateString(base)
        break
      case 'nextWeek':
        base.setDate(base.getDate() + 7)
        dueDate = getLocalDateString(base)
        break
      case 'noDate':
        dueDate = null
        break
      default:
        dueDate = option
        break
    }

    onUpdateDueDate(task.id, dueDate)
  }, [onUpdateDueDate])

  const handleQuickPriorityChange = useCallback((task, priority) => {
    onUpdatePriority(task.id, priority)
  }, [onUpdatePriority])

  const handleQuickComment = useCallback((task, text) => {
    if (onAddComment) {
      onAddComment(task.id, text)
    }
  }, [onAddComment])

  const handleQuickDuplicate = useCallback((task) => {
    if (onDuplicateTask) {
      onDuplicateTask(task.id)
    }
  }, [onDuplicateTask])

  const handleCreateSubtask = useCallback((taskId) => {
    if (!onAddSubtask) {
      return
    }

    const parentTask = tasks.find((task) => task.id === taskId) || null
    const fallbackTitle = 'Nova tarefa'

    const newTaskId = onAddSubtask(taskId, {
      title: fallbackTitle,
      description: '',
      priority: parentTask?.priority ?? null,
      dueDate: parentTask?.dueDate ?? null,
      labels: parentTask?.labels ?? [],
    })

    if (!newTaskId) {
      return
    }

    setEditingTaskId(newTaskId)
    setEditingText(fallbackTitle)
    setEditingDescription('')
    setEditingPriority(parentTask?.priority ? String(parentTask.priority) : '')
    setEditingDueDate(parentTask?.dueDate ?? '')
    setEditingProject(parentTask?.projectId ?? DEFAULT_PROJECT_ID)
    setEditingLabels(parentTask?.labels ?? [])
    setNewLabelInput('')
  }, [onAddSubtask, tasks])

  const handleIndentTask = useCallback((taskId) => {
    if (sortBy !== 'manual' || !manualRows || !onIndentTask) {
      return
    }

    const currentIndex = manualRows.findIndex((row) => row.task.id === taskId)
    if (currentIndex <= 0) {
      return
    }

    const currentRow = manualRows[currentIndex]
    const previousRow = manualRows[currentIndex - 1]

    if (!previousRow || previousRow.depth < currentRow.depth) {
      return
    }

    onIndentTask(taskId, previousRow.task.id)
  }, [manualRows, onIndentTask, sortBy])

  const handleOutdentTask = useCallback((taskId) => {
    if (sortBy !== 'manual' || !manualRows || !onOutdentTask) {
      return
    }

    const currentRow = manualRows.find((row) => row.task.id === taskId)
    if (!currentRow || currentRow.depth === 0) {
      return
    }

    onOutdentTask(taskId)
  }, [manualRows, onOutdentTask, sortBy])

  return (
    <main className="task-list-container">
      <div className="task-list-header">
        <h1>{filterName}</h1>
        <p className="task-count">{tasksCountLabel}</p>
      </div>

      {/* Minimal Add Task */}
      {!isAddingTask ? (
        <button
          className="add-task-trigger"
          onClick={openAddTask}
          aria-label="Adicionar tarefa"
        >
          <span className="add-task-icon" aria-hidden="true">＋</span>
          <span className="add-task-text">Adicionar tarefa</span>
        </button>
      ) : (
        <form className="add-task-form-inline" onSubmit={handleSubmit}>
          <input
            type="text"
            className="add-task-input-inline"
            placeholder="Nome da tarefa"
            value={newTaskTitle}
            onChange={handleInputChange}
            onKeyDown={handleAddTaskKeyDown}
            aria-label="Nome da nova tarefa"
            autoComplete="off"
            autoFocus
          />
          <div className="add-task-actions-inline">
            <button type="submit" className="add-task-submit-inline">
              Adicionar
            </button>
            <button
              type="button"
              className="add-task-cancel-inline"
              onClick={cancelAddTask}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* List Toolbar */}
      {tasks.length > 0 && (
        <ListToolbar
          showFilter={showFilter}
          sortBy={sortBy}
          taskCount={tasks.length}
          activeCount={activeCount}
          completedCount={completedCount}
          onShowFilterChange={setShowFilter}
          onSortByChange={setSortBy}
        />
      )}

      {/* Lista de tarefas */}
      {tasks.length === 0 ? (
        <div className="task-empty-state" role="status" aria-live="polite">
          <span className="task-empty-icon" aria-hidden="true">🗒️</span>
          <p>Nenhuma tarefa por aqui. Que tal adicionar a próxima?</p>
        </div>
      ) : visibleRows.length === 0 ? (
        <div className="task-empty-state" role="status" aria-live="polite">
          <span className="task-empty-icon" aria-hidden="true">🔍</span>
          <p>Nenhuma tarefa encontrada com este filtro.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <div className="tasks-flat-list">
              {visibleRows.map(({ task, depth, hasChildren, canIndent, canOutdent }) => (
                editingTaskId === task.id ? (
                  <div
                    key={task.id}
                    className="task-edit-expanded-wrapper"
                    style={depth > 0 ? { '--task-depth': depth } : undefined}
                  >
                    <div className="task-edit-expanded">
                        {/* Título */}
                        <input
                          type="text"
                          className="task-edit-input task-edit-title"
                          placeholder="Nome da tarefa"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          autoFocus
                        />

                      {/* Descrição */}
                      <textarea
                        className="task-edit-input task-edit-description"
                        placeholder="Descrição"
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        rows={3}
                      />

                      {/* Labels */}
                      {editingLabels.length > 0 && (
                        <div className="task-labels-container">
                          {editingLabels.map((label, index) => (
                            <span key={index} className="task-label-pill">
                              <span className="task-label-text">{label}</span>
                              <button
                                type="button"
                                className="task-label-remove"
                                onClick={() => handleRemoveLabel(label)}
                                aria-label={`Remover label ${label}`}
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Input para adicionar labels */}
                      <div className="task-label-input-wrapper">
                        <input
                          type="text"
                          className="task-label-input"
                          placeholder="+ Adicionar label"
                          value={newLabelInput}
                          onChange={(e) => setNewLabelInput(e.target.value)}
                          onKeyDown={handleLabelKeyPress}
                        />
                      </div>

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
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    depth={depth}
                    hasChildren={hasChildren}
                    canIndent={canIndent}
                    canOutdent={canOutdent}
                    isDragEnabled={sortBy === 'manual'}
                    onToggleComplete={onToggleComplete}
                    onEdit={startEditing}
                    onDelete={onDeleteTask}
                    onSchedule={handleQuickSchedule}
                    onPriorityChange={handleQuickPriorityChange}
                    onAddComment={handleQuickComment}
                    onDuplicate={handleQuickDuplicate}
                    onAddSubtask={handleCreateSubtask}
                    onIndent={handleIndentTask}
                    onOutdent={handleOutdentTask}
                  />
                )
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </main>
  )
}

export default memo(TaskList)
