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

const createComment = (text) => ({
  id: generateId(),
  text,
  createdAt: new Date().toISOString(),
})

const normalizeComment = (comment) => ({
  id: comment?.id ? String(comment.id) : generateId(),
  text: comment?.text ?? '',
  createdAt: comment?.createdAt ?? new Date().toISOString(),
})

const normalizeTask = (task) => ({
  ...task,
  id: String(task.id),
  description: task.description || '',
  labels: task.labels || [],
  comments: Array.isArray(task.comments) ? task.comments.map(normalizeComment) : [],
  parentId: task.parentId ? String(task.parentId) : null,
})

const buildChildrenMap = (tasks) => {
  const map = new Map()
  tasks.forEach((task) => {
    const parentKey = task.parentId ? String(task.parentId) : null
    if (!map.has(parentKey)) {
      map.set(parentKey, [])
    }
    map.get(parentKey).push(task)
  })
  return map
}

const collectDescendantIds = (childrenMap, taskId) => {
  const result = []
  const children = childrenMap.get(taskId) || []

  children.forEach((child) => {
    result.push(child.id)
    result.push(...collectDescendantIds(childrenMap, child.id))
  })

  return result
}

const moveBranch = (tasks, branchRootId, referenceId, position = 'after', updateRoot) => {
  if (!branchRootId || branchRootId === referenceId) {
    return tasks
  }

  const childrenMap = buildChildrenMap(tasks)
  const branchIds = new Set([branchRootId, ...collectDescendantIds(childrenMap, branchRootId)])

  if (branchIds.size === 0) {
    return tasks
  }

  if (referenceId && branchIds.has(referenceId)) {
    return tasks
  }

  const branch = tasks.filter((task) => branchIds.has(task.id))
  if (branch.length === 0) {
    return tasks
  }

  const remainder = tasks.filter((task) => !branchIds.has(task.id))

  let insertIndex = remainder.length

  if (referenceId) {
    insertIndex = remainder.findIndex((task) => task.id === referenceId)

    if (insertIndex === -1) {
      return tasks
    }

    if (position === 'after') {
      insertIndex += 1
    }
  }

  const updatedBranch = typeof updateRoot === 'function'
    ? branch.map((task) => (task.id === branchRootId ? updateRoot(task) : task))
    : branch

  remainder.splice(insertIndex, 0, ...updatedBranch)

  return remainder
}

