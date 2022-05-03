<style lang="scss" scoped>
.board-wrap {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  align-content: center;
  height: inherit;

  background-color: #0e8938;
  box-shadow: 0px 0px 60px 27px rgb(0 0 0 / 67%) inset;

  padding: $stack-gap * 5 0 $stack-gap 0;
}

.board {
  width: fit-content;
  height: inherit;

  display: flex;
  // justify-content: center;
  flex-direction: column;
  align-items: stretch;
  gap: $stack-gap * 1.5;

  // margin-top: $stack-gap * 5;
}

.board-top {
  display: flex;
  justify-content: space-between;
}

// ------

.deck-table {
  position: relative;

  display: flex;
  gap: $stack-gap;
}

.finish-table {
  position: relative;

  display: flex;
  flex-direction: row;
  gap: $stack-gap;
}

.stacks-table {
  position: relative;

  height: auto; // 500px

  display: flex;
  flex-direction: row;
  justify-content: center;

  gap: $stack-gap;
}

// ------

.deck-stack {
  position: relative;

  width: $card-w;
  height: $card-h;

  &:hover {
    box-shadow: 0px 0px 6px 4px rgba(251, 255, 36, 0.7);
    outline: 1px solid rgba(0, 0, 0, 0.7);
    border-radius: $card-radius;
  }
}

.deck-circle {
  position: absolute;

  width: 80px * $mult;
  height: 80px * $mult;

  left: 50%;
  top: 50%;

  z-index: 0;
  transform: translate(-50%, -50%);

  border: 10px solid #006203;
  filter: drop-shadow(0 0 15px #00ff08bc);

  // box-shadow: inset 0px 0px 20px 3px rgb(255 255 255 / 44%), 0px 0px 20px 3px rgb(255 255 255 / 44%);
  border-radius: 50%;
}

.deck-card {
  z-index: 1;
}

// ------

.board-drag {
  pointer-events: none;
  position: fixed;
  left: 0px;
  top: 0px;
}

.board-help {
  // margin-bottom: 20px;

  width: -webkit-fill-available;

  display: flex;
  flex-direction: column;
}

.help-item{
  text-shadow: 0 0 5px rgb(0, 0, 0);
  display: flex;
  gap: 10px;
}
.help-hotkey {
  flex: 1;

  color: rgb(239, 239, 239);
  font: normal 500 14px 'Segoe UI';

  text-align: end;
}
.help-desc {
  flex: 1;

  color: rgb(159, 199, 255);
  font: normal 500 14px 'Segoe UI';
}
</style>

<template>
  <div class="board-wrap" v-cloak v-if="state.isReady" @mousedown.right.prevent="meth.handlerRightClickBoard($event)" @contextmenu.prevent>

    <div class="board" >
      <div class="board-top">

        <div class="deck-table">

          <div class="deck-stack" @click="meth.popNextDeckCard()">
            <Card class="deck-card" v-if="state.stacks.deck[0].length" />
            <div class="deck-circle"></div>
          </div>

          <div>
            <Card
              v-for="(card, idx) in state.stacks.deck[1]"
              :key="game.meth.getKey(card)"
              :card-data="card"
              :card-index="idx"
              :is-collapsed="true"
              :is-draggable="true"
              :is-droppable="false"
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
    </div>

    <div class="board-drag" v-if="draggable.state.isDragActive" :style="dragPositionStyle">
      <StackCards
        :is-collapsed="false"
        :is-draggable="false"
        :is-droppable="false"
        :stack-data="draggable.state.dragStack"
      />
    </div>

    <div class="board-help">
      <div class="help-item">
        <span class="help-hotkey">Ctrl + Z</span>
        <span class="help-desc">Undo the last move</span>
      </div>
      <div class="help-item">
        <span class="help-hotkey">Right-click on a card</span>
        <span class="help-desc">Move a card to the foundation</span>
      </div>
      <div class="help-item">
        <span class="help-hotkey">Right-click on the background</span>
        <span class="help-desc">Move all available cards to the foundations</span>
      </div>
    </div>

  </div>
</template>

<script  setup>
import { computed, onBeforeMount, onMounted, ref, watch, watchEffect } from 'vue'
// import { throttleFilter, watchThrottled } from '@vueuse/core'

import StackCards from './StackCards.vue'
import Card from './Card.vue'

import game from '@/store/game'
import draggable from '@/store/draggable'

const { state, meth } = game

const dragPositionStyle = computed(() => {
  return `transform: translate(${draggable.state.dragPos.x}px, ${draggable.state.dragPos.y}px);`
  // return `left:${x.value}px; top:${y.value}px;`
})

onBeforeMount(()=> {
  game.state.suits.forEach(suit => {
    for (let rank = 1; rank <= 13; rank++) {
      let el = document.createElement('img')
      el.src = new URL(`../assets/images/cards/${rank}${suit}.png`, import.meta.url).href
      // el = null
    }
  })
})

onMounted(() => {
  meth.resetState()

  meth.initState()
  // meth.testFinish()

  document.addEventListener('keydown', meth.loadPrevState)

  meth.setReady(true)
})

onBeforeMount(() => {
  document.removeEventListener('keydown', meth.loadPrevState)
})

// const x = ref(0)
// const y = ref(0)

// watchThrottled(
//   draggable.state.dragPos,
//   (pos) => {
//     x.value = pos.x
//     y.value = pos.y
//   },
//   { eventFilter: throttleFilter(10),},
// )
// watch(
//   draggable.state.dragPos,
//   (pos) => {
//     // console.log(pos)
//     x.value = pos.x
//     y.value = pos.y
//   }
// )
// const drag = ref(null)
// watchEffect(() => {
//   draggable.meth.setDragElement(drag.value)
// }, {
//   flush: 'post'
// })
</script>