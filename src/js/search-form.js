export default class SearchForm {
    constructor() {
        this.form = document.querySelector('#form-search')
        this.textField = document.querySelector('.form-search__text-field')
        this.closeButton = document.querySelector('.form-search__close-button')    

        this.form.addEventListener('click', (e) => {                              
            const classes = ['form-search__close-button', 'fa-close', 'overlay']
            if (classes.some((value) => e.target.classList.contains(value))) {
                this.hide()
                e.preventDefault()
            }
        })    

        this.form.addEventListener('keyup', (e) => {
            if (e.code === 'Escape') {
                this.hide()
            }
        })
    }

    show = () => {
        this.form.classList.add('display-block')        
    }

    hide = () => {
        this.form.classList.remove('display-block')
        this.textField.value = ''
    }

    focus = () => {
        this.textField.focus()
    }    
}
