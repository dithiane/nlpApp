
//Cookie
const cookieArr = document.cookie.split("=")
const userId = cookieArr[1];
let articleRepository = null;
let categories = null;

if (!userId) window.location.replace("http://localhost:8080/index.html");

//DOM Elements
const cardImage = document.querySelector(".img-modal")
const btnImageDelete = document.querySelector(".delete-modal")
const customFile = document.getElementById("custom-file")
const customFileModal = document.getElementById("custom-file-modal")
const containerApp = document.querySelector(".container-app-home")

const btnSort = document.querySelector(".btn-sort");

const dropDownMenuItem= document.getElementById(".dropdown-item")
const submitForm = document.getElementById("article-form")

let dropdown = null

const categoryEditContainer = document.querySelector(".dropdown-category-edit")
const categoryEditContainerMenu = document.querySelector(".dropdown-menu-category-edit")

const categorySortContainer = document.querySelector(".dropdown-category-sort")
const categorySortContainerMenu = document.querySelector(".dropdown-menu-category-sort")

const alertBox = document.querySelector(".alert");
const searchForm = document.getElementById("search-form")

//Modal Elements
let articleBody = document.getElementById("article-body")
let categoryName = document.getElementById("category-name")
let updateArticleBtn = document.getElementById("update-article-button")
let updateCategoryBtn = document.getElementById("update-category-button")
let deleteCategoryBtn = document.getElementById("delete-category-button")

const toBase64 = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    await new Promise((resolve) => reader.onload = resolve);
    return reader.result;
};

const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const body = document.getElementById("search-input").value.trim().toLowerCase();
    await getArticlesByBody(body);
    document.getElementById("search-input").value = '';
};

const getBase64 = async (target) => {
    const file = document.getElementById(target).files[0];
    let imageData = '';

    if (file) {
        try {
            imageData = await toBase64(file);
        } catch (err) {
            console.log(err);
        }
    }

    return imageData;
}

const handleSubmitArticle = async (e) => {
    e.preventDefault();

    const imageData = await getBase64("custom-file");

    const bodyObj = {
        body: document.getElementById("article-input").value,
        imageData,
    };

    addArticle(bodyObj);

    resetForm();

    switchContext("articles");
};

const resetForm = () => {
    document.getElementById("article-input").value = "";
    document.getElementById("custom-file").value = "";
};

