import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAsVSo06yCsV1Y3EKsK8XaYTB910uJbaCg",
  authDomain: "recipe-sharing-platform-a08eb.firebaseapp.com",
  projectId: "recipe-sharing-platform-a08eb",
  storageBucket: "recipe-sharing-platform-a08eb.firebasestorage.app",
  messagingSenderId: "349234964017",
  appId: "1:349234964017:web:7baf93d3ac8e2615cd710",
  measurementId: "G-6YL6THM6YR"
};

// Firebase Start
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Recipes Array
let recipes = [];

// Add Recipe
async function addRecipe() {

    let title = document.getElementById("title").value;
    let ingredients = document.getElementById("ingredients").value;
    let steps = document.getElementById("steps").value;

    let imageInput = document.getElementById("image");

    let image = "";

    if (imageInput.files.length > 0) {
        image = URL.createObjectURL(imageInput.files[0]);
    }

    let recipe = {
        title,
        ingredients,
        steps,
        image,
        likes: 0
    };

    recipes.push(recipe);

    // Firebase Save
    await addDoc(collection(db, "recipes"), recipe);

    displayRecipes();

    // Clear Input
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

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// Make functions global
window.addRecipe = addRecipe;
window.searchRecipe = searchRecipe;
window.likeRecipe = likeRecipe;
window.toggleDarkMode = toggleDarkMode;
