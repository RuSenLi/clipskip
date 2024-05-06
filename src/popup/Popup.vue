<script setup lang="ts">
import { sendMessage } from "webext-bridge/popup";
import { storageselectedOption, storagePageOptions } from "~/logic/storage";
import { ref, markRaw, computed } from "vue";
import type {
  PageOption,
  ComboboxOption,
  SelectedOption,
  TimeLineOption,
} from "~/components/types";

const selected = ref<SelectedOption>({ url: "", label: "" });
const pageOptions = ref<PageOption[]>([]);
const timeLineOption = ref<TimeLineOption[]>([{ startTime: "", endTime: "" }]);

const saveStatus = {
  loading: markRaw(IconSvgSpinnersRingResize),
  info: markRaw(IconFluentSave24Regular),
  success: markRaw(IconLineMdCircleTwotoneToConfirmCircleTwotoneTransition),
};
const saveIcon = ref(saveStatus.info);

async function getCurrentOption() {
  try {
    const { url } = await sendMessage("get-current-tab", {});

    if (pageOptions.value.length === 0) {
      pageOptions.value.push({
        id: url,
        comboboxOption: {
          value: url,
          label: "current page",
        },
      });

      selected.value = {
        url,
        label: "current page",
      };
    }

    console.log("url: ", url);
  } catch (error) {
    console.error(error);
  }
}
getCurrentOption();

const comboboxOptions = computed<ComboboxOption[]>(() =>
  pageOptions.value.map((item) => item.comboboxOption)
);

async function savePageOptions() {
  saveIcon.value = saveStatus.loading;
  await new Promise((resolve) =>
    setTimeout(() => {
      saveIcon.value = saveStatus.success;
      resolve(null)
    }, 1000)
  );
  
  setTimeout(() => {
    if (saveIcon.value.name === saveStatus.success.name) {
      saveIcon.value = saveStatus.info;
    }
  }, 1500);
}
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
      <arcticons-earth
        class="size-9 text-info icon-btn"
        @click="getCurrentOption"
      />
      <Combobox
        class="mx-2 grow"
        v-model:selected="selected.url"
        v-model:label="selected.label"
        v-model:options="comboboxOptions"
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
      <TimeLine v-model:options="timeLineOption" />
    </div>
    <div>
      <button
        @click="savePageOptions"
        class="btn btn-block bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-200 dark:bg-gradient-to-r dark:from-cyan-600 dark:to-purple-600"
        :class="saveIcon.name === saveStatus.loading.name && 'btn-disabled opacity-70'"
      >
        <component
          :is="saveIcon"
          class="text-lg"
          :class="saveIcon.name === saveStatus.success.name && 'text-green-500'"
        />
        <span class="text-xl">Save</span>
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
