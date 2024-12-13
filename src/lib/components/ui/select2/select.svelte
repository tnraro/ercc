<script lang="ts" generics="Value, Key extends keyof Value">
  import { generateUniqueIds } from "$lib/unique-id";
  import {
    autoUpdate,
    computePosition,
    offset,
    shift,
    size,
    type ComputePositionConfig,
  } from "@floating-ui/dom";
  import { ChevronDown } from "lucide-svelte";
  import { onDestroy, tick, type Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import { Label } from "../label";

  const [{ labelId, listboxId, comboboxId, optionId }, disposeIds] =
    generateUniqueIds("labelId", "listboxId", "comboboxId", "optionId");
  const options: Partial<ComputePositionConfig> = {
    placement: "bottom-start",
    middleware: [
      offset({
        mainAxis: 4,
      }),
      shift({
        mainAxis: false,
        crossAxis: true,
      }),
      size({
        apply({ availableHeight, elements, rects }) {
          const height = rects.reference.height * showItems;
          elements.floating.style.maxHeight = `${Math.min(
            availableHeight,
            height,
          )}px`;
        },
      }),
    ],
  };
  const keys: ((e: KeyboardEvent) => boolean | void)[] = [
    (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return false;
      if (!isOpen) open();
      if (e.key === "ArrowDown") {
        next();
      } else if (e.key === "ArrowUp") {
        prev();
      }
      return true;
    },
    (e) => {
      if (isOpen) return;
      if (e.key === "Enter" || e.key === " ") {
        open();
        return true;
      }
    },
    (e) => {
      if (!isOpen) return;
      if (e.key === "Enter" || e.key === "Tab" || e.key === " ") {
        confirm();
        return true;
      } else if (e.key === "Escape") {
        cancel();
        return true;
      }
    },
  ];
  const MoveToAuto = 0;
  const MoveToTop = 1;
  interface Props {
    value?: Value;
    items: Value[];
    key?: Key;
    label?: string;
    showItems?: number;

    image?: Snippet<[Value]>;
    text: Snippet<[Value]>;
  }
  let {
    value = $bindable(),
    items,
    key,
    label,
    showItems = 7,
    image,
    text,
  }: Props = $props();

  let trigger: HTMLElement;
  let itemlist: HTMLElement;
  let cleanUp: (() => void) | undefined;

  let isOpen = $state(false);
  let activeDescendant = $state<string>();
  let lastValue = $state<Value>();
  let input = $state<string>();

  let filteredItems = $derived(
    input == null
      ? items
      : items.filter((item) => keyHelper(item, key).startsWith(input!)),
  );

  $effect(() => {
    if (value == null || !items.some((item) => isEqual(item, value))) {
      value = items[0];
    }
  });

  onDestroy(() => {
    disposeIds();
    cleanUp?.();
  });

  function keyHelper(value: Value, key: Key | undefined): string {
    return String(key == null ? value : (value as any)[key]);
  }
  function isEqual(a: Value | undefined, b: Value | undefined) {
    if (a == null || b == null) return false;
    if (key == null) {
      return a === b;
    } else {
      return a[key] === b[key];
    }
  }
  function open() {
    lastValue = value;
    isOpen = true;
    setActiveItem(getCurrentIndex());
    tick()
      .then(placeItemList)
      .then(() => {
        scrollToSelectedItem(MoveToTop);
        registerAutoUpdate();
      });
  }
  function confirm() {
    activeDescendant = undefined;
    cleanUp?.();
    cleanUp = undefined;
    isOpen = false;
  }
  function cancel() {
    if (lastValue != null) value = lastValue;
    lastValue = undefined;
    activeDescendant = undefined;
    cleanUp?.();
    cleanUp = undefined;
    isOpen = false;
  }
  function setActiveItem(index: number) {
    activeDescendant = `${optionId}-${index}`;
  }
  function getCurrentIndex() {
    return items.findIndex((item) => isEqual(item, value));
  }
  function getNextIndex(current: number, direction: number) {
    return Math.max(Math.min(current + direction, items.length - 1), 0);
  }
  function navigate(down = true) {
    const current = getCurrentIndex();
    const next = getNextIndex(current, down ? 1 : -1);
    value = items[next];
    setActiveItem(next);
    tick()
      .then(placeItemList)
      .then(() => {
        scrollToSelectedItem();
      });
  }
  function next() {
    navigate();
  }
  function prev() {
    navigate(false);
  }
  function scrollToSelectedItem(moveTo = MoveToAuto) {
    if (activeDescendant == null) return;
    const selected = document.getElementById(activeDescendant);
    if (selected == null) return;
    const sr = selected.getBoundingClientRect();
    const ir = itemlist.getBoundingClientRect();

    if (moveTo === MoveToAuto) {
      if (sr.bottom > ir.bottom) {
        scrollToBottom(sr, ir);
      } else if (sr.y < ir.y) {
        scrollToTop(sr, ir);
      }
    } else if (moveTo === MoveToTop) {
      scrollToTop(sr, ir);
    }
    function scrollToTop(target: DOMRect, parent: DOMRect) {
      itemlist.scrollBy({
        top: target.y - parent.y,
        behavior: "instant",
      });
    }
    function scrollToBottom(target: DOMRect, parent: DOMRect) {
      itemlist.scrollBy({
        top: target.bottom - parent.bottom,
        behavior: "instant",
      });
    }
  }
  async function placeItemList() {
    if (trigger == null || itemlist == null) return;
    return computePosition(trigger, itemlist, options).then(({ x, y }) => {
      itemlist.style.top = `${y}px`;
      itemlist.style.left = `${x}px`;
    });
  }
  function registerAutoUpdate() {
    cleanUp?.();
    cleanUp = undefined;
    if (trigger == null || itemlist == null) return;
    cleanUp = autoUpdate(trigger, itemlist, placeItemList);
  }
</script>

{#if label}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <Label id={labelId} for={comboboxId} onclick={() => trigger.focus()}>
    {label}
  </Label>
{/if}
<div
  bind:this={trigger}
  role="combobox"
  class="ui-select__trigger rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
  id={comboboxId}
  tabindex="0"
  aria-controls={listboxId}
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-labelledby={label ? labelId : undefined}
  aria-activedescendant={activeDescendant}
  onclick={() => {
    if (isOpen) cancel();
    else open();
  }}
  onkeydown={(e) => {
    for (const handler of keys) {
      if (handler(e) === true) {
        e.preventDefault();
        break;
      }
    }
  }}
>
  {#if value == null}
    <div class="text-muted-foreground">placeholder</div>
  {:else}
    {#if image}
      <div class="ui-select__image">
        {@render image(value)}
      </div>
    {/if}
    <div class="ui-select__text">
      {@render text(value)}
    </div>
    <div class="ui-select__space"></div>
    <div class="ui-select__icon">
      <ChevronDown class="h-4 w-4 opacity-50" />
    </div>
  {/if}
</div>
{#if isOpen}
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button class="ui-select__overlay" tabindex="-1" onclick={cancel}></button>
  <div
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
    bind:this={itemlist}
    role="listbox"
    class="ui-select__itemlist"
    id={listboxId}
    aria-labelledby={label ? labelId : undefined}
  >
    {#each filteredItems as v, i (keyHelper(v, key))}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        role="option"
        class="ui-select__item"
        class:ui-select__item--selected={isEqual(v, value)}
        id="{optionId}-{i}"
        aria-selected={isEqual(v, value)}
        onclick={() => {
          value = v;
          tick().then(confirm);
        }}
        tabindex="-1"
      >
        {#if image}
          <div class="ui-select__image">
            {@render image(v)}
          </div>
        {/if}
        <div class="ui-select__text">
          {@render text(v)}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  @mixin container {
    @apply rounded-md border border-input bg-transparent shadow-sm transition-colors;
  }
  @mixin item {
    width: 25ch;
    display: flex;
    user-select: none;
    box-sizing: border-box;
    gap: 0.5rem;
    align-items: center;
    @apply whitespace-nowrap px-3 py-1 text-sm;
  }
  @mixin fixed-size {
    flex: 0 0 auto;
  }
  @mixin flexible-size {
    min-inline-size: 0;
    max-inline-size: 100%;
  }
  .ui-select {
    &__trigger {
      @include container;
      @include item;
      @apply focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring;
    }
    &__overlay {
      all: initial;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &__itemlist {
      @include container;
      @apply bg-white shadow-lg;
      position: absolute;
      overflow: hidden auto;
      z-index: 1;
    }
    &__item {
      @include item;
      &:hover {
        background-color: hsl(41deg 100% 64% / 0.5);
      }

      &--selected {
        background-color: hsl(41deg 100% 64% / 0.75);
      }
    }
    &__image {
      @include fixed-size;
      display: flex;
      align-items: center;
      overflow: hidden;
      & > :global(img) {
        display: inline-block;
      }
    }
    &__text {
      @include flexible-size;
      display: flex;
      align-items: center;
      & > :global(*) {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    &__space {
      flex: 1;
    }
    &__icon {
      @include fixed-size;
      display: flex;
      align-items: center;
    }
  }
</style>
