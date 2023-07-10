
//Cookie
const cookieArr = document.cookie.split("=")
const userId = cookieArr[1];
if (!userId) window.location.replace("http://localhost:8080/login.html");
console.log(userId)

//DOM Elements
const submitForm = document.getElementById("article-form")
const articleContainer = document.getElementById("article-container")
const categoryContainer = document.querySelector(".dropdown")
const categoryContainerMenu = document.querySelector(".dropdown-menu")

const alertBox = document.querySelector(".alert");
const searchForm = document.getElementById("search-form")
//const searchContainer = document.getElementById("search-container")

//Modal Elements
let articleBody = document.getElementById(`article-body`)
let categoryName = document.getElementById(`category-name`)
let updateArticleBtn = document.getElementById('update-article-button')
let updateCategoryBtn = document.getElementById('update-category-button')
let deleteCategoryBtn = document.getElementById('delete-category-button')

const headers = {
    'Content-Type': 'application/json'
}

const baseUrl = "http://localhost:8080/api/v1/articles/"
const categoriesUrl = "http://localhost:8080/api/v1/categories/"

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});


const handleSearchSubmit = async (e) => {
     e.preventDefault()
     let body= document.getElementById("search-input").value.trim()
     getArticlesByBody(body)

     document.getElementById("search-input").value = ''
}

const handleSubmit = async (e) => {
    e.preventDefault()

    let file = document.getElementById("customFile").files[0]
    let imageData = ''

    if (file) {
        try {
            imageData = await toBase64(file)
        }
        catch (err) {
            console.log(err)
        }
    }

    let bodyObj = {
                body: document.getElementById("article-input").value
//                imageData : imageData
    }
    addArticle(bodyObj)

    document.getElementById("article-input").value = ''
}

async function addArticle(obj) {
    const response = await fetch(`${baseUrl}user/${userId}`, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: headers
    })
        .catch(err => console.error(err.message))
    if (response.status == 200) {
        return getArticles(userId);
    }
}

async function getArticles(userId) {
    await fetch(`${baseUrl}user/${userId}`, {
        method: "GET",
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            createArticleCards(data)
            populateCategories(data)
        })
        .catch(err => console.error(err))
}

async function getArticlesByBody(body='') {
    await fetch(`${baseUrl}user/body/${userId}`, {
        method: "POST",
        body: body,
        headers: headers
    })
        .then(response => response.json())
        .then(data => createArticleCards(data))
        .catch(err => console.error(err))
}

async function handleDelete(articleId){
    await fetch(baseUrl + articleId, {
        method: "DELETE",
        headers: headers
    })
    .catch(err => console.error(err))

    return getArticles(userId);
}

async function getArticleById(articleId){
    await fetch(baseUrl + articleId, {
        method: "GET",
        headers: headers
    })
        .then(res => res.json())
        .then(data => populateModal(data))
        .catch(err => console.error(err.message))
}

async function handleArticleEdit(articleId){
    let bodyObj = {
        id: articleId,
        body: articleBody.value
    }

    await fetch(baseUrl, {
        method: "PUT",
        body: JSON.stringify(bodyObj),
        headers: headers
    })
        .catch(err => console.error(err))

    return getArticles(userId);
}

async function handleCategoryEdit(categoryId){
    let bodyObj = {
        id: categoryId,
        name: categoryName.value
    }

    await fetch(categoriesUrl , {
        method: "PUT",
        body: JSON.stringify(bodyObj),
        headers: headers
    })
    .catch(err => console.error(err))

    return getArticles(userId);
}

const populateAlert = (text) => {
    alertBox.innerHTML = text
    alertBox.style.display = "block"
    setTimeout(function(){
        alertBox.style.display = "none"
    }, 1500);
}

async function handleCategoryDelete(categoryId){
    await fetch(categoriesUrl + categoryId , {
        method: "DELETE",
        headers: headers
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            populateAlert(data) }
    })
    .catch(err => console.error(err))

    return getArticles(userId);
}

async function changeCategoryForArticle(categoryId, articleId){
    let bodyObj = {
        id: articleId,
        categoryId: categoryId
    }

     await fetch(baseUrl, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers: headers
        })
        .catch(err => console.error(err))

     return getArticles(userId);
}

