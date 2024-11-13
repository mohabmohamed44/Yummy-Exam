// Constants and State
const api_base_url = 'https://www.themealdb.com/api/json/v1/1';
const loading_screen = $('.loading-screen');
const side_nav_menu = $('.side-nav-menu');
const nav_header = $('.nav-header');
const row_data = $('#rowData');

// Loading state management
const showLoading = () => {
    loading_screen.removeClass('d-none');
    side_nav_menu.addClass('d-none');
    nav_header.animate({left:'80px'}, 300);
};

const hideLoading = () => {
    loading_screen.addClass('d-none');
    side_nav_menu.removeClass('d-none');
    nav_header.animate({left:'0px'}, 300);
};

// API Calls
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${api_base_url}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Initial Load
window.onload = async function() {
    $("#loading-screen").fadeOut(1000);
    await getData();
};

async function getData() {
    showLoading();
    const response = await fetchData('/search.php?s=');
    hideLoading();
    if (response?.meals) {
        displayData(response.meals);
    }
}

// function to close sideNav
function closeSideNav() {
    const width = $('.nav-tab').outerWidth();
    $('.side-nav-menu').css({left: `-${width}px`, transition: 'all 0.5s'}); 
    $('.open-close-icon').removeClass("fa-x").addClass("fa-align-justify");
    $('.list-unstyled li').animate({top: 300}, 500);
}


// Sidebar Management
class Sidebar {
    static toggle() {
        const width = $('.nav-tab').outerWidth();
        const offset = $('.side-nav-menu').offset().left;
        const icon = $(".open-close-icon");
        
        if (offset === 0) {
            $('.side-nav-menu').css({left: `-${width}px`, transition: 'all 0.5s'}); 
            icon.removeClass("fa-x").addClass("fa-align-justify");
            $('.list-unstyled li').animate({top: 300}, 500);
        } else {
            $('.side-nav-menu').css({left: 0, transition: 'all 0.5s'}); 
            icon.removeClass("fa-align-justify").addClass("fa-x");
            $('.list-unstyled li').animate({top: 0}, 500); 
        }
    }
}

// Event Listeners
$('.open-close-btn').click(Sidebar.toggle);

// Display Functions
function displayData(data) {
    if (!Array.isArray(data)) return;
    
    const meals = data.map(meal => `
        <div class="col-md-3 hidenDiv">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `).join('');
    
    row_data.html(meals);
}

// Meal Details
async function getMealDetails(id) {
    closeSideNav();
    showLoading();
    const response = await fetchData(`/lookup.php?i=${id}`);
    hideLoading();
    if (response?.meals?.[0]) { // if response is not empty && response.meals is not null
        displayMealDetails(response.meals[0]);
    }
}

function displayMealDetails(meal) {
    closeSideNav();
    const ingredients = Array.from({length: 20}, (_, i) => i + 1) // length = 20 => [1, 2, 3, ..., 20]
        .filter(i => meal[`strIngredient${i}`])
        .map(i => `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`)
        .join('');

    const tags = meal.strTags?.split(",") || [];
    const tagsStr = tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join('');

    $('.hidenDiv').addClass('d-none');
    const details = `
        <div class="col-md-4 hidenDiv">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8 hidenDiv">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3>Area: <span class="fw-bolder">${meal.strArea}</span></h3>
            <h3>Category: <span class="fw-bolder">${meal.strCategory}</span></h3>
            <h3>Recipes:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredients}</ul>
            <h3>Tags:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsStr}</ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`;
    
    row_data.html(details);
}

// Form Validation
class FormValidator {
    static validators = {
        name: {
            regex: /^[a-zA-Z\s]{3,30}$/,
            message: 'Name must be between 3-30 characters'
        },
        email: {
            regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Enter a valid email address'
        },
        phone: {
            regex: /^01[0125][0-9]{8}$/,
            message: 'Enter a valid Egyptian phone number'
        },
        age: {
            validate: (value) => {
                const age = parseInt(value);
                return age >= 18 && age <= 80;
            },
            message: 'Age must be between 18-80 years'
        },
        password: {
            regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: 'Password must be at least 8 characters with letters and numbers'
        }
    };

