
const loginForm = document.getElementById('login-form')
const loginUsername = document.getElementById('login-username')
const loginPassword = document.getElementById('login-password')
const navItems = document.querySelectorAll('.nav-item')

const home = document.querySelector(".home")
const home_nav = document.getElementById("home")

const login = document.querySelector(".login")
const login_nav = document.getElementById("login")

const register = document.querySelector(".register")
const register_nav = document.getElementById("register");

const articles = document.querySelector(".articles")
const articles_container = document.querySelector(".articles-container")
const articles_container_search = document.querySelector(".articles-container-search")
const articles_nav = document.getElementById("articles")

const add = document.querySelector(".add")
const add_nav = document.getElementById("add")

const search = document.querySelector(".search")
const search_nav = document.getElementById("search")
const searchFormContainer = document.querySelector("article-container-search")

const categoryedit = document.querySelector(".categoryedit")
const categoryedit_nav = document.getElementById("categoryedit")

const logout = document.querySelector(".logout")
const logout_nav = document.getElementById("logout");

const registerForm = document.getElementById('register-form')
const registerUsername = document.getElementById('register-username')
const registerPassword = document.getElementById('register-password')

const headers = {
    'Content-Type':'application/json'
}

const userUrl = "http://localhost:8080/api/v1/users/"
const articleUrl = "http://localhost:8080/api/v1/articles/"
const categoryUrl = "http://localhost:8080/api/v1/categories/"

const getImagePath = (id, active = true) => {
    if (active) return `media/${id}Active.svg`
    return `media/${id}.svg`
}

const toggleActive = (index, element, element_nav, isActive) => {
    element.classList.toggle("active", isActive);
    element_nav.src = getImagePath(index, isActive);
    element_nav.parentNode.classList.toggle("active", isActive);
};

const switchContext = (index) => {
   if (home) toggleActive("home", home, home_nav, false);
   if (login) toggleActive("login", login, login_nav, false);
   if (register) toggleActive("register", register, register_nav, false);
   if (articles) toggleActive("articles", articles, articles_nav, false);
   if (add) toggleActive("add", add, add_nav, false);
   if (categoryedit) toggleActive("categoryedit", categoryedit, categoryedit_nav, false);
   if (search) toggleActive("search", search, search_nav, false);
   if (logout) toggleActive("logout", logout, logout_nav, false);

   switch (index) {
       case "home":
            if (home) toggleActive("home", home, home_nav, true);
           break;
       case "login":
           if (login) toggleActive("login", login, login_nav, true);
           break;
       case "register":
           if (register) toggleActive("register", register, register_nav, true);
           break;
       case "articles":
           if (articles) toggleActive("articles", articles, articles_nav, true);
           break;
       case "add":
           if (add) toggleActive("add", add, add_nav, true);
           break;
       case "categoryedit":
           if (categoryedit) toggleActive("categoryedit", categoryedit, categoryedit_nav, true);
           break;
      case "search":
          if (search) toggleActive("search", search, search_nav, true);
          if (articles_container_search) articles_container_search.innerHTML = ''
          break;
       case "logout":
           if (logout) toggleActive("logout", logout, logout_nav, true);
           break;
       default:
           break;
   }
}

const handleNavItemClick = (e) => {
   e.preventDefault();
   switchContext(e.target.id)
}

const populateAlert = (text) => {
    const alertBox = document.querySelector(".alert");
    alertBox.innerHTML = text
    alertBox.style.display = "block"
    setTimeout(function(){
        alertBox.style.display = "none"
    }, 5000);
}

const handleSubmitLogin = async (e) =>{
    e.preventDefault()

    let bodyObj = {
        username: loginUsername.value,
        password: loginPassword.value
    }

    const response = await fetch(`${userUrl}login`, {
        method: "POST",
        body: JSON.stringify(bodyObj),
        headers: headers
    })
    .catch(err => console.error(err.message))

    const responseArr = await response.json()

    if (response.status === 200){
        if (responseArr[0] === "Username or password incorrect")  {
            populateAlert(responseArr[0])
            return
        }
        document.cookie = `userId=${responseArr[1]}`
        window.location.replace(responseArr[0])
    }
}

const handleSubmitRegistration = async (e) =>{
    e.preventDefault()

    let bodyObj = {
        username: registerUsername.value,
        password: registerPassword.value
    }

    const response = await fetch(`${userUrl}register`, {
        method: "POST",
        body: JSON.stringify(bodyObj),
        headers: headers
    })
        .catch(err => console.error(err.message))

    const responseArr = await response.json()

    if (response.status === 200){
        switchContext("login")
    }
}

loginForm?.addEventListener("submit", handleSubmitLogin)
registerForm?.addEventListener("submit", handleSubmitRegistration)

navItems.forEach(item => {
    item.addEventListener("click", handleNavItemClick)
})

switchContext(home ? "home" : "articles")