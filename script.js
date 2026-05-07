function searchRecipe() {
    let value = document.getElementById("search").value.toLowerCase();

    let filtered = recipes.filter(r =>
        r.title.toLowerCase().includes(value)
    );

    let list = document.getElementById("recipeList");
    list.innerHTML = "";

    filtered.forEach((r, index) => {
        list.innerHTML += `
            <div class="recipe">
                <img src="${r.image}">
                <h3>${r.title}</h3>
                <p><b>Ingredients:</b> ${r.ingredients}</p>
                <p><b>Steps:</b> ${r.steps}</p>

                <button onclick="likeRecipe(${index})">
                    ❤️ Like (${r.likes})
                </button>
            </div>
        `;
    });
}
displayRecipes();

function likeRecipe(index) {
    recipes[index].likes++;
    displayRecipes();
}
