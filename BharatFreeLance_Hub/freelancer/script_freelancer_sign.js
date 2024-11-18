document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('register');
    const signInButton = document.getElementById('login');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', function() {
        container.classList.add('active');
    });

    signInButton.addEventListener('click', function() {
        container.classList.remove('active');
    });
});
