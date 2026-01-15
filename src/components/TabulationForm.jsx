// VERSION: v1.1.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team
import { useState } from 'react'
import { AddCircleOutlined } from '@mui/icons-material'
import { createTabulation, analyzeText } from '../services/api'

const TabulationForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    socialNetwork: 'Instagram',
    messageText: '',
    rating: '',
    contactReason: '',
    sentiment: '',
    directedCenter: false,
    link: ''
  })
  
  const [useAI, setUseAI] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const socialNetworks = ['Instagram', 'Facebook', 'TikTok', 'Messenger', 'YouTube', 'PlayStore']
  const reasons = ['Comercial', 'Suporte', 'Bug', 'Elogio']
  const sentiments = ['Positivo', 'Neutro', 'Negativo']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAIAnalysis = async () => {
    if (!formData.messageText.trim()) {
      setMessage('Por favor, insira o texto da mensagem para análise')
      return
    }

    setLoading(true)
    try {
      const result = await analyzeText(formData.messageText)
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          sentiment: result.data.sentiment,
          contactReason: result.data.reason
        }))
        setMessage('Análise realizada com sucesso!')
      } else if (result.fallback) {
        setFormData(prev => ({
          ...prev,
          sentiment: result.fallback.sentiment,
          contactReason: result.fallback.reason
        }))
        setMessage('Análise realizada com valores padrão')
      }
    } catch (error) {
      setMessage(`Erro na análise: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.clientName || !formData.messageText) {
      setMessage('Preencha os campos obrigatórios')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const data = {
        ...formData,
        rating: formData.socialNetwork === 'PlayStore' && formData.rating 
          ? parseInt(formData.rating.replace('⭐', '').trim()) 
          : null
      }

      const result = await createTabulation(data)
      
      if (result.success) {
        setMessage('Tabulação criada com sucesso!')
        // Reset form
        setFormData({
          clientName: '',
          socialNetwork: 'Instagram',
          messageText: '',
          rating: '',
          contactReason: '',
          sentiment: '',
          directedCenter: false,
          link: ''
        })
      } else {
        setMessage(`Erro: ${result.error}`)
      }
    } catch (error) {
      setMessage(`Erro ao criar tabulação: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="velohub-container">
      <h2 className="section-title">
        <AddCircleOutlined className="section-icon" />
        Nova Tabulação
      </h2>
      
      {message && (
        <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="tabulation-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="clientName">Nome do Cliente *</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="velohub-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="socialNetwork">Rede Social *</label>
            <select
              id="socialNetwork"
              name="socialNetwork"
              value={formData.socialNetwork}
              onChange={handleChange}
              className="velohub-input"
              required
            >
              {socialNetworks.map(network => (
                <option key={network} value={network}>{network}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="messageText">Texto da Mensagem Principal *</label>
          <textarea
            id="messageText"
            name="messageText"
            value={formData.messageText}
            onChange={handleChange}
            className="velohub-input"
            rows="4"
            required
          />
        </div>

        {formData.socialNetwork === 'YouTube' && (
          <div className="form-group">
            <label htmlFor="link">Link do Vídeo</label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="velohub-input"
            />
          </div>
        )}

        {formData.socialNetwork === 'PlayStore' && (
          <div className="form-group">
            <label htmlFor="rating">Avaliação *</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="velohub-input"
              required
            >
              <option value="">Selecione</option>
              <option value="1⭐">1⭐</option>
              <option value="2⭐">2⭐</option>
              <option value="3⭐">3⭐</option>
              <option value="4⭐">4⭐</option>
              <option value="5⭐">5⭐</option>
            </select>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactReason">Motivo do Contato</label>
            <select
              id="contactReason"
              name="contactReason"
              value={formData.contactReason}
              onChange={handleChange}
              className="velohub-input"
            >
              <option value="">Selecione</option>
              {reasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sentiment">Sentimento</label>
            <select
              id="sentiment"
              name="sentiment"
              value={formData.sentiment}
              onChange={handleChange}
              className="velohub-input"
            >
              <option value="">Selecione</option>
              {sentiments.map(sentiment => (
                <option key={sentiment} value={sentiment}>{sentiment}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="directedCenter" className="checkbox-label">
            <input
              type="checkbox"
              id="directedCenter"
              name="directedCenter"
              checked={formData.directedCenter}
              onChange={handleChange}
            />
            Direcionado para Central
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="useAI" className="checkbox-label">
            <input
              type="checkbox"
              id="useAI"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
            Usar Análise Expressa (IA)
          </label>
          {useAI && (
            <button
              type="button"
              onClick={handleAIAnalysis}
              className="velohub-btn secondary"
              disabled={loading || !formData.messageText.trim()}
            >
              {loading ? 'Analisando...' : 'Analisar com IA'}
            </button>
          )}
        </div>

        <button
          type="submit"
          className="velohub-btn"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Tabulação'}
        </button>
      </form>
    </div>
  )
}

export default TabulationForm
