<script>
export default {
  props: {
    image: {
      type: Object,
    },
    coordinates: {
      type: Object,
    },
    transitions: {
      type: Object,
    },
    stencilCoordinates: {
      type: Object,
    },
  },
  emits: ['move', 'move-end', 'resize', 'resize-end'],
  computed: {
    style() {
      const { height, width, left, top } = this.stencilCoordinates
      const style = {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${left}px, ${top}px)`,
      }
      if (this.transitions && this.transitions.enabled) {
        style.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`
      }
      return style
    },
  },
  methods: {
    onMove(moveEvent) {
      this.$emit('move', moveEvent)
    },
    onMoveEnd() {
      this.$emit('move-end')
    },
    onResize(dragEvent) {
      const shift = dragEvent.shift()

      const widthResize = shift.left
      const heightResize = -shift.top

      this.$emit(
        'resize',
        new ResizeEvent(
          {
            left: widthResize,
            right: widthResize,
            top: heightResize,
            bottom: heightResize,
          },
          {
            compensate: true,
          },
        ),
      )
    },
    onResizeEnd() {
      this.$emit('resize-end')
    },
    aspectRatios() {
      return {
        minimum: 1,
        maximum: 1,
      }
    },
  },
}
</script>

<template>
  <div
    class="circle-stencil"
    :style="style"
  >
    <draggable-element
      class="circle-stencil__handler"
      @drag="onResize"
      @drag-end="onResizeEnd"
    >
      <svg
        class="circle-stencil__icon"
        xmlns="http://www.w3.org/2000/svg"
        width="26.7"
        height="26.3"
        @mousedown.prevent
      >
        <path
          fill="#FFF"
          d="M15.1 4.7L18.3 6l-3.2 3.3 2.3 2.3 3.3-3.3 1.3 3.3L26.7 0zM9.3 14.7L6 18l-1.3-3.3L0 26.3l11.6-4.7-3.3-1.3 3.3-3.3z"
        />
      </svg>
    </draggable-element>
    <draggable-area
      @move="onMove"
      @move-end="onMoveEnd"
    >
      <stencil-preview
        class="circle-stencil__preview"
        :image="image"
        :coordinates="coordinates"
        :width="stencilCoordinates.width"
        :height="stencilCoordinates.height"
        :transitions="transitions"
      />
    </draggable-area>
  </div>
</template>

<style lang="scss">
.circle-stencil {
  border-radius: 50%;
  cursor: move;
  position: absolute;
  border: dashed 2px white;
  box-sizing: border-box;
  &__handler {
    position: absolute;
    right: 15%;
    top: 14%;
    z-index: 1;
    cursor: ne-resize;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(50%, -50%);
  }
  &__preview {
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
