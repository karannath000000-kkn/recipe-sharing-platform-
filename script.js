let recipes = [];

function addRecipe() {
    let title = document.getElementById("title").value;
    let ingredients = document.getElementById("ingredients").value;
    let steps = document.getElementById("steps").value;

    let recipe = {
        title,
        ingredients,
        steps
    };

    recipes.push(recipe);
    displayRecipes();
    document.getElementById("title").value = "";
document.getElementById("ingredients").value = "";
document.getElementById("steps").value = "";
}

function displayRecipes() {
    let list = document.getElementById("recipeList");
    list.innerHTML = "";

    recipes.forEach((r) => {
        list.innerHTML += `
            <div class="recipe">
                <h3>${r.title}</h3>
                <p><b>Ingredients:</b> ${r.ingredients}</p>
                <p><b>Steps:</b> ${r.steps}</p>
            </div>
        `;
    });
}
