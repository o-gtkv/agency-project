import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js'      

const swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',

    loop: true,
    
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
    },

    autoplay: {
        delay: 3000,
    },
});