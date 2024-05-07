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
const tabId = ref(0);

async function getCurrentOption() {
  try {
    const { url, id } = await sendMessage("get-current-tab", {});
    tabId.value = id;

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

const workingIconOptions = {
  info: markRaw(IconFluentFilmstripPlay24Filled),
  loading: markRaw(IconSvgSpinnersRingResize),
  success: markRaw(IconLineMdCircleTwotoneToConfirmCircleTwotoneTransition),
};
const workingStatus = ref<keyof typeof workingIconOptions>("info");
const workingIcon = computed(() => workingIconOptions[workingStatus.value]);

async function updateVideoSkip() {
  workingStatus.value = "loading";
  try {
    const isSuccess = await sendMessage(
      "update-video-skip",
      timeLineOption.value,
      { context: "content-script", tabId: tabId.value }
    );
    if (isSuccess) {
      workingStatus.value = "success";
    } else {
      workingStatus.value = "info";
    }
  } catch (error) {
    console.error(error);
    workingStatus.value = "info";
  }
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
      <TooltipProvider>
        <TooltipRoot
          :delay-duration="100"
          disableClosingTrigger
          disableHoverableContent
        >
          <TooltipTrigger
            class="h-9 box-border text-zinc-50 bg-red-500 hover:bg-red-600"
            :class="[
              workingStatus === 'loading' &&
                'bg-zinc-600 cursor-not-allowed opacity-70',
              workingStatus === 'success' && 'bg-green-500 hover:bg-green-600',
            ]"
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
                  ? "Skipping video clip has taken effect 🎉🎬"
                  : "Video not found, click to retry 🔄"
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
        class="btn btn-block bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-200 dark:bg-gradient-to-r dark:from-cyan-600 dark:to-purple-600"
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
