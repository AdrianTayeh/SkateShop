

const flexContainer = document.querySelector('.flex-container');

export async function renderProducts(){
    const res = await fetch('http://localhost:3000/products');
    const data = await res.json();
    data.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('image-wrapper');
        productCard.innerHTML = `
      
            <img src="${product.image}" alt="${product.altTxt}">
            
            <h2>${product.name}</h2>
            <p>Category: ${product.category}</p>
            <div class="info-card"><span>+</span> More info</div>
          
        `;
        flexContainer.append(productCard);
    });

}




document.addEventListener("DOMContentLoaded", () => {

    renderProducts();
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


