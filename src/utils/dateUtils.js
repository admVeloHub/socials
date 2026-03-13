/**
 * Utilitários de data no fuso America/Sao_Paulo (Brasília, GMT-3).
 * Garante que exibição e envio à API usem sempre horário de Brasília, não UTC do servidor.
 */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Sao_Paulo')

const TZ = 'America/Sao_Paulo'

/**
 * Formata uma data/hora para exibição em pt-BR no fuso de Brasília (Intl).
 * @param {string|Date} dateInput - ISO string ou Date
 * @returns {string} Ex: "19/02/2025, 09:30"
 */
export function formatDateTimeBRT(dateInput) {
  if (dateInput == null || dateInput === '') return ''
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Formata apenas a data (sem hora) em pt-BR no fuso de Brasília.
 * @param {string|Date} dateInput
 * @returns {string} Ex: "19/02/2025"
 */
export function formatDateOnlyBRT(dateInput) {
  if (dateInput == null || dateInput === '') return ''
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

/**
 * Retorna a data de hoje no fuso de Brasília no formato YYYY-MM-DD (para input type="date").
 * Usa Intl para não depender dos dados de timezone do dayjs.
 * @returns {string}
 */
export function todayBRTDateString() {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date())
    const get = (type) => (parts.find((p) => p.type === type) || {}).value || ''
    const y = get('year')
    const m = get('month')
    const d = get('day')
    return `${y}-${m}-${d}`
  } catch {
    return dayjs().tz(TZ).format('YYYY-MM-DD')
  }
}

/**
 * Retorna o instante atual no fuso de Brasília formatado para exibição (pt-BR).
 * @returns {string}
 */
export function nowBRTFormatted() {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date())
}

/**
 * Gera nome de arquivo com data de hoje em BRT (YYYY-MM-DD).
 * @returns {string}
 */
export function todayBRTForFilename() {
  return todayBRTDateString()
}

/**
 * Converte string YYYY-MM-DD em Date representando o início desse dia em Brasília (00:00 BRT).
 * @param {string} yyyyMmDd
 * @returns {Date|null}
 */
export function parseDateOnlyAsBRT(yyyyMmDd) {
  if (!yyyyMmDd || !/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return null
  const d = new Date(yyyyMmDd + 'T00:00:00-03:00')
  return isNaN(d.getTime()) ? null : d
}
