// PDF.js 懒加载优化脚本
// 仅在需要时加载 PDF.js，提高页面加载速度

class PDFOptimizer {
  constructor() {
    this.pdfjsLoaded = false;
    this.pdfjsLoading = false;
    this.pdfInstances = new Map();
    this.init();
  }

  init() {
    // 监听页面上的 PDF 链接点击
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href$=".pdf"]');
      if (target) {
        e.preventDefault();
        this.handlePdfLinkClick(target);
      }
    });

    // 监听页面滚动，实现视口内 PDF 懒加载
    this.observePdfElements();
  }

  // 观察页面中的 PDF 元素
  observePdfElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (element.dataset.pdfUrl) {
            this.loadPdf(element, element.dataset.pdfUrl);
          }
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.1
    });

    // 观察所有带有 data-pdf-url 属性的元素
    document.querySelectorAll('[data-pdf-url]').forEach(el => {
      observer.observe(el);
    });
  }

  // 处理 PDF 链接点击
  async handlePdfLinkClick(linkElement) {
    const pdfUrl = linkElement.getAttribute('href');
    const fileName = pdfUrl.split('/').pop();

    // 检查是否已缓存
    if (this.pdfInstances.has(pdfUrl)) {
      this.openPdfViewer(this.pdfInstances.get(pdfUrl));
      return;
    }

    // 加载 PDF.js（如果尚未加载）
    if (!this.pdfjsLoaded) {
      await this.loadPdfJs();
    }

    // 加载并缓存 PDF
    try {
      const pdfDoc = await this.loadPdfDocument(pdfUrl);
      this.pdfInstances.set(pdfUrl, pdfDoc);
      this.openPdfViewer(pdfDoc, fileName);
    } catch (error) {
      console.error('PDF loading error:', error);
      // 失败时回退到默认行为
      window.open(pdfUrl, '_blank');
    }
  }

  // 懒加载 PDF.js 库
  loadPdfJs() {
    if (this.pdfjsLoading) {
      return this.pdfjsLoading;
    }

    this.pdfjsLoading = new Promise((resolve, reject) => {
      // 检查 PDF.js 是否已加载
      if (window.pdfjsLib) {
        this.pdfjsLoaded = true;
        resolve();
        return;
      }

      // 创建加载状态指示器
      this.showLoadingIndicator('正在加载 PDF 查看器...');

      // 动态加载 PDF.js
      const script = document.createElement('script');
      script.src = 'assets/build/pdf.mjs';
      script.type = 'module';
      script.onload = () => {
        this.pdfjsLoaded = true;
        this.hideLoadingIndicator();
        resolve();
      };
      script.onerror = () => {
        this.hideLoadingIndicator();
        reject(new Error('Failed to load PDF.js'));
      };
      document.head.appendChild(script);
    });

    return this.pdfjsLoading;
  }

  // 加载 PDF 文档
  async loadPdfDocument(url) {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js not loaded');
    }

    // 设置 PDF.js 工作器
    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/build/pdf.worker.mjs';
    }

    this.showLoadingIndicator('正在加载 PDF 文档...');

    try {
      const loadingTask = window.pdfjsLib.getDocument({
        url,
        cMapUrl: 'assets/web/cmaps/',
        cMapPacked: true,
        // 优化加载选项
        disableFontFace: true, // 禁用字体加载以提高速度
        renderInteractiveForms: false, // 禁用交互式表单以提高速度
        maxImageSize: 1024, // 限制图像大小
      });

      const pdfDoc = await loadingTask.promise;
      this.hideLoadingIndicator();
      return pdfDoc;
    } catch (error) {
      this.hideLoadingIndicator();
      throw error;
    }
  }

  // 加载单个 PDF 到指定元素
  async loadPdf(element, url) {
    if (!this.pdfjsLoaded) {
      await this.loadPdfJs();
    }

    try {
      const pdfDoc = await this.loadPdfDocument(url);
      this.renderPdf(element, pdfDoc);
    } catch (error) {
      console.error('PDF rendering error:', error);
      element.innerHTML = '<div style="color: red; padding: 10px;">PDF 加载失败</div>';
    }
  }

  // 渲染 PDF 到指定元素
  async renderPdf(element, pdfDoc) {
    const pageNumber = 1;
    const page = await pdfDoc.getPage(pageNumber);

    const scale = 1.0;
    const viewport = page.getViewport({ scale });

    // 创建画布
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // 设置元素样式
    element.style.width = '100%';
    element.style.textAlign = 'center';
    element.innerHTML = '';
    element.appendChild(canvas);

    // 渲染页面
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;

    // 添加页码信息
    const pageInfo = document.createElement('div');
    pageInfo.style.marginTop = '10px';
    pageInfo.style.fontSize = '14px';
    pageInfo.style.color = '#666';
    pageInfo.textContent = `第 ${pageNumber} 页，共 ${pdfDoc.numPages} 页`;
    element.appendChild(pageInfo);
  }

  // 打开 PDF 查看器
  openPdfViewer(pdfDoc, fileName) {
    // 创建模态窗口
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';

    // 创建标题栏
    const header = document.createElement('div');
    header.style.padding = '15px';
    header.style.backgroundColor = '#333';
    header.style.color = 'white';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    const title = document.createElement('h3');
    title.style.margin = '0';
    title.style.fontSize = '16px';
    title.textContent = fileName;

    const closeBtn = document.createElement('button');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => {
      document.body.removeChild(modal);
    };

    header.appendChild(title);
    header.appendChild(closeBtn);

    // 创建内容区域
    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.padding = '20px';
    content.style.overflow = 'auto';

    // 渲染第一页作为预览
    this.renderPdf(content, pdfDoc);

    // 组装模态窗口
    modal.appendChild(header);
    modal.appendChild(content);

    // 添加到页面
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // 点击模态窗口外部关闭
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }
    };
  }

  // 显示加载指示器
  showLoadingIndicator(message) {
    // 移除现有指示器
    this.hideLoadingIndicator();

    const indicator = document.createElement('div');
    indicator.id = 'pdf-loading-indicator';
    indicator.style.position = 'fixed';
    indicator.style.top = '50%';
    indicator.style.left = '50%';
    indicator.style.transform = 'translate(-50%, -50%)';
    indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    indicator.style.color = 'white';
    indicator.style.padding = '20px';
    indicator.style.borderRadius = '8px';
    indicator.style.zIndex = '9999';
    indicator.style.display = 'flex';
    indicator.style.alignItems = 'center';
    indicator.style.gap = '10px';

    const spinner = document.createElement('div');
    spinner.style.width = '20px';
    spinner.style.height = '20px';
    spinner.style.border = '2px solid #f3f3f3';
    spinner.style.borderTop = '2px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';

    const text = document.createElement('span');
    text.textContent = message || '加载中...';

    indicator.appendChild(spinner);
    indicator.appendChild(text);

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);

    document.body.appendChild(indicator);
  }

  // 隐藏加载指示器
  hideLoadingIndicator() {
    const indicator = document.getElementById('pdf-loading-indicator');
    if (indicator) {
      indicator.remove();
    }

    const style = document.querySelector('style[data-pdf-spinner]');
    if (style) {
      style.remove();
    }
  }
}

// 初始化 PDF 优化器
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.PDFOptimizer = new PDFOptimizer();
  });
}
