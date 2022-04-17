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
    @drop="meth.onDropZone($event, { area: zoneName, areaID: zoneId })"
    class="card-stack"
  >
    <!-- <div
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
      :key="meth.getKey(card)"
      :card-data="card"
      :is-draggable="props.isDraggable"
      :zone-id="props.zoneId"
      :zone-name="props.zoneName"
    />

  </div>
</template>

<script  setup>
import game from '@/store/game'
import Card from './Card.vue'
import { onMounted } from 'vue'

const { state, meth } = game

const props = defineProps({
  zoneName: {
    type: String,
    default: ''
  },
  zoneId: {
    type: Number,
    default: -1
  },
  isDroppable: {
    type: Boolean,
    default: false
  },
  isDraggable: {
    type: Boolean,
    default: true
  },
  stackData: {
    type: Array,
    default: () => []
  }
})

onMounted(() => {

})

</script>

