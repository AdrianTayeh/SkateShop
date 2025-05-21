const flexContainer = document.querySelector(".flex-container");

export async function getProducts() {
    const response = await fetch("http://localhost:3000/all");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
}

export async function renderProducts(products) {
    flexContainer.innerHTML = "";
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerHTML = `<h1 class="latest-drops">Latest Drops</h1>`;
    flexContainer.append(titleDiv);

    const wishlist = getWishlist();

    [...products].reverse().forEach((product, index) => {
        const imgSrc = Array.isArray(product.images)
            ? product.images[0]
            : product.image;
        const imgTag = imgSrc
            ? `<img src="${imgSrc}" alt="${product.altTxt || "Product image"}">`
            : "";
        const isFavorite = wishlist.some((p) => p._id === product._id);
        const productCard = document.createElement("div");
        productCard.classList.add("image-wrapper");
        productCard.innerHTML = `
            ${imgTag}
            <span class="material-symbols-outlined favorite-product-icon${
                isFavorite ? " active" : ""
            }" data-index="${index}" style="cursor:pointer;">favorite</span>
            <h2>${product.name}</h2>
            <p>${product.category}</p>
            <p>${product.subcategory}</p>
            <div class="info-card"><span>+</span> More info</div>
        `;
        flexContainer.append(productCard);
    });

    // Event listeners
    document.querySelectorAll(".favorite-product-icon").forEach((icon, i) => {
        icon.addEventListener("click", (e) => {
            const product = products[products.length - 1 - i]; // because of reverse()
            icon.classList.toggle("active");
            toggleWishlist(product);
            updateWishlistModal();
            e.stopPropagation();
        });
    });
}

function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(product) {
    let wishlist = getWishlist();
    const exists = wishlist.find((p) => p._id === product._id);
    if (exists) {
        wishlist = wishlist.filter((p) => p._id !== product._id);
    } else {
        wishlist.push(product);
    }
    saveWishlist(wishlist);
}

function updateWishlistModal() {
    const modalContent = document.querySelector(
        "#favorite-modal .modal-content"
    );
    const wishlist = getWishlist();
    let html = `<span class="close" id="close-modal">&times;</span>
        <h2>Wishlist</h2>`;
    if (wishlist.length === 0) {
        html += "<p>Du har inga favoriter ännu.</p>";
    } else {
        html += "<ul>";
        wishlist.forEach((product) => {
            html += `<li>${product.name}</li>`;
        });
        html += "</ul>";
    }
    modalContent.innerHTML = html;

    // Lägg till close-event igen
    document.getElementById("close-modal").onclick = function () {
        document.getElementById("favorite-modal").style.display = "none";
    };
}

document.addEventListener("DOMContentLoaded", async () => {
    const products = await getProducts();
    renderProducts(products);
    const swiper = new Swiper(".swiper-container", {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("favorite-modal");
    const btn = document.getElementById("favorite-icon");
    const close = document.getElementById("close-modal");

    btn.addEventListener("click", () => {
        updateWishlistModal();
        modal.style.display = "block";
    });

    close.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

export default { renderProducts };
