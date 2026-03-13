// VERSION: v1.0.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team
import { formatDateOnlyBRT, todayBRTForFilename } from './dateUtils'
// Cache para bibliotecas carregadas
let jsPDFCache = null
let html2canvasCache = null

const loadPDFLibraries = async () => {
  try {
    // Carregar jsPDF
    if (!jsPDFCache) {
      const jspdfModule = await import('jspdf')
      // jsPDF pode ser exportado de diferentes formas dependendo da versão
      jsPDFCache = jspdfModule.default || jspdfModule.jsPDF || jspdfModule
      // Se for um objeto, tentar acessar a classe diretamente
      if (typeof jsPDFCache === 'object' && jsPDFCache.jsPDF) {
        jsPDFCache = jsPDFCache.jsPDF
      }
    }
    
    // Carregar html2canvas
    if (!html2canvasCache) {
      const html2canvasModule = await import('html2canvas')
      html2canvasCache = html2canvasModule.default || html2canvasModule
    }
    
    if (!jsPDFCache || !html2canvasCache) {
      throw new Error('Não foi possível carregar as bibliotecas PDF')
    }
    
    return { jsPDF: jsPDFCache, html2canvas: html2canvasCache }
  } catch (error) {
    console.error('Erro ao carregar bibliotecas PDF:', error)
    throw error
  }
}

/**
 * Remove códigos de citação do texto
 * @param {string} text - Texto a ser processado
 * @returns {string} Texto sem códigos [cite_start] e [cite:]
 */
const removeCitationCodes = (text) => {
  if (!text) return ''
  
  // Remove blocos completos [cite_start]... [cite: ]
  text = text.replace(/\[cite_start\][\s\S]*?\[cite:\s*\]/g, '')
  
  // Remove [cite_start] sozinho
  text = text.replace(/\[cite_start\]/g, '')
  
  // Remove [cite: ] sozinho (com ou sem espaço)
  text = text.replace(/\[cite:\s*\]/g, '')
  
  // Remove [cite: qualquer coisa] (padrão como [cite: Dados Coletados])
  text = text.replace(/\[cite:\s*[^\]]+\]/g, '')
  
  return text
}

/**
 * Processa elementos inline do Markdown (negrito) e remove asteriscos literais
 * @param {string} text - Texto a ser processado
 * @returns {string} Texto com elementos Markdown convertidos para HTML e asteriscos literais removidos
 */
const processMarkdownInline = (text) => {
  if (!text) return ''
  
  // PRIMEIRA PASSADA: Converter negrito válido **texto** para <strong>texto</strong>
  // Processar múltiplas ocorrências na mesma linha
  // Usar regex que captura texto entre ** sem incluir os asteriscos
  text = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
  
  // SEGUNDA PASSADA: Remover todos os asteriscos literais restantes
  // Após converter negrito válido, qualquer asterisco restante é literal e deve ser removido
  // Isso remove:
  // - Asteriscos duplos ** não fechados corretamente
  // - Asteriscos soltos * que não fazem parte de formatação válida
  // - Qualquer asterisco literal que possa aparecer no texto
  text = text.replace(/\*\*/g, '') // Remove ** duplos restantes
  text = text.replace(/\*/g, '') // Remove * soltos restantes
  
  return text
}

/**
 * Converte markdown para HTML formatado
 */
