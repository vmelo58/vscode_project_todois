import { memo } from 'react'
import './Header.css'

function Header({ onMenuClick, isMobile, isSidebarOpen }) {
  return (
    <header className="header">
      <div className="header-content">
        <button
          type="button"
          className={`menu-button ${isMobile ? 'menu-button--visible' : ''}`}
          onClick={onMenuClick}
          title="Abrir menu"
          aria-label="Alternar menu lateral"
          aria-expanded={isSidebarOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="logo">
          <span className="logo-icon">✓</span>
          <span className="logo-text">Todoist Clone</span>
        </div>
        <div className="header-actions">
          <button type="button" className="icon-button" title="Buscar" aria-label="Pesquisar">
            🔍
          </button>
          <button type="button" className="icon-button" title="Notificações" aria-label="Notificações">
            🔔
          </button>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
