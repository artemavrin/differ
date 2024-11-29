import { Provider } from "./types";

export const providers: Provider[] = [
  {
    label: "OpenAI",
    description: "OpenAI compatible API",
    detail: "https://api.openai.com/v1",
  },
  {
    label: "Anthropic",
    description: "Anthropic compatible API",
    detail: "https://api.anthropic.com/v1",
  },
  {
    label: "xAI",
    description: "xAI compatible API",
    detail: "https://api.x.ai/v1",
  },
];
