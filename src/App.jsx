import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import Header from './components/layout/Header/Header.jsx'
import Sidebar from './components/layout/Sidebar/Sidebar.jsx'

// Lazy load views for better performance
const TaskList = lazy(() => import('./components/tasks/TaskList/TaskList.jsx'))
const UpcomingView = lazy(() => import('./components/tasks/UpcomingView/UpcomingView.jsx'))
import { DEFAULT_FILTER, FILTERS } from './constants/filters.js'
import { useSidebar } from './hooks/useSidebar.js'
import { useToolbar } from './hooks/useToolbar.js'
import { useTasks } from './hooks/useTasks.js'
import { getLocalDateString, isWithinNextSevenDays } from './utils/date.js'
import './App.css'

function App() {
  useToolbar()

  const { isSidebarOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar()
  const [currentFilter, setCurrentFilter] = useState(DEFAULT_FILTER)
  const {
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
  } = useTasks()

  // Optimize: Calculate date once outside reduce loop
  const filterCounts = useMemo(() => {
    const referenceDate = new Date()
    const today = getLocalDateString(referenceDate)

    return tasks.reduce(
      (acc, task) => {
        if (task.dueDate === today) {
          acc[FILTERS.today.id] += 1
        }

        if (isWithinNextSevenDays(task.dueDate, referenceDate)) {
          acc[FILTERS.upcoming.id] += 1
        }

        if (task.projectId === FILTERS.personal.id) {
          acc[FILTERS.personal.id] += 1
        }

        if (task.projectId === FILTERS.work.id) {
          acc[FILTERS.work.id] += 1
        }

        return acc
      },
      {
        [FILTERS.inbox.id]: tasks.length,
        [FILTERS.today.id]: 0,
        [FILTERS.upcoming.id]: 0,
        [FILTERS.personal.id]: 0,
        [FILTERS.work.id]: 0,
      },
    )
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (currentFilter === FILTERS.inbox.id) {
      return tasks
    }

    const referenceDate = new Date()
    const today = getLocalDateString(referenceDate)

    switch (currentFilter) {
      case FILTERS.today.id:
        return tasks.filter((task) => task.dueDate === today)

      case FILTERS.upcoming.id:
        return tasks.filter((task) => isWithinNextSevenDays(task.dueDate, referenceDate))

      case FILTERS.personal.id:
        return tasks.filter((task) => task.projectId === FILTERS.personal.id)

      case FILTERS.work.id:
        return tasks.filter((task) => task.projectId === FILTERS.work.id)

      default:
        return tasks
    }
  }, [currentFilter, tasks])

  useEffect(() => {
    if (!isMobile || !isSidebarOpen) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, isSidebarOpen, closeSidebar])

  return (
    <div className="app">
      <Header onMenuClick={toggleSidebar} isMobile={isMobile} isSidebarOpen={isSidebarOpen} />
      <div className="main-container">
        <Sidebar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          filterCounts={filterCounts}
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onClose={closeSidebar}
        />
        <Suspense fallback={<div className="loading-spinner">Carregando...</div>}>
          {currentFilter === FILTERS.upcoming.id ? (
            <UpcomingView
              tasks={tasks}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onToggleComplete={toggleTaskComplete}
              onUpdateTitle={updateTaskTitle}
              onUpdatePriority={updateTaskPriority}
              onUpdateDueDate={updateTaskDueDate}
              onUpdateProject={updateTaskProject}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              currentFilter={currentFilter}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onToggleComplete={toggleTaskComplete}
              onUpdateTitle={updateTaskTitle}
              onUpdatePriority={updateTaskPriority}
              onUpdateDueDate={updateTaskDueDate}
              onUpdateProject={updateTaskProject}
              onUpdateDescription={updateTaskDescription}
              onUpdateLabels={updateTaskLabels}
              onAddComment={addTaskComment}
              onDuplicateTask={duplicateTask}
              onAddSubtask={addSubtask}
              onIndentTask={indentTask}
              onOutdentTask={outdentTask}
              onMoveTask={moveTask}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}

export default App
