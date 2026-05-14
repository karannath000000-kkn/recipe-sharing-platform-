import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAsVSo06yCsV1Y3EKsK8XaYTB010uJbaCg",
  authDomain: "recipe-sharing-platform-a08eb.firebaseapp.com",
  projectId: "recipe-sharing-platform-a08eb",
  storageBucket: "recipe-sharing-platform-a08eb.appspot.com",
  messagingSenderId: "349234964017",
  appId: "1:349234964017:web:78baf93d3ac8e2615cd710",
  measurementId: "G-6YL6THM6YR"
};



// FIREBASE START
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

let currentUser = null;

let recipes = [];



// AUTO LOGIN
onAuthStateChanged(auth, (user) => {

  if (user) {

    currentUser = user.email;

    document.getElementById("app").style.display = "block";

    loadRecipes();

  } else {

    document.getElementById("app").style.display = "none";

  }

});



// LOAD RECIPES
async function loadRecipes() {

  let querySnapshot =
  await getDocs(collection(db, "recipes"));

  recipes = [];

  querySnapshot.forEach((doc) => {

    recipes.push(doc.data());

  });

  displayRecipes();
}



// ADD RECIPE
async function addRecipe() {

  let title =
  document.getElementById("title").value;

  let ingredients =
  document.getElementById("ingredients").value;

  let steps =
  document.getElementById("steps").value;

  let image =
  document.getElementById("image").value;

  let recipe = {

    title,

    ingredients,

    steps,

    image,

    likes: 0,

    owner: currentUser,

    comments: [],

    favorites: [],

    rating: 0,

    totalRatings: 0

  };

  recipes.push(recipe);

  await addDoc(
    collection(db, "recipes"),
    recipe
  );

  displayRecipes();

  document.getElementById("title").value = "";

  document.getElementById("ingredients").value = "";

  document.getElementById("steps").value = "";

  document.getElementById("image").value = "";

}



// DISPLAY RECIPES
function displayRecipes() {

  let list =
  document.getElementById("recipeList");

  list.innerHTML = "";

  recipes.forEach((r, index) => {

    list.innerHTML += `

    <div class="recipe">

      <img src="${r.image}">

      <h3>${r.title}</h3>

      <p>
      <b>Ingredients:</b>
      ${r.ingredients}
      </p>

      <p>
      <b>Steps:</b>
      ${r.steps}
      </p>

      <button onclick="likeRecipe(${index})">
        ❤️ Like (${r.likes})
      </button>

      <button onclick="favoriteRecipe(${index})">
        ❤️ Favorite (${(r.favorites || []).length})
      </button>

      <br><br>

      ⭐ Rating: ${r.rating || 0}/5

      <br><br>

      <select id="rating-${index}">
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐</option>
        <option value="3">3 ⭐</option>
        <option value="4">4 ⭐</option>
        <option value="5">5 ⭐</option>
      </select>

      <button onclick="rateRecipe(${index})">
        ⭐ Rate
      </button>

      ${r.owner === currentUser ? `

      <button onclick="deleteRecipe(${index})">
        🗑️ Delete
      </button>

      <button onclick="editRecipe(${index})">
        ✏️ Edit
      </button>

      ` : ""}

      <div class="comments">

        <input
          type="text"
          id="comment-${index}"
          placeholder="Write comment..."
        >

        <button onclick="addComment(${index})">
          💬 Comment
        </button>

        <div>

          ${(r.comments || []).map(c => `
            <p>💬 ${c}</p>
          `).join("")}

        </div>

      </div>

    </div>

    `;

  });

}



// SEARCH RECIPE
function searchRecipe() {

  let value =
  document.getElementById("search")
  .value
  .toLowerCase();

  let filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(value)
  );

  let list =
  document.getElementById("recipeList");

  list.innerHTML = "";

  filtered.forEach((r) => {

    list.innerHTML += `

    <div class="recipe">

      <img src="${r.image}">

      <h3>${r.title}</h3>

      <p>
      <b>Ingredients:</b>
      ${r.ingredients}
      </p>

      <p>
      <b>Steps:</b>
      ${r.steps}
      </p>

    </div>

    `;

  });

}



