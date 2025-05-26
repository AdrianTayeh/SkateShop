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
    [...products].reverse().forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("image-wrapper");
        // Render all images in product.image (assuming it's an array)
        let imgSrc = Array.isArray(product.images)
            ? product.images[0]
            : product.image;
        if (imgSrc) {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = product.altTxt || "Product image";
            productCard.appendChild(img);
        }

        productCard.innerHTML += `
      <h2>${product.name}</h2>
      <p>${product.category}</p>
      <p>${product.subcategory}</p>
      <div class="info-card"><span>+</span> More info</div>
    `;
        flexContainer.append(productCard);
    });
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

    const form = document.getElementById("searchForm");
    const input = document.getElementById("searchInput");

    if (form && input) {
        form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) return;

        try {
            const res = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
            const products = await res.json();

            if (products.length === 0) {
            flexContainer.innerHTML = "<p style='color:white'>No products found.</p>";
            return;
            }

            renderProducts(products);
        } catch (err) {
            console.error("Search error:", err);
            flexContainer.innerHTML = "<p style='color:white'>Something went wrong. Try again.</p>";
      }
    });
  }
});

export default { renderProducts };
