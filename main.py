import os
import datetime
import textwrap
from urllib.parse import urlparse

# --- 常量定义：SVG 图标 ---
ICON_PDF = '<svg xmlns=" `http://www.w3.org/2000/svg` " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
ICON_OPEN = '<svg xmlns=" `http://www.w3.org/2000/svg` " width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>'

def _count_markdown_files(docs_dir: str) -> int:
    """辅助函数：递归统计 Markdown 文件数量"""
    count = 0
    try:
        for root, _, files in os.walk(docs_dir):
            for file in files:
                if file.endswith('.md'):
                    count += 1
    except Exception as e:
        print(f"⚠️ [Error] 文件统计失败: {e}")
    return count

def define_env(env):
    """
    MkDocs 宏定义环境入口
    """
    
    # --- 1. 动态获取站点前缀 ---
    # 从 mkdocs.yml 的 site_url 中解析路径 (例如 `https://xxx.github.io/myweb/`  -> /myweb/)
    site_url = env.conf.get('site_url', '/')
    site_prefix = urlparse(site_url).path
    if not site_prefix.endswith('/'):
        site_prefix += '/'
    
    print(f"✅ [main.py] 已加载。站点前缀自动识别为: '{site_prefix}'")

    # --- 2. 计算统计数据并注入 Config ---
    docs_dir = getattr(env.conf, 'docs_dir', 'docs') if hasattr(env, 'conf') else 'docs'
    total_notes = _count_markdown_files(docs_dir)
    
    # 注入到 config.extra
    if 'extra' not in env.conf:
        env.conf['extra'] = {}
    
    env.conf['extra']['total_notes'] = total_notes
    env.conf['extra']['build_date'] = datetime.datetime.now().strftime("%Y-%m-%d")

    # --- 3. 定义 PDF 卡片宏 ---
    @env.macro
    def pdf_card(title, url, size, pages, date):
        # 路径处理
        clean_url = url.strip()
        if clean_url.startswith(("http", "https")):
            final_url = clean_url
        else:
            # 智能拼接：如果 url 已经包含前缀则不处理，否则加上前缀
            clean_path = clean_url.lstrip("./").lstrip("/")
            if clean_path.startswith(site_prefix.lstrip("/")):
                 final_url = f"/{clean_path}" # 已经是绝对路径了，确保开头有 /
            else:
                 final_url = f"{site_prefix}{clean_path}"

        # 生成 HTML
        html = f"""
        <div class="pdf-card">
            <div class="pdf-icon-wrapper">{ICON_PDF}</div>
            <div class="pdf-details">
                <div class="pdf-title">{title}</div>
                <div class="pdf-meta">
                    <span class="pdf-size">{size}</span>
                    <span class="pdf-separator">/</span>
                    <span class="pdf-pages">{pages} P</span>
                    <span class="pdf-separator">/</span>
                    <span class="pdf-date">{date}</span>
                </div>
            </div>
            <div class="pdf-action">
                <a href="{final_url}" class="pdf-btn" target="_blank" rel="noopener noreferrer">
                    {ICON_OPEN}
                    <span>打开</span>
                </a>
            </div>
        </div>
        """
        return textwrap.dedent(html).strip()