const addArticle = async (obj) => {
    try {
        const response = await fetch(`${articleUrl}user/${userId}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers,
        });

        if (response.ok) {
            return getArticles(userId);
        } else {
            throw new Error("Failed to add article");
        }
    } catch (err) {
        console.error(err.message);
    }
}

const sortArticles = (data) => {
     return data.sort((a, b) => b.updated.localeCompare(a.updated));
}

const sortArticlesByCategory = (id, name) => {
    let sortedArticles = articleRepository
    if (name !== "All categories") sortedArticles = articleRepository.filter(article => article.category.id == id)
    createArticleCards(sortedArticles);
    populateCategoryArticles(categories);
}

const getArticles = async (userId) => {
    try {
        const response = await fetch(`${articleUrl}user/${userId}`, {
            method: "GET",
            headers,
        });

        if (response.ok) {
            const data = await response.json();
            articleRepository = sortArticles(data);
            createArticleCards(articleRepository);
            populateCategories();
        } else {
            throw new Error("Failed to retrieve articles");
        }
    } catch (err) {
        console.error(err);
    }
}

const getArticlesByBody = async (body = '') => {
    try {
        const response = await fetch(`${articleUrl}user/body/${userId}`, {
            method: "POST",
            body,
            headers,
        });

        if (response.ok) {
            const data = await response.json();
            createArticleCards(data, true);
            populateCategoryArticles(categories);
        } else {
            throw new Error("Failed to retrieve articles by body");
        }
    } catch (err) {
        console.error(err);
    }
}

const handleDeleteArticle = async (articleId) => {
    try {
        await fetch(articleUrl + articleId, {
            method: "DELETE",
            headers,
        });

        return getArticles(userId);
    } catch (err) {
        console.error(err);
    }
}

const getArticleById = async (articleId) => {
    try {
        const response = await fetch(articleUrl + articleId, {
            method: "GET",
            headers,
        });

        if (response.ok) {
            const data = await response.json();
            populateArticleModal(data);
        } else {
            throw new Error("Failed to retrieve article by ID");
        }
    } catch (err) {
        console.error(err.message);
    }
}

const handleArticleEdit = async (articleId) => {
    try {
        const image = document.querySelector(".img-modal")
        const image64 = await getBase64("custom-file-modal");
        const imageData = image64 ? image64 : image.getAttribute("src")
        const bodyObj = {
            id: articleId,
            body: articleBody.value,
            imageData,
        };

        await fetch(articleUrl, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers,
        });

        document.getElementById("custom-file-modal").value = "";
        switchContext("articles");

        return getArticles(userId);
    } catch (err) {
        console.error(err);
    }
};

const handleCategoryEdit = async (category) => {
    if (!category) return;

    try {
        const bodyObj = {
            id: category,
            name: categoryName.value,
        };

        await fetch(categoryUrl, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers,
        });

        categoryEditContainer.classList.add("show");
        return getArticles(userId);
    } catch (err) {
        console.error(err);
    }
};

const handleCategoryDelete = async (categoryId) => {
    try {
        const response = await fetch(categoryUrl + categoryId, {
            method: "DELETE",
            headers,
        });

        if (response.ok) {
            const data = await response.json();
            if (data) {
                populateAlert(data);
            }
        } else {
            throw new Error("Failed to delete category");
        }
    } catch (err) {
        console.error(err);
    }

    return getArticles(userId);
};

const changeCategoryForArticle = async (articleId, category, target) => {
    const articleToChange = articleRepository.find(article => article.id == articleId);
    articleToChange.category = category;
    const bodyObj = {
        id: articleToChange.id,
        title: articleToChange.title,
        body: articleToChange.body,
        link: articleToChange.link,
        relevance: articleToChange.relevance,
        created: articleToChange.created,
        user: articleToChange.user,
        category: articleToChange.category
    };

    try {
        await fetch(articleUrl, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers,
        });

        switchContext("articles");
        return getArticles(userId);
    } catch (err) {
        console.error(err);
    }
};

const getButtonCategoryChange = (category) => `
    <button
        id=${category.id}
        class="dropdown-item"
        type="button">
        ${category.name}
    </button>
`;

const populateCategoryMenu = (categories) =>  {
     categoryEditContainerMenu.innerHTML = "";
     categories.forEach(category => {
            const categoryButton = document.createElement("button");
            categoryButton.classList.add("dropdown-item");
            categoryButton.addEventListener("click", handleDropdownItemClick)
            categoryButton.type = "button";
            categoryButton.dataset.bsToggle = "modal";
            categoryButton.value = category.id;
            categoryButton.dataset.bsTarget = "#category-edit-modal";
            categoryButton.innerText = category.name;
            categoryButton.onclick = () => populateCategoryModal(category);
            categoryEditContainerMenu.appendChild(categoryButton);
            categoryEditContainerMenu.classList.add("show");
     });
}

const populateSort = (categories) =>  {
     categorySortContainerMenu.innerHTML = "";
     const categoryTypes = categories.slice(0);
     categoryTypes.push({id: 10000, name: "All categories"})
     const categoryChangeMenuLink = document.getElementById(`dropdownCategorySort`)
     categoryTypes.forEach(category => {
            let categoryButton = document.createElement("button");
            categoryButton.classList.add("dropdown-item");
            categoryButton.addEventListener("click", handleDropdownItemClick)
            categoryButton.type = "button";
            categoryButton.value = category.id;
            categoryButton.id = category.id;
            categoryButton.innerText = category.name;
            categoryButton.onclick = () => sortArticlesByCategory(category.id, category.name);
            categorySortContainerMenu.appendChild(categoryButton);
     });
}

const populateCategoryArticles = (categories) => {
    articles_container.childNodes.forEach(article => {
        const categoryId = article.getAttribute("data-category-id");
        const categoryChangeMenuLink = document.getElementById(`${article.id}_dropdownCategoryChange`)
        categoryChangeMenuLink.addEventListener("click", handleDropdownClick)
        if (categories.length <= 1) {
            categoryChangeMenuLink.parentNode.innerHTML = "";
            return
        }
        categories.forEach(category => {
            if (category.id != categoryId) {
                const categoryChangeMenu = document.getElementById(`${article.id}_menu`);
                if (categoryChangeMenu) {
                    const categoryButton = document.createElement("button");
                    categoryButton.classList.add("dropdown-item");
                    categoryButton.addEventListener("click", handleDropdownItemClick)
                    categoryButton.type = "button";
                    categoryButton.value = category.id;
                    categoryButton.innerHTML = category.name;
                    categoryButton.onclick = () => changeCategoryForArticle(article.id, category);
                    categoryChangeMenu.appendChild(categoryButton);
                }
            }
        });
    });
}

const populateCategories = () => {
    categories = Object.values(articleRepository.reduce((acc, obj) => ({ ...acc, [obj.category.id]: obj.category }), {}));

    populateCategoryMenu(categories);
    populateSort(categories);
    populateCategoryArticles(categories);
}

const createArticleCards = (array, search = false) => {
    search ? (articles_container_search.innerHTML = "") : (articles_container.innerHTML = "");
    if (!array.length) return;
    array.forEach((obj) => {
        let articleCard = document.createElement("div");
        articleCard.classList.add("m-0");
        articleCard.id = obj.id;
        articleCard.setAttribute("data-category-id", obj.category.id);
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
                        </button>
                    </li>
                </ul>
                <div class="card-body d-flex flex-column  justify-content-between article-card-body">
                    <p class="card-text">${obj.body}</p>
                    <div class="card-footer">
                        <p class="card-category">${obj.category ? obj.category.name : ""}</p>
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
        `;
        search
            ? articles_container_search.appendChild(articleCard)
            : articles_container.append(articleCard);
    });
};

