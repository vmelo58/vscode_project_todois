import { useState, useEffect } from 'react'
import { initToolbar } from '@21st-extension/toolbar'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import TaskList from './components/TaskList'
import './App.css'

function App() {
  // Initialize 21st.dev toolbar in development mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      const stagewiseConfig = {
        plugins: [],
      }
      initToolbar(stagewiseConfig)
    }
  }, [])
  // Estado: armazena a lista de tarefas
  // Carrega do LocalStorage ou usa tarefas de exemplo
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todoist-tasks')
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: 1,
        title: 'Bem-vindo ao seu Todoist Clone!',
        completed: false,
        priority: null,
        dueDate: null,
        projectId: 'inbox'
      },
      {
        id: 2,
        title: 'Experimente definir prioridade 🚩',
        completed: false,
        priority: 1,
        dueDate: null,
        projectId: 'inbox'
      },
      {
        id: 3,
        title: 'Adicione uma data de vencimento 📅',
        completed: false,
        priority: null,
        dueDate: new Date().toISOString().split('T')[0],
        projectId: 'personal'
      },
      {
        id: 4,
        title: 'Organize por projetos 📁',
        completed: false,
        priority: 2,
        dueDate: null,
        projectId: 'work'
      },
    ]
  })

  // Salva no LocalStorage sempre que tasks mudar
  useEffect(() => {
    localStorage.setItem('todoist-tasks', JSON.stringify(tasks))
  }, [tasks])

  // CREATE - Adicionar nova tarefa
  const addTask = (taskTitle) => {
    const newTask = {
      id: Date.now(), // ID único baseado no timestamp
      title: taskTitle,
      completed: false,
      priority: null,
      dueDate: null,
      projectId: 'inbox'
    }
    setTasks([...tasks, newTask])
  }

  // DELETE - Deletar tarefa
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  // UPDATE - Marcar/desmarcar como concluída
  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  // UPDATE - Editar texto da tarefa
  const updateTaskTitle = (taskId, newTitle) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    ))
  }

  // UPDATE - Atualizar prioridade
  const updateTaskPriority = (taskId, priority) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, priority } : task
    ))
  }

  // UPDATE - Atualizar data de vencimento
  const updateTaskDueDate = (taskId, dueDate) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, dueDate } : task
    ))
  }

  // UPDATE - Atualizar projeto
  const updateTaskProject = (taskId, projectId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, projectId } : task
    ))
  }

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar />
        <TaskList
          tasks={tasks}
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
