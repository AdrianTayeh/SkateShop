import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import fs from "fs/promises";
const catP = "categories.json";
const prodP = "products.json";
const subcatP = "subcats.json";
const usersP = "users.json";
const highlightedP = "highlighted.json";
const contactP = "contactForm.json";

const app = express();
app.use(cors());
app.use(express.json());

let highlightedItems = [];

app.get("/categories", async (req, res) => {
  try {
    const data = await fs.readFile(catP, "utf-8");
    const categories = JSON.parse(data);
    res.json(categories);
  } catch (error) {
    console.error("Error reading categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/subcats", async (req, res) => {
  try {
    const data = await fs.readFile(subcatP, "utf-8");
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    console.error("Error reading products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/categories", async (req, res) => {
  const newCat = req.body;
  try {
    const data = await fs.readFile(catP, "utf-8");
    const categories = JSON.parse(data);
    categories.push(newCat);
    await fs.writeFile(catP, JSON.stringify(categories));
    res.status(201).json(newCat);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/products", async (req, res) => {
  const newProduct = req.body;
  newProduct.id = uuidv4();

  try {
    const data = await fs.readFile(prodP, "utf-8");
    const products = JSON.parse(data);
    products.push(newProduct);
    await fs.writeFile(prodP, JSON.stringify(products));
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/highlighted", async (req, res) => {
  try {
    const data = await fs.readFile(highlightedP, "utf-8");
    const highlightedItems = JSON.parse(data);
    res.json(highlightedItems);
  } catch (error) {
    console.error("Error reading highlighted items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/highlighted", async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const data = await fs.readFile(highlightedP, "utf-8");
    const highlightedItems = JSON.parse(data);

    const index = highlightedItems.indexOf(productId);

    if (index === -1) {
      if (highlightedItems.length < 5) {
        highlightedItems.push(productId);
        await fs.writeFile(
          highlightedP,
          JSON.stringify(highlightedItems, null, 2)
        );
        res
          .status(200)
          .json({ message: "Product highlighted", highlightedItems });
      } else {
        res
          .status(400)
          .json({ error: "Maximum of 5 highlighted items allowed" });
      }
    } else {
      highlightedItems.splice(index, 1);
      await fs.writeFile(
        highlightedP,
        JSON.stringify(highlightedItems, null, 2)
      );
      res
        .status(200)
        .json({ message: "Product unhighlighted", highlightedItems });
    }
  } catch (error) {
    console.error("Error updating highlighted items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

app.get("/users", async (req, res) => {
  try {
    const data = await fs.readFile(usersP, "utf-8");
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products", async (req, res) => {
  const { subcategory } = req.query;

  try {
    const fileContent = await fs.readFile(prodP, "utf-8");
    const products = JSON.parse(fileContent);

    if (subcategory) {
      const filteredProducts = products.filter(
        (product) =>
          product.subcategory &&
          product.subcategory.trim().toLowerCase() ===
            subcategory.trim().toLowerCase()
      );
      res.json(filteredProducts);
    } else {
      res
        .status(400)
        .json({ message: "Subcategory query parameter is required" });
    }
  } catch (error) {
    console.error("Error reading products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/all", async (req, res) => {
  try {
    const data = await fs.readFile(prodP, "utf-8");
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    console.error("Error reading products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/user-products", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  try {
    const data = await fs.readFile(prodP, "utf-8");
    const products = JSON.parse(data);
    const userProducts = products.filter((p) => p.createdBy === username);
    res.json(userProducts);
  } catch (error) {
    console.error("Error reading products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/contact", async (req, res) => {
  try {
    const fileData = await fs.readFile(contactP, "utf-8");
    const data = JSON.parse(fileData);
    const newContact = req.body;
    data.push(newContact);
    await fs.writeFile(contactP, JSON.stringify(data));
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error reading contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getcontact", async (req, res) => {
  try {
    const data = await fs.readFile(contactP, "utf-8");
    const parsedData = JSON.parse(data);
    res.json(parsedData);
  } catch (error) {
    console.error("Error reading contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/title/:productName", async (req, res) => {
  const { productName } = req.params;
  try {
    const data = await fs.readFile(prodP, "utf-8");
    const products = JSON.parse(data);
    const filteredProducts = products.filter(
      (p) =>
        p.category.trim().toLowerCase() === productName.trim().toLowerCase()
    );
    if (filteredProducts.length > 0) {
      res.json(filteredProducts);
    } else {
      res.status(404).json({ error: "No products found in this category" });
    }
  } catch (error) {
    console.error("Error reading products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await fs.readFile(prodP, "utf-8");
    const products = JSON.parse(data);

    const product = products.find((product) => product.id === id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;

  try {
    const data = await fs.readFile(prodP, "utf-8");
    const products = JSON.parse(data);

    console.log("Request ID:", id);
    console.log(
      "Product IDs:",
      products.map((product) => product.id)
    );

    const productIndex = products.findIndex(
      (product) => product.id.trim().toLowerCase() === id.trim().toLowerCase()
    );
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    products[productIndex] = { ...products[productIndex], ...updatedProduct };

    await fs.writeFile(prodP, JSON.stringify(products, null, 2));
    res.status(200).json(products[productIndex]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function initializeHighlightedItems() {
  try {
    const data = await fs.readFile(highlightedP, "utf-8");
    highlightedItems = JSON.parse(data);
    console.log("Highlighted items loaded:", highlightedItems);
  } catch (error) {
    console.error("Error initializing highlighted items:", error);
    highlightedItems = [];
    await fs.writeFile(highlightedP, JSON.stringify(highlightedItems, null, 2));
  }
}

initializeHighlightedItems();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
