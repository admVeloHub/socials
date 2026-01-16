// VERSION: v1.0.3 | DATE: 2026-01-14 | AUTHOR: VeloHub Development Team
import axios from 'axios'

// URL base da API SKYNET - Backend Online
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://staging-skynet-278491073220.us-east1.run.app/api/sociais'

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
    // Melhorar log de erros com mais detalhes
    const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido'
    const errorStatus = error.response?.status
    const errorUrl = error.config?.url
    const requestData = error.config?.data
    
    console.error('❌ Erro na API:', {
      url: errorUrl,
      status: errorStatus,
      message: errorMessage,
      responseData: error.response?.data,
      requestData: requestData ? JSON.parse(requestData) : null,
      fullError: error
    })
    
    // Log mais detalhado para erros 400
    if (errorStatus === 400) {
      console.error('📋 Detalhes do erro 400:', {
        mensagem: error.response?.data?.error,
        dadosEnviados: requestData ? JSON.parse(requestData) : null,
        headers: error.config?.headers
      })
    }
    
    return Promise.reject(error)
  }
)

// Criar nova tabulação
export const createTabulation = async (data) => {
  try {
    console.log('🔄 Criando tabulação com dados:', data)
    const response = await api.post('/tabulation', data)
    console.log('✅ Tabulação criada com sucesso:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Erro ao criar tabulação:', {
      status: error.response?.status,
      error: error.response?.data,
      message: error.message
    })
    
    // Retornar objeto com success: false para manter compatibilidade
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.error || 'Dados inválidos. Verifique os campos obrigatórios.'
      console.error('📋 Erro 400 detalhado:', errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
    throw new Error(error.response?.data?.error || 'Erro ao criar tabulação')
  }
}

// Listar tabulações com filtros
export const getTabulations = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.socialNetwork && filters.socialNetwork !== '') {
      params.append('socialNetwork', filters.socialNetwork)
    }
    
    if (filters.contactReason && filters.contactReason !== '') {
      params.append('contactReason', filters.contactReason)
    }
    
    if (filters.sentiment && filters.sentiment !== '') {
      params.append('sentiment', filters.sentiment)
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
    
    if (filters.socialNetwork && filters.socialNetwork !== '') {
      params.append('socialNetwork', filters.socialNetwork)
    }
    
    if (filters.contactReason && filters.contactReason !== '') {
      params.append('contactReason', filters.contactReason)
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
    // Tratar erro 500 especificamente
    if (error.response?.status === 500) {
      console.error('Erro 500 no servidor ao buscar métricas:', error.response?.data)
      // Se houver dados na resposta mesmo com erro, tentar usar
      if (error.response?.data?.data) {
        return {
          success: true,
          data: error.response.data.data
        }
      }
      return { 
        success: false, 
        error: 'Erro interno do servidor ao buscar métricas. Tente novamente mais tarde.' 
      }
    }
    throw new Error(error.response?.data?.error || 'Erro ao obter métricas')
  }
}

// Obter dados para gráficos
export const getChartData = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.socialNetwork && filters.socialNetwork !== '') {
      params.append('socialNetwork', filters.socialNetwork)
    }
    
    if (filters.contactReason && filters.contactReason !== '') {
      params.append('contactReason', filters.contactReason)
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
    // Tratar erro 500 especificamente
    if (error.response?.status === 500) {
      console.error('Erro 500 no servidor ao buscar dados de gráficos:', error.response?.data)
      // Se houver dados na resposta mesmo com erro, tentar usar
      if (error.response?.data?.data) {
        return {
          success: true,
          data: error.response.data.data
        }
      }
      return { 
        success: false, 
        error: 'Erro interno do servidor ao buscar dados de gráficos. Tente novamente mais tarde.' 
      }
    }
    throw new Error(error.response?.data?.error || 'Erro ao obter dados de gráficos')
  }
}

// Obter feed de atendimentos
export const getFeed = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.socialNetwork && filters.socialNetwork !== '') {
      params.append('socialNetwork', filters.socialNetwork)
    }
    
    if (filters.contactReason && filters.contactReason !== '') {
      params.append('contactReason', filters.contactReason)
    }
    
    if (filters.sentiment && filters.sentiment !== '') {
      params.append('sentiment', filters.sentiment)
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

// Obter média de rating
export const getRatingAverage = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.socialNetwork && filters.socialNetwork !== '') {
      params.append('socialNetwork', filters.socialNetwork)
    }
    
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom)
    }
    
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo)
    }
    
    const response = await api.get('/rating/average', { params })
    return response.data
  } catch (error) {
    // Se o endpoint não existir (404), retorna null para não quebrar o Dashboard
    if (error.response?.status === 404) {
      console.warn('Endpoint /rating/average não encontrado. Retornando null.')
      return { success: false, data: null }
    }
    throw new Error(error.response?.data?.error || 'Erro ao obter média de rating')
  }
}

export default api
