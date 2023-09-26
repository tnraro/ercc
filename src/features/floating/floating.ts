import { autoUpdate, computePosition, type ComputePositionConfig } from "@floating-ui/dom";
import type { Action } from "svelte/action";

export interface FloatingParams {
  target: HTMLElement;
  options?: Partial<ComputePositionConfig>;
  auto?: boolean;
}
export const floating: Action<HTMLElement, FloatingParams> = (node, parameter) => {
  const update = (params: FloatingParams) => {
    if (node == null || params.target == null) return;
    computePosition(params.target, node, params.options)
      .then(({ x, y }) => {
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        console.log("floating", x, y);
      });
  };
  let cleanUp: (() => void) | undefined;
  const setup = (params: FloatingParams) => {
    if (cleanUp != null) {
      cleanUp();
      cleanUp = undefined;
    }
    if (params.auto) {
      cleanUp = autoUpdate(params.target, node, () => update(params));
    }
    update(params);
  }
  node.setAttribute("style", "position:absolute;top:0;left:0;" + node.getAttribute("style"));
  setup(parameter);
  return {
    destroy() {
      if (cleanUp != null) cleanUp();
    },
    update(parameter) {
      setup(parameter);
    },
  }
}