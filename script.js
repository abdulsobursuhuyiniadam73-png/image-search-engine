const accesskey = "f_qLlxzeEDP6snBoyk6leBDrY8scHwnziPYjSw1JVzk";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");
const viewSavedBtn = document.getElementById("view-saved-btn");

// Modal
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementById("close-btn");

let keyword = "";
let page = 1;
let showingSaved = false;

// Load saved images
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function saveToLocalStorage(){
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function displayImages(images){
    searchResult.innerHTML = "";

    images.forEach((src) =>{
        const container = document.createElement("div");

        const image = document.createElement("img");
        image.src = src;

        // Remove from favorites
        const favBtn = document.createElement("span");
        favBtn.innerHTML = "❤️";
        favBtn.style.position = "absolute";
        favBtn.style.top = "10px";
        favBtn.style.right = "15px";
        favBtn.style.cursor = "pointer";

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            favorites = favorites.filter(img => img !== src);
            saveToLocalStorage();
            displaySaved();
        });

        // Modal
        image.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = src;
        });

        container.appendChild(image);
        container.appendChild(favBtn);
        searchResult.appendChild(container);
    });
}

function displaySaved(){
    showingSaved = true;
    viewSavedBtn.textContent = "Back to Search 🔍";
    showMoreBtn.style.display = "none";
    displayImages(favorites);
}

async function searchImages(){
    showingSaved = false;
    viewSavedBtn.textContent = "View Saved ❤️";

    keyword = searchBox.value;
    if(!keyword) return;

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accesskey}&per_page=12`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    if(page === 1){
        searchResult.innerHTML = "";
    }

    results.forEach((result) =>{
        const container = document.createElement("div");

        const image = document.createElement("img");
        image.src = result.urls.small;

        // ❤️ Favorite button
        const favBtn = document.createElement("span");
        favBtn.innerHTML = favorites.includes(result.urls.small) ? "❤️" : "♡";
        favBtn.style.position = "absolute";
        favBtn.style.top = "10px";
        favBtn.style.right = "15px";
        favBtn.style.cursor = "pointer";

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            if(favorites.includes(result.urls.small)){
                favorites = favorites.filter(img => img !== result.urls.small);
                favBtn.innerHTML = "♡";
            } else {
                favorites.push(result.urls.small);
                favBtn.innerHTML = "❤️";
            }

            saveToLocalStorage();
        });

        // Modal
        image.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = result.urls.regular;
        });

        container.appendChild(image);
        container.appendChild(favBtn);
        searchResult.appendChild(container);
    });

    showMoreBtn.style.display = "block";
}

// Toggle saved view
viewSavedBtn.addEventListener("click", () => {
    if(showingSaved){
        searchResult.innerHTML = "";
        showMoreBtn.style.display = "none";
        viewSavedBtn.textContent = "View Saved ❤️";
        showingSaved = false;
    } else {
        displaySaved();
    }
});

// Search
searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    page = 1;
    searchImages();
});

// Show more
showMoreBtn.addEventListener("click",() => {
    page++;
    searchImages();
});

// Close modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
});
