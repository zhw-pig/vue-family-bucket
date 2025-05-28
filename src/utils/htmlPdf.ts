/**
 * 将HTML内容转换为PDF，并下载pdf到本地
 */

import html2Canvas from 'html2canvas' // 将DOM 树渲染为Canvas
import JsPDF from 'jspdf' // 将Canvas内容分页转为PDF

// 计算pdf页面高度
const calculatePageHeightHandler = (width: number) => {
    return Math.min(
        277, // A4高度
        Math.floor((width * 277) / 190)
    )
}

const getFooterElement = (remainingHeight: string | number, fillingHeight = 0) => {
    const newNode = document.createElement('div')
    newNode.style.background = '#ffffff'
    newNode.style.width = 'calc(100% + 8px)'
    newNode.style.marginLeft = '-4px'
    newNode.style.marginBottom = '0px'
    newNode.classList.add('divRemove')
    newNode.style.height = +remainingHeight + fillingHeight + 'px'
    return newNode
}

// 提取表格元素处理逻辑
const isTableRow = (element: HTMLElement) => element.localName === 'tr'

// 辅助函数：计算插入元素的高度
const calculateInsertHeightHandler = (element: HTMLElement, localNoTableHeight: number) => {
    const pageHeight = calculatePageHeightHandler(277)
    const multiple = Math.ceil((element.offsetTop + element.offsetHeight) / pageHeight)
    if (isTableRow(element)) {
        return multiple * pageHeight - (element.offsetTop + element.offsetHeight + localNoTableHeight) + 20
    } else {
        return multiple * pageHeight - (element.offsetTop + element.offsetHeight)
    }
}

// pdf文件分页处理
const pdfSplitPageHandler = (htmlChildren: HTMLElement[]) => {
    const pageHeight = calculatePageHeightHandler(277)
    let localNoTableHeight = 0
    const nodesToInsert: { node: HTMLElement; position: Node | null }[] = []
    htmlChildren.forEach((element, index) => {
        const nextNode = htmlChildren[index + 1]
        const totalHeight = element.offsetTop + element.offsetHeight + localNoTableHeight
        const isNeedSplitPage = (() => {
            if (isTableRow(element)) {
                return totalHeight < pageHeight && nextNode && nextNode.offsetTop + nextNode.offsetHeight + localNoTableHeight > pageHeight
            } else {
                localNoTableHeight += element.clientHeight
                return element.offsetTop + element.offsetHeight < pageHeight && nextNode && nextNode.offsetTop + nextNode.offsetHeight > pageHeight
            }
        })()

        if (isNeedSplitPage) {
            const _H = calculateInsertHeightHandler(element, localNoTableHeight)
            const newNode = getFooterElement(_H)
            const next = element.nextSibling
            nodesToInsert.push({ node: newNode, position: next || null })
        }
    })

    // 收集所有需要插入的节点，最后批量操作 DOM
    nodesToInsert.forEach(({ node, position }) => {
        const parent = node.parentNode
        if (parent && position) {
            parent.insertBefore(node, position)
        } else if (parent) {
            parent.appendChild(node)
        }
    })
}

// html生成canvas
const generateCanvasByHTMLHandler = async (html: HTMLElement): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
        html2Canvas(html, {
            useCORS: true, // 解决跨域图片问题
            imageTimeout: 1500, // 增加图片加载超时时间
            scale: window.devicePixelRatio, // 适配高DPI屏幕
        })
            .then(resolve)
            .catch(reject)
    })
}

// 生成pdf文件名称通过title
const generateFileNameByTitleHandler = (title: string) => {
    if (title) {
        return `${title}.pdf`
    }
    return `${new Date().getTime()}.pdf`
}
// canvas生成pdf
const generatePdfByCanvasHandler = async (canvas: HTMLCanvasElement) => {
    const pdf = new JsPDF('p', 'mm', 'a4')
    const ctx = canvas.getContext('2d')
    const a4w = 190
    const a4h = 277
    const imgHeight = Math.floor((a4h * canvas.width) / a4w)
    let renderedHeight = 0
    while (renderedHeight < canvas.height) {
        const page: HTMLCanvasElement = document.createElement('canvas')
        page.width = canvas.width
        page.height = Math.min(imgHeight, canvas.height - renderedHeight)
        page.getContext('2d').putImageData(
            ctx?.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)) as ImageData,
            0,
            0
        )
        pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, (a4w * page.height) / page.width))
        renderedHeight += imgHeight
        if (renderedHeight < canvas.height) {
            pdf.addPage()
        }
    }
    return pdf
}

// 清理临时元素，避免内存泄露
const cleanup = () => {
    const tempElements = document.querySelectorAll('.divRemove')
    tempElements.forEach((el) => el.remove())
}

export const htmlPdf = async (title: string, html: HTMLElement, htmlChildren: HTMLElement[]) => {
    pdfSplitPageHandler(Array.from(htmlChildren))
    const canvas = await generateCanvasByHTMLHandler(html)
    const pdf = await generatePdfByCanvasHandler(canvas)
    pdf.save(generateFileNameByTitleHandler(title))
    cleanup()
}
