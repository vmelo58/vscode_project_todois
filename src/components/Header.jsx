import React from 'react'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
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
