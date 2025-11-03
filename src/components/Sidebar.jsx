import React from 'react'
import './Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item active">
            <span className="nav-icon">📥</span>
            <span className="nav-text">Entrada</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📅</span>
            <span className="nav-text">Hoje</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📆</span>
            <span className="nav-text">Próximos 7 dias</span>
          </li>
        </ul>

        <div className="projects-section">
          <h3 className="section-title">Projetos</h3>
          <ul className="nav-list">
            <li className="nav-item">
              <span className="nav-icon">📌</span>
              <span className="nav-text">Pessoal</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">💼</span>
              <span className="nav-text">Trabalho</span>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
