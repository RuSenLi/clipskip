<script lang="ts" setup>
import { watchEffect } from 'vue'
import { storageTheme } from '~/logic/storage'

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', storageTheme.value)
})

function switchTheme(e: Event) {
  storageTheme.value = (e.target as HTMLInputElement).checked
    ? 'dark'
    : 'light'
}
</script>

<template>
  <div>
    <label class="swap swap-rotate">
      <input
        type="checkbox"
        class="theme-controller"
        :checked="storageTheme === 'dark'"
        @change="switchTheme"
      >
      <material-symbols-wb-sunny-outline-rounded
        class="swap-off fill-current size-8"
      />
      <line-md-sunny-filled-loop-to-moon-filled-transition
        class="swap-on fill-current size-8"
      />
    </label>
  </div>
</template>

<style scoped></style>
