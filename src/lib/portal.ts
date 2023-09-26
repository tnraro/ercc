import type { Action } from "svelte/action";

export const portal: Action = (node) => {
  document.body.append(node);
}