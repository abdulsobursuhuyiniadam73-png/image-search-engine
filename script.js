const accesskey = "f_qLlxzeEDP6snBoyk6leBDrY8scHwnziPYjSw1JVzk";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const viewSavedBtn = document.getElementById("view-saved-btn");

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

// Display images (search results or saved)
function displayImages(images){
    searchResult.innerHTML = "";

    images.forEach((src) => {
        const container = document.createElement("div");
        container.style.position = "relative";

        const image = document.createElement("img");
        image.src = src;

        // Favorite button
        const favBtn = document.createElement("span");
        favBtn.innerHTML = "❤️";
        favBtn.style.position = "absolute";
        favBtn.style.top = "10px";
        favBtn.style.right = "15px";
        favBtn.style.cursor = "pointer";
        favBtn.style.background = "rgba(0,0,0,0.4)";
        favBtn.style.borderRadius = "50%";
        favBtn.style.padding = "5px";

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            favorites = favorites.filter(img => img !== src);
            saveToLocalStorage();
            displaySaved();
        });

        // Download button
        const downloadBtn = document.createElement("span");
        downloadBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
          <path d="M5 20h14v-2H5v2zm7-18v12l5-5h-3V4h-4v5H7l5 5z"/>
        </svg>
        `;
        downloadBtn.style.position = "absolute";
        downloadBtn.style.bottom = "10px";
        downloadBtn.style.right = "15px";
        downloadBtn.style.cursor = "pointer";
        downloadBtn.style.background = "rgba(0,0,0,0.4)";
        downloadBtn.style.borderRadius = "50%";
        downloadBtn.style.padding = "5px";

        downloadBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const link = document.createElement("a");
            link.href = src;
            link.download = "image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // Open modal on image click
        image.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = src;
        });

        container.appendChild(image);
        container.appendChild(favBtn);
        container.appendChild(downloadBtn);
        searchResult.appendChild(container);
    });
}

// Show saved images
function displaySaved(){
    showingSaved = true;
    viewSavedBtn.textContent = "Back to Search 🔍";
    displayImages(favorites);
}

// Fetch images from Unsplash
async function searchImages(){
    if(isLoading) return;

    keyword = searchBox.value;
    if(!keyword) return;

    isLoading = true;

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
            container.style.position = "relative";

            const image = document.createElement("img");
            image.src = result.urls.small;

            // Favorite button
            const favBtn = document.createElement("span");
            favBtn.innerHTML = favorites.includes(result.urls.small) ? "❤️" : "♡";
            favBtn.style.position = "absolute";
            favBtn.style.top = "10px";
            favBtn.style.right = "15px";
            favBtn.style.cursor = "pointer";
            favBtn.style.background = "rgba(0,0,0,0.4)";
            favBtn.style.borderRadius = "50%";
            favBtn.style.padding = "5px";

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

            // Download button
            const downloadBtn = document.createElement("span");
            downloadBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M5 20h14v-2H5v2zm7-18v12l5-5h-3V4h-4v5H7l5 5z"/>
            </svg>
            `;
            downloadBtn.style.position = "absolute";
            downloadBtn.style.bottom = "10px";
            downloadBtn.style.right = "15px";
            downloadBtn.style.cursor = "pointer";
            downloadBtn.style.background = "rgba(0,0,0,0.4)";
            downloadBtn.style.borderRadius = "50%";
            downloadBtn.style.padding = "5px";

            downloadBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const link = document.createElement("a");
                link.href = result.urls.full; // high-res download
                link.download = "image.jpg";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });

            // Open modal
            image.addEventListener("click", () => {
                modal.style.display = "flex";
                modalImg.src = result.urls.regular;
            });

            container.appendChild(image);
            container.appendChild(favBtn);
            container.appendChild(downloadBtn);
            searchResult.appendChild(container);
        });

        page++;

    } catch(error){
        console.log("Error:", error);
    }

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

// Search form submit
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
