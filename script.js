import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAsVSo06yCsV1Y3EKsK8XaYTB010uJbaCg",
  authDomain: "recipe-sharing-platform-a08eb.firebaseapp.com",
  projectId: "recipe-sharing-platform-a08eb",
  storageBucket: "recipe-sharing-platform-a08eb.appspot.com",
  messagingSenderId: "349234964017",
  appId: "1:349234964017:web:78baf93d3ac8e2615cd710",
  measurementId: "G-6YL6THM6YR"
};

// Firebase Start
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let currentUser = null;
const db = getFirestore(app);

// Local Storage Recipes
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

// Add Recipe
async function addRecipe() {

    let title = document.getElementById("title").value;
    let ingredients = document.getElementById("ingredients").value;
    let steps = document.getElementById("steps").value;

    let image = document.getElementById("image").value;

    let recipe = {
        title,
        ingredients,
        steps,
        image,
        likes: 0,
        owner: currentUser,
    };

    // Add to array
    recipes.push(recipe);

    // Save local storage
    localStorage.setItem("recipes", JSON.stringify(recipes));

    // Save Firebase
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

            ${r.owner === currentUser ? `

            <button onclick="deleteRecipe(${index})">
                🗑️ Delete
            </button>

            <button onclick="editRecipe(${index})">
                ✏️ Edit
            </button>

            ` : ""}

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

    localStorage.setItem("recipes", JSON.stringify(recipes));

    displayRecipes();
}
function deleteRecipe(index) {

    recipes.splice(index, 1);

    localStorage.setItem("recipes", JSON.stringify(recipes));

    displayRecipes();
}
function editRecipe(index) {

    let newTitle = prompt(
        "Edit Recipe Title",
        recipes[index].title
    );

    let newIngredients = prompt(
        "Edit Ingredients",
        recipes[index].ingredients
    );

    let newSteps = prompt(
        "Edit Steps",
        recipes[index].steps
    );

    recipes[index].title = newTitle;
    recipes[index].ingredients = newIngredients;
    recipes[index].steps = newSteps;

    // Save updated data
    localStorage.setItem(
        "recipes",
        JSON.stringify(recipes)
    );

    displayRecipes();
}
// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// Global Functions
window.addRecipe = addRecipe;
window.searchRecipe = searchRecipe;
window.likeRecipe = likeRecipe;
window.deleteRecipe = deleteRecipe;
window.editRecipe = editRecipe;
window.toggleDarkMode = toggleDarkMode;

// Load Recipes
async function loadRecipes() {

    let querySnapshot = await getDocs(collection(db, "recipes"));

    recipes = [];

    querySnapshot.forEach((doc) => {
        recipes.push(doc.data());
    });

    displayRecipes();
}
loadRecipes();
function signup() {

    let email = document.getElementById("email").value;

    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)

    .then(() => {
      currentUser = auth.currentUser.email;
        alert("Signup Successful 😎");
        document.getElementById("app").style.display = "block";
    })

    .catch((error) => {
        alert(error.message);
    });
}
function login() {

    let email = document.getElementById("email").value;

    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)

    .then(() => {
      currentUser = auth.currentUser.email;
        alert("Login Successful 🔥");
        document.getElementById("app").style.display = "block";
    })

    .catch((error) => {
        alert(error.message);
    });
}
function logout() {

    signOut(auth)

    .then(() => {
        alert("Logout Successful 👋");
        document.getElementById("app").style.display = "none";
    })

    .catch((error) => {
        alert(error.message);
    });
}
window.signup = signup;
window.login = login;
window.logout = logout;
