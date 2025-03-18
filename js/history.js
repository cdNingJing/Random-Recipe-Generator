const HISTORY_KEY = "recipe_history";
const MAX_HISTORY = 10;

function saveToHistory(meal) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    
    // 检查是否已存在相同的菜品
    const existingIndex = history.findIndex(item => item.idMeal === meal.idMeal);
    if (existingIndex !== -1) {
        // 如果存在，删除旧的记录
        history.splice(existingIndex, 1);
    }
    
    // 添加新记录到开头
    history.unshift({
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        timestamp: new Date().toISOString()
    });
    
    // 保持历史记录不超过最大数量
    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    updateHistoryPanel();
}

function updateHistoryPanel() {
    const historyList = document.getElementById("history-list");
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    
    historyList.innerHTML = "";
    
    history.forEach(item => {
        const timeAgo = getTimeAgo(new Date(item.timestamp));
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        historyItem.onclick = () => {
            loadRecipeById(item.idMeal);
            // 平滑滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        
        historyItem.innerHTML = `
            <img src="${item.strMealThumb}" alt="${item.strMeal}">
            <div class="history-content">
                <div class="history-title">${item.strMeal}</div>
                <div class="history-time">${timeAgo}</div>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
    
    const historyPanel = document.getElementById("history");
    historyPanel.style.display = history.length > 0 ? "block" : "none";
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "刚刚";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    return `${Math.floor(diffInSeconds / 86400)}天前`;
}

// 页面加载时初始化历史记录面板
document.addEventListener("DOMContentLoaded", updateHistoryPanel);

// 分享菜谱
function shareRecipe(meal) {
    const shareData = {
        title: meal.strMeal,
        text: `Check out this amazing ${meal.strMeal} recipe!`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .catch(error => console.log('Share failed', error));
    } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Copy failed:', err));
    }
}

// 初始化历史记录
window.addEventListener('load', () => {
    const savedHistory = localStorage.getItem('recipeHistory');
    if (savedHistory) {
        recipeHistory = JSON.parse(savedHistory);
        updateHistoryPanel();
    }
});

function clearHistory() {
    if (confirm("确定要清除所有历史记录吗？")) {
        localStorage.removeItem(HISTORY_KEY);
        updateHistoryPanel();
    }
} 