    static validateField(fieldName, value, compareValue = null) {
        const validator = this.validators[fieldName];
        const input = $(`#${fieldName}Input`);
        const alert = $(`#${fieldName}InputAlert`);
        
        let isValid = false;
        
        if (fieldName === 'repassword') {
            isValid = value === compareValue && value !== '';
        } else if (validator.regex) {
            isValid = validator.regex.test(value);
        } else if (validator.validate) {
            isValid = validator.validate(value);
        }

        input.toggleClass('is-valid', isValid).toggleClass('is-invalid', !isValid);
        alert.toggleClass('d-none', isValid).toggleClass('d-block', !isValid);
        
        return isValid;
    }

    static setupValidation() {
        const fields = ['name', 'email', 'phone', 'age', 'password', 'repassword'];
        
        fields.forEach(field => {
            $(`#${field}Input`).on('input', function() {
                const value = $(this).val();
                const compareValue = field === 'repassword' ? $('#passwordInput').val() : null;
                FormValidator.validateField(field, value, compareValue);
                FormValidator.updateSubmitButton();
            });
        });
    }

    static updateSubmitButton() {
        const allValid = ['name', 'email', 'phone', 'age', 'password', 'repassword']
            .every(field => $(`#${field}Input`).hasClass('is-valid'));
        
        $('#submitBtn').prop('disabled', !allValid);
    }
}

// Initialize form validation
$(document).ready(FormValidator.setupValidation);



// Search Functionality
async function setupSearchPage() {
    closeSideNav();
    $('.hidenDiv').addClass('d-none');

    const searchHTML = `
        <div class="hidenDiv row py-4">
            <div class="col-md-6">
                <input id="searchByName" 
                       class="form-control bg-transparent text-white" 
                       type="text" 
                       placeholder="Search By Name"
                       autocomplete="off">
            </div>
            <div class="col-md-6">
                <input id="searchByLetter" 
                       class="form-control bg-transparent text-white" 
                       type="text" 
                       placeholder="Search By First Letter"
                       maxlength="1"
                       autocomplete="off">
            </div>
        </div>
    `;
    $('#searchContainer').html(searchHTML);

    // Event Listeners
    $('#searchByName').on('input', async function() {
        await searchByName(this.value);
    });

    $('#searchByLetter').on('input', async function() {
        await searchByFirstLetter(this.value);
    });
}

async function searchByName(name) {
    if (!name.trim()) {
        row_data.empty();
        return;
    }
    
    showLoading();
    const response = await fetchData(`/search.php?s=${name}`);
    hideLoading();
    
    if (response?.meals) {
        displayData(response.meals);
    } else {
        row_data.html('<div class="alert alert-info">No meals found</div>');
    }
}

async function searchByFirstLetter(letter) {
    if (!letter) {
        row_data.empty();
        return;
    }
    
    showLoading();
    const response = await fetchData(`/search.php?f=${letter}`);
    hideLoading();
    
    if (response?.meals) {
        displayData(response.meals);
    } else {
        row_data.html('<div class="alert alert-info">No meals found</div>');
    }
}

// Categories Functionality
async function getCategories() {
    closeSideNav();
    showLoading();
    const response = await fetchData('/categories.php');
    hideLoading();
    
    if (response?.categories) {
        displayCategories(response.categories);
    }
}

function displayCategories(categories) {
    closeSideNav();
    $('.hidenDiv').addClass('d-none');
    
    const categoriesHTML = categories.map(category => `
        <div class="col-md-3 hidenDiv">
            <div class="category position-relative overflow-hidden rounded-2 cursor-pointer"
                 onclick="getCategoryMeals('${category.strCategory}')">
                <img src="${category.strCategoryThumb}" class="w-100" alt="${category.strCategory}">
                <div class="category-layer position-absolute text-center text-black p-2">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.split(' ').slice(0, 20).join(' ')}...</p>
                </div>
            </div>
        </div>
    `).join('');
    
    row_data.html(categoriesHTML);
}