const markdownToHtml = (markdown) => {
  if (!markdown) return ''
  
  const lines = markdown.split('\n')
  const htmlParts = []
  let inList = false
  let currentListItems = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Remover códigos de citação primeiro
    const cleanedLine = removeCitationCodes(line)
    
    // Ignorar linhas de quebra de página (já processadas antes)
    if (cleanedLine.includes('[QUEBRA DE PÁGINA') || cleanedLine.includes('[QUEBRA DE PAGINA')) {
      // Fechar lista se estiver aberta
      if (inList) {
        htmlParts.push(`<ul style="margin: 10px 0; padding-left: 20px; list-style-type: disc;">${currentListItems.join('')}</ul>`)
        currentListItems = []
        inList = false
      }
      continue
    }
    
    // Títulos
    if (cleanedLine.startsWith('# ')) {
      // Fechar lista se estiver aberta
      if (inList) {
        htmlParts.push(`<ul style="margin: 10px 0; padding-left: 20px; list-style-type: disc;">${currentListItems.join('')}</ul>`)
        currentListItems = []
        inList = false
      }
      const content = processMarkdownInline(cleanedLine.substring(2))
      htmlParts.push(`<h1 style="color: #1634FF; font-size: 24px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; font-family: 'Poppins', sans-serif;">${content}</h1>`)
    } else if (cleanedLine.startsWith('## ')) {
      // Fechar lista se estiver aberta
      if (inList) {
        htmlParts.push(`<ul style="margin: 10px 0; padding-left: 20px; list-style-type: disc;">${currentListItems.join('')}</ul>`)
        currentListItems = []
        inList = false
      }
      const content = processMarkdownInline(cleanedLine.substring(3))
      htmlParts.push(`<h2 style="color: #1634FF; font-size: 20px; margin-top: 18px; margin-bottom: 8px; font-weight: bold; font-family: 'Poppins', sans-serif;">${content}</h2>`)
    } else if (cleanedLine.startsWith('### ')) {
      // Fechar lista se estiver aberta
      if (inList) {
        htmlParts.push(`<ul style="margin: 10px 0; padding-left: 20px; list-style-type: disc;">${currentListItems.join('')}</ul>`)
        currentListItems = []
        inList = false
      }
      const content = processMarkdownInline(cleanedLine.substring(4))
      htmlParts.push(`<h3 style="color: #1634FF; font-size: 18px; margin-top: 16px; margin-bottom: 6px; font-weight: bold; font-family: 'Poppins', sans-serif;">${content}</h3>`)
    }
    // Listas
    else if (cleanedLine.match(/^\s*[-*]\s/)) {
      if (!inList) {
        inList = true
      }
      const content = processMarkdownInline(cleanedLine.replace(/^\s*[-*]\s+/, ''))
      // Detectar indentação para listas aninhadas
      const indentMatch = cleanedLine.match(/^(\s*)([-*])/)
      const indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0
      const paddingLeft = indentLevel * 20
      currentListItems.push(`<li style="margin-bottom: 6px; line-height: 1.6; color: #272A30; padding-left: ${paddingLeft}px;">${content}</li>`)
    }
    // Linha em branco
    else if (cleanedLine.trim() === '') {
      // Fechar lista se estiver aberta
      if (inList) {
        htmlParts.push(`<ul style="margin: 10px 0; padding-left: 20px; list-style-type: disc;">${currentListItems.join('')}</ul>`)
        currentListItems = []
        inList = false
      }
      htmlParts.push('<br/>')
    }
    // Parágrafos
    else {
      // Fechar lista se estiver aberta
      if (inList) {
        htmlParts.push(`<ul style="margin: 10px 0; padding-left: 20px; list-style-type: disc;">${currentListItems.join('')}</ul>`)
        currentListItems = []
        inList = false
      }
      const content = processMarkdownInline(cleanedLine)
      htmlParts.push(`<p style="margin-bottom: 10px; line-height: 1.6; color: #272A30;">${content}</p>`)
    }
  }
  
  // Fechar lista se ainda estiver aberta no final
  if (inList) {
    htmlParts.push(`<ul style="margin: 10px 0; padding-left: 20px; list-style-type: disc;">${currentListItems.join('')}</ul>`)
  }
  
  return htmlParts.filter(html => html !== '').join('')
}

/**
 * Gera PDF do relatório com gráficos incluídos
 * @param {string} reportMarkdown - Conteúdo do relatório em markdown
 * @param {Object} chartImages - Objeto com imagens dos gráficos (networkVolume, reasonFrequency)
 * @param {Object} sentimentChartImage - Imagem do gráfico de sentimento por rede social
 * @returns {Promise<jsPDF>} Instância do PDF gerado
 */
