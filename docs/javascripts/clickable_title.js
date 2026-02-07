document.addEventListener("DOMContentLoaded", () => {
    // 1. 找到标题容器
    const titleElem = document.querySelector('.md-header__title');
    // 2. 找到 Logo (它身上有正确的首页链接)
    const logoElem = document.querySelector('a.md-header__button.md-logo');

    if (titleElem && logoElem) {
        // 3. 让鼠标放上去变成"小手"，暗示可点击
        titleElem.style.cursor = "pointer";

        // 4. 绑定点击事件
        titleElem.addEventListener("click", (event) => {
            // 如果用户点的是标题里的文字，跳转到 Logo 指向的地址
            window.location.href = logoElem.href;
            
            // 阻止冒泡，防止和其他 header 事件冲突
            event.preventDefault();
        });
        
        console.log("Site title is now clickable.");
    }
});