const handleLogout = (e) =>{
    e.preventDefault
    let c = document.cookie.split(";");
    for(let i in c){
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    window.location.replace("http://localhost:8080/index.html");
}

const handleDropdownClick = (e) => {
    e.preventDefault();
    const dropdownMenu = e.target.nextElementSibling;
    dropdownMenu?.classList.toggle("show");
};

const handleDropdownItemClick = (e) => {
    e.preventDefault();
    const dropdownMenu = e.target.parentNode;
    dropdownMenu?.classList.toggle("show");
};

const populateArticleModal = (obj) =>{
    articleBody.value= ''
    articleBody.value = obj.body
    cardImage.setAttribute("src", obj.imageData)
    if (cardImage.getAttribute("src")) btnImageDelete.style.display = 'block'
    updateArticleBtn.setAttribute('data-article-id', obj.id)
}

const populateCategoryModal = (obj) =>{
    categoryName.value = ''
    categoryName.value = obj.name
    updateCategoryBtn.setAttribute('data-category-id', obj.id)
    deleteCategoryBtn.setAttribute('data-category-id', obj.id)
}

const handleDeleteImage = (e) =>{
    e.preventDefault()
    cardImage.setAttribute("src", "")
    customFileModal.value = ""
    btnImageDelete.style.display = 'none'
}

const handleLoadFile = async (e) => {
    e.preventDefault()
    let imageData = await getBase64("custom-file-modal")
    cardImage.setAttribute("src", imageData)
    btnImageDelete.style.display = 'block'
}

const handleClickSort = (e) => {
    e.preventDefault()
    btnSort.innerText = "Sort Categories";
}

const handleLeavingDropDown = (e) => {
    if (!e.target.classList.contains("dropdown-toggle") && !e.target.classList.contains("dropdown-item")) {
        categorySortContainerMenu.classList.remove("show");
        if (dropdown) dropdown.nextElementSibling.classList.remove("show");
    }

    if (e.target.classList.contains("dropdown-container-change")) dropdown = e.target
}

getArticles(userId);

submitForm?.addEventListener("submit", handleSubmitArticle)

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

logout_nav.addEventListener("click", handleLogout)

btnImageDelete.addEventListener("click", handleDeleteImage)

customFileModal.addEventListener("change", handleLoadFile)

btnSort.addEventListener("click", handleClickSort)

containerApp.addEventListener("click", handleLeavingDropDown)