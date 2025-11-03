import { memo } from 'react'
import './ListToolbar.css'

function ListToolbar({
  showFilter = 'all',
  sortBy = 'manual',
  taskCount = 0,
  activeCount = 0,
  completedCount = 0,
  onShowFilterChange,
  onSortByChange
}) {
  return (
    <div className="list-toolbar">
      <div className="toolbar-left">
        {/* Show Filter Dropdown */}
        <div className="toolbar-dropdown">
          <label htmlFor="show-filter" className="toolbar-label">
            Exibir:
          </label>
          <select
            id="show-filter"
            value={showFilter}
            onChange={(e) => onShowFilterChange(e.target.value)}
            className="toolbar-select"
          >
            <option value="all">Todas ({taskCount})</option>
            <option value="active">Ativas ({activeCount})</option>
            <option value="completed">Concluídas ({completedCount})</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="toolbar-dropdown">
          <label htmlFor="sort-by" className="toolbar-label">
            Ordenar:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="toolbar-select"
          >
            <option value="manual">Manual</option>
            <option value="date">Data</option>
            <option value="priority">Prioridade</option>
            <option value="name">Nome</option>
          </select>
        </div>
      </div>

      <div className="toolbar-right">
        {/* Task Counter */}
        <div className="task-counter">
          <span className="counter-value">{taskCount}</span>
          <span className="counter-label">
            {taskCount === 1 ? 'tarefa' : 'tarefas'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(ListToolbar)
