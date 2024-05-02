<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxTrigger,
} from "radix-vue";
import type { ComboboxOption } from "./types";
import { SelectEvent } from "node_modules/radix-vue/dist/Combobox/ComboboxItem";

const options = defineModel<ComboboxOption[]>("options", { required: true });
const selected = defineModel<string>("selected", { required: true });
const label = defineModel<string>("label", { required: true });

function getLable(selected: string): string {
  return options.value.find((i) => i.value === selected)?.label ?? "";
}

function changeSelected(e: SelectEvent<string>) {
  label.value = getLable(e.detail.value!);
}

type OptionKeysLabelValue = keyof Pick<ComboboxOption, "label" | "value">;

function filterFunction(list: String[], searchTerm: string) {
  const searchKey: OptionKeysLabelValue[] = ["label", "value"];

  return options.value
    .filter((option) =>
      searchKey.some((key) =>
        option[key]
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(searchTerm.toLowerCase().replace(/\s+/g, ""))
      )
    )
    .map((i) => i.value);
}
</script>

<template>
  <ComboboxRoot
    v-model="selected"
    class="relative"
    :filter-function="filterFunction"
  >
    <div class="w-full pl-3">
      <input
        type="text"
        v-model="label"
        class="w-full outline-none dark:bg-inherit text-sm"
      />
    </div>
    <ComboboxAnchor
      class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md"
    >
      <ComboboxInput
        class="w-full py-2 pl-3 pr-10 text-sm leading-5 focus:outline-4 focus:outline-teal-500 focus:rounded-lg"
        placeholder="select url"
      />
      <ComboboxTrigger
        class="absolute inset-y-0 right-0 flex items-center pr-2"
      >
        <fluent-chevron-up-down-16-filled
          class="h-4 w-4 text-gray-400 hover:text-gray-500"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
      class="absolute z-20 mt-1 max-h-60 p-[5px] w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm dark:bg-black"
    >
      <ComboboxEmpty
        class="relative cursor-default select-none px-4 py-2 text-gray-700 text-center"
      />

      <ComboboxItem
        v-for="option in options"
        :key="option.value"
        class="ComboboxItem relative cursor-default select-none py-2 pl-10 pr-4 highlighted data-[highlighted]:outline-none data-[highlighted]:bg-teal-600 data-[highlighted]:text-white data-[highlighted]:font-medium"
        :value="option.value"
        @select="changeSelected"
      >
        <ComboboxItemIndicator
          class="icon absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600"
        >
          <material-symbols-check class="h-5 w-5" />
        </ComboboxItemIndicator>
        <span class="block truncate text-sm">
          {{ option.label }}
          <p>{{ option.value }}</p>
        </span>
      </ComboboxItem>
    </ComboboxContent>
  </ComboboxRoot>
</template>

<style scoped>
.ComboboxItem[data-highlighted] .icon {
  color: white !important;
}
</style>
