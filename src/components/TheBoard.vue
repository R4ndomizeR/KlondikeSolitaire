<style lang="scss">
// img {
//   pointer-events: none;
// }

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
  position: absolute;
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
          <Card class="deck-card" @click="meth.iterateNextDeckCard" />
        </div>

        <div class="card-stack">
          <Card
            v-if="state.deckStack.length"
            :key="meth.getKey(state.deckStack[state.deckPosition])"
            :card-data="state.deckStack[state.deckPosition]"
            :is-draggable="true"
            :is-droppable="false"
            :zone-data="{ name:'deck' }"
          />
        </div>
      </div>

      <div class="finish-table">
        <StackCards
          v-for="(stack, idx) in state.finishStack"
          :key="idx"
          :is-collapsed="true"
          :is-draggable="true"
          :is-droppable="true"
          :stack-data="stack"
          :zone-data="{ name:'finish', id: idx }"
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
          :zone-data="{ name:'table', id: idx }"
        />
      </div>

    </div>

    <div class="board-drag" ref="drag">
      <StackCards
        v-for="(stack, idx) in draggable.state.dragStack"
        :key="idx"
        :stack-data="stack"
      />
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
  meth.initState()
})

</script>