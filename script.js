const accesskey = "f_qLlxzeEDP6snBoyk6leBDrY8scHwnziPYjSw1JVzk";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

// Modal elements
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementById("close-btn");

let keyword = "";
let page = 1;

async function searchImages(){
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
        const image = document.createElement("img");
        image.src = result.urls.small;

        // Click to open modal
        image.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = result.urls.regular;
        });

        searchResult.appendChild(image);
    });

    showMoreBtn.style.display = "block";
}

// Search submit
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

// Close when clicking outside image
modal.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
});
