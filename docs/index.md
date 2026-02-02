---
title: 首页
description: index page
keywords: 读书杂谈, 笔记整理, 知识分享, 数学分析, 微电子
author: Nano-ELC
comments: true
---

<!-- Hero 区域 -->
<div class="hero-section">
    <!-- 波浪动画 -->
    <div class="wave-container">
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
    </div>
    <div class="hero-content">
                <div class="hero-avatar">
                    <img src="/myweb/assets/logo.png" alt="Nano-ELC" width="120" height="120">
                </div>
                <h1 class="hero-title">Nano-ELC's Docs</h1>
                <p class="hero-subtitle">探索数理与智慧的疆界</p>
                <div class="hero-buttons">
                    <a href="/myweb/blog/" class="btn btn-primary">阅读博客</a>
                    <a href="https://github.com/Nano-ELC/myweb" class="btn btn-secondary" target="_blank">关于我</a>
                </div>
    </div>
</div>

<!-- 卡片导航 -->
<div class="grid-container">
    <div class="grid-item">
        <div class="card">
            <div class="card-icon">
                <i class="material-icons">math-integral</i>
            </div>
            <h3 class="card-title">数理基础</h3>
            <p class="card-description">探索数学分析的奥秘，构建坚实的数理基础</p>
            <a href="/myweb/Math/Analysis/Analysis_pdf/" class="card-link">开始学习 →</a>
        </div>
    </div>
    <div class="grid-item">
        <div class="card">
            <div class="card-icon">
                <i class="material-icons">book-open-page-variant</i>
            </div>
            <h3 class="card-title">读书杂谈</h3>
            <p class="card-description">记录阅读心得，分享智慧的火花与思考</p>
            <a href="/myweb/Reading/The Boundaries of Intelligence/The Boundaries of Intelligence/" class="card-link">阅读文章 →</a>
        </div>
    </div>
    <div class="grid-item">
        <div class="card">
            <div class="card-icon">
                <i class="material-icons">compass-rose</i>
            </div>
            <h3 class="card-title">未竟之旅</h3>
            <p class="card-description">记录学习过程中的点滴，探索未知的领域</p>
            <a href="/myweb/VoyageLeftUndone/markdown/mymarkdown/" class="card-link">探索之旅 →</a>
        </div>
    </div>
    <div class="grid-item">
        <div class="card">
            <div class="card-icon">
                <i class="material-icons">forum</i>
            </div>
            <h3 class="card-title">Hertoffee</h3>
            <p class="card-description">访问我的博客，了解更多关于我的思考与分享</p>
            <a href="/myweb/blog/" class="card-link">访问博客 →</a>
        </div>
    </div>
</div>

<!-- 站点信息统计 -->
<div class="site-stats">
    <h2 class="stats-title">站点概览</h2>
    <div class="stats-grid">
        <div class="stat-item">
            <div class="stat-icon">
                <i class="material-icons">article</i>
            </div>
            <div class="stat-content">
                <div class="stat-value" id="doc-count">--</div>
                <div class="stat-label">文档总数</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">
                <i class="material-icons">text-box</i>
            </div>
            <div class="stat-content">
                <div class="stat-value" id="word-count">--</div>
                <div class="stat-label">文字总数</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">
                <i class="material-icons">clock-outline</i>
            </div>
            <div class="stat-content">
                <div class="stat-value" id="last-update">--</div>
                <div class="stat-label">最后更新</div>
            </div>
        </div>
    </div>
</div>

<!-- 访问量统计 -->
<div class="stats-container">
    <div class="busuanzi_container">
        <span class="busuanzi_label">本站总访问量：</span>
        <span class="busuanzi_value" id="busuanzi_value_site_pv"></span>
    </div>
    <div class="busuanzi_container">
        <span class="busuanzi_label">今日访问量：</span>
        <span class="busuanzi_value" id="busuanzi_value_day_pv"></span>
    </div>
</div>

<!-- 站点统计脚本 -->
<script>
    // 动态计算站点统计数据
    function calculateSiteStats() {
        // 文档路径列表（实际项目中可以根据需要扩展）
        const docPaths = [
            '/myweb/Math/Analysis/Analysis/',
            '/myweb/Math/Analysis/Analysis_pdf/',
            '/myweb/Reading/The Boundaries of Intelligence/The Boundaries of Intelligence/',
            '/myweb/VoyageLeftUndone/markdown/mymarkdown/'
            // 可以根据实际文档结构添加更多路径
        ];
        
        let totalDocs = docPaths.length;
        let totalWords = 0;
        let processedDocs = 0;
        
        // 模拟异步计算（实际项目中可以使用 fetch API 获取文档内容并计算）
        // 这里使用模拟数据，实际项目中需要根据文档内容动态计算
        const mockWordCounts = [1200, 850, 2100, 1500]; // 模拟每个文档的字数
        
        mockWordCounts.forEach(count => {
            totalWords += count;
            processedDocs++;
        });
        
        // 生成统计数据
        const stats = {
            docCount: totalDocs,
            wordCount: totalWords,
            lastUpdate: new Date().toISOString().split('T')[0]
        };
        
        return stats;
    }
    
    // 页面加载完成后更新统计数据
    document.addEventListener('DOMContentLoaded', function() {
        updateStats();
        
        // 每5分钟更新一次统计数据
        setInterval(updateStats, 5 * 60 * 1000);
    });
    
    // 更新统计数据的函数
    function updateStats() {
        const siteStats = calculateSiteStats();
        
        // 更新文档总数
        document.getElementById('doc-count').textContent = siteStats.docCount;
        
        // 更新文字总数
        document.getElementById('word-count').textContent = siteStats.wordCount.toLocaleString();
        
        // 更新最后更新时间
        document.getElementById('last-update').textContent = siteStats.lastUpdate;
    }
</script>
