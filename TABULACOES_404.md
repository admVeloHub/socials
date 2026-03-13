# Corrigir 404 "Rota não encontrada" - Nova Tabulação

**Frontend:** https://tabulacoes.onrender.com (srv-d6lh83fkijhs73dngqg0)

## Problema
Ao criar tabulação, o erro 404 "Rota não encontrada" aparece no console.

## Causa
O frontend pode estar como **Static Site** no Render. Nesse caso, o `server.js` (proxy) **não roda** e requisições para `/api/sociais` retornam 404.

## Solução

### No Render Dashboard → Serviço tabulacoes (srv-d6lh83fkijhs73dngqg0) → Environment

Adicione a variável com a **URL do backend de tabulações**:

| Variável | Valor |
|----------|--------|
| `VITE_API_URL` | `https://[URL-DO-BACKEND].onrender.com/api/sociais` |

### Depois
1. Salve as variáveis
2. **Manual Deploy** → **Clear build cache & deploy**
3. Teste novamente
