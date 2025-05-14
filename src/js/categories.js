
    export const categories = [
"Men",
"Women",
"Kids"]

export const products = [
    {
        category: "Men",
        name: "Men's Product 1",
    },
    {
        category: "Men",
        name: "Men's Product 2",
    },
    {
        category: "Women",
        name: "Women's Product 1",
    },
    {
        category: "Women",
        name: "Women's Product 2",
    },
    {
        category: "Kids",
        name: "Kids' Product 1",
    },
    {
        category: "Kids",
        name: "Kids' Product 2",
    }
]

export function setItems() {
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('products', JSON.stringify(products));
    console.log(products)
}



export function addToStorage(item) {
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    storedCategories.push(item);
    localStorage.removeItem('categories');
    localStorage.setItem('categories', JSON.stringify(storedCategories));
}
