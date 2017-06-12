class App {
  constructor(selectors) {
    this.flicks = []
    this.max = 0
    this.list = document.querySelector(selectors.listSelector)
    this.template = document
      .querySelector(selectors.templateSelector)

    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addFlickViaForm.bind(this))

    this.load()
    for (let i = 0; i < this.flicks.length; i++){
      if (this.flicks[i].id > this.max){
        this.max = this.flicks[i].id
      }
    }
  }

  load(){
    const flicksJSON = localStorage.getItem('flicks')
    const flicksArray = JSON.parse(flicksJSON)
    if (flicksArray){
      flicksArray
        .reverse()
        .map(this.addFlick.bind(this))  
    }
  }

  addFlick(flick){
    const listItem = this.renderListItem(flick)
    this.list.insertBefore(listItem, this.list.firstChild)
    this.max++
    this.flicks.unshift(flick)
    this.save()
  }

  addFlickViaForm(ev) {
    // TODO: Add flick to this.flicks
    ev.preventDefault()
    const f = ev.target
    const flick = {
      id: this.max + 1,
      name: f.flickName.value,
      year: f.flickYear.value,
      fav: false,
    }
    
    this.addFlick(flick)

    f.reset()
  }

  reIndexFlicks(){
    for(let i = 0; i < this.flicks.length; i++){
      this.flicks[i].id = this.flicks.length - i
    }
  }

  save(){
    localStorage
      .setItem('flicks', JSON.stringify(this.flicks))

    console.log(JSON.stringify(this.flicks))
  }

  renderListItem(flick){
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = flick.id
    item.dataset.name = flick.name

    if (flick.fav){
      item.classList.add('fav')
    }

    item
      .querySelector('.flick-name')
      .textContent = flick.name

    item
      .querySelector('.flick-name')
      .addEventListener('keypress', this.saveOnEnter.bind(this, flick))
    
    item
      .querySelector('.flick-year')
      .textContent = flick.year
    
    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeFlick.bind(this))

    item
      .querySelector('button.fav')
      .addEventListener('click', this.favFlick.bind(this, flick))
    
    item
      .querySelector('button.up')
      .addEventListener('click', this.moveUp.bind(this, flick))

    item
      .querySelector('button.down')
      .addEventListener('click', this.moveDown.bind(this, flick))

    item
      .querySelector('.button.edit')
      .addEventListener('click', this.edit.bind(this, flick))

    return item
  }

  edit(flick, ev){
    const listItem = ev.target.closest('.flick')
    const nameField = listItem.querySelector('.flick-name')
    const btn = listItem.querySelector('.edit.button')

    const icon = btn.querySelector('i.fa')

    if (nameField.isContentEditable){
      nameField.contentEditable = false
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
      btn.classList.remove('success')
    }
    else {
      nameField.contentEditable = true
      nameField.focus()
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
      btn.classList.add('success')
    }
    flick.name = nameField.textContent
    this.save()
  }

  saveOnEnter(flick, ev){
    if (ev.key === 'Enter'){
      this.edit(flick, ev)
    }
  }

  favFlick(flick, ev){
    const b = ev.target
    const element = b.closest('li')

    element.classList.toggle('fav')
    flick.fav = !flick.fav
    this.save()   
  }

  removeFlick(ev){
    const listItem = ev.target.closest('.flick')

    for (let i = 0; i < this.flicks.length; i++){
      const currentId = this.flicks[i].id.toString()
      if (listItem.dataset.id === currentId){
        this.flicks.splice(i, 1)
        break
      }
    }

    listItem.remove()
    // this.reIndexFlicks()
    this.save()
  }

  moveUp(flick, ev){
    const listItem = ev.target.closest('.flick')

    const index = this.flicks.findIndex((currentFlick, i) => {
      return currentFlick.id === flick.id
    })

    if (index > 0) {
      this.list.insertBefore(listItem, listItem.previousElementSibling)

      const previousFlick = this.flicks[index - 1]
      this.flicks[index - 1] = flick
      this.flicks[index] = previousFlick
      this.save()
    }
  }

  moveDown(flick, ev){
    const listItem = ev.target.closest('.flick')

    const index = this.flicks.findIndex((currentFlick, i) => {
      return currentFlick.id === flick.id
    })

    if (index < this.flicks.length - 1) {
      this.list.insertBefore(listItem.nextElementSibling, listItem)

      const nextFlick = this.flicks[index + 1]
      this.flicks[index + 1] = flick
      this.flicks[index] = nextFlick
      this.save()
    }
  }
}

const app = new App({
  formSelector: '#flick-form',
  listSelector: '#flick-list',
  templateSelector: '.flick.template',
})
