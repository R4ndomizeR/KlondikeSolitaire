<style lang="scss" scoped>
.main {
  // width: 1360px;
  // height: 800px;
}

.top {
  display: flex;
  justify-content: space-between;
}

.deck-table {
  height: 180px;
  position: relative;
  display: flex;
  // justify-self: flex-start;
}

.finish-table {
  height: 150px;
  // justify-self: flex-end;

  position: relative;
  display: flex;
  flex-direction: row;
  // justify-content: flex-end;

  gap: 20px;
}

.table {
  // width: 100%;
  // height: 100%;

  height: 500px;

  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;

  gap: 20px;
}

.card-stack {
  position: relative;
  width: 100px;
}

.card {
  display: flex;

  width: 100px;
  height: 145px;

  @for $i from 1 through 13 {
    &:nth-child(#{$i}) {
      top: #{$i * 10}px;
      position: absolute;
    }
  }
}
</style>

<template>
  <div class="main">
    <div class="top">
      <div class="deck-table">
        <div class="card-stack">
          <div class="card" v-if="state.cardDeck.length">
            <img :src="meth.getCardFaceImage(state.cardDeck[state.deckPos])" />
          </div>
        </div>
      </div>
      <div class="finish-table">
        <div class="card-stack" v-for="(cardStack, idx) in state.finishStack" :key="idx">
          <div class="card" v-for="card in cardStack" :key="card.rank + card.suit">
            <img :src="meth.getCardFaceImage(card)" />
          </div>
        </div>
      </div>
    </div>

    <div class="table">
      <div class="card-stack" v-for="(cardStack, idx) in state.table" :key="idx">
        <div class="card" v-for="card in cardStack" :key="card.rank + card.suit">
          <img :src="meth.getCardFaceImage(card)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script  setup>
import { onMounted, reactive } from 'vue'
import BoardCell from './BoardCell.vue'
import { utils } from '../utils/utils.js'

/*

  52 карты
  по 13 карт каждой из 4 мастей

*/

const state = reactive({
  deckPos: 0,

  cardDeck: [],

  finishStack: [[], [], [], []],

  table: [[], [], [], [], [], [], []],
})

const meth = {
  getCardFaceImage: (card) => {
    /*
      Clubs - Трефы
      Diamonds - Бубны
      Hearts - Червы
      Spades - Пики
     */
    const suits = ['c', 'd', 'h', 's']

    if (!card.opened) return new URL(`../assets/cards/back.png`, import.meta.url).href

    return new URL(`../assets/cards/${card.rank}${suits[card.suit - 1]}.png`, import.meta.url).href
  },

  init: () => {

    meth.fillCardDeck()
    // console.log(state.cardDeck)

    meth.shuffleCardDeck()
    // console.log(state.cardDeck)

    meth.fillTable()
    console.log(state.cardDeck)
    console.log(state.table)

    meth.testFillFinishTable()
  },
  fillCardDeck: () => {
    for (let s = 1; s <= 4; s++) {
      for (let r = 1; r <= 13; r++) {
        state.cardDeck.push({
          suit: s, // масть: 1..4
          rank: r, // достоинство: 1..13
          opened: false,
        })
      }
    }
  },
  shuffleCardDeck: () => {
    let j, temp
    for (let i = state.cardDeck.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = state.cardDeck[j]
      state.cardDeck[j] = state.cardDeck[i]
      state.cardDeck[i] = temp
    }
  },
  fillTable: () => {
    for (let i = 0; i <= 6; i++) {
      for (let k = 0; k <= i; k++) {
        // console.log(i, k)
        const card = state.cardDeck.pop()

        if (k === i) card.opened = true

        state.table[i].push(card)
      }
    }

    state.deckPos = state.cardDeck.length - 1
    state.cardDeck[state.deckPos].opened = true
  },
  // popCardFromDeck: () => {
  //   // state.deckPos = state.cardDeck.length - 2
  //   return state.cardDeck.pop()
  // },

  testFillFinishTable() {
    for (let i = 0; i < state.finishStack.length; i++) {
      state.finishStack[i].push({
        suit: i + 1, // масть: 1..4
        rank: 1, // достоинство: 1..13
        opened: true,
      })

    }
  },
}

onMounted(() => {
  meth.init()
})

</script>