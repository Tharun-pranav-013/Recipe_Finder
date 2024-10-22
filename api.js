const searchBtn = document.getElementById('search-btn');
const recipeContainer = document.getElementById('recipe-container');
const description = document.getElementById('description');

// Spoonacular API Info
const API_KEY = '64fbb0d78dd348a0a2615d1453e64c20';
const API_URL = `https://api.spoonacular.com/recipes/complexSearch`;

// Function to fetch recipes
async function fetchRecipes(query) {
    try {
        const res = await fetch(`${API_URL}?query=${query}&number=9&apiKey=${API_KEY}`);
        const data = await res.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = '<p>There was an error fetching recipes. Please try again later.</p>';
    }
}

// Function to render recipes
function displayRecipes(recipes) {
    recipeContainer.innerHTML = ''; // Clear previous results

    if (recipes.length === 0) {
        recipeContainer.innerHTML = '<p>No recipes found. Try again!</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button class="details-btn" onclick="getRecipeDetails(${recipe.id})">View Recipe</button>
        `;

        recipeContainer.appendChild(recipeCard);
    });

    recipeContainer.style.opacity = '1'; 
}

// Search button click event
searchBtn.addEventListener('click', async () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        recipeContainer.style.opacity = '0'; // Hide container first
        const recipes = await fetchRecipes(query);
        if (recipes) {
            setTimeout(() => displayRecipes(recipes), 1000); // Delay to allow any previous animations
        }
    }
});

// Function to fetch the recipe details using the ID and navigate to the recipe page
async function getRecipeDetails(id) {
    try {
        const res = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
        const data = await res.json();
        
        if (data.sourceUrl) {
            window.open(data.sourceUrl, '_blank'); // Open the actual source recipe link
        } else {
            console.error('No source URL available for this recipe');
        }
    } catch (error) {
        console.error('Failed to retrieve the recipe details:', error);
    }
}