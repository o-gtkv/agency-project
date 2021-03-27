import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js'      

const swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    
    pagination: {
        el: '.swiper-pagination',
    },

    scrollbar: {
        el: '.swiper-scrollbar',
    },

    autoplay: {
        delay: 5000,
    },
});