import { renderProducts } from './index.js';

async function getFilteredProducts(cat){
    try{
        const res = await fetch(`http://localhost:3000/products?subcategory=${cat}`);
        const data = await res.json();
        console.log(data);
        return data;
    }
    catch(error){
        console.error('Error fetching products:', error);
    }  
}

const navbar = document.querySelector('.navbar');

export async function getCats(){
    const response = await fetch('http://localhost:3000/categories');
    const data = await response.json();
    console.log(data);
    return data;
}

export async function getSubCats(){
    const response = await fetch('http://localhost:3000/subcats');
    const data = await response.json();
    return data;
}


export async function renderCats() {
    const cats = await getCats();
    console.log(cats);

    cats.forEach(cat => {
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');
        dropdown.innerHTML = `
            <button class="dropbtn">
                ${cat.category}
                <i class="fa fa-caret-down"></i>
            </button>
            <div class="dropdown-content"></div>`;
        navbar.append(dropdown);
       
    });



    const subcats = await getSubCats();    
    subcats.forEach(product => {
        const titles = document.querySelectorAll('.dropbtn');
        titles.forEach(title => {
            if (title.innerText === product.category) {
                const productItem = document.createElement('a');
                productItem.innerText = product.name;
                const dropdownContent = title.nextElementSibling;
                dropdownContent.append(productItem);
                productItem.addEventListener('click', async (e) => {
                    const products = await getFilteredProducts(product.name);
                    if(products.length === 0){
                        alert('No products found for this category');
                        return;
                    }
                    await renderProducts(products);
                    console.log(products);

                })
            }
            
        });
    });
    const titles = document.querySelectorAll('.dropbtn');
    async function getTitledProducts(title) {
        try {
            const res = await fetch(`http://localhost:3000/title/${title}`);
            const data = await res.json();
    
            if (!res.ok) {
                console.error(`Error fetching products for title "${title}":`, data.error);
                return null;
            }
            return data; 
        } catch (error) {
            console.error('Network error:', error);
            return null; 
        }
    }
    titles.forEach(title => {
        title.addEventListener('click', async (e) => {
            const product = await getTitledProducts(title.innerText);
    
            if (!product) {
                alert(`No products found for the title "${title.innerText}"`);
                return;
            }
            const products = Array.isArray(product) ? product : [product];
    
            await renderProducts(products);
        });
    });
  
}
renderCats();



