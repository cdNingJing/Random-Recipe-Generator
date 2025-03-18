async function renderRecipe(meal) {
    const recipeElement = document.getElementById('recipe');
    const header = document.getElementById('header');
    const floatingAction = document.getElementById('floatingAction');
    
    // 收起头部
    header.classList.add('minimized');
    
    // 显示悬浮按钮
    floatingAction.style.display = 'block';
    
    // 收集所有非空的配料
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push({ ingredient, measure });
        }
    }
    
    // 处理说明文字，分成步骤并清理格式
    const steps = meal.strInstructions
        .split(/\r?\n/)  // 首先按换行符分割
        .map(step => step.trim())
        .filter(step => {
            // 过滤掉空白或只包含标点符号的步骤
            const nonPunctuationText = step.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, '');
            return nonPunctuationText.length > 0;
        })
        .map(step => {
            // 移除开头的数字和点
            return step.replace(/^\d+\.\s*/, '').trim();
        });
    
    // 从YouTube URL中提取视频ID
    const videoId = meal.strYoutube ? meal.strYoutube.split('v=')[1] : null;
    
    // 渲染菜谱
    recipeElement.innerHTML = `
        <div class="recipe-header">
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <div class="recipe-meta">
                <div class="meta-item">
                    <i class="fas fa-globe"></i>
                    <span>${meal.strArea}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${meal.strCategory}</span>
                </div>
            </div>
        </div>
        
        <div class="media-container">
            ${videoId ? `
                <div class="video-container">
                    <div class="video-thumbnail" onclick="playVideo('${videoId}')">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-image">
                        <div class="play-overlay">
                            <i class="fas fa-play-circle"></i>
                        </div>
                    </div>
                    <div class="video-player" id="video-player-${videoId}" style="display: none;">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="about:blank" 
                            frameborder="0" 
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            ` : `
                <div class="image-container">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-image">
                </div>
            `}
        </div>
        
        <div class="recipe-content">
            <div class="ingredients-section">
                <h3>Ingredients</h3>
                <div class="ingredients-list">
                    ${ingredients.map(({ ingredient, measure }) => `
                        <div class="ingredient-item">
                            <i class="fas fa-check"></i>
                            <span>${measure} ${ingredient}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${steps.length > 0 ? `
                <div class="instructions-section">
                    <h3>Step by Step Instructions</h3>
                    ${steps.map((step, index) => `
                        <div class="instructions-step">
                            ${step}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    // 显示菜谱
    recipeElement.classList.add('visible');
    
    // 保存到历史记录
    saveToHistory(meal);

    // 平滑滚动到顶部
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 播放视频
function playVideo(videoId) {
    const thumbnailElement = document.querySelector('.video-thumbnail');
    const playerElement = document.getElementById(`video-player-${videoId}`);
    const iframeElement = playerElement.querySelector('iframe');
    
    try {
        // 设置视频URL时添加必要的参数以支持自动播放
        const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&mute=1&enablejsapi=1`;
        iframeElement.src = videoUrl;
        iframeElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        
        // 隐藏缩略图，显示播放器
        thumbnailElement.style.display = 'none';
        playerElement.style.display = 'block';
    } catch (error) {
        console.error('视频加载失败:', error);
        // 如果加载失败，显示错误信息
        playerElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa;">
                <div style="text-align: center; color: #666;">
                    <i class="fas fa-exclamation-circle" style="font-size: 24px; margin-bottom: 8px;"></i>
                    <div>视频加载失败，请稍后重试。</div>
                </div>
            </div>
        `;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    updateHistoryPanel();
}); 