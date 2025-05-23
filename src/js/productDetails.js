// Function to fetch product details by ID
async function fetchProductDetails(productId) {
  try {
    const response = await fetch(`http://localhost:3000/products/${productId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Product not found");
      } else {
        throw new Error("Internal server error");
      }
    }

    const product = await response.json();
    displayProductDetails(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    displayError(error.message);
  }
}

// Function to display product details on the page
function displayProductDetails(product) {
  const productContainer = document.getElementById("product-detail");

  // Generate HTML for all images
  const imagesHTML = product.images
    .map((image) => `<img src="${image}" alt="Product image" />`)
    .join("");

  productContainer.innerHTML = `
    <div id="product-container">
      <div class="product-images">
        ${imagesHTML}
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.category}</p>
        <p>${product.subcategory}</p>
        <p>${product.description}</p>
        <p>In stock: ${product.quantity}</p>
      </div>
    </div>
  `;
}

// Function to display an error message
function displayError(message) {
  const productContainer = document.getElementById("product-detail");
  productContainer.innerHTML = `<p class="error">${message}</p>`;
}

// Get the productId from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id"); // Assumes the query parameter is named 'id'
console.log("Product ID from URL:", productId);

if (productId) {
  fetchProductDetails(productId);
} else {
  displayError("Product ID is missing in the URL");
}