// LIKE RECIPE
function likeRecipe(index) {

  recipes[index].likes++;

  displayRecipes();

}



// FAVORITE RECIPE
function favoriteRecipe(index) {

  if(!recipes[index].favorites) {

    recipes[index].favorites = [];

  }

  if(
    recipes[index]
    .favorites
    .includes(currentUser)
  ) {

    alert("Already Favorited ❤️");

    return;

  }

  recipes[index]
  .favorites
  .push(currentUser);

  displayRecipes();
  showSection("favorites");

}



// RATE RECIPE
function rateRecipe(index) {

  let rating = parseInt(

    document.getElementById(
      `rating-${index}`
    ).value

  );

  let oldRating =
  recipes[index].rating || 0;

  let totalRatings =
  recipes[index].totalRatings || 0;

  let newTotal =
  oldRating * totalRatings + rating;

  totalRatings++;

  recipes[index].totalRatings =
  totalRatings;

  recipes[index].rating =
  (newTotal / totalRatings)
  .toFixed(1);

  displayRecipes();

}



// DELETE RECIPE
function deleteRecipe(index) {

  recipes.splice(index, 1);

  displayRecipes();

}



// EDIT RECIPE
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

  displayRecipes();

}



// ADD COMMENT
function addComment(index) {

  let input =
  document.getElementById(
    `comment-${index}`
  );

  let comment = input.value;

  if(comment.trim() === "") return;

  if(!recipes[index].comments) {

    recipes[index].comments = [];

  }

  recipes[index].comments.push(comment);

  displayRecipes();

}



// DARK MODE
function toggleDarkMode() {

  document.body.classList.toggle("dark");

}



// SIGNUP
function signup() {

  let email =
  document.getElementById("email").value;

  let password =
  document.getElementById("password").value;

  createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  .then(() => {

    currentUser = auth.currentUser.email;

    alert("Signup Successful 😎");

    document.getElementById("app")
    .style.display = "block";

  })

  .catch((error) => {

    alert(error.message);

  });

}



// LOGIN
function login() {

  let email =
  document.getElementById("email").value;

  let password =
  document.getElementById("password").value;

  signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  .then(() => {

    currentUser = auth.currentUser.email;

    alert("Login Successful 🔥");

    document.getElementById("app")
    .style.display = "block";

    loadRecipes();

  })

  .catch((error) => {

    alert(error.message);

  });

}



// LOGOUT
function logout() {

  signOut(auth)

  .then(() => {

    alert("Logout Successful 👋");

    document.getElementById("app")
    .style.display = "none";

  })

  .catch((error) => {

    alert(error.message);

  });

}



// GLOBAL FUNCTIONS
window.addRecipe = addRecipe;

window.searchRecipe = searchRecipe;

window.likeRecipe = likeRecipe;

window.favoriteRecipe = favoriteRecipe;

window.rateRecipe = rateRecipe;

window.deleteRecipe = deleteRecipe;

window.editRecipe = editRecipe;

window.addComment = addComment;

window.toggleDarkMode = toggleDarkMode;

window.signup = signup;

window.login = login;

window.logout = logout;
function showSection(section) {

    document.getElementById("home-section").style.display = "none";
    document.getElementById("favorites-section").style.display = "none";
    document.getElementById("profile-section").style.display = "none";

    if(section === "home") {
        document.getElementById("home-section").style.display = "block";
    }

    if(section === "favorites") {

        document.getElementById("favorites-section").style.display = "block";

        let favoriteList =
            document.getElementById("favoriteList");

        favoriteList.innerHTML = "";

        let favRecipes = recipes.filter(r =>
            r.favorites &&
            r.favorites.includes(currentUser)
        );

        favRecipes.forEach(r => {

            favoriteList.innerHTML += `
                <div class="recipe">
                    <img src="${r.image}">
                    <h3>${r.title}</h3>
                </div>
            `;
        });
    }

    if(section === "profile") {

        document.getElementById("profile-section").style.display = "block";

        document.getElementById("profileEmail").innerText =
            "Email: " + currentUser;

        let myRecipes = recipes.filter(r =>
            r.owner === currentUser
        );

        document.getElementById("recipeCount").innerText =
            myRecipes.length;
    }
}

window.showSection = showSection;
