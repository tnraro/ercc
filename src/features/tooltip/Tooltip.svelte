<script lang="ts">
  import {
    arrow,
    autoUpdate,
    computePosition,
    offset,
    shift,
  } from "@floating-ui/dom";
  import { onDestroy, onMount, tick } from "svelte";
  import { generateUniqueIds } from "../../lib/uniqueId";

  const [ids, disposeIds] = generateUniqueIds("trigger", "tooltip");
  const open = () => {
    isOpen = true;
    window.addEventListener("keydown", keyHandler, { once: true });
    tick().then(placeTooltip).then(registerAutoUpdate);
  };
  const close = () => {
    window.removeEventListener("keydown", keyHandler);
    cleanUp?.();
    cleanUp = undefined;
    isOpen = false;
  };
  const placeTooltip = async () => {
    if (trigger == null || tooltip == null) return;
    return computePosition(trigger, tooltip, {
      placement: "bottom",
      middleware: [
        offset({ mainAxis: 4 }),
        shift({ padding: 4 }),
        arrow({ element: tooltip__arrow, padding: 4 }),
      ],
    }).then(({ x, y, middlewareData }) => {
      tooltip.style.top = `${y}px`;
      tooltip.style.left = `${x}px`;

      if (middlewareData.arrow) {
        const { x, y } = middlewareData.arrow;
        tooltip__arrow.style.top = y != null ? `${y}px` : "-10px";
        tooltip__arrow.style.left = x != null ? `${x}px` : "";
      }
    });
  };
  const registerAutoUpdate = () => {
    cleanUp?.();
    cleanUp = undefined;
    if (trigger == null || tooltip == null) return;
    cleanUp = autoUpdate(trigger, tooltip, placeTooltip);
  };
  const keyHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    }
  };

  export let trigger: HTMLElement;

  let tooltip: HTMLElement;
  let tooltip__arrow: HTMLElement;

  let isOpen = false;
  let cleanUp: (() => void) | undefined = undefined;

  $: isOpen
    ? trigger?.setAttribute("aria-describedby", ids.tooltip)
    : trigger?.removeAttribute("aria-describedby");

  onMount(() => {
    tick().then(() => {
      trigger.addEventListener("focus", open);
      trigger.addEventListener("mouseover", open);
      // trigger.addEventListener("blur", close);
      trigger.addEventListener("mouseleave", close);
    });
  });
  onDestroy(() => {
    disposeIds();
    trigger.removeEventListener("focus", open);
    trigger.removeEventListener("mouseover", open);
    trigger.removeEventListener("blur", close);
    trigger.removeEventListener("mouseleave", close);
  });
</script>

{#if isOpen}
  <div bind:this={tooltip} role="tooltip" class="ui-tooltip">
    <slot />
    <div bind:this={tooltip__arrow} class="ui-tooltip__arrow" />
  </div>
{/if}

<style lang="scss">
  .ui-tooltip {
    position: absolute;
    padding: 0.5rem;
    background: white;
    pointer-events: none;
    user-select: none;
    border-radius: 0.5rem;
    box-shadow: 0 4px 16px hsl(210deg 5% 10% / 0.2);
    box-sizing: border-box;
    z-index: 2;

    &__arrow {
      border: 5px solid transparent;
      border-bottom-color: white;
      position: absolute;
    }
  }
</style>
