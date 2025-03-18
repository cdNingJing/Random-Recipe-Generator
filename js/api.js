// 获取随机菜谱
async function fetchRandomRecipes(count = 5) {
    const recipes = [];
    for (let i = 0; i < count; i++) {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            if (data.meals && data.meals[0]) {
                recipes.push(data.meals[0]);
            }
        } catch (error) {
            console.error('获取菜谱失败:', error);
            throw error;
        }
    }
    return recipes;
}

// 根据ID加载菜谱
async function loadRecipeById(id) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        if (data.meals && data.meals[0]) {
            renderRecipe(data.meals[0]);
        }
    } catch (error) {
        console.error('加载菜谱失败:', error);
        showError();
    }
}

// 显示错误信息
function showError() {
    const errorElement = document.getElementById('error');
    errorElement.classList.add('visible');
    setTimeout(() => {
        errorElement.classList.remove('visible');
    }, 3000);
} 