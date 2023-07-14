
//Cookie
const cookieArr = document.cookie.split("=")
const userId = cookieArr[1];
let articleRepository = null;
if (!userId) window.location.replace("http://localhost:8080/index.html");

//DOM Elements
const dropDownMenuItem= document.getElementById(".dropdown-item")
const submitForm = document.getElementById("article-form")
const articles = document.getElementById("article-container")
const categoryEditContainer = document.querySelector(".dropdown-category-edit")
const categoryEditContainerMenu = document.querySelector(".dropdown-menu-category-edit")

const categorySortContainer = document.querySelector(".dropdown-category-sort")
const categorySortContainerMenu = document.querySelector(".dropdown-menu-category-sort")

const alertBox = document.querySelector(".alert");
const searchForm = document.getElementById("search-form")
//const searchContainer = document.getElementById("search-container")

//Modal Elements
let articleBody = document.getElementById("article-body")
let categoryName = document.getElementById("category-name")
let updateArticleBtn = document.getElementById("update-article-button")
let updateCategoryBtn = document.getElementById("update-category-button")
let deleteCategoryBtn = document.getElementById("delete-category-button")

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
                body: document.getElementById("article-input").value,
                imageData : imageData
    }
    addArticle(bodyObj)

    document.getElementById("article-input").value = ''
}

async function addArticle(obj) {
    const response = await fetch(`${articleUrl}user/${userId}`, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: headers
    })
        .catch(err => console.error(err.message))
    if (response.status == 200) {
        return getArticles(userId);
    }
}

const sortArticles = (data) => {
     return data.sort((a, b) => b.updated.localeCompare(a.updated));
}

const sortArticlesByCategory = (category) => {
    let sortedArticles = articleRepository
    if (category.name !== "All categories")
        sortedArticles = articleRepository.filter(article => article.category.id === category.id)
    createArticleCards(sortedArticles)
}

async function getArticles(userId) {
    await fetch(`${articleUrl}user/${userId}`, {
        method: "GET",
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            articleRepository = sortArticles(data)
            createArticleCards(articleRepository)
            populateCategories(articleRepository)
        })
        .catch(err => console.error(err))
}

async function getArticlesByBody(body='') {
    await fetch(`${articleUrl}user/body/${userId}`, {
        method: "POST",
        body: body,
        headers: headers
    })
        .then(response => response.json())
        .then(data => createArticleCards(data))
        .catch(err => console.error(err))
}

async function handleDeleteArticle(articleId){
    await fetch(articleUrl + articleId, {
        method: "DELETE",
        headers: headers
    })
    .catch(err => console.error(err))

    return getArticles(userId);
}

