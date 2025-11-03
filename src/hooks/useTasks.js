import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PROJECT_ID, PROJECTS } from '../constants/projects.js'
import { getLocalDateString } from '../utils/date.js'

const STORAGE_KEY = 'todoist-tasks'

const buildSeedTasks = () => ([
  {
    id: 1,
    title: 'Bem-vindo ao seu Todoist Clone!',
    completed: false,
    priority: null,
    dueDate: null,
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 2,
    title: 'Experimente definir prioridade 🚩',
    completed: false,
    priority: 1,
    dueDate: null,
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 3,
    title: 'Adicione uma data de vencimento 📅',
    completed: false,
    priority: null,
    dueDate: getLocalDateString(),
    projectId: PROJECTS.personal.id,
  },
  {
    id: 4,
    title: 'Organize por projetos 📁',
    completed: false,
    priority: 2,
    dueDate: null,
    projectId: PROJECTS.work.id,
  },
])

const readStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return buildSeedTasks()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return buildSeedTasks()
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return buildSeedTasks()
    }

    return parsed
  } catch (error) {
    console.warn('Falha ao carregar tarefas salvas. Usando dados padrão.', error)
    return buildSeedTasks()
  }
}

export const useTasks = () => {
  const [tasks, setTasks] = useState(readStorage)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = useCallback((title) => {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: trimmedTitle,
        completed: false,
        priority: null,
        dueDate: null,
        projectId: DEFAULT_PROJECT_ID,
      },
    ])
  }, [])

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }, [])

  const patchTask = useCallback((taskId, updater) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        const patch = typeof updater === 'function' ? updater(task) : updater
        return { ...task, ...patch }
      }),
    )
  }, [])

  const toggleTaskComplete = useCallback((taskId) => {
    patchTask(taskId, (task) => ({ completed: !task.completed }))
  }, [patchTask])

  const updateTaskTitle = useCallback((taskId, newTitle) => {
    patchTask(taskId, { title: newTitle })
  }, [patchTask])

  const updateTaskPriority = useCallback((taskId, priority) => {
    patchTask(taskId, { priority })
  }, [patchTask])

  const updateTaskDueDate = useCallback((taskId, dueDate) => {
    patchTask(taskId, { dueDate })
  }, [patchTask])

  const updateTaskProject = useCallback((taskId, projectId) => {
    patchTask(taskId, { projectId })
  }, [patchTask])

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTaskTitle,
    updateTaskPriority,
    updateTaskDueDate,
    updateTaskProject,
  }
}