async function getCategoryMeals(category) {
    closeSideNav();
    showLoading();
    const response = await fetchData(`/filter.php?c=${category}`);
    hideLoading();
    
    if (response?.meals) {
        displayData(response.meals);
    }
}

// Area Functionality
async function getAreas() {
    closeSideNav();
    showLoading();
    const response = await fetchData('/list.php?a=list');
    hideLoading();
    
    if (response?.meals) {
        displayAreas(response.meals);
    }
}

function displayAreas(areas) {
    closeSideNav();
    $('.hidenDiv').addClass('d-none');
    
    const areasHTML = areas.map(area => `
        <div class="col-md-3 hidenDiv">
            <div class="area text-center cursor-pointer" onclick="getAreaMeals('${area.strArea}')">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>
    `).join('');
    
    row_data.html(areasHTML);
}

async function getAreaMeals(area) {
    closeSideNav();
    showLoading();
    const response = await fetchData(`/filter.php?a=${area}`);
    hideLoading();
    
    if (response?.meals) {
        displayData(response.meals);
    }
}

// Ingredients Functionality
async function getIngredients() {
    closeSideNav();
    showLoading();
    const response = await fetchData('/list.php?i=list');
    hideLoading();
    
    if (response?.meals) {
        displayIngredients(response.meals.slice(0, 20)); // Display only first 20 ingredients
    }
}

function displayIngredients(ingredients) {
    closeSideNav();
    $('.hidenDiv').addClass('d-none');
    
    const ingredientsHTML = ingredients.map(ingredient => `
        <div class="col-md-3 hidenDiv">
            <div class="ingredient text-center cursor-pointer" 
                 onclick="getIngredientMeals('${ingredient.strIngredient}')">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredient.strIngredient}</h3>
                <p>${ingredient.strDescription ? 
                     ingredient.strDescription.split(' ').slice(0, 20).join(' ') + '...' : 
                     ''}</p>
            </div>
        </div>
    `).join('');
    
    row_data.html(ingredientsHTML);
}

async function getIngredientMeals(ingredient) {
    closeSideNav();
    showLoading();
    const response = await fetchData(`/filter.php?i=${ingredient}`);
    hideLoading();
    
    if (response?.meals) {
        displayData(response.meals.slice(0, 20)); // Display only first 20 meals
    }
}

// Contact Form
function displayContactForm() {
    closeSideNav();
    $('.hidenDiv').addClass('d-none');
    
    const formHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Name must be between 3-30 characters
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email">
                        <div id="emailInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter a valid email address
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" type="text" class="form-control" placeholder="Enter Your Phone">
                        <div id="phoneInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter a valid phone number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
                        <div id="ageInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Age must be between 18-80 years
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password">
                        <div id="passwordInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Password must be at least 8 characters with letters and numbers
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" type="password" class="form-control" placeholder="Reenter Your Password">
                        <div id="repasswordInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Passwords don't match
                        </div>
                    </div>
                    <button id="submitBtn" class="btn btn-outline-danger px-2 mt-3" disabled>Submit</button>
                </div>
            </div>
        </div>
    `;
    
    row_data.html(formHTML);
    FormValidator.setupValidation();
}

// Navigation Event Listeners
function setupNavigation() {
    $('#searchLink').click(setupSearchPage);
    $('#categoriesLink').click(getCategories);
    $('#areaLink').click(getAreas);
    $('#ingredientsLink').click(getIngredients);
    $('#contactLink').click(displayContactForm);
}

// Initialize the application
$(document).ready(function() {
    setupNavigation();
    getData(); // Load initial data
});