async function getArticleById(articleId){
   await fetch(articleUrl+ articleId, {
        method: "GET",
        headers: headers
    })
        .then(res => res.json())
        .then(data => populateArticleModal(data))
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

async function handleCategoryEdit(category){
    if (!category) return
    let bodyObj = {
        id: category,
        name: categoryName.value
    }

    await fetch(categoryUrl , {
        method: "PUT",
        body: JSON.stringify(bodyObj),
        headers: headers
    })
    .catch(err => console.error(err))

    return getArticles(userId);
}

async function handleCategoryDelete(categoryId){
    await fetch(categoryUrl + categoryId , {
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

async function changeCategoryForArticle(articleId, categoryId, allArticles){
    const articleToChange = allArticles.find(article => article.id == articleId);
    articleToChange.category.id = categoryId;
    let bodyObj = {
        id : articleToChange.id,
        title : articleToChange.title,
        body: articleToChange.body,
        link: articleToChange.link,
        relevance : articleToChange.relevance,
        created: articleToChange.created,
        user: articleToChange.user,
        category: articleToChange.category
    }

     await fetch(baseUrl, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers: headers
        })
        .catch(err => console.error(err))

     return getArticles(userId);
}

const getButtonCategoryChange = (category) =>
   ` <button
        id=${category.id}
        class="dropdown-item"
        type="button">
            ${category.name}
     </button>`


const populateCategoryMenu = (categories) =>  {
     categoryEditContainerMenu.innerHTML = "";
     categories.forEach(category => {
            const categoryButton = document.createElement("button");
            categoryButton.classList.add("dropdown-item");
            categoryButton.addEventListener("click", handleDropdownItemClick)
            categoryButton.type = "button";
            categoryButton.value = category.id;
            categoryButton.dataset.bsToggle = "modal";
            categoryButton.dataset.bsTarget = "#category-edit-modal";
            categoryButton.innerText = category.name;
            categoryButton.onclick = () => populateCategoryModal(category);
            categoryEditContainerMenu.appendChild(categoryButton);
     });
}

const populateSort = (categories) =>  {
     categorySortContainerMenu.innerHTML = "";
     categories.push({id: 10000, name: "All categories"})
     categories.forEach(category => {
            const categoryButton = document.createElement("button");
            categoryButton.classList.add("dropdown-item");
            categoryButton.addEventListener("click", handleDropdownItemClick)
            categoryButton.type = "button";
            categoryButton.value = category.id;
            categoryButton.innerText = category.name;
            categoryButton.onclick = () => sortArticlesByCategory(category);
            categorySortContainerMenu.appendChild(categoryButton);
     });
}

const populateCategoryArticles = (categories, allArticles) => {
        articles.childNodes.forEach(article => {
            const categoryId = article.getAttribute("data-category-id");
            const categoryChangeMenuLink = document.getElementById(`${article.id}_dropdownCategoryChange`)
            if (categories.length <= 1) {
                categoryChangeMenuLink.parentNode.innerHTML = "";
                return
            }
            categories.forEach(category => {
                if (category.id != categoryId) {
                    categoryChangeMenuLink.addEventListener("click", handleDropdownClick)
                    const categoryChangeMenu = document.getElementById(`${article.id}_menu`);
                    if (categoryChangeMenu) {
                        const categoryButton = document.createElement("button");
                        categoryButton.classList.add("dropdown-item");
                        categoryButton.addEventListener("click", handleDropdownItemClick)
                        categoryButton.type = "button";
                        categoryButton.value = category.id;
                        categoryButton.innerHTML = category.name;
                        categoryButton.onclick = () => changeCategoryForArticle(article.id, category.id, allArticles);
                        categoryChangeMenu.appendChild(categoryButton);
                    }
                }
            });
        });
}

const populateCategories = (allArticles) => {
    const categories = Object.values(allArticles.reduce((acc, obj) => ({ ...acc, [obj.category.id]: obj.category }), {}));
    //populateCategoryMenu(categories);
    //populateSort(categories);
    populateCategoryArticles(categories, allArticles);
}

const switchContextArticle = (index) => {
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

const createArticleCards = (array) => {
    articles.innerHTML = ''
    if (!array.length) return
    array.forEach(obj => {
        let articleCard = document.createElement("div")
        articleCard.classList.add("m-0")
        articleCard.id = obj.id;
        articleCard.setAttribute("data-category-id", obj.category.id)
        articleCard.innerHTML = `
            <div class="card d-flex article-card">
                <ul class="nav flex-column articles-nav">
                    <li id="delete_nav" class="nav-item">
                        <button class="nav-link-article active" onclick="handleDeleteArticle(${obj.id})">
                            <img id="delete" src="media/deleteActive.svg" alt="Delete">
                        </button>
                    </li>
                    <li id="edit_nav" class="nav-item">
                        <button class="nav-link-article active" onclick="getArticleById(${obj.id})"
                        data-bs-toggle="modal" data-bs-target="#article-edit-modal">
                            <img id="edit" src="media/editActive.svg" alt="Edit">
                        </button
                    </li>
                </ul>
                <div class="card-body d-flex flex-column  justify-content-between article-card-body">
                    <p class="card-text">${obj.body}</p>
                    <div class="card-footer">
                        <p class="card-category">${obj.category? obj.category.name : ""}</p>
                        <div class="drop-down-container">
                            <div class="dropdown-category-change">
                                <a class="btn btn-info dropdown-toggle dropdown-container-change" href="#" role="button"
                                    id="${obj.id}_dropdownCategoryChange"
                                    data-toggle="dropdown-category-change">
                                    Change category
                                </a>
                                <div
                                    id="${obj.id}_menu"
                                    class="dropdown-menu-category-change">
                                </div>
                            </div>
                        </div>
                    </div>
                    <img src="${obj.imageData}" class="card-img"/>
                </div>
            </div>
        `
        articles.append(articleCard);
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
    if (e.target.nextElementSibling?.classList.contains("show")) {
        e.target.nextElementSibling?.classList.remove("show");
    } else {
        e.target.nextElementSibling?.classList.add("show");
    }
}

const handleDropdownItemClick = (e) => {
    e.preventDefault();
    if (e.target.parentNode?.classList.contains("show")) {
        e.target.parentNode?.classList.remove("show");
    } else {
        e.target.parentNode?.classList.add("show");
    }
}


const populateArticleModal = (obj) =>{
    articleBody.value= ''
    articleBody.value = obj.body
    updateArticleBtn.setAttribute('data-article-id', obj.id)
}

const populateCategoryModal = (obj) =>{
    categoryName.value = ''
    categoryName.value = obj.name
    updateCategoryBtn.setAttribute('data-category-id', obj.id)
    deleteCategoryBtn.setAttribute('data-category-id', obj.id)
}


getArticles(userId);

submitForm?.addEventListener("submit", handleSubmit)

searchForm?.addEventListener("submit", handleSearchSubmit)

categoryEditContainer?.addEventListener("click", handleDropdownClick)
categorySortContainer?.addEventListener("click", handleDropdownClick)

updateArticleBtn?.addEventListener("click", (e)=>{
    let articleId = e.target.getAttribute('data-article-id')
    handleArticleEdit(articleId);
})

updateCategoryBtn?.addEventListener("click", (e)=>{
    let categoryId = e.target.getAttribute('data-category-id')
    handleCategoryEdit(categoryId);
})

deleteCategoryBtn.addEventListener("click", (e)=>{
    let categoryId = e.target.getAttribute('data-category-id')
    handleCategoryDelete(categoryId);
})

