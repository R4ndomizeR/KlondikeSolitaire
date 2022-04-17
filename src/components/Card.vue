<style lang="scss" scoped>
.card {
  display: flex;

  width: $card-w;
  height: $card-h;

  border-radius: 6px;

  position: absolute;

  &.hidden {
    opacity: 0.01;
  }

  &.collapsed {
    top: 0 !important;
  }

  &:not(.closed):hover {
    // box-shadow: 0px 0px 6px 3px rgba(251, 255, 36, 0.7);
    box-shadow: 0px 0px 6px 4px rgba(251, 255, 36, 0.7);
    outline: 1px solid rgba(0, 0, 0, 0.7);
  }

  @for $i from 1 through 13 {
    &:not(:first-child):nth-child(#{$i}) {
      top: #{($i - 2) * 20}px;
    }
  }
}
</style>

<template>
  <div :class="[props.cardData.hidden ? 'hidden' :'', props.cardData.opened ? '' : 'closed', props.isCollapsed ? 'collapsed' : '', 'card']"
    :draggable="props.isDraggable" :style="meth.getCardImageStyle(props.cardData)" @dragend="meth.endDrag($event)"
    @dragstart="meth.startDrag($event, { zone: props.zoneName, zoneID: props.zoneId }, props.cardData)"
    @mousedown="meth.createGhost({ zone: props.zoneName, zoneID: props.zoneId }, props.cardData)">
  </div>
</template>

<script  setup>
import game from '@/store/game'

const { state, meth } = game

const props = defineProps({
  isDraggable: {
    type: Boolean,
    default: true
  },
  isCollapsed: {
    type: Boolean,
    default: false
  },
  zoneName: {
    type: String,
    default: ''
  },
  zoneId: {
    type: Number,
    default: -1
  },
  cardData: {
    type: Object,
    default: () => {
      return {
        suit: 0, // масть: 1..4
        rank: 0, // достоинство: 1..13
        opened: false,
        hidden: false,
      }
    }
  }
})
</script>