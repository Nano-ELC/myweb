#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
PDF 链接转换脚本

递归遍历 docs/ 目录下所有 .md 文件，将 iframe PDF 嵌入替换为 PDF 下载卡片宏。
自动提取 PDF 文件的元数据（大小、页数、修改日期）。
"""

import os
import re
import datetime

try:
    from pypdf import PdfReader
except ImportError:
    print("错误: 未找到 pypdf 库。请运行 'pip install pypdf' 安装。")
    exit(1)

# 全局变量
converted_count = 0
skipped_count = 0
warning_count = 0

# 正则表达式匹配 iframe PDF 嵌入
PDF_IFRAME_PATTERN = re.compile(r'<iframe\s+src="(.*?file=(.*?\.pdf))"[^>]*?>.*?</iframe>', re.DOTALL)

def get_pdf_metadata(pdf_path):
    """
    提取 PDF 文件的元数据
    
    Args:
        pdf_path: PDF 文件的绝对路径
        
    Returns:
        dict: 包含 size, pages, date 的字典
    """
    global warning_count
    
    metadata = {
        'size': '0.0 MB',
        'pages': '-',
        'date': '未知'
    }
    
    try:
        # 获取文件大小
        size_bytes = os.path.getsize(pdf_path)
        size_mb = size_bytes / (1024 * 1024)
        metadata['size'] = f"{size_mb:.1f} MB"
        
        # 获取修改日期
        mtime = os.path.getmtime(pdf_path)
        date = datetime.datetime.fromtimestamp(mtime)
        metadata['date'] = date.strftime('%Y-%m-%d')
        
        # 获取页数
        try:
            reader = PdfReader(pdf_path)
            metadata['pages'] = str(len(reader.pages))
        except Exception as e:
            print(f"[警告] 无法读取 {pdf_path} 的页数: {e}")
            warning_count += 1
            # 保持默认值 "-"
            pass
            
    except Exception as e:
        print(f"[错误] 处理 {pdf_path} 时出错: {e}")
        warning_count += 1
    
    return metadata

def convert_md_file(file_path):
    """
    转换单个 .md 文件中的 PDF 链接
    
    Args:
        file_path: .md 文件的路径
        
    Returns:
        bool: 是否进行了转换
    """
    global converted_count
    global skipped_count
    global warning_count
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 查找所有 iframe PDF 嵌入
        matches = PDF_IFRAME_PATTERN.findall(content)
        
        if not matches:
            skipped_count += 1
            return False
        
        # 处理每个匹配
        modified_content = content
        
        for match in matches:
            full_src = match[0]
            pdf_path = match[1]
            
            # 从完整路径中提取相对路径
            # 移除前缀 /myweb/ 得到相对路径
            if pdf_path.startswith('/myweb/'):
                pdf_rel_path = pdf_path[7:]  # 移除 /myweb/ 前缀
            else:
                # 尝试从 src 中提取文件名
                pdf_rel_path = pdf_path.split('/')[-1]
            
            # 解析 PDF 绝对路径
            # 构建相对路径（从 docs 目录开始）
            docs_root = os.path.join(os.getcwd(), 'docs')
            pdf_abs_path = os.path.join(docs_root, pdf_rel_path)
            pdf_abs_path = os.path.normpath(pdf_abs_path)
            
            # 检查文件是否存在
            if not os.path.exists(pdf_abs_path):
                print(f"[警告] PDF 文件不存在: {pdf_abs_path}")
                warning_count += 1
                continue
            
            # 生成标题（使用文件名或上下文）
            pdf_filename = os.path.basename(pdf_rel_path)
            title = os.path.splitext(pdf_filename)[0]
            
            # 提取元数据
            metadata = get_pdf_metadata(pdf_abs_path)
            
            # 生成宏调用
            macro_call = f"{{{{ pdf_card(\"{title}\", \"{pdf_rel_path}\", \"{metadata['size']}\", \"{metadata['pages']}\", \"{metadata['date']}\") }}}}"
            
            # 构建完整的 iframe 匹配字符串
            iframe_pattern = r'<iframe\s+src="' + re.escape(full_src) + r'"[^>]*?>.*?</iframe>'
            iframe_match = re.search(iframe_pattern, modified_content, re.DOTALL)
            
            if iframe_match:
                old_iframe = iframe_match.group(0)
                modified_content = modified_content.replace(old_iframe, macro_call)
                
                converted_count += 1
        
        # 写回文件
        if modified_content != content:
            # 创建备份文件
            backup_path = file_path + '.bak'
            try:
                with open(backup_path, 'w', encoding='utf-8') as f:
                    f.write(content)
            except Exception as e:
                print(f"[警告] 无法创建备份文件 {backup_path}: {e}")
            
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(modified_content)
                return True
            except Exception as e:
                print(f"[错误] 无法写入文件 {file_path}: {e}")
                warning_count += 1
        
    except Exception as e:
        print(f"[错误] 处理文件 {file_path} 时出错: {e}")
        warning_count += 1
    
    return False

def main():
    """
    主函数
    """
    print("开始转换 PDF 链接...")
    print("=" * 60)
    
    # 遍历 docs/ 目录
    docs_dir = os.path.join(os.getcwd(), 'docs')
    
    if not os.path.exists(docs_dir):
        print(f"[错误] docs 目录不存在: {docs_dir}")
        exit(1)
    
    processed_files = 0
    converted_files = 0
    
    for root, dirs, files in os.walk(docs_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                processed_files += 1
                
                if convert_md_file(file_path):
                    converted_files += 1
                    print(f"已转换: {file_path}")
    
    print("=" * 60)
    print("转换完成！")
    print(f"处理文件数: {processed_files}")
    print(f"转换文件数: {converted_files}")
    print(f"转换链接数: {converted_count}")
    print(f"跳过文件数: {skipped_count}")
    print(f"警告数: {warning_count}")

if __name__ == "__main__":
    main()
