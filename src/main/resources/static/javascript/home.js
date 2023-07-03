
//Cookie
const cookieArr = document.cookie.split("=")
const userId = cookieArr[1];
if (!userId) window.location.replace("http://localhost:8080/login.html");
console.log(userId)

//DOM Elements
const submitForm = document.getElementById("article-form")
const articleContainer = document.getElementById("article-container")

const searchForm = document.getElementById("search-form")
//const searchContainer = document.getElementById("search-container")

//Modal Elements
let articleBody = document.getElementById(`article-body`)
let updateArticleBtn = document.getElementById('update-article-button')

const headers = {
    'Content-Type': 'application/json'
}

const baseUrl = "http://localhost:8080/api/v1/article/"

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
        .then(data => createArticleCards(data))
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

async function handleDelete(ArticleId){
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

const createArticleCards = (array) => {
    articleContainer.innerHTML = ''
    if (!array.length) return
    array.forEach(obj => {
        let articleCard = document.createElement("div")
        articleCard.classList.add("m-0")
        articleCard.innerHTML = `
            <div class="card d-flex" ">
                <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
                    <p class="card-text">${obj.body}</p>
                    <img src="${obj.imageData}" class="card-img"/>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-danger" onclick="handleDelete(${obj.id})">Delete</button>
                        <button onclick="getArticleById(${obj.id})" type="button" class="btn btn-primary"
                        data-bs-toggle="modal" data-bs-target="#article-edit-modal">
                        Edit
                        </button>
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

const populateModal = (obj) =>{
    articleBody.innerText = ''
    articleBody.innerText = obj.body
    updateArticleBtn.setAttribute('data-article-id', obj.id)
}

getArticles(userId);

submitForm.addEventListener("submit", handleSubmit)

searchForm.addEventListener("submit", handleSearchSubmit)

updateArticleBtn.addEventListener("click", (e)=>{
    let articleId = e.target.getAttribute('data-article-id')
    handleArticleEdit(articleId);
})