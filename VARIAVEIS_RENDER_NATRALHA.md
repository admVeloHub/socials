# Variáveis de API - Natralha (Render)

## O que configurar no Render Dashboard

### 1. Serviço do FRONTEND (natralha.onrender.com)

| Variável | Valor | Quando usar |
|----------|-------|-------------|
| `VITE_API_URL` | `https://[URL-DO-SEU-BACKEND].onrender.com/api/sociais` | **Sempre** – Static Site ou Web Service |
| `BACKEND_API_URL` | `https://[URL-DO-SEU-BACKEND].onrender.com` | **Só** se for Web Service com proxy |

**Exemplo:** Se o backend está em `https://natralha-backend.onrender.com`:
- `VITE_API_URL` = `https://natralha-backend.onrender.com/api/sociais`

### 2. Serviço do BACKEND (tabulações – pasta Back)

| Variável | Descrição |
|----------|-----------|
| `MONGO_URI` ou `MONGODB_URI` | String de conexão do MongoDB |
| `PORT` | Definido automaticamente pelo Render |
| `NODE_ENV` | `production` |

---

## Como descobrir a URL do backend

1. Acesse https://dashboard.render.com
2. Abra o serviço que faz deploy da pasta **Back**
3. Copie a URL exibida no topo (ex: `https://xxx.onrender.com`)
4. Use essa URL em `VITE_API_URL` no frontend: `https://xxx.onrender.com/api/sociais`

---

## Checklist

- [ ] Backend (Back) deployado no Render
- [ ] `VITE_API_URL` configurada no frontend com a URL do backend + `/api/sociais`
- [ ] MongoDB configurado no backend
- [ ] Deploy executado após alterar variáveis
