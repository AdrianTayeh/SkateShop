import {categories} from './categories.js';

export const getCats = async () => {
    categories.forEach(cat => {
        console.log(cat);
    })
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
    } else {
        console.log('Please enter a category name.');
    }
})
