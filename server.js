// Servidor simples para servir arquivos estáticos no Render
// Proxy /api/sociais para o backend (URL sensível só em variável de ambiente)
// VERSION: 1.1.0 | DATE: 2026-03-12

import { createServer } from 'http'
import { request as httpRequest } from 'http'
import { request as httpsRequest } from 'https'
import { readFileSync, existsSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3000
const DIST_DIR = join(__dirname, 'dist')
// URL do backend - SOMENTE em variável de ambiente (não no código)
const BACKEND_API_URL = process.env.BACKEND_API_URL || ''

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
}

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

function proxyToBackend(req, res) {
  if (!BACKEND_API_URL) {
    console.error('BACKEND_API_URL não configurada')
    res.writeHead(503, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: false, error: 'Backend não configurado' }))
    return
  }
  const url = new URL(req.url, `http://${req.headers.host}`)
  const targetUrl = new URL(url.pathname + url.search, BACKEND_API_URL)
  const isHttps = targetUrl.protocol === 'https:'
  const requestFn = isHttps ? httpsRequest : httpRequest
  const headers = { ...req.headers, host: targetUrl.host }
  delete headers['host']
  headers['host'] = targetUrl.host
  const proxyReq = requestFn(targetUrl, {
    method: req.method,
    headers
  }, (proxyRes) => {
    const excludeHeaders = ['transfer-encoding', 'connection']
    const resHeaders = {}
    for (const [k, v] of Object.entries(proxyRes.headers)) {
      if (v && !excludeHeaders.includes(k.toLowerCase())) resHeaders[k] = v
    }
    res.writeHead(proxyRes.statusCode || 200, resHeaders)
    proxyRes.pipe(res)
  })
  proxyReq.on('error', (err) => {
    console.error('Erro no proxy:', err.message)
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: false, error: 'Erro ao conectar ao backend' }))
  })
  req.pipe(proxyReq)
}

function serveFile(filePath, res) {
  try {
    if (!existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404 Not Found')
      return
    }

    const stats = statSync(filePath)
    if (stats.isDirectory()) {
      filePath = join(filePath, 'index.html')
    }

    if (!existsSync(filePath)) {
      // Para SPA, servir index.html para todas as rotas
      filePath = join(DIST_DIR, 'index.html')
    }

    const content = readFileSync(filePath)
    const mimeType = getMimeType(filePath)

    res.writeHead(200, { 'Content-Type': mimeType })
    res.end(content)
  } catch (error) {
    console.error('Error serving file:', error)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('500 Internal Server Error')
  }
}

const server = createServer((req, res) => {
  const pathname = req.url.split('?')[0]
  if (pathname.startsWith('/api/sociais')) {
    return proxyToBackend(req, res)
  }
  let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : pathname)
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(DIST_DIR, 'index.html')
  }
  serveFile(filePath, res)
})

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📁 Servindo arquivos de: ${DIST_DIR}`)
})
