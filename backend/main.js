import express from 'express';
import cors from 'cors';   
import fs from 'fs/promises';
const catP = "categories.json"; 
const prodP = "products.json";
const subcatP = "subcats.json";
const usersP = "users.json";

const app = express();
app.use(cors());
app.use(express.json());


app.get('/categories', async (req, res) => {
    try {
        const data = await fs.readFile(catP, 'utf-8');
        const categories = JSON.parse(data);
        res.json(categories);
    } catch (error) {
        console.error('Error reading categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/subcats', async (req, res) => {
    try {
        const data = await fs.readFile(subcatP, 'utf-8');
        const products = JSON.parse(data);
        res.json(products);
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/categories', async (req, res) => {
    const newCat = req.body;
    try {
        const data = await fs.readFile(catP, 'utf-8');
        const categories = JSON.parse(data);
        categories.push(newCat);
        await fs.writeFile(catP, JSON.stringify(categories));
        res.status(201).json(newCat);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/products', async (req, res) => {
    const newProduct = req.body;
    try {
        const data = await fs.readFile(prodP, 'utf-8');
        const products = JSON.parse(data);
        products.push(newProduct);
        await fs.writeFile(prodP, JSON.stringify(products));
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// app.get('/products', async (req, res) => {
//     try {
//         const data = await fs.readFile(prodP, 'utf-8');
//         const products = JSON.parse(data);
//         res.json(products);
//     } catch (error) {
//         console.error('Error reading products:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// })

app.get('/users', async (req, res) => {
    try {
        const data = await fs.readFile(usersP, 'utf-8');
        const users = JSON.parse(data);
        res.json(users);
    } catch (error) {
        console.error('Error reading users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})




app.get('/products', async (req, res) => {
    const { subcategory } = req.query;

    try {
        const fileContent = await fs.readFile(prodP, 'utf-8');
        const products = JSON.parse(fileContent);

        if (subcategory) {
            const filteredProducts = products.filter(product =>
                product.subcategory &&
                product.subcategory.trim().toLowerCase() === subcategory.trim().toLowerCase()
            );
            res.json(filteredProducts);
        } else {
            res.status(400).json({ message: "Subcategory query parameter is required" });
        }
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});








app.listen(3000, () => {
    console.log('Server is running on port 3000');
})