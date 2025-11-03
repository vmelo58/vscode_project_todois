import { memo, useCallback } from 'react'
import { FILTERS } from '../../../constants/filters.js'
import { PROJECTS } from '../../../constants/projects.js'
import './Sidebar.css'

// Optimize: Move constants outside component to prevent recreation on every render
const FILTER_ICONS = Object.freeze({
  [FILTERS.inbox.id]: '📥',
  [FILTERS.today.id]: '📅',
  [FILTERS.upcoming.id]: '🗓️',
  [FILTERS.personal.id]: PROJECTS.personal.icon,
  [FILTERS.work.id]: PROJECTS.work.icon,
})

const PRIMARY_FILTERS = Object.freeze([
  FILTERS.inbox,
  FILTERS.today,
  FILTERS.upcoming,
])

const PROJECT_FILTERS = Object.freeze([
  FILTERS.personal,
  FILTERS.work,
])

function Sidebar({ currentFilter, onFilterChange, filterCounts, isOpen, isMobile, onClose }) {
  const handleFilterClick = useCallback((filterId) => {
    onFilterChange(filterId)
    if (isMobile && onClose) {
      onClose()
    }
  }, [onFilterChange, isMobile, onClose])

  const renderNavItem = useCallback((filter) => (
    <li key={filter.id}>
      <button
        type="button"
        className={`nav-item ${currentFilter === filter.id ? 'active' : ''}`}
        onClick={() => handleFilterClick(filter.id)}
        aria-pressed={currentFilter === filter.id}
        aria-current={currentFilter === filter.id ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden="true">{FILTER_ICONS[filter.id]}</span>
        <span className="nav-text">{filter.label}</span>
        <span className="task-count-badge">{filterCounts[filter.id] ?? 0}</span>
      </button>
    </li>
  ), [currentFilter, filterCounts, handleFilterClick])

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Fechar menu lateral"
        >
          <span className="sr-only">Fechar menu lateral</span>
        </button>
      )}

      <aside
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        aria-label="Navegação principal"
        data-open={isOpen}
      >
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
    </>
  )
}

export default memo(Sidebar)
