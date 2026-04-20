import type { Preview } from "@storybook/react";
import "../src/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "var(--color-background, #ffffff)" },
        { name: "dark", value: "#0f1117" },
      ],
    },
    layout: "centered",
  },
};

export default preview;
