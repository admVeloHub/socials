# Corrigir 404 "Rota não encontrada" - Nova Tabulação (Natralha)

## Problema
Ao criar tabulação, o erro 404 "Rota não encontrada" aparece no console.

## Causa
O frontend Natralha pode estar configurado como **Static Site** no Render. Nesse caso, o `server.js` (proxy) **não roda** e requisições para `/api/sociais` retornam 404.

## Solução

### No Render Dashboard → Serviço do frontend Natralha → Environment

Adicione ou edite a variável com a **URL do backend de tabulações do Natralha**:

| Variável | Valor |
|----------|--------|
| `VITE_API_URL` | `https://[BACKEND-NATRALHA].onrender.com/api/sociais` |

Use a URL do serviço de backend que contém as rotas de tabulação (`/api/sociais/tabulation`).

### Depois
1. Salve as variáveis
2. Faça **Manual Deploy** → **Clear build cache & deploy**
3. Aguarde o build e teste novamente

## Alternativa: Usar Web Service
Se preferir usar o proxy (URL do backend só no servidor), configure o serviço como **Web Service** no Render:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run serve`
- **Variável:** `BACKEND_API_URL` = URL base do backend Natralha (ex: `https://[seu-backend].onrender.com`)
