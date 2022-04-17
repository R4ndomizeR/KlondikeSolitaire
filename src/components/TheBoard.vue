<style lang="scss">
// img {
//   pointer-events: none;
// }

.board-top {
  display: flex;
  justify-content: space-between;
}

.board-bottom{
  margin-top: 30px;
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
  <div class="board" v-cloak v-if="state.isReady">

    <div class="board-top">

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
            :is-droppable="false"
            zone-name="deck"
          />
        </div>
      </div>

      <div class="finish-table">
        <StackCards
          v-for="(stack, idx) in state.finishStack"
          :key="idx"
          :is-draggable="true"
          :is-droppable="true"
          :is-collapsed="true"
          :stack-data="stack"
          :zone-id="idx"
          zone-name="finish"
        />
      </div>

    </div>

    <div class="board-bottom">

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
      </div>

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