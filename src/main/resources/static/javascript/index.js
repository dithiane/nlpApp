
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

const registerForm = document.getElementById('register-form')
const registerUsername = document.getElementById('register-username')
const registerPassword = document.getElementById('register-password')

let menu = "home"


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
  if (!home || !login || !register) return
   toggleActive("home", home, home_nav, false);
   toggleActive("login", login, login_nav, false);
   toggleActive("register", register, register_nav, false);

   switch (index) {
       case "home":
           toggleActive("home", home, home_nav, true);
           break;
       case "login":
           toggleActive("login", login, login_nav, true);
           break;
       case "register":
           toggleActive("register", register, register_nav, true);
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

    const response = await fetch(`${userUrl}/register`, {
        method: "POST",
        body: JSON.stringify(bodyObj),
        headers: headers
    })
        .catch(err => console.error(err.message))

    const responseArr = await response.json()

    if (response.status === 200){
        window.location.replace(responseArr[0])
        makeNotActiveLeft(responseArr[1])
    }
}

loginForm?.addEventListener("submit", handleSubmitLogin)
registerForm?.addEventListener("submit", handleSubmitRegistration)

navItems.forEach(item => {
    item.addEventListener("click", handleNavItemClick)
})

switchContext(menu)