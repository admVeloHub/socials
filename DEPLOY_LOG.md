# Deploy Log - Veloredes

## Histórico de Deploys e Alterações

---

### GitHub Push - 2026-01-14 18:15:00

**Tipo:** Push para GitHub  
**Repositório:** https://github.com/admVeloHub/socials  
**Branch:** main  
**Versão:** v1.0.2

**Arquivos Modificados/Adicionados:**
- `vercel.json` - Criado arquivo de configuração do Vercel
- `package.json` - Criado package.json na raiz para facilitar deploy no Vercel
- `DEPLOY_LOG.md` - Atualizado log de deploy

**Descrição:**
- Configuração do Vercel para build e deploy do projeto React/Vite
- Build configurado para executar na pasta `frontend/`
- Output directory configurado para `frontend/dist`
- Rewrites configurados para SPA (Single Page Application)
- Framework detectado como Vite

---

### GitHub Push - 2026-01-14 18:30:00

**Tipo:** Push para GitHub  
**Repositório:** https://github.com/admVeloHub/socials  
**Branch:** main  
**Versão:** v1.0.5

**Arquivos Modificados/Adicionados:**
- `vercel.json` - Atualizado buildCommand para usar `npx vite build`
- `package.json` - Atualizado script de build para usar `npx vite build`
- `DEPLOY_LOG.md` - Atualizado log de deploy

**Descrição:**
- Correção do problema "vite: command not found" no deploy do Vercel
- BuildCommand atualizado para usar `npx vite build` ao invés de `npm run build`
- Uso de `npx` garante que o vite seja encontrado mesmo se não estiver no PATH
- Script de build no package.json também atualizado para consistência

---

### GitHub Push - 2026-01-14 18:25:00

**Tipo:** Push para GitHub  
**Repositório:** https://github.com/admVeloHub/socials  
**Branch:** main  
**Versão:** v1.0.4

**Arquivos Modificados/Adicionados:**
- Reestruturação completa: conteúdo da pasta `frontend/` movido para a raiz do projeto
- `package.json` - Atualizado para refletir nova estrutura (versão 1.0.1)
- `vercel.json` - Simplificado para executar comandos na raiz (sem `cd frontend`)
- `index.html`, `vite.config.js`, `src/` - Movidos para raiz
- Pasta `frontend/` removida
- `DEPLOY_LOG.md` - Atualizado log de deploy

**Descrição:**
- Reestruturação do projeto para facilitar deploy no Vercel
- Todos os arquivos do frontend agora estão na raiz do projeto
- Configuração do Vercel simplificada: `npm install` e `npm run build` executam diretamente na raiz
- Output directory atualizado para `dist` (ao invés de `frontend/dist`)
- Resolve problema de "vite: command not found" no deploy

---

### GitHub Push - 2026-01-14 18:20:00

**Tipo:** Push para GitHub  
**Repositório:** https://github.com/admVeloHub/socials  
**Branch:** main  
**Versão:** v1.0.3

**Arquivos Modificados/Adicionados:**
- `vercel.json` - Ajustado installCommand e buildCommand para executar diretamente na pasta frontend
- `package.json` - Removido `npm ci` do script de build (dependências já instaladas pelo installCommand)
- `DEPLOY_LOG.md` - Atualizado log de deploy

**Descrição:**
- Correção da configuração do Vercel para build funcionar corretamente
- installCommand agora executa `cd frontend && npm install` diretamente
- buildCommand agora executa `cd frontend && npm run build` sem npm ci redundante
- Resolve erro "vite: command not found" no deploy

---

### GitHub Push - 2026-01-14 18:10:00

**Tipo:** Push para GitHub  
**Repositório:** https://github.com/admVeloHub/socials  
**Branch:** main  
**Versão:** v1.0.1

**Arquivos Modificados/Adicionados:**
- `frontend/src/services/api.js` - Atualizado endpoint da API para staging (v1.0.1)
- `DEPLOY_LOG.md` - Atualizado log de deploy

**Descrição:**
- Configuração da API atualizada para usar endpoint staging: `https://staging-skynet-278491073220.us-east1.run.app/api/sociais`
- Frontend agora conecta automaticamente ao backend staging
- Mantida possibilidade de sobrescrever via variável de ambiente `VITE_API_URL`

---

### GitHub Push - 2026-01-14 18:05:00

**Tipo:** Push para GitHub  
**Repositório:** https://github.com/admVeloHub/socials  
**Branch:** main  
**Versão:** v1.0.0

**Arquivos Modificados/Adicionados:**
- `DEPLOY_LOG.md` - Criado log de deploy
- `frontend/vite.config.js` - Configurado para acesso na rede local (host: '0.0.0.0')
- `frontend/` - Estrutura completa do frontend React/Vite (incluindo node_modules)
- `LAYOUT_GUIDELINES.md` - Guia de layout e padrões visuais
- `LISTA_SCHEMAS.rb` - Schemas das coleções MongoDB
- `tailwind.config.js` - Configuração do Tailwind CSS

**Descrição:**
- Configuração do projeto React para funcionar na rede local
- Frontend configurado para se conectar à API REST na porta 3001
- Projeto migrado do Streamlit para React/Vite
- Configuração do Vite para permitir acesso via IP local (0.0.0.0)
- Push realizado com sucesso: 12426 objetos enviados (59.80 MiB)

---
