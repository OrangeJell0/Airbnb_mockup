module.exports.formHasEmpty = function(form) {
    return (form.email == "" 
    || form.firstName == ""
    || form.lastName == "" 
    || form.createPassword == "" 
    || form.confirmPassword == "" 
    || form.month == "Month" 
    || form.day == "Day" 
    || form.year == "Year");
}

function formHasEmpty(form) {
    return form.email == "" 
    || form.firstName == ""
    || form.lastName == "" 
    || form.createPassword == "" 
    || form.confirmPassword == "" 
    || form.month == "Month" 
    || form.day == "Day" 
    || form.year == "Year";
}

module.exports.firstNameEmpty = function(firstName) {
    return firstName == "";
}
module.exports.lastNameEmpty = function(lastName) {
    return lastName == "";
}
module.exports.monthEmpty = function(month) {
    return month == "Month";
}
module.exports.dayEmpty = function(day) {
    return day == "Day";
}
module.exports.yearEmpty = function(year) {
    return year == "Year";
}

module.exports.isGoodEmail = function(email) {
    let emailFormat = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return emailFormat.test(email);
}

function isGoodEmail(email) {
    let emailFormat = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return emailFormat.test(email);
}

module.exports.isGoodPassword = function(str) {
    let passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    return passwordFormat.test(str);
}

function isGoodPassword(str) {
    let passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    return passwordFormat.test(str);
}

module.exports.passwordMatch = function(str1, str2) {
    return str1 === str2;
}

function passwordMatch(str1, str2) {
    return str1 === str2;
}

module.exports.isValid = function(form) {
    return (!formHasEmpty(form)) && isGoodPassword(form.createPassword) && isGoodEmail(form.email) && passwordMatch(form.createPassword, form.confirmPassword);
}


