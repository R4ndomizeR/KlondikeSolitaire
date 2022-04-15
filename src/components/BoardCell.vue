<style lang="scss" scoped>
.cell {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  font: normal 600 14px Arial;

  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.5);

  box-shadow: 0px 0px 0px 1px #3d5cd67b;
}

.bomb {
  background-size: cover;
  background-image: url("@/assets/bomb.png");
}

.flag {
  // background: none !important;
  background-size: cover !important;
  background-image: url("@/assets/flag.png") !important;
}

.not-opened {
  // background: radial-gradient(circle, rgba(61,130,214,1) 0%, rgba(61,92,214,1) 50%, rgba(69,61,214,1) 100%);
  background: linear-gradient(
    0deg,
    rgba(61, 130, 214, 1) 0%,
    rgb(61, 92, 214) 50%,
    rgba(69, 61, 214, 1) 100%
  );

  &:hover {
    cursor: pointer;

    background: linear-gradient(
      0deg,
      rgba(61, 130, 214, 0.5) 0%,
      rgba(61, 92, 214, 0.5) 50%,
      rgba(69, 61, 214, 0.5) 100%
    );
  }

  &:active {
    cursor: pointer;

    background: linear-gradient(
      0deg,
      rgba(61, 130, 214, 0.75) 0%,
      rgba(61, 92, 214, 0.75) 50%,
      rgba(69, 61, 214, 0.75) 100%
    );
  }
}

.opened-number- {
  &1 {
    color: blue;
  }

  &2 {
    color: green;
  }

  &3 {
    color: red;
  }

  &4 {
    color: rgb(0, 0, 94);
  }

  &5 {
    color: rgb(139, 19, 19);
  }

  &6 {
    color: rgb(0, 128, 53);
  }

  &7 {
    color: rgb(0, 0, 94);
  }

  &8 {
    color: rgb(139, 19, 19);
  }
}
</style>

<template>
  <div
    @click.right.prevent
    :class="[getColorClass(data.value), 'cell']"
    v-if="data.opened"
  >{{ getNumber(data.value) }}</div>

  <div
    @click.left="$emit('left-click')"
    @click.right.prevent="$emit('right-click')"
    :class="[data.marked ? 'flag' : '', 'cell', 'not-opened']"
    v-else
  ></div>
</template>

<script  setup>
defineProps({
  data: {
    opened: {
      type: Boolean,
      default: false
    },

    marked: {
      type: Boolean,
      default: false
    },

    value: {
      type: Number,
      default: 0
    }
  }
})


function getColorClass(val) {
  if (val < 0) return 'bomb'
  if (val > 0) return `opened-number-${val}`
}

function getNumber(val) {
  return val > 0 ? val : ''
}
</script>