window.onload = function () {
    let form = document.querySelector('#login-form');
    let username = document.querySelector('#username');
    let password = document.querySelector('#password');

    form.onsubmit = function(e) {
        if (username.value == "") {
            username.classList.add('is-invalid');
            e.preventDefault();
        }
        if (password.value == "") {
            password.classList.add('is-invalid');
            e.preventDefault();
        }
    };

    username.onchange = function(e) {
        if (username.classList.contains('is-invalid')) {
            username.classList.remove('is-invalid');
        }
    }

    password.onchange = function(e) {
        if (password.classList.contains('is-invalid')) {
            password.classList.remove('is-invalid');
        }
    }
}