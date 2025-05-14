import { getCats, getProducts } from './adminPanel';

const navbar = document.querySelector('.navbar');

async function renderCats() {
    const cats = JSON.parse(localStorage.getItem('categories'));
    console.log(cats);

    cats.forEach(cat => {
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');
        dropdown.innerHTML = `
            <button class="dropbtn">
                ${cat}
                <i class="fa fa-caret-down"></i>
            </button>
            <div class="dropdown-content"></div>`;

        navbar.append(dropdown);
    });

    const products = JSON.parse(localStorage.getItem('products'));
    products.forEach(product => {
        const titles = document.querySelectorAll('.dropbtn');
        titles.forEach(title => {
            if (title.innerText === product.category) {
                const productItem = document.createElement('a');
                productItem.href = '#';
                productItem.innerText = product.name;
                const dropdownContent = title.nextElementSibling;
                dropdownContent.append(productItem);
            }
        });
    });
}

renderCats();