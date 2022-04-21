import { markRaw, nextTick, reactive, readonly } from 'vue'
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

  emptyElement: markRaw(document.createElement("div"))
})

const meth = {
  resetState() {
    state.isDragActive = false

    // if (state.dragElement) {
    //   state.dragElement.style.top = '-1000px'
    // }

    state.shiftX = 0
    state.shiftY = 0

    state.dragStack.length = 0
    state.dragZoneData = {
      name: '',
      id: -1
    }
  },
  setDragElement(elem) {
    state.dragElement = elem
  },
  updateDragPosition(pageX, pageY) {
    // state.dragElement.style.left = '0'
    // state.dragElement.style.top = '0'

    // console.log(JSON.stringify(state.dragStack))

    state.dragElement.style.left = pageX - state.shiftX + 'px'
    state.dragElement.style.top = pageY - state.shiftY + 'px'
  },

  handlerMouseDown(event, zoneData, cardData, cardIndex) {
    if (cardData.closed) {
      event.preventDefault()
      return
    }

    console.log('handlerMouseDown', event, cardIndex, zoneData, cardData)

    state.shiftX = event.offsetX //event.clientX - event.target.getBoundingClientRect().left
    state.shiftY = event.offsetY //event.clientY - event.target.getBoundingClientRect().top

    let stack = []

    if (zoneData.name === 'table') {
      const stackLength = game.meth.getStackLength(zoneData)

      if (!game.meth.getCardFromIndex(zoneData, cardIndex).closed) {
        const _stack = game.state.stacks.table[zoneData.id].slice(cardIndex, stackLength)

        // console.log('DRAG_STACK', _stack)

        _stack.forEach(card => {
          // console.log('DRAG', card)
          stack.push(Object.assign({}, card))

          // скрываем карту на столе
          // game.meth.toggleCardHide(zoneData, card, true)
        })

        _stack.forEach(card => {
          // console.log('DRAG', card)
          // stack.push(Object.assign({}, card))

          // скрываем карту на столе
          game.meth.toggleCardHide(zoneData, card, true)
        })
      }
    }
    else if (zoneData.name === 'deck' || zoneData.name === 'finish') {
      stack.push(Object.assign({}, cardData))

      // скрываем карту на столе
      game.meth.toggleCardHide(zoneData, cardData, true)
    }

    // state.dragStack.length = 0
    state.dragStack = JSON.parse(JSON.stringify(stack))
    state.dragZoneData = JSON.parse(JSON.stringify(zoneData))

    meth.updateDragPosition(event.pageX, event.pageY)
    state.isDragActive = true

    // console.log('createDragGhost', 'dragStack', state.dragStack)
    // console.log('createDragGhost', 'dragZoneData', state.dragZoneData)
  },
  handlerStartDrag(event, zoneData, cardData, cardIndex) {
    if (!state.isDragActive || cardData.closed) {
      event.preventDefault()
      return
    }

    // console.log('startDrag', event, cardIndex, zoneData, cardData)

    event.dataTransfer.setData('cardIndex', cardIndex)
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'

    // await nextTick()

    event.dataTransfer.setDragImage(state.emptyElement, event.offsetX, event.offsetY)
  },
  handlerDrag(event) {
    meth.updateDragPosition(event.pageX, event.pageY)
  },
  handlerEndDrag(event) {
    // console.log('handlerEndDrag', state.dragZoneData, state.dragStack)

    state.dragStack.forEach((card) => {
      game.meth.toggleCardHide(state.dragZoneData, card, false)
    })
    meth.resetState()
  },

  handleDropZone(event, zoneData) {
    // console.log('handleDropZone', event, zoneData)

    const zoneLength = game.meth.getStackLength(zoneData)

    if (zoneData.name === 'table') {

      if (zoneLength === 0) {
        if (state.dragStack[0].rank === 13) {

          state.dragStack.forEach((card) => {
            game.meth.pushCard(zoneData, card)
            game.meth.deleteCard(state.dragZoneData, card)
          })

        }
      }
      else {
        const lastItem = game.meth.getCardFromIndex(zoneData, zoneLength - 1)

        if (!game.meth.checkSuitCompat(lastItem.suit, state.dragStack[0].suit)) return

        if (lastItem.rank === state.dragStack[0].rank + 1) {

          state.dragStack.forEach((card) => {
            game.meth.pushCard(zoneData, card)
            game.meth.deleteCard(state.dragZoneData, card)
          })

        }
      }

    }

    if (zoneData.name === 'finish') {

      if (state.dragStack.length > 1) return

      if (zoneLength === 0) {
        if (state.dragStack[0].rank === 1) {

          game.meth.pushCard(zoneData, state.dragStack[0])
          game.meth.deleteCard(state.dragZoneData, state.dragStack[0])

        }
      }
      else {
        const lastItem = game.meth.getCardFromIndex(zoneData, zoneLength - 1)

        if (lastItem.suit !== state.dragStack[0].suit) return

        if (lastItem.rank === state.dragStack[0].rank - 1) {

          game.meth.pushCard(zoneData, state.dragStack[0])
          game.meth.deleteCard(state.dragZoneData, state.dragStack[0])

        }
      }
    }

    game.meth.checkEnd()
  },
}


export default {
  state: state,
  meth
}