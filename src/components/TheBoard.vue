<style lang="scss" scoped>
// .main {
//   // width: 1360px;
//   // height: 800px;
// }

// img {
//   pointer-events: none;
// }

.top {
  display: flex;
  justify-content: space-between;
}

.deck-table {
  position: relative;
  display: flex;
  gap: $gap;
}

.finish-table {
  position: relative;
  display: flex;
  flex-direction: row;

  gap: $gap;
}

.stacks-table {
  margin-top: 30px;

  height: auto; // 500px

  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;

  gap: $gap;
}

.deck-card {
  display: flex;

  width: $card-w;
  height: $card-h;

  border-radius: 6px;
}

// .card-stack {
//   position: relative;
//   width: $card-w;

//   // margin-left: 10px;
// }

// .empty-place {
//   display: block;
//   position: absolute;
//   width: $card-w;
//   height: $card-h;
//   top: 0;

//   outline: 1px solid rgb(0 0 0 / 50%);
//   border-radius: 6px;
//   box-shadow: 0px 0px 20px 5px rgb(0 0 0 / 19%) inset;
// }

// .drag-zone {
//   width: $card-w;
//   height: $card-h;

//   outline: 1px solid rgb(0 0 0 / 50%);
//   border-radius: 6px;
//   box-shadow: 0px 0px 20px 5px rgb(0 0 0 / 19%) inset;
// }

// .card {
//   display: flex;

//   width: $card-w;
//   height: $card-h;

//   border-radius: 6px;

//   &:not(.closed):hover {
//     // box-shadow: 0px 0px 6px 3px rgba(251, 255, 36, 0.7);
//     box-shadow: 0px 0px 6px 4px rgba(251, 255, 36, 0.7);
//     outline: 1px solid rgba(0, 0, 0, 0.7);
//   }

//   @for $i from 1 through 13 {
//     &:not(:first-child):nth-child(#{$i}) {
//       top: #{($i - 2) * 20}px;
//       position: absolute;
//     }
//   }
// }

.drag-stack {
  width: $card-w;

  .card-stack {
    display: flex;

    width: $card-w;
    height: $card-h;

    border-radius: 6px;

    @for $i from 1 through 13 {
      &:not(:first-child):nth-child(#{$i}) {
        top: #{($i - 1) * 20}px;
        position: absolute;
      }
    }
  }
}
</style>

<template>
  <div class="main" v-cloak v-if="state.isReady">
    <div class="top">
      <div class="deck-table">
        <div class="card-stack">
          <div class="deck-card" @click="meth.nextCard" :style="meth.getCardImageStyle({ opened: false })">
          </div>
        </div>
        <div class="card-stack">
          <Card
            v-if="state.deckStack.length"
            :key="meth.getKey(state.deckStack[state.deckPosition])"
            :card-data="state.deckStack[state.deckPosition]"
            :is-draggable="true"
            :zone-id="0"
            zone-name="deck"
          />
          <!-- <div
            draggable="true"
            class="card"
            v-if="state.cardDeck.length"
            @dragstart="meth.startDrag($event, { zone: 'deck', zoneID: -1 }, state.cardDeck[state.deckPos])"
            @dragend="meth.endDrag($event)"
            :style="meth.getCardImageStyle(state.cardDeck[state.deckPos])"
          ></div>-->
        </div>

      </div>

      <div class="finish-table">
        <StackCards
          v-for="(stack, idx) in state.finishStack"
          :key="idx"
          :is-draggable="true"
          :is-droppable="true"
          :stack-data="stack"
          :zone-id="idx"
          zone-name="finish"
        />
        <!-- <div
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
            :key="meth.getKey(card)"
          ></div>
        </div>-->
      </div>
    </div>

    <div class="stacks-table">
      <StackCards
        v-for="(stack, idx) in state.tableStack"
        :key="idx"
        :is-draggable="true"
        :is-droppable="true"
        :stack-data="stack"
        :zone-id="idx"
        zone-name="table"
      />

      <!-- <div
        class="card-stack"
        v-for="(cardStack, idx) in state.table"
        :key="idx"
        @dragenter.prevent
        @dragover.prevent
        @drop="meth.onDropZone($event, { area: 'table', areaID: idx })"
      >
      <div class="empty-place"></div>-->
      <!-- <div
          draggable="true"
          class="card"
          :class="[card.opened ? '' : 'closed', 'card']"
          v-for="card in cardStack"
          :key="meth.getKey(card)"
          :style="meth.getCardImageStyle(card)"
          @dragstart="meth.startDrag($event, { zone: 'table', zoneID: idx }, card)"
          @dragend="meth.endDrag($event)"
          @mousedown="meth.createGhost({ zone: 'table', zoneID: idx }, card)"
        >
      </div>-->
      <!-- </div> -->
    </div>
  </div>
</template>

<script  setup>
import { onMounted } from 'vue'
import game from '@/store/game'
import StackCards from './StackCards.vue'
import Card from './Card.vue'

const { state, meth } = game


onMounted(() => {
  meth.init()
})

</script>