

const flexContainer = document.querySelector('.flex-container');

export async function getProducts() {
    const response = await fetch('http://localhost:3000/products');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}


export async function renderProducts(products){
    flexContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('image-wrapper');
        productCard.innerHTML = `
      
            <img src="${product.image}" alt="${product.altTxt}">
            
            <h2>${product.name}</h2>
            <p>${product.category}</p>
            <p>${product.subcategory}</p>
            <div class="info-card"><span>+</span> More info</div>
          
        `;
        flexContainer.append(productCard);
    });

}




document.addEventListener("DOMContentLoaded",async () => {
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


export default {renderProducts}