const populateCategories = (array) => {
    const categories = []
//    const categoryContainerChange = document.querySelector(".dropdown-change")
//    const categoryContainerMenuChange = document.querySelector(".dropdown-menu-change")
    categoryContainerMenu.innerHTML = ''
    const articleChildren = articleContainer.childNodes;

//    categoryContainerChange.addEventListener("click", handleDropdownChangeClick)

    if (!array.length) return
    array.forEach(obj => {
        if (categories.includes(obj.category.name)) return
        let category = document.createElement("div");
        let categoryChange = document.createElement("div");
        categoryChange.id = obj.category.id
        const buttonHTML = `
           <button class="dropdown-item"
               type="button"
               value="${obj.id}"
               data-bs-toggle="modal" data-bs-target="#category-edit-modal">
               ${obj.category.name}
           </button>`
        let name = obj.category.name
        let id = obj.category.id
        category.innerHTML = buttonHTML
        category.onclick = () => populateCategoryModal(obj.category)
        categoryContainerMenu.append(category)

        articleChildren.forEach((article) => {
            const categoryContainerMenuChange = document.getElementById(`${article.id}_menu`)
            const categoryContainerChange = document.getElementById(`${article.id}_dropdown`)
            categoryContainerChange.addEventListener("click", handleDropdownChangeClick)
            categoryContainerMenuChange.innerHTML = buttonHTML
              //categoryChange.onclick = () => changeCategoryForArticle(obj.category, categoryContainerChange.id)
        });

        categories.push(obj.category.name)
    })

}

const createArticleCards = (array) => {
    articleContainer.innerHTML = ''
    if (!array.length) return
    array.forEach(obj => {
        let articleCard = document.createElement("div")
        articleCard.classList.add("m-0")
        articleCard.id = obj.id;
        articleCard.innerHTML = `
            <div class="card d-flex" ">
                <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
                    <p class="card-text">${obj.body}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-danger" onclick="handleDelete(${obj.id})">Delete</button>
                        <button onclick="getArticleById(${obj.id})" type="button" class="btn btn-primary"
                        data-bs-toggle="modal" data-bs-target="#article-edit-modal">
                        Edit
                        </button>
                    </div>
                    <p class="card-text">${obj.category? obj.category.name : ""}</p>
                    <div id="${obj.id}_dropdown" class="dropdown-change">
                        <a class="btn btn-info dropdown-toggle" href="#" role="button"
                            id="dropdownMenuLinkChange" data-toggle="dropdownchange" aria-haspopup="true"
                            aria-expanded="false">
                            Change category
                        </a>
                        <div id="${obj.id}_menu" class="dropdown-menu-change" aria-labelledby="dropdownMenuLink" aria-labelledby="dropdownMenuLink">
                    </div>
                </div>
            </div>
        `
        articleContainer.append(articleCard);
    })
}
function handleLogout(){
    let c = document.cookie.split(";");
    for(let i in c){
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
}

const handleDropdownClick = (e) => {
    e.preventDefault();
    if (categoryContainerMenu.classList.contains("show")) {
        categoryContainerMenu.classList.remove("show");
    } else {
        categoryContainerMenu.classList.add("show");
    }
}

const handleDropdownChangeClick = (e) => {
    e.preventDefault();
    if (e.target.nextElementSibling?.classList.contains("show")) {
        e.target.nextElementSibling?.classList.remove("show");
    } else {
        e.target.nextElementSibling?.classList.add("show");
    }
}

const populateModal = (obj) =>{
    articleBody.innerText = ''
    articleBody.innerText = obj.body
    updateArticleBtn.setAttribute('data-article-id', obj.id)
}

const populateCategoryModal = (obj) =>{
    categoryName.innerText = ''
    categoryName.innerText = obj.name
    updateCategoryBtn.setAttribute('data-category-id', obj.id)
    deleteCategoryBtn.setAttribute('data-category-id', obj.id)
}


getArticles(userId);

submitForm.addEventListener("submit", handleSubmit)

searchForm.addEventListener("submit", handleSearchSubmit)
categoryContainer.addEventListener("click", handleDropdownClick)

updateArticleBtn.addEventListener("click", (e)=>{
    let articleId = e.target.getAttribute('data-article-id')
    handleArticleEdit(articleId);
})

updateCategoryBtn.addEventListener("click", (e)=>{
    let categoryId = e.target.getAttribute('data-category-id')
    handleCategoryEdit(categoryId);
})

deleteCategoryBtn.addEventListener("click", (e)=>{
    let categoryId = e.target.getAttribute('data-category-id')
    handleCategoryDelete(categoryId);
})