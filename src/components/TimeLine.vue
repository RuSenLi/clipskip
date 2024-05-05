<script setup lang="ts">
import type { TimeLineOption } from "~/components/types";
import { formatTime } from "~/utils";
import { useDebounceFn } from "@vueuse/core";
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "radix-vue";
import dayjs from "dayjs";

const options = defineModel<TimeLineOption[]>("options", { required: true });

const debouncedTime = useDebounceFn(
  (value: string, index: number, key: "startTime" | "endTime") => {
    options.value[index][key] = value.replace(/^:(.*)/, "00:$1");
    const diffSecond = dayjs(parseTime(options.value[index].endTime)).diff(
      dayjs(parseTime(options.value[index].startTime)),
      "s"
    );
    options.value[index].second = isNaN(diffSecond) ? "" : diffSecond;
  },
  1000
);

function formatInput(e: Event, index: number, key: "startTime" | "endTime") {
  const value = formatTime((e.target as HTMLInputElement)?.value);
  options.value[index][key] = value;
  debouncedTime(value, index, key);
}

function parseTime(time: string) {
  if (!time) {
    return null;
  }
  const [second, minute, hour] = time.split(":").reverse();
  return { second, minute, hour };
}

function setSecond(e: Event, index: number) {
  options.value[index].second = (e.target as HTMLInputElement)?.value.replace(
    /\D/g,
    ""
  );
  const { startTime, endTime, second } = options.value[index];
  if (startTime) {
    const start = dayjs(parseTime(startTime));
    options.value[index].endTime = start
      .add(Number(second), "s")
      .format("HH:mm:ss");
  } else {
    const end = dayjs(parseTime(endTime));
    options.value[index].startTime = end
      .subtract(Number(second), "s")
      .format("HH:mm:ss");
  }
}
</script>

<template>
  <div v-for="(item, index) in options">
    <ul class="timeline mb-5 relative">
      <li class="grid-rows-1 self-center mr-1">
        <div class="timeline-start timeline-box items-center dark:bg-black">
          <input
            type="text"
            placeholder="label"
            class="w-11 outline-none font-semibold dark:bg-black"
            v-model="item.label"
          />
        </div>
      </li>
      <li class="grid-rows-1">
        <div class="timeline-start timeline-box dark:bg-black">
          <input
            v-model="item.startTime"
            @input="(e) => formatInput(e, index, 'startTime')"
            type="text"
            placeholder="00:00:00"
            class="w-12 outline-none dark:bg-black"
          />
        </div>
        <div class="timeline-middle">
          <bi-clock-fill class="siez-5 text-primary" />
        </div>
        <hr :class="item.startTime && 'bg-primary'" />
      </li>
      <li class="grid-rows-1">
        <hr :class="item.startTime && 'bg-primary'" />
        <div class="timeline-start timeline-box dark:bg-black py-1 self-center">
          <input
            :disabled="!item.startTime && !item.endTime"
            @input="(e) => setSecond(e, index)"
            type="text"
            placeholder="20 S"
            class="w-7 outline-none dark:bg-black"
            :class="!item.startTime && !item.endTime && 'cursor-not-allowed '"
            v-model="item.second"
          />
        </div>
        <div class="timeline-middle">
          <mingcute-arrows-right-fill class="text-primary" />
        </div>
        <hr :class="item.endTime && 'bg-primary'" />
      </li>
      <li class="grid-rows-1">
        <hr :class="item.endTime && 'bg-primary'" />
        <div class="timeline-start timeline-box dark:bg-black">
          <input
            v-model="item.endTime"
            @input="(e) => formatInput(e, index, 'endTime')"
            placeholder="00:00:20"
            type="text"
            class="w-12 outline-none dark:bg-black"
          />
        </div>
        <div class="timeline-middle">
          <bi-clock-fill class="siez-5 text-primary" />
        </div>
      </li>
      <TooltipProvider v-if="options.length > 1">
        <TooltipRoot :delay-duration="200">
          <TooltipTrigger
            class="icno-close opacity-0 absolute btn btn-sm btn-circle -right-1 top-2 border-none hover:text-white hover:bg-red-500"
          >
            <iconamoon-close class="size-5" />
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent
              class="z-20 font-semibold dark:bg-zinc-700 dark:text-white data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
              :side-offset="5"
            >
              delete row？
              <button
                @click="() => options.length > 1 && options.splice(index, 1)"
                class="btn btn-sm btn-info text-white"
              >
                Yes
              </button>
              <TooltipArrow class="fill-white" :width="8" />
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>
    </ul>
    <div v-if="options.length - 1 === index" class="flex justify-center">
      <button
        @click="options.push({ startTime: '', endTime: '' })"
        class="btn btn-sm btn-wide rounded-full bg-gradient-to-t hover:from-blue-300 hover:to-indigo-500 hover:text-white dark:hover:from-blue-400 dark:hover:to-indigo-700"
      >
        <ic-baseline-plus class="size-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.timeline .icno-close {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline:hover .icno-close {
  opacity: 1;
}
</style>
