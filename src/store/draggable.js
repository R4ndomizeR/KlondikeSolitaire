
import { reactive, readonly } from 'vue'
import game from './game'

const state = reactive({
  isDragActive: false,

  shiftX: 0,
  shiftY: 0,

  dragStack: [],
  dragElement: null,
})

const meth = {
  setDragElement(elem) {
    state.dragElement = elem
  },

  handlerStartDrag(event, zoneData, cardData) {
    console.log('startDrag', event, zoneData, cardData)

    if (!cardData.opened) {
      event.preventDefault()
      return
    }

    if (zoneData.zone === 'table') {
      //   stack.forEach(item => {
      //     item.hidden = true
      //   })

      // const stackLength = state.tableStack[zoneData.zoneID].length
      // const position = state.tableStack[zoneData.zoneID].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

      // if (position !== stackLength - 1) {
      //   console.log('stackLength', stackLength)
      //   console.log('position', position)

      //   const stack = state.tableStack[zoneData.zoneID].slice(position + 1, stackLength)
      //   // console.log(stack)

      //   state.dragData = [...stack]

      //   stack.forEach(item => {
      //     item.hidden = true
      //   })

      //   // event.dataTransfer.setData('nestedCardData', JSON.stringify(stack))

      //   event.dataTransfer.setDragImage(state.dragImage, event.offsetX, event.offsetY)
      // }
    }



    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'

    event.dataTransfer.setData('card', JSON.stringify(cardData))
    event.dataTransfer.setData('zone', JSON.stringify(zoneData))

    // event.target.style.opacity = '0.01'

    // event.dataTransfer.setDragImage(state.dragElement, event.offsetX, event.offsetY)

    // event.target.style.opacity = '1'
    // let img = new Image()
    // img.src = meth.getCardImage(cardData)
    // event.dataTransfer.setDragImage(state.img, 0, 0)
    // console.log(event.dataTransfer)
  },
  handlerDrag(event) {
    // if (event.pageX === state.pageX && event.pageY === state.pageY) return

    state.dragElement.style.left = event.pageX - state.shiftX + 'px'
    state.dragElement.style.top = event.pageY - state.shiftX + 'px'

    // console.log(state.pageX, state.pageY)
    // console.log(state.pageX, state.pageY)
  },
  handlerEndDrag(event, data) {
    console.log('endDrag')
    event.target.style.opacity = '1'

    if (state.dragData) {
      state.dragData.forEach(item => {
        item.hidden = false
      })
      state.dragData = null
    }

    // const ghost = document.getElementById("drag-stack")
    // if (ghost) {
    //   ghost.remove()
    //   state.dragImage = null
    // }
  },
  handlerMouseDown(event, zoneData, cardData) {
    console.log('createDragGhost')

    state.shiftX = event.offsetX //event.clientX - event.target.getBoundingClientRect().left
    state.shiftY = event.offsetY //event.clientY - event.target.getBoundingClientRect().top

    let stack = [cardData]

    if (zoneData.zone === 'table') {
      const stackLength = state.tableStack[zoneData.zoneID].length
      const position = state.tableStack[zoneData.zoneID].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

      if (position !== -1) {
        if (state.tableStack[zoneData.zoneID][position].opened) {
          stack = state.tableStack[zoneData.zoneID].slice(position, stackLength)
        }
      }
    }

    // if (position !== stackLength - 1) {
    // console.log('stackLength', stackLength)
    // console.log('position', position)

    state.dragStack.length = 0
    state.dragStack = stack

    console.log('dragStack', state.dragStack)

    // meth.setDragStack(stack)

    // const stack = state.tableStack[zoneData.zoneID].slice(position + 1, stackLength)

    // state.dragImage = document.createElement("div")
    // state.dragImage.id = "drag-stack"
    // state.dragImage.classList.add("drag-stack")
    // state.dragImage.style.position = "absolute"
    // state.dragImage.style.top = "-1000px"

    // const tCard = document.createElement("div")
    // tCard.classList.add("card-stack")
    // tCard.style = meth.getCardImageStyle(cardData)
    // state.dragImage.appendChild(tCard)

    // stack.forEach((item) => {
    //   const tCard = document.createElement("div")
    //   tCard.classList.add("card-stack")
    //   tCard.style = meth.getCardImageStyle(item)
    //   state.dragImage.appendChild(tCard)
    // })

    // document.body.appendChild(state.dragImage)
    // }
  },
  // handlerMouseUp(zoneData, cardData) {
  //   console.log('deleteDragGhost')
  //   state.dragStack.length = 0
  // },

  handleDropZone(event, data) {
    console.log('onDrop', event, data)

    const cardData = JSON.parse(event.dataTransfer.getData('card'))
    const zoneData = JSON.parse(event.dataTransfer.getData('zone'))

    // const item = this.items.find(item => item.id == itemID)
    // item.list = list
    if (data.area === 'table') {
      const zoneLength = state.tableStack[data.areaID].length

      if (zoneLength === 0) {
        if (cardData.rank === 13) {
          state.tableStack[data.areaID].push(cardData)
          meth.deleteFromZone(zoneData, cardData)

          if (state.dragData) {
            state.dragData.forEach((item) => {
              state.tableStack[data.areaID].push(item)
              meth.deleteFromZone(zoneData, item)
            })
          }

          console.log('onDrop:item', cardData)
        }
      }
      else {
        const lastItem = state.tableStack[data.areaID][zoneLength - 1]

        if (!meth.checkSuitCompat(lastItem.suit, cardData.suit)) return

        if (lastItem.rank === cardData.rank + 1) {
          state.tableStack[data.areaID].push(cardData)
          meth.deleteFromZone(zoneData, cardData)

          if (state.dragData) {
            state.dragData.forEach((item) => {
              state.tableStack[data.areaID].push(item)
              meth.deleteFromZone(zoneData, item)
            })
          }

          console.log('onDrop:item', cardData)
        }
      }
    }


    if (data.area === 'finish') {
      const zoneLength = state.finishStack[data.areaID].length

      if (zoneLength === 0) {

        if (cardData.rank === 1) {
          state.finishStack[data.areaID].push(cardData)
          meth.deleteFromZone(zoneData, cardData)
          console.log('onDrop:item', cardData)
        }

      }
      else {
        const lastItem = state.finishStack[data.areaID][zoneLength - 1]

        if (lastItem.suit !== cardData.suit) return

        if (lastItem.rank === cardData.rank - 1) {
          state.finishStack[data.areaID].push(cardData)
          meth.deleteFromZone(zoneData, cardData)
          console.log('onDrop:item', cardData)
        }
      }
    }

    meth.checkEnd()
  },
  deleteFromZone: (zoneData, cardData) => {
    if (zoneData.zone === 'table') {
      const index = state.tableStack[zoneData.zoneID].findIndex((item) => item.suit === cardData.suit && item.rank === cardData.rank)
      state.tableStack[zoneData.zoneID].splice(index, 1)

      const newLength = state.tableStack[zoneData.zoneID].length

      if (newLength) state.tableStack[zoneData.zoneID][newLength - 1].opened = true
    }

    if (zoneData.zone === 'finish') {
      const index = state.finishStack[zoneData.zoneID].findIndex((item) => item.suit === cardData.suit && item.rank === cardData.rank)

      state.finishStack[zoneData.zoneID].splice(index, 1)

      // const newLength = state.finishStack[zoneData.zoneID].length

      // if (newLength) state.finishStack[zoneData.zoneID][newLength - 1].opened = true
    }
    if (zoneData.zone === 'deck') {
      state.deckStack.splice(state.deckPosition, 1)
      if (state.deckPosition >= state.deckStack.length) state.deckPosition = state.deckStack.length - 1
      // meth.nextCard()
    }

  },
}


export default {
  state: readonly(state),
  meth
}