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
    if (Array.isArray(product.images)) {
      product.images.forEach((imgSrc, idx) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = product.altTxt
          ? `${product.altTxt} ${idx + 1}`
          : `Product image ${idx + 1}`;
        productCard.appendChild(img);
      });
    } else if (product.image) {
      // Fallback if product.image is a string
      const img = document.createElement("img");
      img.src = product.image;
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
});

export default { renderProducts };
