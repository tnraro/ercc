<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { SortDirection } from "@tanstack/table-core";
  import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-svelte";
  import type { ComponentProps } from "svelte";

  let {
    variant = "ghost",
    label,
    state,
    ...restProps
  }: ComponentProps<typeof Button> & {
    label: string;
    state: false | SortDirection;
  } = $props();
</script>

<Button {variant} {...restProps} class="px-1 py-0">
  {label}
  {#if state === "desc"}
    <ArrowDown class="size-4" />
  {:else if state === "asc"}
    <ArrowUp class="size-4" />
  {:else}
    <ArrowUpDown class="size-4 text-muted-foreground/50" />
  {/if}
</Button>
