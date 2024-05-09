/* eslint-disable no-console */
import { onMessage } from "webext-bridge/content-script";
import { createApp } from "vue";
import App from "./views/App.vue";
import { setupApp } from "~/logic/common-setup";
import "../styles";
import type { TimeLineOption } from "~/components/types";
import { parseTime } from "~/utils";
import dayjs from "dayjs";

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info("[vitesse-webext] Hello world from content script");

  // communication example: send previous tab title from background page
  onMessage("tab-prev", ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`);
  });

  const videoHandlers = new WeakMap();
  const tiemToSecond = (time: string) => {
    return dayjs(parseTime(time)).diff(dayjs().startOf('day'), "second");
  };

  const handleTimeUpdate = (
    video: HTMLVideoElement,
    timeLine: TimeLineOption[]
  ) => {
    timeLine.forEach(({ startTime, endTime }) => {
      const currentTime = video.currentTime;
      const end = tiemToSecond(endTime);

      if (currentTime >= tiemToSecond(startTime) && currentTime <= end) {
        video.currentTime = end;
      }
    });
  };

  onMessage("update-video-skip", async ({ data: timeLine }) => {
    const videos = document.querySelectorAll("video");
    if (videos.length === 0) {
      return "info";
    }
    const isEmpty = !timeLine.every((item) => item.startTime && item.endTime);
    console.log("isEmpty", isEmpty);
    if (isEmpty) {
      return "success";
    }
    videos.forEach((v) => {
      const handler = videoHandlers.get(v);
      if (handler) {
        v.removeEventListener("timeupdate", handler);
      }
      const newHandler = handleTimeUpdate.bind(null, v, timeLine);
      videoHandlers.set(v, newHandler);
      v.addEventListener("timeupdate", newHandler);
    });
    return "success";
  });

  // mount component to context window
  const container = document.createElement("div");
  container.id = __NAME__;
  const root = document.createElement("div");
  const styleEl = document.createElement("link");
  const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? "open" : "closed" }) ||
    container;
  styleEl.setAttribute("rel", "stylesheet");
  styleEl.setAttribute(
    "href",
    browser.runtime.getURL("dist/contentScripts/style.css")
  );
  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(root);
  document.body.appendChild(container);
  const app = createApp(App);
  setupApp(app);
  app.mount(root);
})();
