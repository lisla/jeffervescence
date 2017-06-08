const app = {
  init(selectors) {
    this.flicks = []
    this.max = 0
    this.list = document.querySelector(selectors.listSelector)

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
    this.flicks.push(flick)
  
    this.list.insertBefore(listItem, this.list.firstChild)
    this.max++

    f.reset()
  },

  renderListItem(flick){
    const item = document.createElement('li')
    item.textContent = flick.name
    const div = document.createElement('div')
    div.className = 'button-group'
    const b1 = document.createElement('a')
    b1.className = 'success button'
    const b2 = document.createElement('a')
    b2.className = 'alert button'
    const b3 = document.createElement('a')
    b3.className = 'button'
    const b4 = document.createElement('a')
    b4.className = 'button'

    b1.textContent = 'Promote'
    b1.onclick = this.promoteItem.bind(this)
    b2.textContent = 'Delete'
    b2.onclick = this.deleteItem.bind(this)
    b3.innerHTML = '&#8679;'
    b3.onclick = this.moveItemUp.bind(this)
    b4.innerHTML = '&#8681;'
    b4.onclick = this.moveItemDown.bind(this)

    div.appendChild(b1)
    div.appendChild(b2)
    div.appendChild(b3)
    div.appendChild(b4)

    item.appendChild(div)

    return item
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
  deleteItem(ev){
    const b = ev.target
    const p = b.parentNode
    const pp = p.parentNode
    pp.parentNode.removeChild(pp)
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
  listSelector: '#flick-list'
})