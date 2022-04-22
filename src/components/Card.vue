<style lang="scss" scoped>
.card {
  position: absolute;

  width: $card-w;
  height: $card-h;

  border-radius: $card-radius;
  // image-rendering: -webkit-optimize-contrast;

  &.hidden {
    opacity: 0.01;
  }

  &.collapsed {
    top: 0 !important;
  }

  &:not(.closed) {
    outline: 1px solid rgba(0, 0, 0, 0.7);
  }

  &:not(.closed):hover {
    box-shadow: 0px 0px 6px 4px rgba(251, 255, 36, 0.7);
  }

  @for $i from 1 through 13 {
    &:nth-child(#{$i}) {
      top: #{($i - 1) * 20}px;
    }
  }
}
</style>

<template>
  <div
    :class="getClassesList"
    :style="getCardImageStyle"

    :draggable="props.isDraggable"

    @drag="onDragHandleThrottle"
    @dragend="draggable.meth.handlerEndDrag($event)"
    @dragstart="draggable.meth.handlerStartDrag($event, props.zoneData, props.cardData, props.cardIndex)"

    @mousedown.left="props.isDraggable ? draggable.meth.handlerMouseDown($event, props.zoneData, props.cardData, props.cardIndex) : null"
    @mouseup.left="props.isDraggable ? draggable.meth.handlerMouseUp($event) : null"

    @mousedown.right.prevent.stop="draggable.meth.handlerRightClick($event, props.zoneData, props.cardData, props.cardIndex)"
  >
  </div>
</template>

<script  setup>
import { computed } from 'vue'
import draggable from '@/store/draggable'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

const props = defineProps({
  isDraggable: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  },
  cardIndex: {
    type: Number,
    default: -1
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
  cardData: {
    type: Object,
    default: () => {
      return {
        suit: 0, // масть: 1..4
        rank: 0, // достоинство: 1..13
        closed: true,
        hidden: false,
      }
    }
  }
})

const onDragHandle = (event) => {
  // @drag="draggable.meth.handlerDrag($event)"
  draggable.meth.handlerDrag(event)
}

const onDragHandleThrottle = useThrottleFn((event) => {
  draggable.meth.handlerDrag(event)
}, 1000 / 74)

const getCardImage = computed(() => {
  /*
    Clubs - Трефы (ч)
    Diamonds - Бубны (к)
    Spades - Пики (ч)
    Hearts - Червы (к)
  */
  const suits = ['c', 'd', 's', 'h']

  if (props.cardData.closed) return new URL(`../assets/cards/back.png`, import.meta.url).href

  return new URL(`../assets/cards/${props.cardData.rank}${suits[props.cardData.suit - 1]}.png`, import.meta.url).href
})

const getCardImageStyle = computed(() => {
  return `background: url(${getCardImage.value}); background-size: cover;`
})

const getClassesList = computed(() => {
  return [
    'card',
    props.cardData.hidden ? 'hidden' : '',
    props.cardData.closed ? 'closed' : '',
    props.isCollapsed ? 'collapsed' : '',
  ]
})
</script>