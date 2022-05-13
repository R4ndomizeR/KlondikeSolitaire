<style>
[v-cloak]>* {
  display: none;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: inherit;
  height: inherit;
}
</style>

<template>
  <WinFirework v-if="game.meth.getWin.value" />
  <TheBoard />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import TheBoard from './components/TheBoard.vue'
import WinFirework from './components/WinFirework.vue'
import game from './store/game'

// onMounted(()=> {
//   console.log(game.meth.getWin.value)

//   setTimeout(() => {
//     game.meth.setWin(true)
//   }, 1000);
// })
</script>