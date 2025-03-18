let currentMeals = [];
let selectedCard = null;
let isAnimating = false;

async function startDraw() {
    if (isAnimating) return;
    isAnimating = true;
    
    // 停止当前正在播放的视频
    const activeVideoPlayer = document.querySelector('.video-player[style*="display: block"]');
    if (activeVideoPlayer) {
        const iframe = activeVideoPlayer.querySelector('iframe');
        if (iframe) {
            iframe.src = 'about:blank';
        }
    }
    
    const cardContainer = document.getElementById('cardDrawContainer');
    const cardStage = document.getElementById('cardStage');
    const loadingElement = document.getElementById('loading');
    const recipeElement = document.getElementById('recipe');
    
    // 重置状态
    cardStage.innerHTML = '';
    cardStage.classList.remove('final-layout');
    cardContainer.classList.add('visible');
    loadingElement.classList.add('visible');
    recipeElement.innerHTML = '';  // 清空菜谱内容
    
    try {
        currentMeals = await fetchRandomRecipes(5);
        loadingElement.classList.remove('visible');
        
        // 计算发牌位置
        const cardWidth = 280; // 卡片宽度
        const containerWidth = Math.min(window.innerWidth, 1600); // 容器宽度，最大1600px
        const availableWidth = containerWidth - 40; // 减去左右边距
        
        // 计算重叠距离
        const overlap = Math.max(
            0,
            ((cardWidth * 5) - availableWidth) / 4 // 4是卡片间隔数
        );
        
        // 计算实际间距（可能为负数，表示重叠）
        const spacing = (availableWidth - cardWidth * 5) / 4;
        
        // 计算起始位置，确保居中
        const totalWidth = cardWidth * 5 + spacing * 4;
        const startX = -totalWidth / 2;
        
        // 生成位置数组
        const positions = Array.from({ length: 5 }, (_, i) => ({
            x: `${startX + i * (cardWidth + spacing)}px`
        }));
        
        // 第一阶段：发牌
        for (let i = 0; i < currentMeals.length; i++) {
            const card = createCard(currentMeals[i], i);
            cardStage.appendChild(card);
            
            // 设置发牌位置
            card.style.setProperty('--dealX', positions[i].x);
            await new Promise(resolve => setTimeout(resolve, 100));
            card.classList.add('dealing');
        }
        
        // 等待发牌完成
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 第二阶段：聚集到中心
        const cards = Array.from(cardStage.children);
        cards.forEach((card, index) => {
            card.classList.remove('dealing');
            card.style.setProperty('--fromX', positions[index].x);
            card.classList.add('gathering');
        });
        
        // 等待聚集完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 第三阶段：洗牌效果
        cards.forEach(card => {
            card.classList.remove('gathering');
            card.classList.add('shuffling');
        });
        
        // 等待洗牌完成
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // 第四阶段：展开最终布局
        cards.forEach(card => card.classList.remove('shuffling'));
        await new Promise(resolve => setTimeout(resolve, 50));
        
        cardStage.classList.add('final-layout');
        cards.forEach((card, index) => {
            if (index === 0) card.classList.add('left-card-2');
            if (index === 1) card.classList.add('left-card-1');
            if (index === 2) card.classList.add('center-card');
            if (index === 3) card.classList.add('right-card-1');
            if (index === 4) card.classList.add('right-card-2');
            
            if (index !== 2) card.classList.add('side-card');
            
            setTimeout(() => card.classList.add('flipped'), index * 200);
        });
        
        isAnimating = false;
    } catch (error) {
        console.error('获取菜谱失败:', error);
        loadingElement.classList.remove('visible');
        showError();
        isAnimating = false;
    }
}

function createCard(meal, index) {
    const card = document.createElement('div');
    card.className = 'recipe-card-draw';
    card.onclick = () => selectCard(meal, index);
    
    card.innerHTML = `
        <div class="card-front">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 15px 15px 0 0;">
            <div class="card-content" style="
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            ">
                <div class="card-title" style="
                    font-family: 'Inter', sans-serif;
                    font-size: 20px; 
                    font-weight: 600; 
                    color: #1a202c;
                    line-height: 1.4;
                    letter-spacing: -0.01em;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: optimizeLegibility;
                ">${meal.strMeal}</div>
                <div class="card-meta" style="
                    display: flex; 
                    gap: 8px; 
                    font-size: 15px; 
                    color: #4a5568;
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                ">
                    <div class="meta-item" style="
                        display: flex; 
                        align-items: center; 
                        gap: 4px;
                    ">
                        <i class="fas fa-globe" style="color: #3498db; font-size: 15px;"></i>
                        <span style="
                            white-space: nowrap;
                        ">${meal.strArea}</span>
                    </div>
                    <span style="color: #cbd5e0;">•</span>
                    <div class="meta-item" style="
                        display: flex; 
                        align-items: center; 
                        gap: 4px;
                    ">
                        <i class="fas fa-tag" style="color: #3498db; font-size: 15px;"></i>
                        <span style="
                            white-space: nowrap;
                        ">${meal.strCategory}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-back">
            <i class="fas fa-utensils" style="font-size: 48px; color: white;"></i>
        </div>
    `;
    
    return card;
}

function selectCard(meal, index) {
    if (selectedCard !== null || isAnimating) return;
    selectedCard = meal;
    
    const cards = document.querySelectorAll('.recipe-card-draw');
    const selectedCardElement = cards[index];
    
    // 移除其他卡片
    cards.forEach((card, i) => {
        if (i !== index) {
            card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '0';
            card.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
    });
    
    // 选中的卡片居中并放大
    selectedCardElement.classList.add('selected-card-animation');
    
    // 直接渲染选中的菜谱
    setTimeout(() => {
        const cardContainer = document.getElementById('cardDrawContainer');
        cardContainer.style.opacity = '0';
        
        setTimeout(() => {
            cardContainer.classList.remove('visible');
            cardContainer.style.opacity = '';
            renderRecipe(selectedCard);
            selectedCard = null;
        }, 300);
    }, 600);
}

function showError() {
    const cardContainer = document.getElementById('cardDrawContainer');
    cardContainer.classList.remove('visible');
    
    const errorElement = document.getElementById('error');
    errorElement.classList.add('visible');
    setTimeout(() => errorElement.classList.remove('visible'), 3000);
} 