<style lang="scss">
// .main {
//   // width: 1360px;
//   // height: 800px;
// }

.top {
  display: flex;
  justify-content: space-between;
}

// img {
//   pointer-events: none;
// }

.deck-table {
  height: 180px;
  position: relative;
  display: flex;
  // justify-self: flex-start;
  gap: 10px;
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

  // margin-left: 10px;
}

.empty-place {
  display: block;
  position: absolute;
  width: 100px;
  height: 145px;
  top: 0;

  outline: 1px solid rgb(0 0 0 / 50%);
  border-radius: 6px;
  box-shadow: 0px 0px 20px 5px rgb(0 0 0 / 19%) inset;
}

.drag-zone {
  width: 100px;
  height: 145px;

  outline: 1px solid rgb(0 0 0 / 50%);
  border-radius: 6px;
  box-shadow: 0px 0px 20px 5px rgb(0 0 0 / 19%) inset;
}

.drag-stack {
  width: 100px;
  .card-stack {
    display: flex;

    width: 100px;
    height: 145px;

    border-radius: 6px;

    @for $i from 1 through 13 {
      &:not(:first-child):nth-child(#{$i}) {
        top: #{($i - 1) * 20}px;
        position: absolute;
      }
    }
  }
}

.card {
  display: flex;

  width: 100px;
  height: 145px;

  border-radius: 6px;

  &:not(.closed):hover {
    // box-shadow: 0px 0px 6px 3px rgba(251, 255, 36, 0.7);
    box-shadow: 0px 0px 6px 4px rgba(251, 255, 36, 0.7);
    outline: 1px solid rgba(0, 0, 0, 0.7);
  }

  // &:not(.closed):active {
  //   border-radius: 6px;
  //   outline: 1px solid transparent !important;
  // }

  // &.closed:not(:first-child):nth-child(#{$i}) {
  //   top: #{($i - 1) * 10}px;
  //   position: absolute;
  // }

  // &:not(.closed):not(:first-child):nth-child(#{$i}) {
  //   top: #{($i - 1) * 20}px;
  //   position: absolute;
  // }

  @for $i from 1 through 13 {
    &:not(:first-child):nth-child(#{$i}) {
      top: #{($i - 2) * 20}px;
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
          <div
            class="stack card"
            @click="meth.nextCard"
            :style="meth.getCardImageStyle({ opened: false })"
          >
            <!-- <img :src="meth.getCardImage({ opened: false })" /> -->
          </div>
        </div>
        <div class="card-stack">
          <div
            draggable="true"
            class="card"
            v-if="state.cardDeck.length"
            @dragstart="meth.startDrag($event, { zone: 'deck', zoneID: -1 }, state.cardDeck[state.deckPos])"
            @dragend="meth.endDrag($event)"
            :style="meth.getCardImageStyle(state.cardDeck[state.deckPos])"
          >
            <!-- <img :src="meth.getCardImage(state.cardDeck[state.deckPos])" /> -->
          </div>
        </div>
      </div>

      <div class="finish-table">
        <div
          v-for="(cardStack, idx) in state.finishStack"
          :key="idx"
          @dragenter.prevent
          @dragover.prevent
          @drop="meth.onDropZone($event, { area: 'finish', areaID: idx })"
          class="card-stack drag-zone"
        >
          <div
            draggable="true"
            class="card"
            v-for="card in cardStack.slice(-1)"
            :style="meth.getCardImageStyle(card)"
            @dragstart="meth.startDrag($event, { zone: 'finish', zoneID: idx }, card)"
            @dragend="meth.endDrag($event)"
            :key="card.rank + card.suit"
          ></div>
        </div>
      </div>
    </div>

    <div class="table">
      <div
        class="card-stack"
        v-for="(cardStack, idx) in state.table"
        :key="idx"
        @dragenter.prevent
        @dragover.prevent
        @drop="meth.onDropZone($event, { area: 'table', areaID: idx })"
      >
        <div class="empty-place"></div>
        <div
          draggable="true"
          class="card"
          :class="[card.opened ? '' : 'closed', card]"
          v-for="card in cardStack"
          :key="card.rank + card.suit"
          :style="meth.getCardImageStyle(card)"
          @dragstart="meth.startDrag($event, { zone: 'table', zoneID: idx }, card)"
          @dragend="meth.endDrag($event)"
          @mousedown="meth.createGhost({ zone: 'table', zoneID: idx }, card)"
        >
          <!-- <img :src="meth.getCardImage(card)" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script  setup>
import { onMounted, reactive } from 'vue'
// import BoardCell from './BoardCell.vue'
// import { utils } from '../utils/utils.js'

/*

  52 карты
  по 13 карт каждой из 4 мастей

*/

const state = reactive({
  deckPos: 0,

  cardDeck: [],

  finishStack: [[], [], [], []],

  table: [[], [], [], [], [], [], []],

  dragImage: null
})

const meth = {

  createGhost(zoneData, cardData) {

    if (zoneData.zone !== 'table') return
    const stackLength = state.table[zoneData.zoneID].length
    const position = state.table[zoneData.zoneID].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

    if (position !== stackLength - 1) {
      console.log('stackLength', stackLength)
      console.log('position', position)

      const stack = state.table[zoneData.zoneID].slice(position + 1, stackLength)
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
      const stackLength = state.table[zoneData.zoneID].length
      const position = state.table[zoneData.zoneID].findIndex(item => item.suit === cardData.suit && item.rank === cardData.rank)

      if (position !== stackLength - 1) {
        console.log('stackLength', stackLength)
        console.log('position', position)

        const stack = state.table[zoneData.zoneID].slice(position + 1, stackLength)
        // console.log(stack)

        event.dataTransfer.setData('nestedCardData', JSON.stringify(stack))

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

    const ghost = document.getElementById("drag-stack")
    if (ghost) {
      ghost.remove()
      state.dragImage = null
    }
  },

  onDropZone(event, data) {
    console.log('onDrop', event, data)

    const _nestedCardStack = event.dataTransfer.getData('nestedCardData')
    let nestedCardData = null

    if (_nestedCardStack) {
      nestedCardData = JSON.parse(_nestedCardStack)
    }

    const cardData = JSON.parse(event.dataTransfer.getData('card'))
    const zoneData = JSON.parse(event.dataTransfer.getData('zone'))

    // const item = this.items.find(item => item.id == itemID)
    // item.list = list
    if (data.area === 'table') {
      const zoneLength = state.table[data.areaID].length

      if (zoneLength === 0) {
        if (cardData.rank === 13) {
          state.table[data.areaID].push(cardData)
          meth.deleteFromZone(zoneData, cardData)

          if (nestedCardData) {
            nestedCardData.forEach((item) => {
              state.table[data.areaID].push(item)
              meth.deleteFromZone(zoneData, item)
            })
          }

          console.log('onDrop:item', cardData)
        }
      }
      else {
        const lastItem = state.table[data.areaID][zoneLength - 1]

        if (!meth.checkTableCompat(lastItem.suit, cardData.suit)) return

        if (lastItem.rank === cardData.rank + 1) {
          state.table[data.areaID].push(cardData)
          meth.deleteFromZone(zoneData, cardData)

          if (nestedCardData) {
            nestedCardData.forEach((item) => {
              state.table[data.areaID].push(item)
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
      const index = state.table[zoneData.zoneID].findIndex((item) => item.suit === cardData.suit && item.rank === cardData.rank)
      state.table[zoneData.zoneID].splice(index, 1)

      const newLength = state.table[zoneData.zoneID].length

      if (newLength) state.table[zoneData.zoneID][newLength - 1].opened = true
    }

    if (zoneData.zone === 'finish') {
      const index = state.finishStack[zoneData.zoneID].findIndex((item) => item.suit === cardData.suit && item.rank === cardData.rank)

      state.finishStack[zoneData.zoneID].splice(index, 1)

      // const newLength = state.finishStack[zoneData.zoneID].length

      // if (newLength) state.finishStack[zoneData.zoneID][newLength - 1].opened = true
    }
    if (zoneData.zone === 'deck') {
      state.cardDeck.splice(state.deckPos, 1)
      if (state.deckPos >= state.cardDeck.length) state.deckPos = state.cardDeck.length - 1
      // meth.nextCard()
    }

  },

  nextCard: () => {
    if (state.deckPos === state.cardDeck.length - 1) state.deckPos = 0
    else ++state.deckPos

    state.cardDeck[state.deckPos].opened = true
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
    state.deckPos = 0
    state.cardDeck = []
    state.finishStack = [[], [], [], []]
    state.table = [[], [], [], [], [], [], []]
  },

  init: () => {

    meth.fillCardDeck()
    // console.log(state.cardDeck)

    meth.shuffleCardDeck()
    // console.log(state.cardDeck)

    meth.fillTable()
    console.log(state.cardDeck)
    console.log(state.table)

    // meth.testFillFinishTable()
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
        const card = state.cardDeck.pop()

        card.opened = (k === i)

        state.table[i].push(card)
      }
    }

    state.deckPos = state.cardDeck.length - 1
    state.cardDeck[state.deckPos].opened = true
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
  //   // state.deckPos = state.cardDeck.length - 2
  //   return state.cardDeck.pop()
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

onMounted(() => {
  meth.init()

  // const img = new Image(100, 145)
  // img.src = new URL(`../assets/cards/back.png`, import.meta.url).href

  // state.img.drawImage(img, 0, 0, img.width, img.height)
})

</script>