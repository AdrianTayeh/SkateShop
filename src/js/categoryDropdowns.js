

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
                productItem.href = '#';
                productItem.innerText = product.name;
                const dropdownContent = title.nextElementSibling;
                dropdownContent.append(productItem);
            }
        });
    });
}
renderCats();



