
//Dashboard
const updateWindow = document.querySelector("body .updateWindow")
const ProductTable = document.querySelector("table tbody")
const form = document.querySelector("#addForm")
const productName = document.querySelector("#productName")
const productPrice = document.querySelector("#productPrice")
const productCategory = document.querySelector("#productCategory")
const productImage = document.querySelector("#productImage")


//Gallery
const cardContainer = document.querySelector("#cardContainer");
const nameFilter = document.getElementById("nameFilter");
const categoryFilter = document.getElementById("categoryFilter");
const priceSort = document.getElementById("priceSort");

//slider
const left = document.querySelector(".prev-btn");
const right = document.querySelector(".next-btn");
const productSlider = document.getElementById("productSlider");


//Dashboard Functions
let products = JSON.parse(localStorage.getItem("products")) || []
if (products.length === 0) {
    products = [{
        id: 1,
        name: "Butterfly Dress",
        price: "32",
        category: "Women's Clothing",
        image: "https://img.veaul.com/catalog/product/o/1/o1cn01p5hbeb2b5xzjidlhg__464808288/simg/glamorous-lilac-butterfly-prom-dresses-2024-crossed-straps-tulle-sweet-16-a-line-princess-short-sleeve-floor-length-long-off-the-shoulder-formal-dress.jpg@600w.jpg"
    }]
    localStorage.setItem("products", JSON.stringify(products))
}

let lastId = parseInt(localStorage.getItem("lastId")) || 0
lastId = products[products.length - 1]?.id || 0

const read = () => {
    const ProductTable = document.querySelector("table tbody")
    if (!ProductTable) return;
    ProductTable.innerHTML = "";
    products.forEach(product => {
        ProductTable.innerHTML += `<tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price}$</td>
        <td>${product.category}</td>
        <td><img src="${product.image}" alt="${product.name}"></td>
        <td><button onclick="handleEdit(${product.id})" class="btn-edit border-0 rounded-1 text-white">Edit</button><button onclick="deleteProduct(${product.id})"class="btn-delete border-0 rounded-1 text-white">Delete</button></td>
        </tr>`
    })
}
read()

const add = (event) => {
    event.preventDefault()
    let newProduct = {
        id: lastId + 1,
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        image: productImage.value
    }
    products.push(newProduct)
    localStorage.setItem("products", JSON.stringify(products))
    productName.value = ""
    productPrice.value = ""
    productCategory.value = ""
    productImage.value = ""
    lastId = newProduct.id
    read()
}
if (form) form.addEventListener("submit", (event) => add(event));


const handleEdit = (id) => {
    const product = products.find(product => { return product.id == id })
    updateWindow.innerHTML +=
        `<div id="editWindow-${product.id}" class="display-none position-fixed top-0 start-0 w-100 h-100 justify-content-center align-items-center">
        <div id="editModal" class="bg-white rounded-3">
        <div class="head-edit d-flex justify-content-between align-items-center text-white">
        <h3>Edit Product</h3>
        <i class="fa-solid fa-x" onclick="closeModal(${product.id})"></i>
        </div>
        <form id="editForm-${product.id}" onsubmit="editProduct(event , ${product.id})" class="d-flex flex-column">
            <label for="editName-${product.id}" class="form-label">Edit Name</label>
            <input type="text" id="editName-${product.id}" value="${product.name}" class="form-control">
            <label for="editPrice-${product.id}" class="form-label">Edit price</label>
            <input type="text" id="editPrice-${product.id}" value="${product.price}" class="form-control">
            <label for="editCategory-${product.id}" class="form-label">Edit Category</label>
            <select name="productCategory" id="editCategory-${product.id}" class="form-select">
            <option value="">Product Category</option>
            <option value="Womens Clothes" ${product.category === "Womens Clothes" ? "selected" : ""}>Womens Clothes</option>
            <option value="Men Clothes" ${product.category === "Men Clothes" ? "selected" : ""}>Men Clothes</option>
            <option value="Kids Clothes" ${product.category === "Kids Clothes" ? "selected" : ""}>Kids Clothes</option>
            </select>
            <label for="editImage-${product.id}" class="form-label">Edit Image</label>
            <input type="text" id="editImage-${product.id}" value="${product.image}" class="form-control">
            <div class="button-group">
            <button type="submit" class="btn changes-btn">Save Changes</button>
            <button type="button" onclick="closeModal(${product.id})" class="btn changes-btn">Cancel</button>
            </div>
        </form>
    </div>
</div>`
    const editWindow = document.querySelector(`#editWindow-${id}`)
    editWindow.style.display = "flex"
}

