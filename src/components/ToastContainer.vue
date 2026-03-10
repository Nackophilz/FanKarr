<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
            v-for="t in toasts"
            :key="t.id"
            @click="remove(t.id)"
            :class="{
            'border-[#3ae87a] text-[#3ae87a]': t.type === 'success',
            'border-[#e8513a] text-[#e8513a]': t.type === 'error',
            'border-[#3a8fe8] text-[#3a8fe8]': t.type === 'info',
          }"
            class="bg-[#0d1219] border px-4 py-3 text-xs tracking-wider cursor-pointer flex items-center gap-3 min-w-64"
        >
          <span v-if="t.type === 'success'">✓</span>
          <span v-else-if="t.type === 'error'">✕</span>
          <span v-else>·</span>
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-enter-active { transition: all 0.2s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(20px); }
.toast-leave-to   { opacity: 0; transform: translateX(20px); }
</style>