// VERSION: v1.0.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team
import { useState } from 'react'
import TabulationForm from './components/TabulationForm'
import Dashboard from './components/Dashboard'
import Feed from './components/Feed'
import Reports from './components/Reports'
import './styles/theme.css'

function App() {
  const [activeTab, setActiveTab] = useState('tabulation')

  return (
    <div className="app">
      <header className="velohub-header">
        <h1>Social Command Center</h1>
        <nav className="nav-menu">
          <button 
            className={activeTab === 'tabulation' ? 'active' : ''}
            onClick={() => setActiveTab('tabulation')}
          >
            📥 Entrada de Dados
          </button>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeTab === 'feed' ? 'active' : ''}
            onClick={() => setActiveTab('feed')}
          >
            📱 Feed de Atendimento
          </button>
          <button 
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            📝 Relatórios
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'tabulation' && <TabulationForm />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'feed' && <Feed />}
        {activeTab === 'reports' && <Reports />}
      </main>
    </div>
  )
}

export default App
