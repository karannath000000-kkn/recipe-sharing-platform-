import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsVSo06yCsV1Y3EKsK8XaYTB910uJbaCg",
  authDomain: "recipe-sharing-platform-a08eb.firebaseapp.com",
  projectId: "recipe-sharing-platform-a08eb",
  storageBucket: "recipe-sharing-platform-a08eb.firebasestorage.app",
  messagingSenderId: "349234964017",
  appId: "1:349234964017:web:7baf93d3ac8e2615cd710",
  measurementId: "G-6YL6THM6YR"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase Connected ✅");
let recipes = [];

// Add Recipe
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
        image,
        likes: 0
    };

    recipes.push(recipe);

    displayRecipes();

    // Clear inputs
    document.getElementById("title").value = "";
    document.getElementById("ingredients").value = "";
    document.getElementById("steps").value = "";
    document.getElementById("image").value = "";
}

// Display Recipes
function displayRecipes() {

    let list = document.getElementById("recipeList");

    list.innerHTML = "";

    recipes.forEach((r, index) => {

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

// Search Recipe
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

// Like Recipe
function likeRecipe(index) {

    recipes[index].likes++;

    displayRecipes();
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
