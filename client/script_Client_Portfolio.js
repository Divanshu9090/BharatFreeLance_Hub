const stars = document.querySelectorAll('.star');

stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = star.dataset.rating;
        updateStars(rating);
    });
});

function updateStars(rating) {
    stars.forEach((star, index) => {
        star.classList.toggle('filled', index < rating);
    });
}
