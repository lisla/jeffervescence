const app = {
  init(selectors) {
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
  },

  load(){
    const flicksJSON = localStorage.getItem('flicks')
    const flicksArray = JSON.parse(flicksJSON)
    if (flicksArray){
      flicksArray
        .reverse()
        .map(this.addFlick.bind(this))  
    }
  },

  addFlick(flick){
    const listItem = this.renderListItem(flick)
    this.list.insertBefore(listItem, this.list.firstChild)
    this.max++
    this.flicks.unshift(flick)
    this.save()
  },

  addFlickViaForm(ev) {
    // TODO: Add flick to this.flicks
    ev.preventDefault()
    const f = ev.target
    const flick = {
      id: this.max + 1,
      name: f.flickName.value,
      year: f.flickYear.value,
    }
    
    this.addFlick(flick)

    f.reset()
  },

  reIndexFlicks(){
    for(let i = 0; i < this.flicks.length; i++){
      this.flicks[i].id = this.flicks.length - i
    }
  },

  save(){
    localStorage
      .setItem('flicks', JSON.stringify(this.flicks))

    console.log(JSON.stringify(this.flicks))
  },

  renderListItem(flick){
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = flick.id
    item.dataset.name = flick.name

    item
      .querySelector('.flick-name')
      .textContent = flick.name
    
    item
      .querySelector('.flick-year')
      .textContent = flick.year
    
    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeFlick.bind(this))

    item
      .querySelector('button.promote')
      .onclick = this.promoteItem.bind(this)
    
    item
      .querySelector('button.up')
      .onclick = this.moveItemUp.bind(this)

    item
      .querySelector('button.down')
      .onclick = this.moveItemDown.bind(this)

    item
      .querySelector('.flick-name')
      .onkeyup = this.changeName.bind(this)

    return item
  },

  changeName(ev){
    const listItem = ev.target.parentNode
    this.flicks[this.flicks.length - listItem.dataset.id].name = listItem.firstElementChild.textContent
    this.save()
  },

  promoteItem(ev){
    const b = ev.target
    b.textContent = 'Un-fav'
    const element = b.closest('li')
    
    element.style.backgroundColor = 'gold'
    b.onclick = this.demoteItem.bind(this)
  },

  demoteItem(ev){
    const b = ev.target
    b.textContent = 'Fav'
    const element = b.closest('li')

    element.style.backgroundColor = 'transparent'
    b.onclick = this.promoteItem.bind(this)
  },

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
  },

  moveItemUp(ev){
    const b = ev.target
    const element = b.closest('li')
    if(element.previousElementSibling){
      element.parentNode.insertBefore(element, element.previousElementSibling)

      for (let i = 0; i < this.flicks.length; i++){
        if (this.flicks[i].name === element.dataset.name){
          const temp = this.flicks[i-1]
          this.flicks[i-1] = this.flicks[i]
          this.flicks[i] = temp 
          break
        }
      }
      
      // const temp = this.flicks[this.flicks.length - element.dataset.id]
      // this.flicks[this.flicks.length - element.dataset.id] = this.flicks[this.flicks.length - element.dataset.id - 1]
      // this.flicks[this.flicks.length - element.dataset.id - 1] = temp

      // this.reIndexFlicks()
      this.save()
    }
  },

  moveItemDown(ev){
    const b = ev.target
    const element = b.closest('li')
    if(element.nextElementSibling){
      element.parentNode.insertBefore(element.nextElementSibling, element)
      
      for (let i = 0; i < this.flicks.length; i++){
        if (this.flicks[i].name === element.dataset.name){
          const temp = this.flicks[i+1]
          this.flicks[i+1] = this.flicks[i]
          this.flicks[i] = temp 
          break
        }
      }
      
      // const temp = this.flicks[this.flicks.length - element.dataset.id]
      // this.flicks[this.flicks.length - element.dataset.id] = this.flicks[this.flicks.length - element.dataset.id + 1]
      // this.flicks[this.flicks.length - element.dataset.id + 1] = temp

      // this.reIndexFlicks()
      this.save()
    }
  },
}

app.init({
  formSelector: '#flick-form',
  listSelector: '#flick-list',
  templateSelector: '.flick.template',
})