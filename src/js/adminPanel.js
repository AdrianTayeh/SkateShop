





async function getSubcategories() {
  const res = await fetch("http://localhost:3000/subcats");
  const data = await res.json();
  return data;
}

async function renderOptions() {
  const res = await fetch("http://localhost:3000/categories");
  const cats = await res.json();
  const select = document.querySelector("#category");
  cats.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.category;
    option.innerText = cat.category;
    select.append(option);
  });
}
renderOptions();

async function postCats(category) {
  const res = await fetch("http://localhost:3000/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category: category }),
  });
  if (res.ok) {
    const data = await res.json();
    console.log("Category added:", data);
  } else {
    console.error("Error adding category:", res.statusText);
  }
}

const form = document.querySelector("#newCat");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newCat = form.querySelector("input").value;
  if (newCat) {
    form.querySelector("input").value = "";
    await postCats(newCat);
  } else {
    console.log("Please enter a category name.");
  }
});

const categorySelect = document.querySelector("#category");
const subcategorySelect = document.querySelector("#subcategory");

categorySelect.addEventListener("change", async (e) => {
  subcategorySelect.innerHTML = "";
  const subcats = await getSubcategories();
  subcats.forEach((subcat) => {
    if (subcat.category == e.target.value) {
      const option = document.createElement("option");
      option.value = subcat.name;
      option.innerText = subcat.name;
      subcategorySelect.append(option);
    }
  });
});

const form2 = document.querySelector("#addProduct");
const username = localStorage.getItem("username");
form2.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formdata = new FormData(form2);
  const files = formdata.getAll("image");
  let imageUrls = [];

  // If files exist and are not empty, process each file
  if (files && files.length > 0 && files[0].size > 0) {
    for (const file of files) {
      if (file && file.size > 0) {
        const resized = await resizeImage(file, 300, 225);
        imageUrls.push(resized);
      }
    }
  }

  // If no images uploaded, use placeholder
  if (imageUrls.length === 0) {
    imageUrls = [
      "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image-300x225.png",
    ];
  }

  const product = {
    name: formdata.get("title"),
    category: formdata.get("category"),
    images: imageUrls, // Now an array
    altTxt: formdata.get("altTxt"),
    subcategory: formdata.get("subcategory"),
    quantity: formdata.get("quantity"),
    createdBy: username,
  };

  const res = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (res.ok) {
    const data = await res.json();
    console.log("Product added:", data);
    renderUserProducts();
  } else {
    console.error("Error adding product:", res.statusText);
  }
  form2.reset();
});

// Helper function to resize the image
async function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = (error) => reject(error);
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

async function renderUserProducts() {
  const username = localStorage.getItem("username");
  if (!username) return;
  const res = await fetch(
    `http://localhost:3000/user-products?username=${encodeURIComponent(
      username
    )}`
  );
  const products = await res.json();
  const list = document.getElementById("userProducts");
  list.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `Namn: ${product.name}, Kategori: (${product.category} - ${product.subcategory})`;
    list.appendChild(li);
  });
}

renderUserProducts();

// liten helper
// async function convertFileToBase64(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = error => reject(error);
//         reader.readAsDataURL(file);
//     });
// }
