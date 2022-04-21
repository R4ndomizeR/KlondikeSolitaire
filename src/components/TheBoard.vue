<style lang="scss">
// img {
//   pointer-events: none;
// }

.board {
  // position: relative;
}

.board-top {
  display: flex;
  justify-content: space-between;
}

.board-bottom {
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

.card-stack {
  position: relative;
  width: $card-w;

  // margin-left: 10px;
}


.deck-card {
  display: flex;

  width: $card-w;
  height: $card-h;

  border-radius: 6px;

  &:hover {
    // box-shadow: 0px 0px 6px 3px rgba(251, 255, 36, 0.7);
    box-shadow: 0px 0px 6px 4px rgba(251, 255, 36, 0.7);
    outline: 1px solid rgba(0, 0, 0, 0.7);
  }
}

.board-drag {
  pointer-events: none;
  position: fixed;
  top: -1000px;

  .drag-stack {
    width: $card-w;

    .drag-card {
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
}
</style>

<template>
  <div class="board" v-cloak v-if="state.isReady">

    <div class="board-top">

      <div class="deck-table">
        <div class="card-stack">
          <Card class="deck-card" @click="meth.popNextDeckCard()" />
        </div>

        <div class="card-stack">
          <Card
            v-for="(card, idx) in state.stacks.deck[1]"
            :key="game.meth.getKey(card)"
            :is-collapsed="true"
            :is-draggable="true"
            :is-droppable="false"
            :card-data="card"
            :card-index="idx"
            :zone-data="{ name: 'deck', id: 1 }"
          />
        </div>
      </div>

      <div class="finish-table">
        <StackCards
          v-for="(stack, idx) in state.stacks.finish"
          :key="idx"
          :is-collapsed="true"
          :is-draggable="true"
          :is-droppable="true"
          :stack-data="stack"
          :zone-data="{ name: 'finish', id: idx }"
        />
      </div>

    </div>

    <div class="board-bottom">

      <div class="stacks-table">
        <StackCards
          v-for="(stack, idx) in state.stacks.table"
          :key="idx"
          :is-draggable="true"
          :is-droppable="true"
          :stack-data="stack"
          :zone-data="{ name: 'table', id: idx }"
        />
      </div>

    </div>

    <div class="board-drag" ref="drag">
      <!-- v-if="draggable.state.isDragActive" -->
      <div class="drag-stack" >
        <Card
          class="drag-card"
          v-for="card in draggable.state.dragStack"
          :key="game.meth.getKey(card)"
          :card-data="card"
          :is-collapsed="false"
          :is-draggable="false"
          :is-droppable="false"
          :zone-data="{name:'zzz', id:game.meth.getKey(card)}"
        />
        <!-- draggable.state.dragZoneData -->
      </div>
      <!-- <StackCards :stack-data="draggable.state.dragStack" /> -->
    </div>

  </div>
</template>

<script  setup>
import { onMounted, ref, watchEffect } from 'vue'
import game from '@/store/game'
import draggable from '@/store/draggable'
import StackCards from './StackCards.vue'
import Card from './Card.vue'

const { state, meth } = game

const drag = ref(null)

watchEffect(() => {
  draggable.meth.setDragElement(drag.value)
}, {
  flush: 'post'
})

onMounted(() => {
  meth.resetState()
  meth.initState()
})
</script>