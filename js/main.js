function SearchForm() {
    this.form = document.querySelector('.form-search')
    this.searchButton = document.querySelector('.form-search__button')
    this.textField = document.querySelector('.form-search__text-field')
    this.closeButton = document.querySelector('.form-search__close-button')    

    this.show = function() {
        this.form.classList.add('form-search--visible')        
    }

    this.hide = function() {
        this.form.classList.remove('form-search--visible')        
    }

    this.focus = function() {
        this.textField.focus()
    }

    this.closeButton.addEventListener('click', (e) => {
        e.preventDefault()
        this.hide()
    })

}

const searchForm = new SearchForm();
const searchButton = document.querySelector('.search-button')
searchButton.addEventListener('click', (e) => {
    e.preventDefault()
    searchForm.show()
    searchForm.focus()
})

// ===============================================
// === changing header's bg color on scrolling ===
// ===============================================
const header = document.querySelector('.header');
window.addEventListener('scroll', (e) => {
    if (window.scrollY > 0) {            
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    } else {
        header.style.backgroundColor = 'transparent'
    }    
} )

// ===========================================
// === mobile menu ===
// ===========================================
const mobileMenu = document.querySelector('.mobile-menu')
const mainMenu = document.querySelector('.menu')

mobileMenu.addEventListener('click', function() {
    mobileMenu.classList.toggle('mobile-menu--active')
    if (mobileMenu.classList.contains('mobile-menu--active')) {
        mainMenu.classList.add('mobile-menu--active')
    } else  {
        mainMenu.classList.remove('mobile-menu--active')
    }

})

//=========================
const tab = document.querySelectorAll('.tab-bar__item')
const tabBar = document.querySelector('.tab-bar')
const tabContent = document.querySelectorAll('.tab-container__content')

function hideTabContent() {
    tabContent.forEach(tab => {
        tab.classList.add('tab-container__content--hidden')
        tab.classList.remove('tab-container__content--visible')
    })    
    tab.forEach(item => item.classList.remove('tab-bar__item--active'))    
}

function showTabContent(i = 0) {
    tabContent[i].classList.add('tab-container__content--visible')
    tabContent[i].classList.remove('tab-container__content--hidden')
    tab[i].classList.add('tab-bar__item--active')
}

hideTabContent();
showTabContent(2);

tabBar.addEventListener('click', function(e) {
    const target = e.target
    if (target.classList.contains('tab-bar__item')) {
        tab.forEach((item, i) => {
            if (item === target) {
                hideTabContent()
                showTabContent(i)
            }
        })
    }
})