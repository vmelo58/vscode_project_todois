import './Header.css'

function Header({ onMenuClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <button className="menu-button" onClick={onMenuClick} title="Menu" aria-label="Toggle menu">
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
          <button className="icon-button" title="Buscar">
            🔍
          </button>
          <button className="icon-button" title="Notificações">
            🔔
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
