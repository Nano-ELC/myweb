// 优化 KaTeX 公式渲染，确保移动设备兼容性

// 等待 KaTeX 和 auto-render 加载完成
document.addEventListener('DOMContentLoaded', function() {
  renderMathIfAvailable();
});

// 兼容 MkDocs 的 document$ 订阅
try {
  if (typeof document$ !== 'undefined') {
    document$.subscribe(({ body }) => {
      renderMathIfAvailable(body);
    });
  }
} catch (e) {
  console.log('document$ not available:', e);
}

// 确保在页面完全加载后再次尝试渲染（解决移动设备延迟加载问题）
window.addEventListener('load', function() {
  setTimeout(renderMathIfAvailable, 500);
});

// 统一的公式渲染函数
function renderMathIfAvailable(target = document.body) {
  if (typeof renderMathInElement !== 'undefined') {
    try {
      renderMathInElement(target, {
        delimiters: [
          { left: "$$",  right: "$$",  display: true },
          { left: "$",   right: "$",   display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false,
        // 优化移动设备渲染
        strict: false,
        fleqn: false
      });
    } catch (error) {
      console.warn('KaTeX rendering error:', error);
      // 失败后尝试再次渲染，确保移动设备上的兼容性
      setTimeout(() => {
        try {
          renderMathInElement(target, {
            delimiters: [
              { left: "$$",  right: "$$",  display: true },
              { left: "$",   right: "$",   display: false }
            ],
            throwOnError: true
          });
        } catch (e) {
          console.warn('KaTeX fallback rendering also failed:', e);
        }
      }, 1000);
    }
  } else {
    // 如果 KaTeX 未加载，延迟后重试
    setTimeout(() => renderMathIfAvailable(target), 300);
  }
}