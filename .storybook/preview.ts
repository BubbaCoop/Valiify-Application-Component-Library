import type { Preview } from "@storybook/html-vite";

// Storybook-specific entry — includes the library plus utilities used by
// stories. See preview.css for why this is not src/index.css directly.
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("p-8");
      // Stories may return either an HTML string or a live Node.
      const story = Story();
      if (typeof story === "string") {
        wrapper.innerHTML = story;
      } else {
        wrapper.appendChild(story);
      }
      return wrapper;
    },
  ],
};

export default preview;
