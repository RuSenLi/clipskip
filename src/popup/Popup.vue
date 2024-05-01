<script setup lang="ts">
import { sendMessage } from "webext-bridge/popup";
import { storageSelectedUrl, storageComboboxOptions } from "~/logic/storage";

async function getTabUrl() {
  try {
    const { url } = await sendMessage("get-current-tab", {});
    const currentOption = storageComboboxOptions.value.find(
      (i) => i.value === url
    );
    if (!currentOption) {
      storageComboboxOptions.value[0] = { value: url, label: "current page" };
    } else {
      storageSelectedUrl.value = currentOption.value;
    }
    storageSelectedUrl.value = url;
  } catch (error) {
    console.error(error);
  }
}
getTabUrl();
</script>

<template>
  <header>
    <div class="divider-colorful" />
    <div class="flex flex-wrap items-center justify-end p-2 space-x-3">
      <a
        rel="noreferrer"
        href="https://github.com/RuSenLi/clipskip"
        target="_blank"
        title="GitHub"
      >
        <bi-github class="size-7 icon-btn text-zinc-500 dark:text-zinc-400" />
      </a>
      <Theme class="flex items-center" />
    </div>
  </header>
  <main class="w-[400px] h-[410px] p-2 flex flex-col">
    <div class="flex flex-wrap items-end">
      <arcticons-earth class="size-9 text-info icon-btn" @click="getTabUrl" />
      
      <Combobox
        class="mx-2 grow"
        v-model:selected="storageSelectedUrl"
        v-model:options="storageComboboxOptions"
      />
      <!-- <button class="btn btn-sm btn-success box-border h-9 text-zinc-50">
        <mingcute-check-2-fill class="text-xl" />
      </button> -->
      <div
        class="tooltip tooltip-error before:-left-5 before:text-zinc-50 before:tracking-widest"
        data-tip="未找到视频，请重试"
      >
        <button
          class="btn btn-sm h-9 box-border bg-red-500 text-zinc-50 hover:bg-red-600"
        >
          <mdi-refresh class="text-xl" />
        </button>
      </div>
    </div>
    <div
      class="flex-1 z-10 overflow-y-auto border rounded-md shadow-md my-3 p-2 dark:border-indigo-400"
    >
      <TimeLine />
    </div>
    <div>
      <button
        class="btn btn-block bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-200 dark:bg-gradient-to-r dark:from-cyan-600 dark:to-purple-600"
      >
        <fluent-save-24-regular class="text-lg" />
        <span class="text-xl">save</span>
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
