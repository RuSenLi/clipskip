<script setup lang="ts">
import { ref } from 'vue'

const startTime = ref<string>('')
const endTiem = ref<string>('')
</script>

<template>
  <ul class="timeline mb-5">
    <li class="grid-rows-1 self-center mr-1">
      <div class="timeline-start timeline-box items-center dark:bg-black">
        <input
          type="text"
          placeholder="label"
          class="w-14 outline-none dark:bg-black"
        >
      </div>
    </li>
    <li class="grid-rows-1">
      <div class="timeline-start timeline-box dark:bg-black">
        <input
          v-model="startTime"
          type="text"
          placeholder="00:00:00"
          class="w-12 outline-none dark:bg-black"
        >
      </div>
      <div class="timeline-middle">
        <bi-clock-fill class="siez-5 text-primary" />
      </div>
      <hr :class="startTime && 'bg-primary'">
    </li>
    <li class="grid-rows-1">
      <hr :class="startTime && 'bg-primary'">
      <div class="timeline-start timeline-box dark:bg-black py-1 self-center">
        <input
          type="text"
          placeholder="20 S"
          class="w-8 outline-none dark:bg-black"
        >
      </div>
      <div class="timeline-middle">
        <mingcute-arrows-right-fill class="text-primary" />
      </div>
      <hr :class="endTiem && 'bg-primary'">
    </li>
    <li class="grid-rows-1">
      <hr :class="endTiem && 'bg-primary'">
      <div class="timeline-start timeline-box dark:bg-black">
        <input
          v-model="endTiem"
          placeholder="00:00:20"
          type="text"
          class="w-12 outline-none dark:bg-black"
        >
      </div>
      <div class="timeline-middle">
        <bi-clock-fill class="siez-5 text-primary" />
      </div>
    </li>
  </ul>
</template>
