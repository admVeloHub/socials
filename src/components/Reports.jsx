// VERSION: v1.1.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team
import { useState } from 'react'
import { AssessmentOutlined, DownloadOutlined, RocketLaunchOutlined } from '@mui/icons-material'
import { generateReport, getTabulations } from '../services/api'

const Reports = () => {
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    socialNetwork: '',
    contactReason: '',
    dateFrom: '',
    dateTo: ''
  })

  const socialNetworks = ['Instagram', 'Facebook', 'TikTok', 'Messenger', 'YouTube', 'PlayStore']
  const reasons = ['Comercial', 'Suporte', 'Bug', 'Elogio']

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    setReport('')

    try {
      // Buscar dados com filtros
      const tabulationsResult = await getTabulations(filters)
      
      if (!tabulationsResult.success || tabulationsResult.count === 0) {
        setReport('Nenhum dado encontrado para os filtros selecionados.')
        return
      }

      // Gerar relatório com os dados
      const result = await generateReport(null, filters)
      
      if (result.success) {
        setReport(result.data)
      } else {
        setReport(`Erro ao gerar relatório: ${result.error}`)
      }
    } catch (error) {
      setReport(`Erro ao gerar relatório: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!report) return

    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_cx_${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="velohub-container">
      <h2 className="section-title">
        <AssessmentOutlined className="section-icon" />
        Relatório Executivo de CX
      </h2>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Rede Social</label>
          <select
            value={filters.socialNetwork}
            onChange={(e) => handleFilterChange('socialNetwork', e.target.value)}
            className="velohub-input"
          >
            <option value="">Todas</option>
            {socialNetworks.map(network => (
              <option key={network} value={network}>{network}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Motivo</label>
          <select
            value={filters.contactReason}
            onChange={(e) => handleFilterChange('contactReason', e.target.value)}
            className="velohub-input"
          >
            <option value="">Todos</option>
            {reasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Data Inicial</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="velohub-input"
          />
        </div>

        <div className="filter-group">
          <label>Data Final</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="velohub-input"
          />
        </div>
      </div>

      <div className="report-actions">
        <button
          onClick={handleGenerateReport}
          className="velohub-btn"
          disabled={loading}
        >
          <RocketLaunchOutlined sx={{ fontSize: '1rem', mr: 1 }} />
          {loading ? 'Gerando relatório...' : 'Gerar Relatório com IA'}
        </button>

        {report && (
          <button
            onClick={handleDownload}
            className="velohub-btn secondary"
          >
            <DownloadOutlined sx={{ fontSize: '1rem', mr: 1 }} />
            Baixar Relatório (Markdown)
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-message">
          <p>Consultor de CX analisando dados...</p>
        </div>
      )}

      {report && !loading && (
        <div className="report-content">
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ 
              __html: report.split('\n').map(line => {
                // Processar markdown básico
                if (line.startsWith('# ')) {
                  return `<h1>${line.substring(2)}</h1>`
                } else if (line.startsWith('## ')) {
                  return `<h2>${line.substring(3)}</h2>`
                } else if (line.startsWith('### ')) {
                  return `<h3>${line.substring(4)}</h3>`
                } else if (line.startsWith('- ')) {
                  return `<li>${line.substring(2)}</li>`
                } else if (line.trim() === '') {
                  return '<br/>'
                } else {
                  return `<p>${line}</p>`
                }
              }).join('')
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Reports
