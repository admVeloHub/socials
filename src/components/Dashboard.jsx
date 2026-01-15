// VERSION: v1.1.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team
import { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { DashboardOutlined } from '@mui/icons-material'
import { getDashboardMetrics, getChartData, getRatingAverage } from '../services/api'

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [ratingAverage, setRatingAverage] = useState(null)
  const [filters, setFilters] = useState({
    socialNetwork: [],
    contactReason: [],
    dateFrom: '',
    dateTo: ''
  })
  const [loading, setLoading] = useState(true)

  const socialNetworks = ['Instagram', 'Facebook', 'TikTok', 'Messenger', 'YouTube', 'PlayStore']
  const reasons = ['Comercial', 'Suporte', 'Bug', 'Elogio']

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [metricsResult, chartResult, ratingResult] = await Promise.allSettled([
        getDashboardMetrics(filters),
        getChartData(filters),
        getRatingAverage()
      ])

      if (metricsResult.status === 'fulfilled' && metricsResult.value?.success) {
        setMetrics(metricsResult.value.data)
      }

      if (chartResult.status === 'fulfilled' && chartResult.value?.success) {
        setChartData(chartResult.value.data)
      }

      if (ratingResult.status === 'fulfilled' && ratingResult.value?.success && ratingResult.value?.data) {
        setRatingAverage(ratingResult.value.data)
      } else if (ratingResult.status === 'rejected') {
        console.warn('Endpoint de rating não disponível:', ratingResult.reason?.message)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="velohub-container">
        <p>Carregando dados...</p>
      </div>
    )
  }

  return (
    <div className="velohub-container">
      <h2 className="section-title">
        <DashboardOutlined className="section-icon" />
        Command Center Metrics
      </h2>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Rede Social</label>
          <select
            multiple
            value={filters.socialNetwork}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value)
              handleFilterChange('socialNetwork', values)
            }}
            className="velohub-input"
          >
            {socialNetworks.map(network => (
              <option key={network} value={network}>{network}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Motivo</label>
          <select
            multiple
            value={filters.contactReason}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value)
              handleFilterChange('contactReason', values)
            }}
            className="velohub-input"
          >
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

      {/* Cards de Métricas */}
      {metrics && (
        <div className="metrics-cards">
          <div className="metric-card">
            <h3>Total de Contatos</h3>
            <p className="metric-value">{metrics.totalContacts}</p>
          </div>
          <div className="metric-card">
            <h3>% Sentimento Positivo</h3>
            <p className="metric-value">{metrics.positivePercent}%</p>
          </div>
          <div className="metric-card">
            <h3>Rede mais Ativa</h3>
            <p className="metric-value">{metrics.mostActiveNetwork || 'N/A'}</p>
          </div>
          {ratingAverage && (
            <div className="metric-card">
              <h3>Média</h3>
              <p className="metric-value">
                {ratingAverage.average ? ratingAverage.average.toFixed(2) : 'N/A'}
                {ratingAverage.average && <span className="metric-unit">⭐</span>}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Gráficos */}
      {chartData && (
        <div className="charts-section">
          <div className="chart-container">
            <h3>Volume por Rede Social</h3>
            <Plot
              data={[{
                x: chartData.networkVolume.map(item => item.socialNetwork),
                y: chartData.networkVolume.map(item => item.count),
                type: 'bar',
                marker: { color: '#1634FF' }
              }]}
              layout={{
                title: '',
                xaxis: { title: 'Rede Social' },
                yaxis: { title: 'Quantidade' },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)'
              }}
              style={{ width: '100%', height: '400px' }}
            />
          </div>

          <div className="chart-container">
            <h3>Motivos Frequentes</h3>
            <Plot
              data={[{
                values: chartData.reasonFrequency.map(item => item.count),
                labels: chartData.reasonFrequency.map(item => item.reason),
                type: 'pie',
                hole: 0.4
              }]}
              layout={{
                title: '',
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)'
              }}
              style={{ width: '100%', height: '400px' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
