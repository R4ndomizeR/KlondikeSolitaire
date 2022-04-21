<style lang="scss" scoped>
.card-stack {
  position: relative;
  width: $card-w;

  // margin-left: 10px;
}

.drag-zone {
  display: block;
  position: absolute;
  width: $card-w;
  height: $card-h;
  top: 0;

  // outline: 1px solid rgb(0 0 0 / 50%);
  // border-radius: 6px;
  // box-shadow: 0px 0px 20px 5px rgb(0 0 0 / 19%) inset;
}

.card-place {
  width: $card-w;
  height: $card-h;

  outline: 1px solid rgb(0 0 0 / 50%);
  border-radius: 6px;
  box-shadow: 0px 0px 20px 5px rgb(0 0 0 / 19%) inset;
}
</style>

<template>
  <div
    @dragenter.prevent
    @dragover.prevent
    @drop="props.isDroppable ? draggable.meth.handleDropZone($event, props.zoneData) : null"
    class="card-stack"
  >
    <!-- <div
      :class="[props.isDroppable ? 'droppable' : '', 'card-stack']"
      v-if="props.isDroppable"
      @dragenter.prevent
      @dragover.prevent
      @drop="meth.onDropZone($event, { area: zoneName, areaID: zoneId })"
      class="drag-zone"
    ></div> -->

    <div class="card-place">
    </div>

    <Card
      v-for="card in props.stackData"
      :key="game.meth.getKey(card)"

      :is-draggable="props.isDraggable"
      :is-collapsed="props.isCollapsed"
      :zone-data="props.zoneData"
      :card-data="card"
    />

  </div>
</template>

<script  setup>
import Card from './Card.vue'
import draggable from '@/store/draggable'
import game from '@/store/game'

const props = defineProps({
  isDroppable: {
    type: Boolean,
    default: false
  },
  isDraggable: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  },
  zoneData: {
    type: Object,
    default: () => {
      return {
        name: '',
        id: -1
      }
    }
  },
  stackData: {
    type: Array,
    default: () => []
  }
})

</script>

