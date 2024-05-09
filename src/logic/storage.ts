import { useWebExtensionStorage } from "~/composables/useWebExtensionStorage";
import type { PageOption } from "~/components/types";

export const storageDemo = useWebExtensionStorage(
  "webext-demo",
  "Storage Demo"
);
export const storageTheme = useWebExtensionStorage<"light" | "dark">(
  "webext-theme",
  "light"
);
export const storageSelectedOption = useWebExtensionStorage<PageOption>(
  "webext-selectedOption",
  { id: "", comboboxOption: { label: "", value: "" }, timeLineOptions: [{ startTime: '', endTime: '' }] }
);
export const storagePageOptions = useWebExtensionStorage<PageOption[]>(
  "webext-pageOptions",
  []
);
export const storageWorkingStatus = useWebExtensionStorage<WorkingStatus>(
  "webext-workingStatus",
  "info"
);
