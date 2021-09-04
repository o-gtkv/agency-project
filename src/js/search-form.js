export default class SearchForm {
    constructor() {
        this.form = document.querySelector('.form-search')
        this.textField = document.querySelector('.form-search__text-field')
        this.closeButton = document.querySelector('.form-search__close-button')    
        this.closeButton.addEventListener('click', (e) => {
            e.preventDefault()
            this.hide()
        })    
    }

    show = () => {
        this.form.classList.add('form-search--visible')        
    }

    hide = () => {
        this.form.classList.remove('form-search--visible')        
    }

    focus = () => {
        this.textField.focus()
    }    
}

