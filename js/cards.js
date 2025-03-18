let currentMeals = [];
let selectedCard = null;
let isAnimating = false;

async function startDraw() {
    if (isAnimating) return;
    isAnimating = true;
    
    const cardContainer = document.getElementById('cardDrawContainer');
    const cardStage = document.getElementById('cardStage');
    const loadingElement = document.getElementById('loading');
    
    // 重置状态
    cardStage.innerHTML = '';
    cardStage.classList.remove('final-layout');
    cardContainer.classList.add('visible');
    loadingElement.classList.add('visible');
    
    try {
        currentMeals = await fetchRandomRecipes(5);
        loadingElement.classList.remove('visible');
        
        // 创建所有卡片
        const positions = [
            { x: "-480px" },
            { x: "-280px" },
            { x: "0px" },
            { x: "280px" },
            { x: "480px" }
        ];
        
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
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 15px 15px 0 0;">
            <div class="card-content" style="padding: 15px;">
                <div class="card-title" style="font-size: 16px; font-weight: bold; color: #333;">${meal.strMeal}</div>
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