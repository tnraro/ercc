<script lang="ts">
  import {
    autoUpdate,
    computePosition,
    type ComputePositionConfig,
  } from "@floating-ui/dom";
  import { onDestroy, onMount } from "svelte";

  export let target: HTMLElement;
  export let options: Partial<ComputePositionConfig> | undefined = undefined;
  export let auto = false;
  let x = 0;
  let y = 0;
  export let offsetX = 0;
  export let offsetY = 0;
  let floating: HTMLElement;
  const update = () => {
    console.log(target, floating);
    if (target == null || floating == null) throw undefined;
    computePosition(target, floating, options).then((context) => {
      x = context.x;
      y = context.y;
    });
  };
  let cleanUp: (() => void) | undefined;
  const registerAutoUpdate = (auto: boolean) => {
    if (cleanUp != null) {
      cleanUp();
      cleanUp = undefined;
    }
    if (!auto || target == null || floating == null) return;
    cleanUp = autoUpdate(target, floating, update);
  };
  $: registerAutoUpdate(auto);
  onMount(() => {
    if (auto) {
      registerAutoUpdate(true);
    }
    update();
  });
  onDestroy(() => {
    registerAutoUpdate(false);
  });
</script>

<div
  {...$$restProps}
  bind:this={floating}
  style:left={x + offsetX}
  style:top={y + offsetY}
>
  <slot />
</div>

<style>
  div {
    position: absolute;
    inline-size: max-content;
  }
</style>
