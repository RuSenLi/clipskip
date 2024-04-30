<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from "@headlessui/vue";
import type { ComboboxOption as SelectOption } from "./types";

const select = defineModel<string>("selected");
const options = defineModel<SelectOption[]>("options");

const query = ref("");

function hasQuery(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "")
    .includes(query.value.toLowerCase().replace(/\s+/g, ""));
}

const filteredOption = computed(() => {
  if (!options.value) {
    return [];
  }

  if (query.value === "") {
    return options.value;
  }

  return options.value.filter(
    (item) => hasQuery(item.value) || hasQuery(item.label)
  );
});
</script>

<template>
  <div>
    <Combobox v-model="select" nullable>
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
        >
          <ComboboxInput
            class="w-full py-2 pl-3 pr-10 text-sm leading-5 focus:outline-4 focus:outline-teal-500 focus:rounded-lg dark:focus:outline-teal-500"
            :display-value="(i: any) => i.value"
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <fluent-chevron-up-down-16-filled class="h-5 w-5 text-gray-400" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm dark:bg-gray-200"
          >
            <div
              v-if="filteredOption.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-gray-700 text-center"
            >
              Nothing found.
              <button
                class="btn btn-block btn-sm mt-1 bg-teal-600 text-gray-200 hover:bg-teal-700 dark:border-none"
              >
                <tabler-plus />
              </button>
            </div>

            <ComboboxOption
              v-for="option in filteredOption"
              :key="option.id || option.value"
              v-slot="{ selected, active }"
              as="template"
              :value="option.value"
            >
              <li
                id="option.id || option.value"
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                  class="block truncate text-lg"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                > 
                  {{ option.label }}
                  <p class="text-base">{{ option.value }}</p>
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-teal-600': !active }"
                >
                  <material-symbols-check class="h-5 w-5" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>
