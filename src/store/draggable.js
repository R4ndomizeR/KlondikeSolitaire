import { nextTick, reactive, readonly } from 'vue'
import game from './game'

const state = reactive({
  isDragActive: false,

  shiftX: 0,
  shiftY: 0,

  dragZoneData: {
    name: '',
    id: -1
  },
  dragStack: [],
  dragElement: null,

  currentDrop: null
})

const meth = {
  setDragElement(elem) {
    state.dragElement = elem
  },

  handlerMouseDown(event, zoneData, cardData) {

    if (cardData.closed) {
      event.preventDefault()
      return
    }

    console.log('handlerMouseDown', event, zoneData, cardData)

    state.shiftX = event.offsetX //event.clientX - event.target.getBoundingClientRect().left
    state.shiftY = event.offsetY //event.clientY - event.target.getBoundingClientRect().top

    let stack = [cardData]

    if (zoneData.name === 'table') {
      const stackLength = game.state.tableStack[zoneData.id].length
      const position = game.meth.getIndexFromCard(zoneData, cardData)

      console.log('position', position)

      if (position !== null) {
        if (!game.state.tableStack[zoneData.id][position].closed) {
          const _stack = game.state.tableStack[zoneData.id].slice(position, stackLength)

          _stack.forEach(item => {
            stack.push(Object.assign({}, item))
            item.hidden = true
          })

        }
      }
    }

    state.dragZoneData = { ...zoneData }

    state.dragStack.length = 0
    state.dragStack = JSON.parse(JSON.stringify(stack))

    console.log('createDragGhost', 'dragStack', state.dragStack)
    console.log('createDragGhost', 'dragZoneData', state.dragZoneData)
  },

  handlerStartDrag(event, zoneData, cardData) {
    if (cardData.closed) {
      event.preventDefault()
      return
    }

    console.log('startDrag', event, zoneData, cardData)

    if (zoneData.name === 'table') {


      // const stackLength = game.state.tableStack[zoneData.id].length
      // const position = game.state.tableStack[zoneData.id].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

      // if (position !== stackLength - 1) {
      //   console.log('stackLength', stackLength)
      //   console.log('position', position)

      //   const stack = game.state.tableStack[zoneData.id].slice(position + 1, stackLength)
      //   // console.log(stack)

      //   state.dragData = [...stack]

      //   stack.forEach(item => {
      //     item.hidden = true
      //   })

      //   // event.dataTransfer.setData('nestedCardData', JSON.stringify(stack))

      //   event.dataTransfer.setDragImage(state.dragImage, event.offsetX, event.offsetY)
      // }
    }

    event.dataTransfer.setData('plain/text', '1')

    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'

    // state.dragStack.forEach(item => {
    //   item.hidden = true
    // })

    // await nextTick()

    event.dataTransfer.setDragImage(document.createElement("div"), event.offsetX, event.offsetY)
  },
  handlerDrag(event) {
    state.dragElement.style.left = event.pageX - state.shiftX + 'px'
    state.dragElement.style.top = event.pageY - state.shiftY + 'px'
  },
  handlerEndDrag(event, zoneData) {
    // event.target.style.opacity = '1'

    if (state.dragElement) {
      state.dragElement.style.top = '-1000px'
    }

    state.shiftX = 0
    state.shiftY = 0

    state.dragStack.length = 0

    // if (state.dragStack) {
    //   // state.dragData.forEach(item => {
    //   //   item.hidden = false
    //   // })
    //   state.dragData = null
    // }

    // const ghost = document.getElementById("drag-stack")
    // if (ghost) {
    //   ghost.remove()
    //   state.dragImage = null
    // }




  },

  handleDropZone(event, zoneData) {
    console.log('handleDropZone', event, zoneData)
    if (zoneData?.name?.length) {
      console.log('handleDropZone')
    }

    if (zoneData?.name === 'table') {

      const zoneLength = game.state.tableStack[zoneData.id].length

      if (zoneLength === 0) {
        if (state.dragStack[0].rank === 13) {
          game.state.tableStack[zoneData.id].push(...state.dragStack)

          meth.deleteFromZone(state.dragZoneData, state.dragStack)

          // if (nestedCardData) {
          //   nestedCardData.forEach((item) => {
          //     game.state.tableStack[zoneData.id].push(item)
          //     meth.deleteFromZone(zoneData, item)
          //   })
          // }

        }
      }
      else {
        const lastItem = game.state.tableStack[zoneData.id][zoneLength - 1]

        if (!game.meth.checkSuitCompat(lastItem.suit, state.dragStack[0].suit)) return

        if (lastItem.rank === state.dragStack[0].rank + 1) {
          game.state.tableStack[zoneData.id].push(state.dragStack[0])

          meth.deleteFromZone(state.dragZoneData, state.dragStack[0])

          // if (nestedCardData) {
          //   nestedCardData.forEach((item) => {
          //     game.state.tableStack[zoneData.id].push(item)
          //     meth.deleteFromZone(zoneData, item)
          //   })
          // }

          // console.log('onDrop:item', cardData)
        }
      }
    }
  },
  deleteFromZone: (zoneData, cardData) => {
    if (zoneData.name === 'table') {
      const index = game.meth.getIndexFromCard(zoneData, cardData)

      game.state.tableStack[zoneData.id].splice(index, 1)

      const newLength = game.state.tableStack[zoneData.id].length
      if (newLength) game.state.tableStack[zoneData.id][newLength - 1].opened = true
    }
    if (zoneData.name === 'finish') {

      const index = game.meth.getIndexFromCard(zoneData, cardData)

      state.finishStack[zoneData.id].splice(index, 1)

      // const newLength = state.finishStack[zoneData.id].length
      // if (newLength) state.finishStack[zoneData.id][newLength - 1].opened = true
    }
    if (zoneData.name === 'deck') {

      state.cardDeck.splice(state.deckPos, 1)

      if (state.deckPos >= state.cardDeck.length) state.deckPos = state.cardDeck.length - 1

      // meth.nextCard()
    }
  },

}


export default {
  state: state,
  meth
}