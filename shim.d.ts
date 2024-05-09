import type { ProtocolWithReturn } from "webext-bridge";
import type { TimeLineOption } from "~/components/types";

declare module "webext-bridge" {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    "tab-prev": { title: string | undefined };
    "get-current-tab": ProtocolWithReturn<
      { tabId?: number },
      { url: string; id: number }
    >;
    "update-video-skip": ProtocolWithReturn<TimeLineOption[], "success" | "info">;
  }
}
