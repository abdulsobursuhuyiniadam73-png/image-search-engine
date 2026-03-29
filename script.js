const accesskey = "f_qLlxzeEDP6snBoyk6leBDrY8scHwnziPYjSw1JVzk";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const viewSavedBtn = document.getElementById("view-saved-btn");
const loader = document.getElementById("loader");

// Modal
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementById("close-btn");

let keyword = "";
let page = 1;
let showingSaved = false;
let isLoading = false;

// Load saved images
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function saveToLocalStorage(){
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Display saved images
function displayImages(images){
    searchResult.innerHTML = "";

    images.forEach((src) =>{
        const container = document.createElement("div");

        const image = document.createElement("img");
        image.src = src;

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

        image.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = src;
        });

        container.appendChild(image);
        container.appendChild(favBtn);
        searchResult.appendChild(container);
    });
}

// Show saved view
function displaySaved(){
    showingSaved = true;
    viewSavedBtn.textContent = "Back to Search 🔍";
    loader.style.display = "none";
    displayImages(favorites);
}

// Fetch images
async function searchImages(){
    if(isLoading) return;

    keyword = searchBox.value;
    if(!keyword) return;

    isLoading = true;
    loader.style.display = "block";

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accesskey}&per_page=12`;

    try{
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

            image.addEventListener("click", () => {
                modal.style.display = "flex";
                modalImg.src = result.urls.regular;
            });

            container.appendChild(image);
            container.appendChild(favBtn);
            searchResult.appendChild(container);
        });

        page++;

    } catch(error){
        console.log("Error fetching images:", error);
    }

    loader.style.display = "none";
    isLoading = false;
}

// Infinite scroll
window.addEventListener("scroll", () => {
    if(showingSaved) return;

    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 500){
        searchImages();
    }
});

// Toggle saved view
viewSavedBtn.addEventListener("click", () => {
    if(showingSaved){
        searchResult.innerHTML = "";
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

// Close modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
});
