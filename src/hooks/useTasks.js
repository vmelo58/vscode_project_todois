import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_PROJECT_ID, PROJECTS } from '../constants/projects.js'
import { getLocalDateString } from '../utils/date.js'

const STORAGE_KEY = 'todoist-tasks'
const STORAGE_DEBOUNCE_MS = 500 // Debounce localStorage writes for better performance
const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const ID_LENGTH = 21

const generateId = () => {
  let result = ''
  for (let index = 0; index < ID_LENGTH; index += 1) {
    const random =
      typeof crypto !== 'undefined' && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint32Array(1))[0] % ID_ALPHABET.length
        : Math.floor(Math.random() * ID_ALPHABET.length)
    result += ID_ALPHABET.charAt(random)
  }

  return result
}

const normalizeTask = (task) => ({
  ...task,
  id: String(task.id),
})

const buildSeedTasks = () => ([
  {
    id: 'seed-1',
    title: 'Bem-vindo ao seu Todoist Clone!',
    completed: false,
    priority: null,
    dueDate: null,
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 'seed-2',
    title: 'Experimente definir prioridade 🚩',
    completed: false,
    priority: 1,
    dueDate: null,
    projectId: DEFAULT_PROJECT_ID,
  },
  {
    id: 'seed-3',
    title: 'Adicione uma data de vencimento 📅',
    completed: false,
    priority: null,
    dueDate: getLocalDateString(),
    projectId: PROJECTS.personal.id,
  },
  {
    id: 'seed-4',
    title: 'Organize por projetos 📁',
    completed: false,
    priority: 2,
    dueDate: null,
    projectId: PROJECTS.work.id,
  },
]).map(normalizeTask)

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

    return parsed.map(normalizeTask)
  } catch (error) {
    console.warn('Falha ao carregar tarefas salvas. Usando dados padrão.', error)
    return buildSeedTasks()
  }
}

export const useTasks = () => {
  const [tasks, setTasks] = useState(readStorage)
  const saveTimeoutRef = useRef(null)

  // Debounced localStorage save for better performance
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Schedule new save
    saveTimeoutRef.current = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }, STORAGE_DEBOUNCE_MS)

    // Cleanup: Save immediately on unmount to prevent data loss
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        // Force immediate save before unmount to prevent data loss
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      }
    }
  }, [tasks])

  // Save immediately before page unload to prevent data loss
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const handleBeforeUnload = () => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [tasks])

  const addTask = useCallback((title, options = {}) => {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    const { dueDate = null, projectId = DEFAULT_PROJECT_ID, priority = null } = options
    const id = generateId()

    setTasks((prev) => [
      ...prev,
      {
        id,
        title: trimmedTitle,
        completed: false,
        priority,
        dueDate,
        projectId,
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
