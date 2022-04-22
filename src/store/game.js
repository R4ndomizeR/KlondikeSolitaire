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
  // #region game state change
  resetState() {
    state.isReady = false

    state.stacks = {
      'deck': [[], []],
      'finish': [[], [], [], []],
      'table': [[], [], [], [], [], [], []],
    }
  },
  initState() {
    meth.filldeck()
    // console.log(state.deck)

    meth.shuffledeck()
    // console.log(state.deck)

    meth.fillTable()
    // console.log(state.stacks.deck)
    // console.log(state.stacks.table)

    // meth.testFillFinishTable()

    state.isReady = true
  },
  checkEnd() {
    const result = state.stacks.finish.every(
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

  filldeck() {
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
  shuffledeck() {
    let j, temp
    for (let i = state.stacks.deck[0].length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = state.stacks.deck[0][j]
      state.stacks.deck[0][j] = state.stacks.deck[0][i]
      state.stacks.deck[0][i] = temp
    }
  },
  fillTable() {
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
  //#endregion game state change

  // #region game setters
  popNextDeckCard() {
    // if (state.deckPosition === state.deck.length - 1) state.deckPosition = 0
    // else ++state.deckPosition

    if (state.stacks['deck'][0].length === 0) {

      state.stacks['deck'][1] = state.stacks['deck'][1].filter((item) => {
        state.stacks['deck'][0].unshift(item)
        return false
      })

    }
    else {
      const card = state.stacks['deck'][0].pop()
      card.closed = false
      state.stacks['deck'][1].push(card)
    }

    console.log(state.stacks['deck'][0].length, state.stacks['deck'][1].length)
  },
  // swapDeckCards() {
  //   if (state.stacks['deck'][0].length === 0) {
  //     state.stacks['deck'][1].filter((item) => {
  //       state.stacks['deck'][0].push(item)
  //     })
  //   }

  //   console.log(state.stacks['deck'][0].length, state.stacks['deck'][1].length)
  // },
  toggleCardHide(zoneData, cardData, isHidden) {
    let cardIndex = meth.getIndexFromCard(zoneData, cardData)

    if (cardIndex === null) return

    // console.log('toggle', state.stacks[zoneData.name][zoneData.id][cardIndex])

    state.stacks[zoneData.name][zoneData.id][cardIndex].hidden = isHidden
  },
  pushCard(zoneData, cardData) {
    state.stacks[zoneData.name][zoneData.id].push(Object.assign({}, cardData))
  },
  // deleteCardArray: (zoneData, cardStack) => {
  //   cardStack.forEach(card => {
  //     const index = meth.getIndexFromCard(zoneData, card)
  //     if (index !== -1) {
  //       state.table.stacks[zoneData.name][zoneData.id].splice(index, 1)
  //     }
  //   })
  //   state.stacks[zoneData.name][zoneData.id].push(Object.assign({}, cardData))
  // },
  deleteCard(zoneData, cardData) {
    const index = meth.getIndexFromCard(zoneData, cardData)
    if (index !== -1) {
      state.stacks[zoneData.name][zoneData.id].splice(index, 1)
    }

    // FIXME: возможно будет открываться предпоследняя, но это не точно
    if (zoneData.name === 'table') {
      const newLength = state.stacks.table[zoneData.id].length
      if (newLength) state.stacks.table[zoneData.id][newLength - 1].closed = false
    }
  },
  // #endregion game setters

  // #region game getters
  getKey(cardData) {
    return `${cardData?.rank}-${cardData?.suit}`
  },
  getStackLength(zoneData) {
    return state.stacks[zoneData.name][zoneData.id].length
  },
  checkSuitCompat(a, b) {
    return a % 2 !== b % 2
  },
  getIndexFromCard(zoneData, cardData) {
    if (!zoneData.name.length) return
    if (zoneData.id < 0) return

    let cardIndex = null

    cardIndex = state.stacks[zoneData.name][zoneData.id].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

    return cardIndex === -1 ? null : cardIndex
  },
  getCardFromIndex(zoneData, index) {
    if (!zoneData.name.length) return
    if (!zoneData.id < 0) return

    return state.stacks[zoneData.name][zoneData.id][index]
  },
  getFinishZoneIdCompat(cardData) {
    let idZone = -1

    for (let i = 0; i < state.stacks.finish.length; i++) {
      const stack = state.stacks.finish[i]

      if (cardData.rank === 1 && stack.length === 0) {
        idZone = i
        break
      }

      const cardID = stack.findIndex((card) => card.suit === cardData.suit && card.rank === cardData.rank - 1)

      if (cardID !== -1) {
        idZone = i
        break
      }
    }

    return idZone
  }
  // #endregion game setters
}

export default {
  state: readonly(state),
  meth
}