import { useMemo, useState } from 'react'
import Header from './components/layout/Header/Header.jsx'
import Sidebar from './components/layout/Sidebar/Sidebar.jsx'
import TaskList from './components/tasks/TaskList/TaskList.jsx'
import { DEFAULT_FILTER, FILTERS } from './constants/filters.js'
import { useToolbar } from './hooks/useToolbar.js'
import { useTasks } from './hooks/useTasks.js'
import { getLocalDateString, isWithinNextSevenDays } from './utils/date.js'
import './App.css'

function App() {
  useToolbar()

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
  } = useTasks()

  const filterCounts = useMemo(() => {
    const today = getLocalDateString()

    return {
      [FILTERS.inbox.id]: tasks.length,
      [FILTERS.today.id]: tasks.filter((task) => task.dueDate === today).length,
      [FILTERS.next7days.id]: tasks.filter((task) => isWithinNextSevenDays(task.dueDate)).length,
      [FILTERS.personal.id]: tasks.filter((task) => task.projectId === FILTERS.personal.id).length,
      [FILTERS.work.id]: tasks.filter((task) => task.projectId === FILTERS.work.id).length,
    }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    const today = getLocalDateString()

    switch (currentFilter) {
      case FILTERS.today.id:
        return tasks.filter((task) => task.dueDate === today)

      case FILTERS.next7days.id:
        return tasks.filter((task) => isWithinNextSevenDays(task.dueDate))

      case FILTERS.personal.id:
        return tasks.filter((task) => task.projectId === FILTERS.personal.id)

      case FILTERS.work.id:
        return tasks.filter((task) => task.projectId === FILTERS.work.id)

      default:
        return tasks
    }
  }, [currentFilter, tasks])

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          filterCounts={filterCounts}
        />
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
        />
      </div>
    </div>
  )
}

export default App
