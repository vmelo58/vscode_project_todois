import { memo, useEffect, useMemo, useRef, useState } from 'react'
import './ListToolbar.css'

function ListToolbar({
  showFilter = 'all',
  sortBy = 'manual',
  taskCount = 0,
  activeCount = 0,
  completedCount = 0,
  onShowFilterChange,
  onSortByChange,
}) {
  const [openMenu, setOpenMenu] = useState(null)
  const toolbarRef = useRef(null)

  const showFilterOptions = useMemo(() => ([
    { value: 'all', label: 'Todas', meta: `${taskCount} ${taskCount === 1 ? 'tarefa' : 'tarefas'}` },
    { value: 'active', label: 'Ativas', meta: `${activeCount} abertas` },
    { value: 'completed', label: 'Concluídas', meta: `${completedCount} finalizadas` },
  ]), [taskCount, activeCount, completedCount])

  const sortOptions = useMemo(() => ([
    { value: 'manual', label: 'Manual', meta: 'Arraste para reordenar' },
    { value: 'date', label: 'Data', meta: 'Mais próximos primeiro' },
    { value: 'priority', label: 'Prioridade', meta: 'Maior prioridade primeiro' },
    { value: 'name', label: 'Nome', meta: 'Ordem alfabética' },
  ]), [])

  const activeShowOption = showFilterOptions.find((option) => option.value === showFilter) || showFilterOptions[0]
  const activeSortOption = sortOptions.find((option) => option.value === sortBy) || sortOptions[0]

  useEffect(() => {
    if (!openMenu) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
      }
    }

    const handleClickOutside = (event) => {
      if (!toolbarRef.current || toolbarRef.current.contains(event.target)) {
        return
      }

      setOpenMenu(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenu])

  const toggleMenu = (menu) => {
    setOpenMenu((previous) => (previous === menu ? null : menu))
  }

  const handleShowFilterSelect = (value) => {
    onShowFilterChange?.(value)
    setOpenMenu(null)
  }

  const handleSortSelect = (value) => {
    onSortByChange?.(value)
    setOpenMenu(null)
  }

  return (
    <div className="list-toolbar" ref={toolbarRef}>
      <div className="toolbar-actions">
        <div className="toolbar-action">
          <button
            type="button"
            className={`toolbar-trigger ${openMenu === 'show' ? 'toolbar-trigger--active' : ''}`}
            onClick={() => toggleMenu('show')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'show'}
          >
            <span className="toolbar-trigger-label">Mostrar</span>
            <span className="toolbar-trigger-value">{activeShowOption.label}</span>
            <span className="toolbar-trigger-icon" aria-hidden="true">▾</span>
          </button>

          {openMenu === 'show' && (
            <div className="toolbar-menu" role="menu">
              {showFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`toolbar-menu-item ${option.value === showFilter ? 'toolbar-menu-item--active' : ''}`}
                  onClick={() => handleShowFilterSelect(option.value)}
                >
                  <span className="toolbar-menu-label">{option.label}</span>
                  <span className="toolbar-menu-meta">{option.meta}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="toolbar-action">
          <button
            type="button"
            className={`toolbar-trigger ${openMenu === 'sort' ? 'toolbar-trigger--active' : ''}`}
            onClick={() => toggleMenu('sort')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'sort'}
          >
            <span className="toolbar-trigger-label">Ordenar</span>
            <span className="toolbar-trigger-value">{activeSortOption.label}</span>
            <span className="toolbar-trigger-icon" aria-hidden="true">▾</span>
          </button>

          {openMenu === 'sort' && (
            <div className="toolbar-menu" role="menu">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`toolbar-menu-item ${option.value === sortBy ? 'toolbar-menu-item--active' : ''}`}
                  onClick={() => handleSortSelect(option.value)}
                >
                  <span className="toolbar-menu-label">{option.label}</span>
                  <span className="toolbar-menu-meta">{option.meta}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-summary">
        <span className="toolbar-summary-value">{taskCount}</span>
        <span className="toolbar-summary-label">{taskCount === 1 ? 'tarefa' : 'tarefas'}</span>
      </div>
    </div>
  )
}

export default memo(ListToolbar)
