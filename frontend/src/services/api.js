// VERSION: v1.0.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team
import axios from 'axios'

// URL base da API SKYNET (ajustar conforme necessário)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/sociais'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error)
    return Promise.reject(error)
  }
)

// Criar nova tabulação
export const createTabulation = async (data) => {
  try {
    const response = await api.post('/tabulation', data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao criar tabulação')
  }
}

// Listar tabulações com filtros
export const getTabulations = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.socialNetwork) {
      if (Array.isArray(filters.socialNetwork)) {
        filters.socialNetwork.forEach(network => params.append('socialNetwork', network))
      } else {
        params.append('socialNetwork', filters.socialNetwork)
      }
    }
    
    if (filters.contactReason) {
      if (Array.isArray(filters.contactReason)) {
        filters.contactReason.forEach(reason => params.append('contactReason', reason))
      } else {
        params.append('contactReason', filters.contactReason)
      }
    }
    
    if (filters.sentiment) {
      if (Array.isArray(filters.sentiment)) {
        filters.sentiment.forEach(sent => params.append('sentiment', sent))
      } else {
        params.append('sentiment', filters.sentiment)
      }
    }
    
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom)
    }
    
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo)
    }
    
    const response = await api.get('/tabulations', { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao listar tabulações')
  }
}

// Obter métricas do dashboard
export const getDashboardMetrics = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.socialNetwork) {
      if (Array.isArray(filters.socialNetwork)) {
        filters.socialNetwork.forEach(network => params.append('socialNetwork', network))
      } else {
        params.append('socialNetwork', filters.socialNetwork)
      }
    }
    
    if (filters.contactReason) {
      if (Array.isArray(filters.contactReason)) {
        filters.contactReason.forEach(reason => params.append('contactReason', reason))
      } else {
        params.append('contactReason', filters.contactReason)
      }
    }
    
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom)
    }
    
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo)
    }
    
    const response = await api.get('/dashboard/metrics', { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao obter métricas')
  }
}

// Obter dados para gráficos
export const getChartData = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.socialNetwork) {
      if (Array.isArray(filters.socialNetwork)) {
        filters.socialNetwork.forEach(network => params.append('socialNetwork', network))
      } else {
        params.append('socialNetwork', filters.socialNetwork)
      }
    }
    
    if (filters.contactReason) {
      if (Array.isArray(filters.contactReason)) {
        filters.contactReason.forEach(reason => params.append('contactReason', reason))
      } else {
        params.append('contactReason', filters.contactReason)
      }
    }
    
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom)
    }
    
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo)
    }
    
    const response = await api.get('/dashboard/charts', { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao obter dados de gráficos')
  }
}

// Obter feed de atendimentos
export const getFeed = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.socialNetwork) {
      if (Array.isArray(filters.socialNetwork)) {
        filters.socialNetwork.forEach(network => params.append('socialNetwork', network))
      } else {
        params.append('socialNetwork', filters.socialNetwork)
      }
    }
    
    if (filters.contactReason) {
      if (Array.isArray(filters.contactReason)) {
        filters.contactReason.forEach(reason => params.append('contactReason', reason))
      } else {
        params.append('contactReason', filters.contactReason)
      }
    }
    
    if (filters.sentiment) {
      if (Array.isArray(filters.sentiment)) {
        filters.sentiment.forEach(sent => params.append('sentiment', sent))
      } else {
        params.append('sentiment', filters.sentiment)
      }
    }
    
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom)
    }
    
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo)
    }
    
    const response = await api.get('/feed', { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao obter feed')
  }
}

// Analisar sentimento e motivo via IA
export const analyzeText = async (text) => {
  try {
    const response = await api.post('/analyze', { text })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao analisar texto')
  }
}

// Gerar relatório executivo
export const generateReport = async (data, filters = null) => {
  try {
    const payload = filters ? { filters } : { data }
    const response = await api.post('/report', payload)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao gerar relatório')
  }
}

// Obter tabulação por ID
export const getTabulationById = async (id) => {
  try {
    const response = await api.get(`/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao obter tabulação')
  }
}

// Atualizar tabulação
export const updateTabulation = async (id, data) => {
  try {
    const response = await api.put(`/${id}`, data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao atualizar tabulação')
  }
}

// Deletar tabulação
export const deleteTabulation = async (id) => {
  try {
    const response = await api.delete(`/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao deletar tabulação')
  }
}

export default api
