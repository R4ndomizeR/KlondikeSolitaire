import { reactive, readonly } from "vue"

const delay = 150

const state = reactive({
  isReady: false,
  isControlsEnabled: false,

  history: [],

  stacks: {
    'deck': [[], []],
    'finish': [[], [], [], []],
    'table': [[], [], [], [], [], [], []],
  }
})

const meth = {
  // #region test
  testFinish() {
    const arr = [
      [1, 2, 3, 4],
      [2, 3, 4, 1], //
      [3, 2, 1, 4],
      [4, 3, 2, 1], //
    ]

    let pos = 0 // Math.floor(Math.random() * arr.length)

    for (let r = 13; r >= 1; r--) {

      for (let s = 1; s <= 4; s++) {
        // const pos = dir ? s : p

        const card = {
          suit: arr[pos][s - 1],
          rank: r,
          closed: false,
          hidden: false,
        }

        state.stacks.table[s].push(card)
      }

      pos = pos < arr.length - 1 ? pos + 1 : 0
    }
  },
  // #endregion test

  // #region game state change
  resetState() {
    meth.setReady(false)

    state.stacks = {
      'deck': [[], []],
      'finish': [[], [], [], []],
      'table': [[], [], [], [], [], [], []],
    }

    state.history.length = 0
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

    meth.saveState()
  },
  setReady(toggle) {
    state.isReady = toggle
    state.isControlsEnabled = toggle
  },
  loadPrevState(event) {
    if (!(event.keyCode === 90 && event.ctrlKey)) return
    if (state.history.length < 2) return

    // state.history.pop()

    const oldState = state.history[state.history.length - 2]

    // console.log('loadPrevState', oldState)

    state.stacks = JSON.parse(JSON.stringify(oldState))

    state.history.pop()
  },
  saveState() {
    state.history.push(JSON.parse(JSON.stringify(state.stacks)))
    // console.log('saveState', state.history)

    // state.isControlsEnabled = true
  },

  checkEnd() {
    const result = state.stacks.finish.every(
      stack => stack.length === 13
    )

    if (!result) return

    console.log('YOU_WIN')

    setTimeout(() => {
      const res = confirm('You win! Restart?')
      if (res) {
        meth.resetState()
        meth.initState()
        meth.setReady(true)
      }
    }, 1000)
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
    if (!state.isControlsEnabled) return

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

    meth.saveState()

    // console.log(state.stacks['deck'][0].length, state.stacks['deck'][1].length)
  },
  toggleCardHide(zoneData, cardData, isHidden) {
    let cardIndex = meth.getIndexFromCard(zoneData, cardData)

    if (cardIndex === null) return

    // console.log('toggle', state.stacks[zoneData.name][zoneData.id][cardIndex])

    state.stacks[zoneData.name][zoneData.id][cardIndex].hidden = isHidden
  },
  moveCard(cardData, fromZoneData, toZoneData) {
    // console.log('moveCard', cardData, fromZoneData, toZoneData)

    meth.pushCard(toZoneData, cardData)
    meth.deleteCard(fromZoneData, cardData)

    // if(saveState) meth.saveState()

    meth.checkEnd()
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

  proceesAutoMoveDeck() {
    let success = false

    // last deck card
    if (state.stacks.deck[1].length && state.stacks.deck[1][state.stacks.deck[1].length - 1]) {
      const lastDeckCard = state.stacks.deck[1][state.stacks.deck[1].length - 1]

      const targetZoneData = meth.getZoneDataCompat(lastDeckCard)

      if (targetZoneData) {
        meth.moveCard(lastDeckCard, { name: 'deck', id: 1 }, targetZoneData)
        meth.saveState()
        success = true
      }
    }

    return success
  },
  proceesAutoMoveTable() {
    let success = false
    // loop on table stacks
    for (const stackID in state.stacks.table) {
      if (!Object.hasOwnProperty.call(state.stacks.table, stackID)) continue

      const stack = state.stacks.table[stackID]
      if (!stack.length) continue

      // console.log(stackID, stack)

      const lastCard = stack[stack.length - 1]
      if (lastCard.closed) return

      const targetZoneData = meth.getZoneDataCompat(lastCard)
      if (!targetZoneData) continue

      meth.moveCard(lastCard, { name: 'table', id: stackID }, targetZoneData)
      meth.saveState()

      success = true
      break // TODO
    }

    return success
  },
  processAutoMove() {
    state.isControlsEnabled = false
    // console.log(event)

    let success = meth.proceesAutoMoveDeck()

    if (!success) {
      success = meth.proceesAutoMoveTable()
    }

    if (!success) state.isControlsEnabled = true

    if (success) {
      setTimeout(() => {
        meth.processAutoMove()
      }, delay)
    }
  },
  handlerRightClickBoard(event) {
    if (!state.isControlsEnabled) return
    state.isControlsEnabled = false
    meth.processAutoMove()
    state.isControlsEnabled = true
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
  getZoneDataCompat(cardData) {
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

    if (idZone === -1) return null

    return { name: 'finish', id: idZone }
  },
  // #endregion game setters
}

export default {
  state: (state),
  meth
}