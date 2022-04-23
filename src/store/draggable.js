
import { useThrottleFn } from '@vueuse/core'
import { markRaw, nextTick, reactive, readonly, computed } from 'vue'
import game from './game'

const state = reactive({
  isDragActive: false,

  shiftX: 0,
  shiftY: 0,

  dragPos: {
    x: 0,
    y: 0
  },

  dragZoneData: {
    name: '',
    id: -1
  },
  dragStack: [],

  emptyElement: markRaw(document.createElement("div"))
})

const meth = {
  resetState() {
    state.isDragActive = false

    state.shiftX = 0
    state.shiftY = 0

    state.dragPos.x = 0
    state.dragPos.y = 0

    state.dragStack.length = 0

    state.dragZoneData = {
      name: '',
      id: -1
    }
  },
  // getPositionStyle: computed(() => {
  //   return `transform: translate(${state.dragPosX}px, ${state.dragPosY}px);`
  //   // return `left:${state.dragPosX}px; top:${state.dragPosY}px;`
  // }),
  // handlerDrag: useThrottleFn((event) => {
  //   meth.updateDragPosition(event.pageX, event.pageY)
  // }, 40),
  updateDragPosition(pageX, pageY) {
    const newPosX = pageX - state.shiftX
    const newPosY = pageY - state.shiftY

    // if (newPosX === state.dragPos.x && newPosY === state.dragPos.y) return

    // state.dragElement.style.left = pageX - state.shiftX + 'px'
    // state.dragElement.style.top = pageY - state.shiftY + 'px'

    state.dragPos.x = newPosX
    state.dragPos.y = newPosY
  },
  handlerMouseUp(event) {
    // console.log('isDragActive', state.isDragActive)
    meth.resetState()
  },
  handlerMouseDown(event, zoneData, cardData, cardIndex) {
    if(!game.state.isControlsEnabled) return
    if (cardData.closed) {
      event.preventDefault()
      return
    }

    // console.log('handlerMouseDown', event, cardIndex, zoneData, cardData)

    state.shiftX = event.offsetX
    state.shiftY = event.offsetY

    // state.shiftX = event.clientX - event.target.getBoundingClientRect().left
    // state.shiftY = event.clientY - event.target.getBoundingClientRect().top

    let stack = []

    if (zoneData.name === 'table') {
      const stackLength = game.meth.getStackLength(zoneData)

      if (!game.meth.getCardFromIndex(zoneData, cardIndex).closed) {
        const _stack = game.state.stacks.table[zoneData.id].slice(cardIndex, stackLength)

        _stack.forEach(card => {
          stack.push(Object.assign({}, card))
        })
      }
    }
    else if (zoneData.name === 'deck' || zoneData.name === 'finish') {
      stack.push(Object.assign({}, cardData))
    }

    state.dragStack = JSON.parse(JSON.stringify(stack))
    state.dragZoneData = JSON.parse(JSON.stringify(zoneData))

    meth.updateDragPosition(event.pageX, event.pageY)
    state.isDragActive = true
  },
  handlerRightClick(event, zoneData, cardData, cardIndex) {
    if (!game.state.isControlsEnabled) return
    if (cardData.closed) return
    if (game.meth.getStackLength(zoneData) - 1 !== cardIndex) return
    if (zoneData.name === 'finish') return

    // console.log('handlerRightClick', cardData)

    const targetZoneData = game.meth.getZoneDataCompat(cardData)
    if (!targetZoneData) return

    game.meth.moveCard(cardData, zoneData, targetZoneData)
    game.meth.saveState()
  },
  handlerStartDrag(event, zoneData, cardData, cardIndex) {
    if (!state.isDragActive || cardData.closed) {
      event.preventDefault()
      return
    }

    // console.log('startDrag', event, cardIndex, zoneData, cardData)

    // event.dataTransfer.setData('cardIndex', cardIndex)
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setDragImage(state.emptyElement, event.offsetX, event.offsetY)

    state.dragStack.forEach(card => {
      // скрываем карту на столе
      game.meth.toggleCardHide(zoneData, card, true)
    })
  },
  handlerDrag: (event) => {
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
            game.meth.moveCard(card, state.dragZoneData, zoneData)
            // game.meth.pushCard(zoneData, card)
            // game.meth.deleteCard(state.dragZoneData, card)
          })
          game.meth.saveState()

        }
      }
      else {
        const lastItem = game.meth.getCardFromIndex(zoneData, zoneLength - 1)

        if (!game.meth.checkSuitCompat(lastItem.suit, state.dragStack[0].suit)) return

        if (lastItem.rank === state.dragStack[0].rank + 1) {

          state.dragStack.forEach((card) => {
            game.meth.moveCard(card, state.dragZoneData, zoneData)
            // game.meth.pushCard(zoneData, card)
            // game.meth.deleteCard(state.dragZoneData, card)
          })
          game.meth.saveState()

        }
      }

    }

    if (zoneData.name === 'finish') {

      if (state.dragStack.length > 1) return

      if (zoneLength === 0) {
        if (state.dragStack[0].rank === 1) {
          game.meth.moveCard(state.dragStack[0], state.dragZoneData, zoneData)
          game.meth.saveState()
          // game.meth.pushCard(zoneData, state.dragStack[0])
          // game.meth.deleteCard(state.dragZoneData, state.dragStack[0])
        }
      }
      else {
        const lastItem = game.meth.getCardFromIndex(zoneData, zoneLength - 1)

        if (lastItem.suit !== state.dragStack[0].suit) return

        if (lastItem.rank === state.dragStack[0].rank - 1) {
          game.meth.moveCard(state.dragStack[0], state.dragZoneData, zoneData)
          game.meth.saveState()
          // game.meth.pushCard(zoneData, state.dragStack[0])
          // game.meth.deleteCard(state.dragZoneData, state.dragStack[0])
        }
      }
    }
  },
}

export default {
  state: readonly(state),
  meth
}