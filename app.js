const app = {
  init(selectors) {
    this.flicks = []
    this.max = 0
    this.list = document.querySelector(selectors.listSelector)
    this.template = document
      .querySelector(selectors.templateSelector)

    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addFlick.bind(this))

  },

  addFlick(ev) {
    // TODO: Add flick to this.flicks
    ev.preventDefault()
    const f = ev.target
    const flick = {
      id: this.max + 1,
      name: f.flickName.value,
    }
    const listItem = this.renderListItem(flick)
    
    // this.flicks[this.max] = flick
    this.flicks.unshift(flick)
  
    this.list.insertBefore(listItem, this.list.firstChild)
    this.max++

    f.reset()
  },

  renderListItem(flick){
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = flick.id
    item
      .querySelector('.flick-name')
      .textContent = flick.name
    
    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeFlick.bind(this))

    return item;
  },

  promoteItem(ev){
    const b = ev.target
    b.textContent = 'Demote'
    b
      .parentElement.parentElement
      .style.backgroundColor = 'gold'
    b.onclick = this.demoteItem.bind(this)
  },

  demoteItem(ev){
    const b = ev.target
    b.textContent = 'Promote'
    b
      .parentElement.parentElement
      .style.backgroundColor = 'white'
    b.onclick = this.promoteItem.bind(this)
  },

  removeFlick(ev){
    const listItem = ev.target.closest('.flick')

    for (let i = 0; i < this.flicks.length; i++){
      const currentId = this.flicks[i].id.toString()
      if (listItem.dataset.id === this.flicks[i].id){
        this.flicks.splice(i, 1)
        break
      }
    }

    listItem.remove()
  },

  moveItemUp(ev){
    const b = ev.target
    const p = b.parentNode
    const element = p.parentElement
    if(element.previousElementSibling){
      element.parentNode.insertBefore(element, element.previousElementSibling)
    }
  },

  moveItemDown(ev){
    const b = ev.target
    const p = b.parentNode
    const element = p.parentElement
    if(element.nextElementSibling){
      element.parentNode.insertBefore(element.nextElementSibling, element)
    }
  },
}

app.init({
  formSelector: '#flick-form',
  listSelector: '#flick-list',
  templateSelector: '.flick.template',
})