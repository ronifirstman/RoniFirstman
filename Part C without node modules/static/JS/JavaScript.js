//input validations
function containsSpecialChars(str) {
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str); //true if there are special chars
}

function containsSpecialCharsWithoutSpace(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

function onlyLetters(str) {
    return Boolean(str.match(/^[A-Za-z]*$/));
}

function checkFullName() {
    let temp = false;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    if (containsSpecialChars(first_name) || !onlyLetters(first_name)) {
        document.getElementById('firstnameError').innerHTML = 'First name should contain only letters with no spaces or special chars';
    } else {
        document.getElementById('firstnameError').innerHTML = '';
    }
    if (containsSpecialChars(last_name) || !onlyLetters(last_name)) {
        document.getElementById('lastnameError').innerHTML = 'Last name should contain only letters with no spaces or special chars';
    } else {
        document.getElementById('lastnameError').innerHTML = '';
    }
    if (!containsSpecialChars(first_name) && onlyLetters(first_name) && !containsSpecialChars(last_name) && onlyLetters(last_name)) {
        temp = true;
    }
    return temp;
}

function checkPhoneNumber() {
    let temp = false;
    let phone_number_input = document.getElementById('phone_number').value;
    if (phone_number_input.startsWith("05") != true) {
        document.getElementById('phoneError').innerHTML = "Phone Number must start with 05";
    } else {
        document.getElementById('phoneError').innerHTML = '';
        temp = true;
    }
    return temp;
}

function checkAdress() {
    let temp = false;
    let address_input = document.getElementById('address').value;
    let checkValidity = containsSpecialCharsWithoutSpace(address_input);
    if (checkValidity) {
        document.getElementById('addressError').innerHTML = "Address should not contain special characters";
    } else {
        document.getElementById('addressError').innerHTML = '';
        temp = true;
    }
    return temp;
}

function checkAge() {
    let temp = false;
    let age_input = document.getElementById('age').value;
    if (age_input < 1 || age_input > 100) {
        document.getElementById('ageError').innerHTML = "The age must be a number between 1 and 100";
    } else {
        document.getElementById('ageError').innerHTML = '';
        temp = true;
    }
    return temp;
}

function checkMaxPrice() {
    let temp = false;
    let selected_price = document.getElementById('max_price').value;
    if (selected_price < 0) {
        document.getElementById('priceError').innerHTML = "Price must be greater than 0";
    } else {
        document.getElementById('priceError').innerHTML = '';
        temp = true;
    }
    return temp;
}

function checkDate() {
    let temp = false;
    var selected_date = document.getElementById('date_of_service').value;
    var selectedDate = new Date(selected_date);
    var selectedDate1 = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate();   
    var now = new Date();
    var current_date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate(); 

    if (selectedDate1 < current_date) {
        document.getElementById('dateError').innerHTML = "The date must be in the future";
    } else {
        document.getElementById('dateError').innerHTML = '';
        temp = true;
    }
    return temp;
} 

function checkTime() {
    let temp = false;
    var selected_date = document.getElementById('date_of_service').value;
    var selectedDate = new Date(selected_date);
    var selectedDate1 = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate(); 

    var date = new Date();
    var current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();    

    var selected_time_start = document.getElementById('time_of_service_start').value;
    console.log("start time input"+" "+selected_time_start);
    var selected_time_end = document.getElementById('time_of_service_end').value;
    console.log("end time input" + " " + selected_time_end);
    var current_time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    console.log("current time" + " " + current_time);


    if (selectedDate1 == current_date && (selected_time_start < current_time || selected_time_end < current_time)) {
        document.getElementById('timeError').innerHTML = "The time must be in the future";
    }
    else if (selected_time_start > selected_time_end) {
        document.getElementById('timeError').innerHTML = "End time should be greater then start time ";
    }
    else {
        document.getElementById('timeError').innerHTML = '';
        temp = true;
    }
    return temp;
} 

function success_registration() {
    let check_fullname = checkFullName();
    let check_number = checkPhoneNumber();
    let check_address = checkAdress();
    let check_age = checkAge();
    if (check_fullname && check_number && check_address && check_age) {
        //alert("User Was Created Successfully");
        return true;
    } else {
        return false;
    }
}

function success_update() {
    let check_fullname = checkFullName();
    let check_number = checkPhoneNumber();
    let check_address = checkAdress();
    let check_age = checkAge();
    if (check_fullname && check_number && check_address && check_age) {
        alert("User Was Updates Successfully");
        return true;
    } else {
        return false;
    }
}

function success_find() {
    let check_date = checkDate();
    let check_price = checkMaxPrice();
    let check_time = checkTime();
    if (check_date && check_price && check_time) {
        return true;
    } else {
        return false;
    }
}