const buildSeedTasks = () => ([
  {
    id: 'seed-1',
    title: 'Bem-vindo ao seu Todoist Clone!',
    description: 'Explore as novas funcionalidades e organize suas tarefas',
    completed: false,
    priority: null,
    dueDate: null,
    projectId: DEFAULT_PROJECT_ID,
    labels: ['boas-vindas'],
    comments: [
      createComment('Você pode arrastar tarefas para reordenar.'),
    ],
    parentId: null,
  },
  {
    id: 'seed-2',
    title: 'Experimente definir prioridade',
    description: 'Use as prioridades para destacar tarefas importantes',
    completed: false,
    priority: 1,
    dueDate: null,
    projectId: DEFAULT_PROJECT_ID,
    labels: ['importante'],
    comments: [],
    parentId: 'seed-1',
  },
  {
    id: 'seed-3',
    title: 'Adicione uma data de vencimento',
    description: '',
    completed: false,
    priority: null,
    dueDate: getLocalDateString(),
    projectId: PROJECTS.personal.id,
    labels: ['pessoal'],
    comments: [],
    parentId: null,
  },
  {
    id: 'seed-4',
    title: 'Organize por projetos',
    description: 'Mantenha suas tarefas organizadas por contexto',
    completed: false,
    priority: 2,
    dueDate: null,
    projectId: PROJECTS.work.id,
    labels: ['trabalho'],
    comments: [],
    parentId: null,
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

  // Flush any pending debounced save to localStorage synchronously.
  // If a debounce timer exists, write the current tasks to storage and clear the timer.
  const flushPendingSave = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    if (saveTimeoutRef.current) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      } catch (e) {
        // Best-effort: if storage write fails, just continue
        // eslint-disable-next-line no-console
        console.warn('Falha ao gravar tarefas no localStorage durante flush', e)
      }

      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }
  }

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
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      } catch (e) {
        // Best-effort: ignore storage errors here
        // eslint-disable-next-line no-console
        console.warn('Falha ao gravar tarefas no localStorage', e)
      }
    }, STORAGE_DEBOUNCE_MS)

    // Cleanup: flush pending save immediately on unmount to prevent data loss
    return () => {
      flushPendingSave()
    }
  }, [tasks])

  // Save immediately before page unload to prevent data loss
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const handleBeforeUnload = () => {
      // Ensure any debounced save is flushed synchronously before the page unloads
      flushPendingSave()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handleBeforeUnload)
    }
  }, [tasks])

  const addTask = useCallback((title, options = {}) => {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return null
    }

    const {
      dueDate = null,
      projectId = DEFAULT_PROJECT_ID,
      priority = null,
      description = '',
      labels = [],
      comments = [],
      parentId = null,
      insertAfterId = null,
    } = options
    const id = generateId()

    setTasks((prev) => {
      const newTask = normalizeTask({
        id,
        title: trimmedTitle,
        description,
        completed: false,
        priority,
        dueDate,
        projectId,
        labels,
        comments,
        parentId,
      })

      if (!insertAfterId) {
        return [...prev, newTask]
      }

      const clone = [...prev]
      const insertIndex = clone.findIndex((task) => task.id === insertAfterId)

      if (insertIndex === -1) {
        clone.push(newTask)
        return clone
      }

      clone.splice(insertIndex + 1, 0, newTask)
      return clone
    })

    return id
  }, [])

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => {
      const childrenMap = buildChildrenMap(prev)
      const idsToRemove = new Set([taskId, ...collectDescendantIds(childrenMap, taskId)])
      return prev.filter((task) => !idsToRemove.has(task.id))
    })
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
    setTasks((prev) => {
      const target = prev.find((task) => task.id === taskId)
      if (!target) {
        return prev
      }

      const shouldComplete = !target.completed
      const childrenMap = buildChildrenMap(prev)
      const idsToUpdate = new Set([taskId, ...collectDescendantIds(childrenMap, taskId)])

      return prev.map((task) => (
        idsToUpdate.has(task.id) ? { ...task, completed: shouldComplete } : task
      ))
    })
  }, [])

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

  const updateTaskDescription = useCallback((taskId, description) => {
    patchTask(taskId, { description })
  }, [patchTask])

  const updateTaskLabels = useCallback((taskId, labels) => {
    patchTask(taskId, { labels })
  }, [patchTask])

  const addTaskComment = useCallback((taskId, text) => {
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    const comment = normalizeComment({ text: trimmed })

    patchTask(taskId, (task) => ({
      comments: [...(task.comments ?? []), comment],
    }))
  }, [patchTask])

  const duplicateTask = useCallback((taskId) => {
    setTasks((prev) => {
      const index = prev.findIndex((task) => task.id === taskId)
      if (index === -1) {
        return prev
      }

      const original = prev[index]
      const copy = normalizeTask({
        ...original,
        id: generateId(),
        title: `${original.title} (cópia)`,
        completed: false,
      })

      const next = [...prev]
      next.splice(index + 1, 0, copy)
      return next
    })
  }, [])

  const addSubtask = useCallback((parentId, options = {}) => {
    const newId = generateId()

    setTasks((prev) => {
      const parentTask = prev.find((task) => task.id === parentId)
      if (!parentTask) {
        return prev
      }

      const {
        title = '',
        description = '',
        dueDate = parentTask.dueDate ?? null,
        priority = null,
        labels = [],
      } = options

      const newTask = normalizeTask({
        id: newId,
        title,
        description,
        completed: false,
        priority,
        dueDate,
        projectId: parentTask.projectId,
        labels,
        comments: [],
        parentId,
      })

      const childrenMap = buildChildrenMap(prev)
      const descendants = collectDescendantIds(childrenMap, parentId)
      const insertAfterId = descendants.length > 0 ? descendants[descendants.length - 1] : parentId

      const next = [...prev]
      const insertIndex = next.findIndex((task) => task.id === insertAfterId)

      if (insertIndex === -1) {
        next.push(newTask)
      } else {
        next.splice(insertIndex + 1, 0, newTask)
      }

      return next
    })

    return newId
  }, [])

  const indentTask = useCallback((taskId, newParentId) => {
    if (!newParentId) {
      return
    }

    setTasks((prev) => {
      const taskExists = prev.some((task) => task.id === taskId)
      const parentExists = prev.some((task) => task.id === newParentId)

      if (!taskExists || !parentExists) {
        return prev
      }

      const childrenMap = buildChildrenMap(prev)
      const descendantIds = new Set(collectDescendantIds(childrenMap, taskId))

      if (descendantIds.has(newParentId)) {
        return prev
      }

      const parentDescendants = collectDescendantIds(childrenMap, newParentId)
      const referenceId = parentDescendants.length > 0
        ? parentDescendants[parentDescendants.length - 1]
        : newParentId

      return moveBranch(
        prev,
        taskId,
        referenceId,
        'after',
        (rootTask) => ({ ...rootTask, parentId: newParentId })
      )
    })
  }, [])

  const outdentTask = useCallback((taskId) => {
    setTasks((prev) => {
      const task = prev.find((entry) => entry.id === taskId)
      if (!task || !task.parentId) {
        return prev
      }

      const parentTask = prev.find((entry) => entry.id === task.parentId)
      if (!parentTask) {
        return prev
      }

      const newParentId = parentTask.parentId ? String(parentTask.parentId) : null
      const childrenMap = buildChildrenMap(prev)
      const branchIds = new Set([taskId, ...collectDescendantIds(childrenMap, taskId)])
      const parentDescendants = collectDescendantIds(childrenMap, parentTask.id)
      const referenceId = [...parentDescendants]
        .reverse()
        .find((id) => !branchIds.has(id)) || parentTask.id

      return moveBranch(
        prev,
        taskId,
        referenceId,
        'after',
        (rootTask) => ({ ...rootTask, parentId: newParentId })
      )
    })
  }, [])

  const moveTask = useCallback((taskId, targetId, options = {}) => {
    const { position = 'after' } = options

    setTasks((prev) => moveBranch(prev, taskId, targetId, position))
  }, [])

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTaskTitle,
    updateTaskPriority,
    updateTaskDueDate,
    updateTaskProject,
    updateTaskDescription,
    updateTaskLabels,
    addTaskComment,
    duplicateTask,
    addSubtask,
    indentTask,
    outdentTask,
    moveTask,
  }
}
