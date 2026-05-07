let recipes = [];

function addRecipe() {
    let title = document.getElementById("title").value;
    let ingredients = document.getElementById("ingredients").value;
    let steps = document.getElementById("steps").value;

    let imageInput = document.getElementById("image");
    let image = URL.createObjectURL(imageInput.files[0]);

    let recipe = {
        title,
        ingredients,
        steps,
        image
    };

    recipes.push(recipe);
    displayRecipes();

    document.getElementById("title").value = "";
    document.getElementById("ingredients").value = "";
    document.getElementById("steps").value = "";
    document.getElementById("image").value = "";
}

function displayRecipes() {
    let list = document.getElementById("recipeList");
    list.innerHTML = "";

    recipes.forEach((r) => {
        list.innerHTML += `
            <div class="recipe">
                <img src="${r.image}">
                <h3>${r.title}</h3>
                <p><b>Ingredients:</b> ${r.ingredients}</p>
                <p><b>Steps:</b> ${r.steps}</p>
            </div>
        `;
    });
}
