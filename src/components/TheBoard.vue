<style scoped>
.main {
  width: 1360px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  gap: 5px;
}
.card {
  display: flex;

  width: 100px;
  height: 145px;
}
</style>

<template>
  <div class="main">
    <div class="card" v-for="card in state.cardDeck" :key="card.rank + card.suit">
      <img :src="meth.getCardFaceImage(card)" />
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
  cardDeck: [],
  deckPos: 0,
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

    // meth.shuffleCardDeck()
    // // console.log(state.cardDeck)

    // meth.fillTable()
    // console.log(state.cardDeck)
    // console.log(state.table)

  },
  fillCardDeck: () => {
    for (let s = 1; s <= 4; s++) {
      for (let r = 1; r <= 13; r++) {
        state.cardDeck.push({
          suit: s, // масть: 1..4
          rank: r, // достоинство: 1..13
          opened: true,
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
        state.table[i].push(state.cardDeck.pop())
      }
    }

    state.deckPos = state.cardDeck.length - 1
  },
  popCardFromDeck: () => {
    state.deckPos = state.cardDeck.length - 2
    return state.cardDeck.pop()
  }
}

onMounted(() => {
  meth.init()
})

</script>