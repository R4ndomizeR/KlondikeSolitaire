<style>
/* * {
  overflow: hidden;
} */

[v-cloak] > * {
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
  display: flex;
  align-items: flex-start; /* center */
  justify-content: center;
  padding-top: 100px;
  height: 100%;

  background-color: #0e8938;
  box-shadow: 0px 0px 60px 27px #000000ab inset;
}
</style>

<template>
  <TheBoard />
</template>

<script setup>
import TheBoard from './components/TheBoard.vue'
</script>