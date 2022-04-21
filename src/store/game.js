import { reactive, readonly } from "vue"

const state = reactive({
  isReady: false,

  stacks: {
    'deck': [[], []],
    'finish': [[], [], [], []],
    'table': [[], [], [], [], [], [], []],
  }
})

const meth = {
  // #region game state
  resetState: () => {
    state.isReady = false

    state.stacks = {
      'deck': [[], []],
      'finish': [[], [], [], []],
      'table': [[], [], [], [], [], [], []],
    }
  },
  initState: () => {
    meth.filldeck()
    // console.log(state.deck)

    meth.shuffledeck()
    // console.log(state.deck)

    meth.fillTable()
    console.log(state.stacks.deck)
    console.log(state.stacks.table)

    // meth.testFillFinishTable()

    state.isReady = true
  },
  checkEnd: () => {
    const result = state.finish.every(
      stack => stack.length === 13
    )
    //TODO: auto finish

    if (!result) return

    console.log('YOU_WIN')
    alert('YOU_WIN')

    setTimeout(() => {
      meth.resetState()
      meth.initState()
    }, 3000)
  },

  filldeck: () => {
    for (let s = 1; s <= 4; s++) {
      for (let r = 1; r <= 13; r++) {
        state.stacks.deck[0].push({
          suit: s, // масть: 1..4
          rank: r, // достоинство: 1..13
          closed: true,
          hidden: false,
        })
      }
    }
  },
  shuffledeck: () => {
    let j, temp
    for (let i = state.stacks.deck[0].length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = state.stacks.deck[0][j]
      state.stacks.deck[0][j] = state.stacks.deck[0][i]
      state.stacks.deck[0][i] = temp
    }
  },
  fillTable: () => {
    for (let i = 0; i <= 6; i++) {
      for (let k = 0; k <= i; k++) {
        // console.log(i, k)
        const card = state.stacks.deck[0].pop()

        card.closed = !(k === i)

        state.stacks.table[i].push(card)
      }
    }

    // state.stacks.deck[0][state.deckPosition].closed = false
  },
  //#endregion game state

  // #region game setters
  popNextDeckCard: () => {
    // if (state.deckPosition === state.deck.length - 1) state.deckPosition = 0
    // else ++state.deckPosition

    if (state.stacks['deck'][0].length === 0) {
      state.stacks['deck'][1].filter((item) => {
        state.stacks['deck'][0].push(item)
      })
    }
    else {
      const card = state.stacks['deck'][0].pop()
      card.closed = false
      console.log(card)
      state.stacks['deck'][1].push(card)
    }

  },
  // #endregion game setters

  // #region game getters
  getKey(cardData) {
    return `${cardData?.rank}-${cardData?.suit}`
  },
  checkSuitCompat: (a, b) => {
    return a % 2 !== b % 2
  },
  getIndexFromCard: (zoneData, cardData) => {
    if (!zoneData.name.length) return
    if (!zoneData.id < 0) return

    let cardIndex = null

    cardIndex = state.stacks[zoneData.name][zoneData.id].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

    return cardIndex === -1 ? null : cardIndex
  },
  getCardFromIndex: (zoneData, index) => {
    if (!zoneData.name.length) return
    if (!zoneData.id < 0) return

    return state.stacks[zoneData.name][zoneData.id][index]
  },
  // #endregion game setters
}

export default {
  state: state,
  meth
}