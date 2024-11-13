function toggleElements(classes) {
    const elements = document.querySelectorAll(`${classes}, .background-blur`);
    elements.forEach(el => {
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
            el.classList.add('hidden');
        }
    });
}

function toggleNav(classes) {
    if (window.innerWidth <= 860) {
        toggleElements(classes);
        const burgerButton = document.querySelector('.navigation__menu-button');
        const logo = document.querySelector('.logo');
        burgerButton.classList.toggle('active');
        logo.classList.toggle('menu-opened');
    } else {
        return;
    }
}

function toggleClassBasedOnWidth() {
    const element = document.querySelector('.navigation__links');
    if (window.innerWidth <= 860) {
        element.classList.add('hidden');
    } else {
        element.classList.remove('hidden');
    }
}
window.addEventListener('load', toggleClassBasedOnWidth);
window.addEventListener('resize', toggleClassBasedOnWidth);