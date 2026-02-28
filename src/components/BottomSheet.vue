<template>
  <Teleport to="body">
    <Transition name="sheet-fade">
      <div v-show="modelValue" class="bottom-sheet-mask" @click.self="close">
        <Transition name="sheet-slide">
          <div v-show="modelValue" class="bottom-sheet-panel" :style="panelStyle">
            <div v-if="$slots.title || title" class="sheet-head">
              <slot name="title">
                <span>{{ title }}</span>
              </slot>
              <slot name="close">
                <span></span>
              </slot>
            </div>
            <div class="sheet-body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="sheet-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  showClose: { type: Boolean, default: true },
  maxHeight: { type: String, default: '85vh' },
})

const emit = defineEmits(['update:modelValue', 'close'])

const panelStyle = computed(() => ({ maxHeight: props.maxHeight }))

function close() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.bottom-sheet-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.bottom-sheet-panel {
  width: 100%;
  max-height: 85vh;
  background: linear-gradient(196deg, #ff4029 24.33%, #ff4d38 52.77%, #ff6350 81.21%);
  border-radius: 0.3rem 0.3rem 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0.14rem;
}
.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 0.35rem;
  line-height: 0.35rem;
  font-size: 0.16rem;
  color: #fff;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 0.07rem;
}
.sheet-close {
  width: 0.35rem;
  height: 0.35rem;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 0.25rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
}
.sheet-body {
  flex: 1;
  overflow-y: hidden;
  padding: 0 0.1rem 0.1rem;
  background: #fff;
  border-radius: 0.2rem;
}
.sheet-footer {
  flex-shrink: 0;
  padding: 0 0.2rem 0.2rem;
}
.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}
.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: transform 0.25s ease-out;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
}
</style>
