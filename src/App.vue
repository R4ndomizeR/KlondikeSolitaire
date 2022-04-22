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
  <TheBoard />
</template>

<script setup>
import TheBoard from './components/TheBoard.vue'
</script>