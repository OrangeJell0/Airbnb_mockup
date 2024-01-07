window.onload = function () {

    // month selection -> different num of days
    month = document.querySelector('#month');
    if (month.selectedIndex > 0) addDate();
    month.onchange = addDate;
    // create 100-year options
    addYears();
    
}

function addYears () {
    let today = new Date();
    let currentYear = today.getFullYear();
    let year = document.querySelector('#year');
    for (let i = currentYear - 18; i >= currentYear - 100; i--) {
        // create
        newOption = document.createElement('option');
        newOption.value = i;
        newOption.innerHTML = i;
        // insert
        year.appendChild(newOption);
    }
}

let addDate = function () {
    let numOfDays = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    let day = document.querySelector('#day');

    // check if month has been selected
    if (month.selectedIndex >= 0) {
        // check if there are already have options
        if (day.length > 1) {
            while (day.children[1]) {
                day.removeChild(day.children[1]);
            }
        }
        // add options
        for (let i = 0; i < numOfDays[month.selectedIndex - 1]; i++) {
            // create an option
            newOption = document.createElement('option');
            newOption.value = i + 1;
            newOption.innerHTML = i + 1;
            // insert
            day.appendChild(newOption);
        }
    }    
}