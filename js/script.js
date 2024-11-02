window.onload = function() {
    $("loading-screen").fadeOut(10000);
    getData();
}

async function getData() {
    $('.loading-screen').removeClass('d-none');
    $('.side-nav-menu').addClass('d-none');
    $('.nav-header').animate({left:'80px'},300);
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    $('.side-nav-menu').removeClass('d-none');
    $('.nav-header').animate({left:'0px'},300);
    displayData(response.meals);
}
// open SideBar
$('.open-close-btn').click(function(){
    let widths = $('.nav-tab').outerWidth();
    let offset = $('.side-nav-menu').offset().left;
        if(offset === 0){
            $('.side-nav-menu').css({left:`-${widths}px` , transition: 'all 1s'});
            $(".open-close-icon").removeClass("fa-x");
            $(".open-close-icon").addClass("fa-align-justify");
            $('.list-unstyled li').animate({top:300 },500)
        }else {
            $('.side-nav-menu').css({left:0 , transition: 'all 1s'});
            $(".open-close-icon").removeClass("fa-align-justify");
            $(".open-close-icon").addClass("fa-x");
            $('.list-unstyled li').animate({top:0 },1000);
        }
});

// close SideBar
function closeSideBar() {
    $('.side-nav-menu').toggleClass('show');
    $('.nav-header').toggleClass('show');
    $('.open-close-icon').toggleClass('rotate');
    if ($('.side-nav-menu').hasClass('show')) {
        $('.side-nav-menu').animate({left:'0px'},300);
    } else {
        $('.side-nav-menu').animate({left:'-256.562px'},300);
    }
}
// display data in grid
async function displayData(data) {
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="col-md-3 hidenDiv">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${data[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 ">
                        <h3>${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}
// get details of meal from api
async function getDetails(id) {
    $(".loading-screen").removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let response = await result.json();
    displayDetails(response.meals[0]);
}

async function getMealDetails(id){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayMealDetails(response.meals[0]);
}

async function displayMealDetails(meal){
    closeSideBar()
    // loop and add on li ingredient list 
    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }


    // if the tag loop not found result 
    let tags = meal.strTags?.split(",");
    if (!tags) tags = [];


    // loop and add on li tags list
    let tagsStr = '' ;
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    } ;


    $('.hidenDiv').addClass('d-none');
    box = `
        <div class="col-md-4 hidenDiv">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="meal-photo"/>
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8 hidenDiv">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3>Area: <span class="fw-bolder">${meal.strArea}</span></h3>
            <h3>Category: <span class="fw-bolder">${meal.strCategory}</span></h3>
            <h3>Recipes: </h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredients}</ul>
            <h3>Tags: </h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsStr}</ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`
    document.getElementById("rowData").innerHTML+=box;
}


// SearchPage()

async function SearchPage() {
    $('.hidenDiv').addClass('d-none');

    // Create the container div
    let $box = $('<div>', { class: 'hidenDiv row py-4' });

    // Create the first input element
    let $inputOne = $('<input>', {
        id: 'inputone',
        class: 'form-control form-controlOne bg-transparent text-white',
        type: 'text',
        placeholder: 'Search By Name',
        onchange: 'dis()',
        onkeyup: 'searchByName(this.value)'
    });

    // Append the first input to its column div, then append to the container
    $('<div>', { class: 'col-md-6' }).append($inputOne).appendTo($box);

    // Create the second input element
    let $inputTwo = $('<input>', {
        id: 'inputtwo',
        class: 'form-control bg-transparent text-white',
        type: 'text',
        placeholder: 'Search By First Letter',
        maxlength: 1,
        onkeyup: 'searchByFLetter(this.value)'
    });

    // append the second input to its column div, then append to the container
    $('<div>', { class: 'col-md-6' }).append($inputTwo).appendTo($box);

    // append the container div to the main container
    $('#searchContainer').append($box);
}




// search by name and show data from the api
async function searchByName(name) {
    closeSideBar();
    $(".loading-screen").removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    document.getElementById("rowData").innerHTML = "";
    let response = await result.json();
    displayData(response.meals);
    $(".loading-screen").addClass('d-none');
}



// search by first letter and show data from the api
async function searchByFLetter(letter) {
    $(".loading-screen").removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    document.getElementById("rowData").innerHTML = "";
    letter == "" ? letter = "-" + letter : letter;
    let response = await result.json();
    displayData(response.meals);
    $(".loading-screen").addClass('d-none');
}


// display categoryMeals
async function getCategoryOneMeal(category) {
    $(".loading-screen").removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let response = await result.json();
    displayCategoryMeals(response.meals);
    $(".loading-screen").addClass('d-none');
}

async function getCategoryMeals(){
    $('.loading-screen').removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let response = await result.json();
    $('.loading-screen').addClass('d-none');
    displayCategoryMeals(response.categories);
}

async function displayCategoryMeals(categories) {
    $('.hidenDiv').addClass('d-none');

    for (let i = 0; i < categories.length; i++) {
        // Create the main category div
        let $categoryDiv = $('<div>', { class: 'hidenDiv col-md-3 position-relative' });

        // Create the clickable meal div
        let $mealDiv = $('<div>', {
            class: 'meal position-relative overflow-hidden rounded-2 cursor-pointer',
            onclick: `getCategoryOneMeal('${categories[i].strCategory}')`
        });

        // Create and append the image
        let $img = $('<img>', {
            class: 'w-100',
            src: categories[i].strCategoryThumb,
            alt: ''
        });
        $mealDiv.append($img);

        // Create the overlay layer
        let $mealLayer = $('<div>', {
            class: 'meal-layer position-absolute text-center text-black p-2'
        });

        
        $mealLayer.append($('<h3>').text(categories[i].strCategory));
        $mealLayer.append($('<p>').text(categories[i].strCategoryDescription));

        
        $mealDiv.append($mealLayer);
        $categoryDiv.append($mealDiv);

        
        $('#rowData').append($categoryDiv);
    }
}


// get Category of one meal
async function getCategoryOneMeal(category) {
    $(".loading-screen").removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let response = await result.json();
    getCategoryOneMeal(response.meals);
    $(".loading-screen").addClass('d-none');
}


// display area
async function getArea() {
    $(".loading-screen").removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let response = await result.json();
    displayArea(response.meals);
    $(".loading-screen").addClass('d-none');
}

async function displayAreas(data){
    $('.hidenDiv').addClass('d-none');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="col-md-3 hidenDiv">
            <div onclick="getAreaOneMeal('${data[i].strArea}')" class="rounded-2 text-center cursor-pointer" >
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${data[i].strArea}</h3>
            </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
}


// get ingradiants
async function getIngradiants() {
    $(".loading-screen").removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let response = await result.json();
    displayIngradiants(response.meals);
    $(".loading-screen").addClass('d-none');
}

// display ingradiants
async function displayIngradiants(ingradiants) {
    $('.hidenDiv').addClass('d-none');

    for (let i = 0; i < ingradiants.length; i++) {
        // Create the main category div
        let $categoryDiv = $('<div>', { class: 'hidenDiv col-md-3 position-relative' });

        // Create the clickable meal div
        let $mealDiv = $('<div>', {
            class: 'meal-div position-relative text-center text-white p-2',
            onclick: `getCategoryOneMeal('${ingradiants[i].strIngredient}')`
        });

        // Create and append the image
        let $mealLayer = $('<div>', { class: 'meal-layer' });
        $mealLayer.append($('<img>').attr('src', `https://www.themealdb.com/images/ingredients/${ingradiants[i].strIngredient}-Small.png`));

        // Create the overlay layer
        $mealDiv.append($mealLayer);
        $categoryDiv.append($mealDiv);

        $('#rowData').append($categoryDiv);


        // Create the main category div
        let $categoryDivTwo = $('<div>', { class: 'hidenDiv col-md-3 position-relative' });
        // Create the clickable meal div
        let $mealDivTwo = $('<div>', {
            class: 'meal-div position-relative text-center text-white p-2',
            onclick: `getCategoryOneMeal('${ingradiants[i].strIngredient}')`
        });

        // Create and append the image
        let $mealLayerTwo = $('<div>', { class: 'meal-layer' });
        $mealLayerTwo.append($('<img>').attr('src', `https://www.themealdb.com/images/ingredients/${ingradiants[i].strIngredient}-Small.png`));

        // Create the overlay layer
        $mealDivTwo.append($mealLayerTwo);
        $categoryDivTwo.append($mealDivTwo);

        $('#rowDataTwo').append($categoryDivTwo);
    }
}


// get one ingradiant from api
async function getOneIngradiant(ingradiant) {
    $(".loading-screen").removeClass('d-none');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingradiant}`);
    let response = await result.json();
    displayOneMeal(response.meals.splice(0, 20)); // display 20 meals
    $(".loading-screen").addClass('d-none');
}

// display one meal
async function displayOneMeal(meals) {
    $('.hidenDiv').addClass('d-none');
    
    for (let i = 0; i < meals.length; i++) {
        // Create the main container div for each meal
        let $mealContainer = $('<div>', { class: 'col-md-3 hidenDiv' });

        // Create the clickable meal div
        let $mealDiv = $('<div>', {
            class: 'meal overflow-hidden rounded-2 cursor-pointer',
            onclick: `getMealDetails('${meals[i].idMeal}')`
        });

        // Create and append the image
        let $img = $('<img>', {
            class: 'w-100',
            src: meals[i].strMealThumb,
            alt: ''
        });
        $mealDiv.append($img);

        // Create the overlay layer for the meal name
        let $mealLayer = $('<div>', {
            class: 'meal-layer position-absolute d-flex align-items-center text-black p-2'
        });

        // Add the meal name inside the overlay
        $mealLayer.append($('<h3>').text(meals[i].strMeal));

        // Append the overlay to the meal div, and then the meal div to the main container
        $mealDiv.append($mealLayer);
        $mealContainer.append($mealDiv);

        // Append the main container to the rowData element
        $('#rowData').append($mealContainer);
    }
}

// regex for validating inputs of contact us page
const nameValidation = () => /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);

const emailValidation = () => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById("emailInput").value));

const phoneValidation = () => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value);

const ageValidation = () => /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value);

const passwordValidation = () => /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value);

const resetPasswordValidation = () => document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;







async function contactUsPage() {
    $('.hidenDiv').addClass('d-none');

    // Main container div for contact us form
    const mainDiv = document.createElement('div');
    mainDiv.className = 'hidenDiv contact min-vh-100 d-flex justify-content-center align-items-center';

    const container = document.createElement('div');
    container.className = 'container w-75 text-center';

    const row = document.createElement('div');
    row.className = 'row g-4';

    // Function to create input and alert div
    const createInputField = (id, type, placeholder, alertText) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-6';

        const input = document.createElement('input');
        input.id = id;
        input.type = type;
        input.className = 'selectedInput form-control';
        input.placeholder = placeholder;
        input.addEventListener('keyup', inputsValidation);

        const alertDiv = document.createElement('div');
        alertDiv.id = `${id}Alert`;
        alertDiv.className = 'alert alert-danger w-100 mt-2 d-none';
        alertDiv.textContent = alertText;

        colDiv.appendChild(input);
        colDiv.appendChild(alertDiv);

        return colDiv;
    };

    // Append each input field to the row
    row.appendChild(createInputField('nameInput', 'text', 'Enter Your Name', 'Special characters and numbers not allowed'));
    row.appendChild(createInputField('emailInput', 'email', 'Enter Your Email', 'Email not valid *example@yyy.zzz'));
    row.appendChild(createInputField('phoneInput', 'text', 'Enter Your Phone', 'Enter valid phone Number'));
    row.appendChild(createInputField('ageInput', 'number', 'Enter Your Age', 'Enter valid age'));
    row.appendChild(createInputField('passwordInput', 'password', 'Enter Your Password', 'Enter valid password *Minimum eight characters, at least one letter and one number*'));
    row.appendChild(createInputField('repasswordInput', 'password', 'Repassword', 'Enter valid repassword'));

    // Create and add submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-outline-danger px-2 mt-3';
    submitBtn.id = 'submitBtn';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submit';

    // Add button to container
    container.appendChild(row);
    container.appendChild(submitBtn);
    mainDiv.appendChild(container);
    document.getElementById('rowData').appendChild(mainDiv);

    // Add focus event listeners to track if input fields have been touched
    const inputs = ['nameInput', 'emailInput', 'phoneInput', 'ageInput', 'passwordInput', 'repasswordInput'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('focus', () => {
            window[`${id}Touched`] = true;
        }); // track if input fields have been touched
    }); // add focus event listeners
}


function inputsValidation() {
    const inputs = ['nameInput', 'emailInput', 'phoneInput', 'ageInput', 'passwordInput', 'repasswordInput'];
    inputs.forEach(id => {
        if (!window[`${id}Touched`]) {
            document.getElementById(`${id}Alert`).classList.replace('d-none', 'd-block');
            document.getElementById(`${id}Alert`).classList.add('is-invalid');
            document.getElementById(`${id}Alert`).classList.remove('is-valid');
        } else {
            document.getElementById(`${id}Alert`).classList.replace('d-block', 'd-none');
            document.getElementById(`${id}Alert`).classList.add('is-valid');
            document.getElementById(`${id}Alert`).classList.remove('is-invalid');
        }
    });

    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
        document.getElementById('submitBtn').disabled = false;
    } else {
        document.getElementById('submitBtn').disabled = true;
    }
}