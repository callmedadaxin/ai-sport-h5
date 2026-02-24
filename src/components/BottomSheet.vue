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
              <button
                v-if="showClose"
                type="button"
                class="sheet-close"
                aria-label="关闭"
                @click="close"
              >
                ×
              </button>
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
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.bottom-sheet-panel {
  width: 100%;
  max-height: 85vh;
  background: #fff;
  border-radius: 0.5rem 0.5rem 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.4rem 0.3rem;
  font-size: 0.36rem;
  flex-shrink: 0;
  border-bottom: 1px solid #eee;
}
.sheet-close {
  width: 0.7rem;
  height: 0.7rem;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 0.5rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
}
.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.4rem 0.4rem;
}
.sheet-footer {
  flex-shrink: 0;
  padding: 0 0.4rem 0.4rem;
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
