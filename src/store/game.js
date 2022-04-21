import { reactive, readonly } from "vue"

const state = reactive({
  isReady: false,

  deckStack: [],
  finishStack: [[], [], [], []],
  tableStack: [[], [], [], [], [], [], []],

  deckPosition: 0,
})

const meth = {
  // #region game state
  resetState: () => {
    state.isReady = false

    state.deckPosition = 0
    state.deckStack = []
    state.finishStack = [[], [], [], []]
    state.tableStack = [[], [], [], [], [], [], []]
  },
  initState: () => {
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
  checkEnd: () => {
    const result = state.finishStack.every(
      stack => stack.length === 13
    )

    if (!result) return

    console.log('YOU_WIN')
    alert('YOU_WIN')

    setTimeout(() => {
      meth.resetState()
      meth.initState()
    }, 3000)
  },

  filldeckStack: () => {
    for (let s = 1; s <= 4; s++) {
      for (let r = 1; r <= 13; r++) {
        state.deckStack.push({
          suit: s, // масть: 1..4
          rank: r, // достоинство: 1..13
          closed: true,
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

        card.closed = !(k === i)

        state.tableStack[i].push(card)
      }
    }

    state.deckPosition = state.deckStack.length - 1
    state.deckStack[state.deckPosition].closed = false
  },
  //#endregion game state

  // #region game helpers
  getKey(cardData) {
    return `${cardData?.rank}-${cardData?.suit}`
  },
  checkSuitCompat: (a, b) => {
    return a % 2 !== b % 2
  },
  iterateNextDeckCard: () => {
    if (state.deckPosition === state.deckStack.length - 1) state.deckPosition = 0
    else ++state.deckPosition

    state.deckStack[state.deckPosition].closed = false
  },

  getIndexFromCard: (zoneData, cardData) => {
    let cardIndex = null

    if (zoneData.name === 'table') {
      cardIndex = state.tableStack[zoneData.id].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)
    }
    else if (zoneData.name === 'finish') {
      cardIndex = state.finishStack[zoneData.id].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)
    }

    return cardIndex === -1 ? null : cardIndex
  },
  getCardFromIndex: (zoneData, index) => {
    let card = null

    if (zoneData.name === 'table') {
      card = state.tableStack[zoneData.id][index]
    }
    else if (zoneData.name === 'finish') {
      card = state.finishStack[zoneData.id][index]
    }
    return card
  },
  // #endregion game helpers
}

export default {
  state: state,
  meth
}