export const generateReportPDF = async (reportMarkdown, chartImages = null, sentimentChartImage = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Carregar bibliotecas dinamicamente
      const { jsPDF: PDF, html2canvas: canvas } = await loadPDFLibraries()
      
      const pdf = new PDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - (margin * 2)
      let yPosition = margin

      // Função para adicionar nova página se necessário
      const checkNewPage = (requiredHeight) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
          return true
        }
        return false
      }

      // Cabeçalho
      pdf.setFontSize(22)
      pdf.setTextColor(22, 52, 255) // #1634FF
      pdf.setFont('helvetica', 'bold')
      pdf.text('Relatório Executivo de CX', margin, yPosition)
      yPosition += 10

      // Data do relatório
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.setFont('helvetica', 'normal')
      const reportDate = formatDateOnlyBRT(new Date())
      pdf.text(`Data: ${reportDate}`, margin, yPosition)
      yPosition += 6

      // Linha separadora
      pdf.setDrawColor(22, 52, 255)
      pdf.setLineWidth(0.5)
      pdf.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 8

      // Processar markdown linha por linha para detectar quebras de página
      const lines = reportMarkdown.split('\n')
      const sections = []
      let currentSection = []
      let nextSectionNeedsPageBreak = false
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        
        // Detectar marcação de quebra de página
        if (line.includes('[QUEBRA DE PÁGINA') || line.includes('[QUEBRA DE PAGINA')) {
          // Salvar seção atual se houver conteúdo
          if (currentSection.length > 0) {
            sections.push({ content: currentSection.join('\n'), pageBreak: false })
            currentSection = []
          }
          // Marcar que a próxima seção precisa de quebra de página
          nextSectionNeedsPageBreak = true
        } else {
          // Se a próxima seção precisa de quebra e estamos começando uma nova seção
          if (nextSectionNeedsPageBreak && currentSection.length === 0 && line.trim() !== '') {
            sections.push({ content: '', pageBreak: true })
            nextSectionNeedsPageBreak = false
          }
          currentSection.push(line)
        }
      }
      
      // Adicionar última seção
      if (currentSection.length > 0) {
        sections.push({ content: currentSection.join('\n'), pageBreak: false })
      }

      // Processar cada seção
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        
        // Se há quebra de página, adicionar nova página (exceto se for a primeira seção)
        if (section.pageBreak && i > 0) {
          pdf.addPage()
          yPosition = margin
          continue
        }
        
        // Ignorar quebra de página na primeira seção para que comece na primeira página
        if (section.pageBreak && i === 0) {
          continue
        }
        
        if (!section.content.trim()) continue
        
        // Converter markdown da seção para HTML
        const htmlContent = markdownToHtml(section.content)
        
        // Verificar se esta é a seção de Gráficos de Análise de Sentimento
        const isSentimentChartSection = section.content.includes('## 2. 🥧 Gráficos de Análise de Sentimento') || 
                                       section.content.includes('## 2. 🥧 Gráficos de Analise de Sentimento')
        
        // Criar elemento temporário para renderizar HTML
        const tempDiv = document.createElement('div')
        tempDiv.style.width = `${maxWidth}mm`
        // Reduzir padding para primeira seção para começar mais cedo na página
        tempDiv.style.padding = i === 0 ? '10px' : '20px'
        tempDiv.style.position = 'absolute'
        tempDiv.style.left = '-9999px'
        tempDiv.style.backgroundColor = '#ffffff'
        tempDiv.style.fontFamily = 'Poppins, Arial, sans-serif'
        tempDiv.style.fontSize = '12px'
        tempDiv.style.color = '#272A30'
        tempDiv.style.fontWeight = '400'
        tempDiv.style.lineHeight = '1.6'
        // Envolver conteúdo em container para melhor formatação de listas
        tempDiv.innerHTML = `<div style="max-width: 100%;">${htmlContent}</div>`
        document.body.appendChild(tempDiv)

        // Converter HTML para canvas e adicionar ao PDF
        try {
          const canvasResult = await canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: tempDiv.offsetWidth,
            height: tempDiv.scrollHeight,
            logging: false
          })

          const imgData = canvasResult.toDataURL('image/png')
          const imgWidth = maxWidth
          const imgHeight = (canvasResult.height * imgWidth) / canvasResult.width

          // Verificar se precisa de nova página antes de adicionar (exceto primeira seção)
          if (i > 0) {
            checkNewPage(imgHeight)
          }

          // Dividir imagem em páginas se necessário
          let heightLeft = imgHeight
          let initialY = yPosition
          let pagesAdded = 0

          // Calcular quanto cabe na primeira página
          const availableHeight = pageHeight - yPosition - margin
          const firstPageHeight = Math.min(imgHeight, availableHeight)
          
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight)
          heightLeft -= availableHeight

          // Se a imagem foi dividida em múltiplas páginas
          while (heightLeft > 0) {
            pdf.addPage()
            pagesAdded++
            heightLeft -= (pageHeight - margin * 2)
          }

          // Calcular yPosition final na última página
          if (pagesAdded > 0) {
            // Se dividiu em páginas, calcular onde termina na última página
            const remainingHeight = imgHeight - (firstPageHeight + pagesAdded * (pageHeight - margin * 2))
            yPosition = margin + Math.max(0, remainingHeight)
          } else {
            // Se coube em uma página, apenas adicionar a altura
            yPosition += firstPageHeight
          }
          yPosition += 10 // Adicionar espaço após o conteúdo

          // Remover elemento temporário
          document.body.removeChild(tempDiv)
        } catch (error) {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv)
          }
          console.error('Erro ao converter HTML para imagem:', error)
          
          // Fallback: adicionar texto diretamente
          pdf.setFontSize(12)
          pdf.setTextColor(39, 42, 48) // #272A30 (Grafite)
          const cleanedContent = removeCitationCodes(section.content)
          const textLines = pdf.splitTextToSize(cleanedContent, maxWidth)
          textLines.forEach(line => {
            checkNewPage(7)
            pdf.text(line, margin, yPosition)
            yPosition += 7
          })
          
        }
      }

      // Adicionar gráfico de sentimento na última página
      if (sentimentChartImage && sentimentChartImage.dataUrl) {
        console.log('📊 [PDF] Adicionando gráfico de sentimento na última página...')
        
        // Verificar se precisa de nova página para o gráfico
        const chartHeight = 80
        checkNewPage(chartHeight + 20)
        
        // Adicionar espaço antes do gráfico
        yPosition += 10
        
        // Adicionar imagem do gráfico
        try {
          const chartWidth = maxWidth
          if (sentimentChartImage.dataUrl.startsWith('data:image')) {
            pdf.addImage(sentimentChartImage.dataUrl, 'PNG', margin, yPosition, chartWidth, chartHeight)
            yPosition += chartHeight + 10
            console.log('✅ [PDF] Gráfico de sentimento adicionado na última página com sucesso')
          } else {
            console.warn('⚠️ [PDF] dataUrl do gráfico de sentimento inválido')
          }
        } catch (error) {
          console.error('❌ [PDF] Erro ao adicionar gráfico de sentimento:', error)
        }
      }

      // Rodapé em todas as páginas
      const totalPages = pdf.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)
        pdf.text(
          `Página ${i} de ${totalPages}`,
          pageWidth - margin - 20,
          pageHeight - 10
        )
      }

      resolve(pdf)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Download do PDF
 * @param {string} reportMarkdown - Conteúdo do relatório em markdown
 * @param {Object} chartImages - Objeto com imagens dos gráficos
 * @param {string} filename - Nome do arquivo (opcional)
 * @returns {Promise<Object>} Objeto com success e error (se houver)
 */
export const downloadReportPDF = async (reportMarkdown, chartImages = null, filename = null, sentimentChartImage = null) => {
  try {
    const pdf = await generateReportPDF(reportMarkdown, chartImages, sentimentChartImage)
    const fileName = filename || `relatorio_cx_${todayBRTForFilename()}.pdf`
    pdf.save(fileName)
    return { success: true }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return { success: false, error: error.message }
  }
}
