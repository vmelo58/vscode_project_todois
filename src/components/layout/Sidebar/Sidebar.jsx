import React from 'react'
import { FILTERS } from '../../../constants/filters.js'
import { PROJECTS } from '../../../constants/projects.js'
import './Sidebar.css'

const FILTER_ICONS = {
  [FILTERS.inbox.id]: '📥',
  [FILTERS.today.id]: '📅',
  [FILTERS.next7days.id]: '📆',
  [FILTERS.personal.id]: PROJECTS.personal.icon,
  [FILTERS.work.id]: PROJECTS.work.icon,
}

const PRIMARY_FILTERS = [
  FILTERS.inbox,
  FILTERS.today,
  FILTERS.next7days,
]

const PROJECT_FILTERS = [
  FILTERS.personal,
  FILTERS.work,
]

function Sidebar({ currentFilter, onFilterChange, filterCounts }) {
  const renderNavItem = (filter) => (
    <li
      key={filter.id}
      className={`nav-item ${currentFilter === filter.id ? 'active' : ''}`}
      onClick={() => onFilterChange(filter.id)}
    >
      <span className="nav-icon">{FILTER_ICONS[filter.id]}</span>
      <span className="nav-text">{filter.label}</span>
      <span className="task-count-badge">{filterCounts[filter.id] ?? 0}</span>
    </li>
  )

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {PRIMARY_FILTERS.map(renderNavItem)}
        </ul>

        <div className="projects-section">
          <h3 className="section-title">Projetos</h3>
          <ul className="nav-list">
            {PROJECT_FILTERS.map(renderNavItem)}
          </ul>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
