<script setup lang="ts">
import { sendMessage } from "webext-bridge/popup";
import {
  storageSelectedOption,
  storagePageOptions,
  storageWorkingStatus,
} from "~/logic/storage";
import { ref, markRaw, computed } from "vue";
import type {
  PageOption,
  ComboboxOption,
  SelectedOption,
  TimeLineOption,
} from "~/components/types";
import dayjs from "dayjs";

const selected = ref<SelectedOption>({ url: "", label: "" });
const pageOptions = ref<PageOption[]>([]);
const timeLineOption = ref<TimeLineOption[]>([{ startTime: "", endTime: "" }]);
const tabId = ref(0);

async function getCurrentOption() {
  try {
    const { url, id } = await sendMessage("get-current-tab", {});
    tabId.value = id;
    console.log("url: ", url);

    console.log("select", storageSelectedOption.value);
    console.log("pageOptions", storagePageOptions.value);

    const CurrentOption = storagePageOptions.value.find(
      (item) => item.id === url
    );
    if (CurrentOption) {
      const {
        comboboxOption: { label, value: url },
      } = CurrentOption;
      selected.value = { label, url };
      timeLineOption.value = CurrentOption.timeLineOptions;
      return;
    }

    if (storageSelectedOption.value.id === url) {
      const {
        comboboxOption: { label, value: url },
      } = storageSelectedOption.value;
      selected.value = { label, url };
      timeLineOption.value = storageSelectedOption.value.timeLineOptions;
      workingStatus.value = storageWorkingStatus.value;
      return;
    }

    if (pageOptions.value.length === 0) {
      pageOptions.value.push({
        id: url,
        comboboxOption: {
          value: url,
          label: "current page",
        },
        timeLineOptions: timeLineOption.value,
      });

      selected.value = {
        url,
        label: "current page",
      };
    }
  } catch (error) {
    console.error(error);
  }
}
getCurrentOption();

const comboboxOptions = computed<ComboboxOption[]>(() =>
  pageOptions.value.map((item) => item.comboboxOption)
);

const workingIconOptions: { [K in WorkingStatus]: any } = {
  info: markRaw(IconFluentFilmstripPlay24Filled),
  loading: markRaw(IconSvgSpinnersRingResize),
  success: markRaw(IconLineMdCircleTwotoneToConfirmCircleTwotoneTransition),
};
const workingStatus = ref<WorkingStatus>("info");
const workingIcon = computed(() => workingIconOptions[workingStatus.value]);

const openStatusTip = ref(false);

function showStatusTip(ms: number = 3000) {
  openStatusTip.value = true;
  setTimeout(() => {
    openStatusTip.value = false;
  }, ms);
}

watch(workingStatus, (v) => {
  if (v === "loading") {
    openStatusTip.value = false;
  } else {
    showStatusTip();
  }
});

function updateStoragePageOptions() {
  const { url, label } = selected.value;
  const index = pageOptions.value.findIndex((item) => item.id === url);
  const option = {
    id: url,
    comboboxOption: {
      label,
      value: url,
    },
    timeLineOptions: timeLineOption.value,
  };
  if (index === -1) {
    storagePageOptions.value.push(option);
  }
  storagePageOptions.value[index] = option;
  storageSelectedOption.value = option;
}

async function updateVideoSkip() {
  workingStatus.value = "loading";
  const now = dayjs();

  updateStoragePageOptions();
  try {
    const status = await sendMessage(
      "update-video-skip",
      timeLineOption.value,
      { context: "content-script", tabId: tabId.value }
    );
    // Prevent the status tip from flashing
    if (dayjs().diff(now, "ms") < 500) {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    workingStatus.value = status;
  } catch (error) {
    console.error(error);
    workingStatus.value = "info";
  }
}

watch(
  selected,
  (v) => {
    const { url, label } = v;
    console.log("selected", v);
    if (url) {
      storageSelectedOption.value.id = url;
      storageSelectedOption.value.comboboxOption = { label, value: url };
      console.log("option", storageSelectedOption.value);
    }
  },
  { deep: true }
);

watch(
  timeLineOption,
  (v) => {
    storageSelectedOption.value.timeLineOptions = v;
    console.log("watch time", storageSelectedOption.value);
  },
  { deep: true }
);
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
      <TooltipProvider>
        <TooltipRoot
          :delay-duration="100"
          :open="openStatusTip"
          disableClosingTrigger
          disableHoverableContent
        >
          <TooltipTrigger
            class="h-9 cursor-auto box-border px-3 rounded-lg text-zinc-50"
            :class="[
              workingStatus === 'loading' &&
                'bg-zinc-600 pointer-events-none opacity-70',
              workingStatus === 'success' && 'bg-green-500 hover:bg-green-600',
              workingStatus === 'info' && 'bg-red-500 hover:bg-red-600',
            ]"
            @mouseenter="openStatusTip = true"
            @mouseleave="openStatusTip = false"
          >
            <line-md-confirm
              v-if="workingStatus === 'success'"
              class="text-xl"
            />
            <mdi-refresh v-else class="text-xl" />
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent
              class="z-20 font-semibold animate-bounce text-zinc-50 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
              :class="
                workingStatus === 'success' ? 'bg-green-600' : 'bg-red-400'
              "
              :side-offset="5"
            >
              {{
                workingStatus === "success"
                  ? "Status: Success 🎉🎬"
                  : "Status: Error Video not found 🚫🎬"
              }}
              <TooltipArrow
                :class="
                  workingStatus === 'success'
                    ? 'fill-green-600'
                    : 'fill-red-400'
                "
                :width="8"
              />
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>
    </div>
    <div
      class="flex-1 z-10 overflow-y-auto border rounded-md shadow-md my-3 p-2 dark:border-indigo-400"
    >
      <TimeLine v-model:options="timeLineOption" />
    </div>
    <div>
      <button
        @click="updateVideoSkip"
        class="btn btn-block hover:from-cyan-600 hover:to-blue-600 dark:hover:from-cyan-700 dark:hover:to-purple-700 bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-200 dark:bg-gradient-to-r dark:from-cyan-600 dark:to-purple-600"
        :class="workingStatus === 'loading' && 'btn-disabled opacity-70'"
      >
        <component
          :is="workingIcon"
          class="text-lg"
          :class="workingStatus === 'success' && 'text-green-500'"
        />
        <span class="text-lg">Update video skip</span>
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
