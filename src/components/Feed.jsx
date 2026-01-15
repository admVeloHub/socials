// VERSION: v1.1.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team
import { useState, useEffect } from 'react'
import { ChatOutlined } from '@mui/icons-material'
import { getFeed } from '../services/api'

const Feed = () => {
  const [feedData, setFeedData] = useState([])
  const [filters, setFilters] = useState({
    socialNetwork: '',
    contactReason: '',
    sentiment: '',
    dateFrom: '',
    dateTo: ''
  })
  const [loading, setLoading] = useState(true)

  const socialNetworks = ['Instagram', 'Facebook', 'TikTok', 'Messenger', 'YouTube', 'PlayStore']
  const reasons = ['Comercial', 'Suporte', 'Bug', 'Elogio']
  const sentiments = ['Positivo', 'Neutro', 'Negativo']

  useEffect(() => {
    loadFeed()
  }, [filters])

  const loadFeed = async () => {
    setLoading(true)
    try {
      const result = await getFeed(filters)
      if (result.success) {
        setFeedData(result.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar feed:', error)
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

  const getNetworkClass = (network) => {
    return `card-${network.toLowerCase()}`
  }

  const getSentimentClass = (sentiment) => {
    return `sentiment-${sentiment?.toLowerCase() || 'neutro'}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <div className="velohub-container">
        <p>Carregando feed...</p>
      </div>
    )
  }

  return (
    <div className="velohub-container">
      <h2 className="section-title">
        <ChatOutlined className="section-icon" />
        Feed de Atendimento
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
          <label>Sentimento</label>
          <select
            value={filters.sentiment}
            onChange={(e) => handleFilterChange('sentiment', e.target.value)}
            className="velohub-input"
          >
            <option value="">Todos</option>
            {sentiments.map(sentiment => (
              <option key={sentiment} value={sentiment}>{sentiment}</option>
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

      {/* Feed de Atendimentos */}
      {feedData.length === 0 ? (
        <div className="empty-feed">
          <p>O feed está vazio.</p>
        </div>
      ) : (
        <div className="feed-list">
          {feedData.map((item) => (
            <div key={item._id} className={`velohub-card feed-card ${getNetworkClass(item.socialNetwork)}`}>
              <div className="feed-header">
                <strong>{item.socialNetwork} | {item.clientName}</strong>
                <span className={getSentimentClass(item.sentiment)}>
                  {item.sentiment || 'N/A'}
                </span>
              </div>
              <div className="feed-meta">
                <span className="badge">{item.contactReason || 'N/A'}</span>
                {item.rating && <span className="rating">⭐ {item.rating}</span>}
              </div>
              <p className="feed-message">"{item.messageText}"</p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="feed-link">
                  Ver link
                </a>
              )}
              <small className="feed-timestamp">{formatDate(item.createdAt)}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Feed
