import { reactive, readonly } from "vue"

const state = reactive({
  isReady: false,

  deckStack: [],
  finishStack: [[], [], [], []],
  tableStack: [[], [], [], [], [], [], []],

  deckPosition: 0,

  dragImage: null,
  dragData: null
})

const meth = {

  getKey(card) {
    return `${card?.rank}-${card?.suit}`
  },

  createGhost(zoneData, cardData) {

    if (zoneData.zone !== 'table') return
    const stackLength = state.tableStack[zoneData.zoneID].length
    const position = state.tableStack[zoneData.zoneID].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

    if (position !== stackLength - 1) {
      console.log('stackLength', stackLength)
      console.log('position', position)

      const stack = state.tableStack[zoneData.zoneID].slice(position + 1, stackLength)
      console.log('stack', stack)

      state.dragImage = document.createElement("div")
      state.dragImage.id = "drag-stack"
      state.dragImage.classList.add("drag-stack")
      state.dragImage.style.position = "absolute"
      state.dragImage.style.top = "-1000px"

      const tCard = document.createElement("div")
      tCard.classList.add("card-stack")
      tCard.style = meth.getCardImageStyle(cardData)
      state.dragImage.appendChild(tCard)

      stack.forEach((item) => {
        const tCard = document.createElement("div")
        tCard.classList.add("card-stack")
        tCard.style = meth.getCardImageStyle(item)
        state.dragImage.appendChild(tCard)
      })

      document.body.appendChild(state.dragImage)
    }
  },

  startDrag(event, zoneData, cardData) {
    console.log('startDrag', event, zoneData, cardData)

    if (!cardData.opened) {
      event.preventDefault()
      return
    }

    if (zoneData.zone === 'table') {
      const stackLength = state.tableStack[zoneData.zoneID].length
      const position = state.tableStack[zoneData.zoneID].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

      if (position !== stackLength - 1) {
        console.log('stackLength', stackLength)
        console.log('position', position)

        const stack = state.tableStack[zoneData.zoneID].slice(position + 1, stackLength)
        // console.log(stack)

        state.dragData = [...stack]

        stack.forEach(item => {
          item.hidden = true // TODO: hide card
        })

        // event.dataTransfer.setData('nestedCardData', JSON.stringify(stack))

        event.dataTransfer.setDragImage(state.dragImage, event.offsetX, event.offsetY)
      }

    }

    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'

    event.dataTransfer.setData('card', JSON.stringify(cardData))
    event.dataTransfer.setData('zone', JSON.stringify(zoneData))

    event.target.style.opacity = '0.01'

    // event.target.style.opacity = '1'
    // let img = new Image()
    // img.src = meth.getCardImage(cardData)
    // event.dataTransfer.setDragImage(state.img, 0, 0)
    // console.log(event.dataTransfer)
  },

  endDrag(event, data) {
    // console.log('endDrag')
    event.target.style.opacity = '1'

    if (state.dragData) {
      state.dragData.forEach(item => {
        item.hidden = false
      })
      state.dragData = null
    }

    const ghost = document.getElementById("drag-stack")
    if (ghost) {
      ghost.remove()
      state.dragImage = null
    }
  },

  onDropZone(event, data) {
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

        if (!meth.checkTableCompat(lastItem.suit, cardData.suit)) return

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

  nextCard: () => {
    if (state.deckPosition === state.deckStack.length - 1) state.deckPosition = 0
    else ++state.deckPosition

    state.deckStack[state.deckPosition].opened = true
  },

  getCardImageStyle: (card) => {
    const url = meth.getCardImage(card)

    return `background: url(${url}); background-size: cover;`
  },

  getCardImage: (card) => {
    /*
      Clubs - Трефы (ч)
      Diamonds - Бубны (к)
      Spades - Пики (ч)
      Hearts - Червы (к)
     */
    const suits = ['c', 'd', 's', 'h']

    if (!card?.opened) return new URL(`../assets/cards/back.png`, import.meta.url).href

    return new URL(`../assets/cards/${card.rank}${suits[card.suit - 1]}.png`, import.meta.url).href
  },

  checkTableCompat: (a, b) => {
    // if (a === 1 || a === 2) {
    //   if (b === 3 || b === 4) return true
    // }

    // if (b === 1 || b === 2) {
    //   if (a === 3 || a === 4) return true
    // }

    return a % 2 !== b % 2
  },

  resetData: () => {
    state.isReady = false

    state.deckPosition = 0
    state.deckStack = []
    state.finishStack = [[], [], [], []]
    state.tableStack = [[], [], [], [], [], [], []]
  },

  init: () => {

    meth.filldeckStack()
    // console.log(state.deckStack)

    meth.shuffledeckStack()
    // console.log(state.deckStack)

    meth.fillTable()
    console.log(state.deckStack)
    console.log(state.tableStack)

    // meth.testFillFinishTable()

    state.isReady = true
  },
  filldeckStack: () => {
    for (let s = 1; s <= 4; s++) {
      for (let r = 1; r <= 13; r++) {
        state.deckStack.push({
          suit: s, // масть: 1..4
          rank: r, // достоинство: 1..13
          opened: true,
          hidden: false,
        })
      }
    }
  },
  shuffledeckStack: () => {
    let j, temp
    for (let i = state.deckStack.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = state.deckStack[j]
      state.deckStack[j] = state.deckStack[i]
      state.deckStack[i] = temp
    }
  },
  fillTable: () => {
    for (let i = 0; i <= 6; i++) {
      for (let k = 0; k <= i; k++) {
        // console.log(i, k)
        const card = state.deckStack.pop()

        card.opened = (k === i)

        state.tableStack[i].push(card)
      }
    }

    state.deckPosition = state.deckStack.length - 1
    state.deckStack[state.deckPosition].opened = true
  },

  checkEnd: () => {
    const result = state.finishStack.every(
      stack => stack.length === 13
    )

    if (!result) return

    console.log('YOU_WIN')
    alert('YOU_WIN')

    setTimeout(() => {
      meth.resetData()
      meth.init()
    }, 3000)
  }

  // popCardFromDeck: () => {
  //   // state.deckPosition = state.deckStack.length - 2
  //   return state.deckStack.pop()
  // },

  //   testFillFinishTable() {
  //     for (let i = 0; i < state.finishStack.length; i++) {
  //       state.finishStack[i].push({
  //         suit: i + 1, // масть: 1..4
  //         rank: 1, // достоинство: 1..13
  //         opened: true,
  //       })

  //     }
  //   },
}

export default {
  state: readonly(state),
  meth
}