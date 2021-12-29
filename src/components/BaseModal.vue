<template>
  <transition name="modal-anim" appear>
    <div
      v-if="show"
      class="absolute inset-0 flex justify-center items-center h-full w-full bg-black/40 z-10"
    >
      <transition name="modal-anim-inner" appear>
        <div
          v-if="show"
          class="relative -top-1/4 bg-white rounded-lg flex flex-col w-3/4 items-center p-2 z-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 text-red-500 self-end"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            @click="$emit('close')"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <div class="w-full pt-0 p-2">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "BaseModal",
  props: ['show'],
  emits: ['close']
}
</script>

<style>
.modal-anim-enter-active,
.modal-anim-leave-active {
  transition: opacity 0.2s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-anim-enter-from,
.modal-anim-leave-to {
  opacity: 0;
}

.modal-anim-inner-enter-active {
  transition: all 0.2s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.1s;
}

.modal-anim-inner-leave-active {
  transition: all 0.2s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-anim-inner-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-anim-inner-leave-to {
  transform: scale(0.9);
}
</style>