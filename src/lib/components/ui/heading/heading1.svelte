<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { WithElementRef } from "bits-ui";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLHeadingElement>> = $props();
</script>

<h1
  bind:this={ref}
  class={cn(
    "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</h1>
