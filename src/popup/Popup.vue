<script setup lang="ts"></script>

<template>
  <header>
    <div class="divider-colorful" />
    <Theme class="flex justify-end my-2 mr-2" />
  </header>
  <main class="w-[400px] h-[400px] p-2 text-gray-700">
    <div class="flex flex-wrap items-end mb-3">
      <arcticons-earth
        class="size-9 text-info transition hover:cursor-pointer active:scale-90"
      />
      <Combobox class="mx-2 grow" />
      <button class="btn btn-sm btn-info h-9">
        <tabler-plus />
      </button>
    </div>
  </main>
</template>

<style>
.divider-colorful {
  border: 2px solid;
  border-image-source: linear-gradient(
    90deg,
    #fb0301,
    #fb0301 25%,
    #fbbb06,
    #34a653,
    #206ace 75%
  );
  border-image-slice: 1;
}
</style>
