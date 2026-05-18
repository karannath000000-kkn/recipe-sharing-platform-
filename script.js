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
const adminEmail = "rahul@gmail.com";

let recipes =
JSON.parse(localStorage.getItem("recipes"))
|| [];



// AUTO LOGIN
onAuthStateChanged(auth, (user) => {

  if (user) {

    currentUser = user.email;

    document.getElementById("app").style.display = "block";
    document.getElementById(
    "authPage"
).style.display = "none";

    loadRecipes();

  } else {

    document.getElementById("app").style.display = "none";
    document.getElementById(
    "authPage"
).style.display = "flex";

  }

});



// LOAD RECIPES
async function loadRecipes() {

  let querySnapshot =
  await getDocs(collection(db, "recipes"));

  recipes = [];

  querySnapshot.forEach((doc) => {

    recipes.push(doc.data());
    localStorage.setItem(
    "recipes",
    JSON.stringify(recipes)
);

  });

  displayRecipes();
}



// ADD RECIPE
async function addRecipe() {
  if(!checkProfileComplete()) {
    return;
}

  let title =
  document.getElementById("title").value;

  let ingredients =
  document.getElementById("ingredients").value;

  let steps =
  document.getElementById("steps").value;

  let file =
document.getElementById("imageFile").files[0];

if (!file) {

    alert("Select Image");

    return;
}

let formData = new FormData();

formData.append("image", file);

let response = await fetch(
    "https://api.imgbb.com/1/upload?key=ab86b02af7b39f7bbc46857602fb83f7",
    {
        method: "POST",
        body: formData
    }
);

let data = await response.json();

let image = data.data.url;

  let recipe = {

    title,

    ingredients,

    steps,

    image,
    category: document.getElementById("category").value,

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
      <p><span class="category-badge ${r.category}">
${r.category}
</span></p>

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

      ${r.owner === currentUser || currentUser === adminEmail ? `

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

    ||

    r.category.toLowerCase().includes(value)

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
     <span class="category-badge ${r.category}">
${r.category}
</span>
      </p>

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
  localStorage.setItem(
    "recipes",
    JSON.stringify(recipes)
  );
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

function filterRecipes(category) {

    let filteredRecipes;

    if(category === "All") {

        filteredRecipes = recipes;

    } else {

        filteredRecipes = recipes.filter(r =>
            r.category === category
        );

    }

    let list =
    document.getElementById("recipeList");

    list.innerHTML = "";

    filteredRecipes.forEach((r, index) => {

        list.innerHTML += `

        <div class="recipe">

            <img src="${r.image}">

            <h3>${r.title}</h3>

            <p>
            <span class="category-badge ${r.category}">
${r.category}
</span>
            </p>

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
window.saveProfile = saveProfile;
window.editProfile = editProfile;
window.filterRecipes = filterRecipes;

function showSection(section) {
  document.getElementById(
    "recipeForm"
).style.display = "none";

    document.getElementById("home-section").style.display = "none";
    document.getElementById("favorites-section").style.display = "none";
    document.getElementById("profile-section").style.display = "none";

    if(section === "home") {
      document.getElementById(
    "recipeForm"
).style.display = "block";
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
// USER PROFILE
let userProfile = JSON.parse(
    localStorage.getItem("userProfile")
) || {};


// SAVE PROFILE
async function saveProfile() {

    let username =
    document.getElementById("username").value;

    let gmail =
    document.getElementById("gmail").value;

    let gender =
    document.getElementById("gender").value;

    let country =
    document.getElementById("country").value;

    let file =
    document.getElementById("profileImage").files[0];

    if(
        !username ||
        !gmail ||
        !gender ||
        !country ||
        !file
    ) {
        alert("Complete Profile First 😎");
        return;
    }

    let formData = new FormData();

    formData.append("image", file);

    let response = await fetch(
        "https://api.imgbb.com/1/upload?key=ab86b02af7b39f7bbc46857602fb83f7",
        {
            method: "POST",
            body: formData
        }
    );

    let data = await response.json();

    let imageUrl = data.data.url;

    userProfile = {
        username,
        gmail,
        gender,
        country,
        imageUrl
    };

    localStorage.setItem(
        "userProfile",
        JSON.stringify(userProfile)
    );

    loadProfile();

    alert("Profile Saved 😎🔥");
}


// LOAD PROFILE
function loadProfile() {

    if(userProfile.username) {
      document.getElementById(
    "profileForm"
).style.display = "none";

document.getElementById(
    "editProfileBtn"
).style.display = "block";

        document.getElementById(
            "profilePreview"
        ).src = userProfile.imageUrl;

        document.getElementById(
            "showUsername"
        ).innerText = userProfile.username;

        document.getElementById(
            "showEmail"
        ).innerText = "📧 " + userProfile.gmail;

        document.getElementById(
            "showGender"
        ).innerText = "🚻 " + userProfile.gender;

        document.getElementById(
            "showCountry"
        ).innerText = "🌍 " + userProfile.country;

    }
}

loadProfile();
function editProfile() {

    document.getElementById(
        "profileForm"
    ).style.display = "flex";

    document.getElementById(
        "editProfileBtn"
    ).style.display = "none";
}


// COMPULSORY PROFILE CHECK
function checkProfileComplete() {

    if(!userProfile.username) {

        showSection("profile");

        alert("Complete Your Profile First 😎");

        return false;
    }

    return true;
}
