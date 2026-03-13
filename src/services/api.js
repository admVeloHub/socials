// VERSION: v1.0.3 | DATE: 2026-01-14 | AUTHOR: VeloHub Development Team
import axios from 'axios'

// URL base da API - Backend no Render (VITE_API_URL define em prod; fallback para velohub-backend)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://velohub-backend.onrender.com/api/sociais'

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
    
    // Log completo do body da resposta de erro
    console.error('❌ Erro na API:', {
      url: errorUrl,
      status: errorStatus,
      message: errorMessage,
      responseData: error.response?.data,
      responseBody: error.response?.data, // Body completo da resposta
      responseHeaders: error.response?.headers,
      requestData: requestData ? JSON.parse(requestData) : null,
      requestHeaders: error.config?.headers,
      fullError: error
    })
    
    // Log detalhado do body da resposta de erro
    console.error('📋 BODY DA RESPOSTA DE ERRO:', {
      status: errorStatus,
      statusText: error.response?.statusText,
      data: error.response?.data,
      dataStringified: JSON.stringify(error.response?.data, null, 2),
      headers: error.response?.headers
    })
    
    // Log mais detalhado para erros 400 e 500
    if (errorStatus === 400 || errorStatus === 500) {
      console.error(`📋 Detalhes do erro ${errorStatus}:`, {
        mensagem: error.response?.data?.error,
        success: error.response?.data?.success,
        details: error.response?.data?.details,
        bodyCompleto: error.response?.data,
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
    
    const fullUrl = `${API_BASE_URL}/tabulations?${params.toString()}`
    console.log('🌐 [API] Chamando:', fullUrl)
    console.log('🌐 [API] Filtros enviados:', filters)
    
    const response = await api.get('/tabulations', { params })
    
    console.log('✅ [API] Resposta recebida:', {
      status: response.status,
      count: response.data?.count,
      hasData: !!response.data?.data
    })
    
    return response.data
  } catch (error) {
    console.error('❌ [API] Erro ao listar tabulações:', {
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data,
      url: error.config?.url
    })
    throw new Error(error.response?.data?.error || 'Erro ao listar tabulações')
  }
}

// Obter métricas do dashboard
export const getDashboardMetrics = async (filters = {}) => {
  try {
    console.log('📊 [API] getDashboardMetrics - Filtros recebidos:', filters)
    
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
    
    const fullUrl = `${API_BASE_URL}/dashboard/metrics?${params.toString()}`
    console.log('🌐 [API] getDashboardMetrics - URL completa:', fullUrl)
    console.log('🌐 [API] getDashboardMetrics - Parâmetros construídos:', Object.fromEntries(params))
    
    const response = await api.get('/dashboard/metrics', { params })
    
    console.log('✅ [API] getDashboardMetrics - Resposta recebida:', {
      status: response.status,
      success: response.data?.success,
      hasData: !!response.data?.data,
      dataKeys: response.data?.data ? Object.keys(response.data.data) : []
    })
    
    return response.data
  } catch (error) {
    console.error('❌ [API] getDashboardMetrics - Erro:', {
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data,
      url: error.config?.url
    })
    
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
    console.log('📊 [API] getChartData - Filtros recebidos:', filters)
    
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
    
    const fullUrl = `${API_BASE_URL}/dashboard/charts?${params.toString()}`
    console.log('🌐 [API] getChartData - URL completa:', fullUrl)
    console.log('🌐 [API] getChartData - Parâmetros construídos:', Object.fromEntries(params))
    
    const response = await api.get('/dashboard/charts', { params })
    
    console.log('✅ [API] getChartData - Resposta recebida:', {
      status: response.status,
      success: response.data?.success,
      hasData: !!response.data?.data,
      dataKeys: response.data?.data ? Object.keys(response.data.data) : []
    })
    
    return response.data
  } catch (error) {
    console.error('❌ [API] getChartData - Erro:', {
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data,
      url: error.config?.url
    })
    
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
    console.log('📊 [API] getFeed - Filtros recebidos:', filters)
    
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
    
    const fullUrl = `${API_BASE_URL}/feed?${params.toString()}`
    console.log('🌐 [API] getFeed - URL completa:', fullUrl)
    console.log('🌐 [API] getFeed - Parâmetros construídos:', Object.fromEntries(params))
    
    const response = await api.get('/feed', { params })
    
    console.log('✅ [API] getFeed - Resposta recebida:', {
      status: response.status,
      success: response.data?.success,
      count: response.data?.count,
      hasData: !!response.data?.data,
      dataLength: response.data?.data?.length
    })
    
    return response.data
  } catch (error) {
    console.error('❌ [API] getFeed - Erro:', {
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data,
      url: error.config?.url
    })
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
    console.log('📊 [API] getRatingAverage - Filtros recebidos:', filters)
    
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
    
    const fullUrl = `${API_BASE_URL}/rating/average?${params.toString()}`
    console.log('🌐 [API] getRatingAverage - URL completa:', fullUrl)
    console.log('🌐 [API] getRatingAverage - Parâmetros construídos:', Object.fromEntries(params))
    
    const response = await api.get('/rating/average', { params })
    
    console.log('✅ [API] getRatingAverage - Resposta recebida:', {
      status: response.status,
      success: response.data?.success,
      average: response.data?.data?.average,
      count: response.data?.data?.count
    })
    
    return response.data
  } catch (error) {
    console.error('❌ [API] getRatingAverage - Erro:', {
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data,
      url: error.config?.url
    })
    
    // Se o endpoint não existir (404), retorna null para não quebrar o Dashboard
    if (error.response?.status === 404) {
      console.warn('⚠️ [API] getRatingAverage - Endpoint /rating/average não encontrado. Retornando null.')
      return { success: false, data: null }
    }
    throw new Error(error.response?.data?.error || 'Erro ao obter média de rating')
  }
}

export default api