const closeModal = (id) => {
    const editWindow = document.querySelector(`#editWindow-${id}`)
    editWindow.remove()
}


const editProduct = (event, id) => {
    event.preventDefault()
    let newName = document.querySelector(`#editForm-${id} #editName-${id}`)
    let newPrice = document.querySelector(`#editForm-${id} #editPrice-${id}`)
    let newCategory = document.querySelector(`#editForm-${id} #editCategory-${id}`)
    let newImage = document.querySelector(`#editForm-${id} #editImage-${id}`)
    products = products.map((product) => {
        if (product.id == id) {
            product.name = newName.value === "" ? product.name : newName.value
            product.price = newPrice.value === "" ? product.price : newPrice.value
            product.category = newCategory.value === "" ? product.category : newCategory.value
            product.image = newImage.value === "" ? product.image : newImage.value

        }
        return product
    })
    localStorage.setItem("products", JSON.stringify(products))
    closeModal(id)
    read()
}


const deleteProduct = (id) => {
    products = products.filter((product) => { return product.id != id })
    read()
    localStorage.setItem("products", JSON.stringify(products))
}

//Gallery Functions

//filter Functions

let filteredProducts = [...products];
let currentSlideIndex = 0;
function showCardsWithFilters() {
    if (!cardContainer) return;
    if (!nameFilter || !categoryFilter || !priceSort) {
        updateSlider();
        return;
    }

    let tempProducts = [...products];

    const nameValue = nameFilter.value.toLowerCase();
    if (nameValue) {
        tempProducts = tempProducts.filter((product) =>
            product.name.toLowerCase().includes(nameValue)
        );
    }

    const categoryValue = categoryFilter.value
    if (categoryValue) {
        tempProducts = tempProducts.filter((product) =>
            product.category === categoryValue
        );
    }

    const sortValue = priceSort.value;
    if (sortValue) {
        tempProducts.sort((a, b) => {
            const priceA = parseFloat(a.price.toString().replace("$", ""));
            const priceB = parseFloat(b.price.toString().replace("$", ""));

            if (sortValue === "low-to-high") {
                return priceA - priceB;
            } else if (sortValue === "high-to-low") {
                return priceB - priceA;
            }
            return 0;
        });
    }
    filteredProducts = tempProducts;
    updateSlider();
}

if (nameFilter) {
    nameFilter.addEventListener("input", showCardsWithFilters);
}
if (categoryFilter) {
    categoryFilter.addEventListener("change", showCardsWithFilters);
}
if (priceSort) {
    priceSort.addEventListener("change", showCardsWithFilters);
}

// Slider Functions

function updateSlider() {
    if (!productSlider) return;

    currentSlideIndex = 0;

    if (filteredProducts.length === 0) {
        productSlider.innerHTML =
            '<p class="text-center text-white p-4">No products to display in slider</p>';
        return;
    }

    productSlider.innerHTML = "";
    filteredProducts.forEach((product) => {
        productSlider.innerHTML += `
            <div class="slider-card overflow-hidden bg-white rounded-4">
                <img src="${product.image}" alt="${product.name}">
                <div class="slider-card-body p-4">
                    <h5 class="fw-bold text-dark mb-2">${product.name}</h5>
                    <div class="price fw-bolder">$${product.price}</div>
                    <span class="category rounded-5 text-dark d-inline-block mt-2">${product.category}</span>
                </div>
            </div>
        `;
    });
    updateSliderPosition();
}
updateSlider()

function slideLeft() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSliderPosition();
    }
}

function slideRight() {
    const slider = document.getElementById("productSlider");
    if (!slider) return;

    const card = slider.querySelector(".slider-card");
    if (!card) return;

const cardWidth = card.offsetWidth + 20;
const visibleCards = Math.floor(slider.offsetWidth / cardWidth);
const maxSlides = Math.max(0, filteredProducts.length - visibleCards);
    if (currentSlideIndex < maxSlides) {
        currentSlideIndex++;
        updateSliderPosition();
    }
}

function updateSliderPosition() {
    const slider = document.getElementById("productSlider");
    if (!slider) return;
    
    const card = slider.querySelector(".slider-card");
    if (!card) return;

    const slideWidth = card.offsetWidth + 20; 
        const visibleCards = Math.floor(slider.offsetWidth / card.offsetWidth);
    const maxSlides = filteredProducts.length - visibleCards;
    if (currentSlideIndex > maxSlides) {
        currentSlideIndex = maxSlides;
    }

    const translateX = currentSlideIndex * slideWidth;
    slider.style.transform = `translateX(-${translateX}px)`;
} 

if (left) left.addEventListener("click", slideLeft);
if (right) right.addEventListener("click", slideRight);
showCardsWithFilters();