import {categories} from './categories.js';
import {products} from './categories.js';
import { addToStorage } from './categories.js';

export const getProducts = async () => {
    return products;
}

export const getCats = async () => {
    return categories;
}

const form = document.querySelector('#newCat')
form.addEventListener('submit', async  (e) => {
    e.preventDefault();
    const newCat = form.querySelector('input').value;
    if (newCat) {
        categories.push(newCat);
        form.querySelector('input').value = '';
        console.log(`New category added: ${newCat}`);
        getCats();
        addToStorage(newCat)
        
    } else {
        console.log('Please enter a category name.');
    }
})
