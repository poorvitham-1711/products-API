const container = document.getElementById("products-container");
const searchInput = document.getElementById("searchInput");
const categoryContainer = document.getElementById("category-buttons");

let allProducts = [];
let currentCategory = "all";

// Modal Elements
const modal = document.getElementById("productModal");
const closeBtn = document.getElementById("closeModal");

// Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();

        allProducts = data.products;

        createCategoryButtons(allProducts);
        displayProducts(allProducts);

    } catch (error) {
        console.error("Error fetching data:", error);
        container.innerHTML = "<p>Failed to load products.</p>";
    }
}

// Create Category Buttons
function createCategoryButtons(products) {
    const categories = [...new Set(products.map(product => product.category))];

    categoryContainer.innerHTML = `
        <button class="category-btn active" data-category="all">All</button>
    `;

    categories.forEach(category => {
        categoryContainer.innerHTML += `
            <button class="category-btn" data-category="${category}">
                ${category}
            </button>
        `;
    });

    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            currentCategory = button.dataset.category;
            filterProducts();
        });
    });
}

// Display Products
function displayProducts(products) {
    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-top">
                <span class="icon-btn">❤️</span>
                <span class="icon-btn">🛒</span>
            </div>

            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>
            <p>⭐ ${product.rating}</p>

            <button class="buy-btn">Buy Now</button>
        `;

        // Open Modal
        card.addEventListener("click", () => {
            document.getElementById("modalImage").src = product.thumbnail;
            document.getElementById("modalTitle").textContent = product.title;
            document.getElementById("modalDescription").textContent = product.description;
            document.getElementById("modalPrice").textContent = `Price: $${product.price}`;
            document.getElementById("modalRating").textContent = `⭐ ${product.rating}`;

            modal.style.display = "block";
        });

        container.appendChild(card);
    });
}

// Filter Products (Search + Category)
function filterProducts() {
    const searchValue = searchInput.value.toLowerCase();

    let filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchValue)
    );

    if (currentCategory !== "all") {
        filteredProducts = filteredProducts.filter(product =>
            product.category === currentCategory
        );
    }

    displayProducts(filteredProducts);

    // Smaller cards only while searching
    if (searchValue.trim() !== "") {
        container.style.gridTemplateColumns = "repeat(auto-fill, 280px)";
        container.style.justifyContent = "center";
    } else {
        container.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
        container.style.justifyContent = "stretch";
    }
}

// Search Products
searchInput.addEventListener("input", filterProducts);

// Close Modal Button
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

// Close Modal When Clicking Outside
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Load Products
fetchProducts();