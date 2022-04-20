import { reactive, readonly } from "vue"

const state = reactive({
  isReady: false,

  deckStack: [],
  finishStack: [[], [], [], []],
  tableStack: [[], [], [], [], [], [], []],

  deckPosition: 0,
})

const meth = {
  getKey(card) {
    return `${card?.rank}-${card?.suit}`
  },
  nextCard: () => {
    if (state.deckPosition === state.deckStack.length - 1) state.deckPosition = 0
    else ++state.deckPosition

    state.deckStack[state.deckPosition].opened = true
  },
  checkSuitCompat: (a, b) => {
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

  /*     testFillFinishTable() {
        for (let i = 0; i < state.finishStack.length; i++) {
          state.finishStack[i].push({
            suit: i + 1, // масть: 1..4
            rank: 1, // достоинство: 1..13
            opened: true,
          })

        }
      }, */
}

export default {
  state: readonly(state),
  meth
}