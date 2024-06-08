<script lang="ts" generics="Value">
  import {
    autoUpdate,
    computePosition,
    offset,
    shift,
    size,
    type ComputePositionConfig,
  } from "@floating-ui/dom";
  import { onDestroy, tick } from "svelte";
  import { fade } from "svelte/transition";
  import { generateUniqueIds } from "../../lib/uniqueId";

  // consts
  const [{ labelId, listboxId, comboboxId, optionId }, disposeIds] =
    generateUniqueIds("labelId", "listboxId", "comboboxId", "optionId");
  const keyHelper = (value: Value, key: string | undefined): string =>
    String(key == null ? value : (value as any)[key]);
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
        apply: ({ availableHeight, elements, rects }) => {
          const height = rects.reference.height * showItems;
          elements.floating.style.maxHeight = `${Math.min(
            availableHeight,
            height,
          )}px`;
        },
      }),
    ],
  };

  const open = () => {
    lastValue = value;
    isOpen = true;
    setActiveItem(getCurrentIndex());
    tick()
      .then(placeItemList)
      .then(() => {
        scrollSelectedItemTo(MoveTo.Top);
        registerAutoUpdate();
      });
  };
  const confirm = () => {
    activeDescendant = undefined;
    cleanUp?.();
    cleanUp = undefined;
    isOpen = false;
  };
  const cancel = () => {
    if (lastValue != null) value = lastValue;
    lastValue = undefined;
    activeDescendant = undefined;
    cleanUp?.();
    cleanUp = undefined;
    isOpen = false;
  };

  const setActiveItem = (index: number) => {
    activeDescendant = `${optionId}-${index}`;
  };
  const getCurrentIndex = () => items.findIndex((item) => item === value);
  const getNextIndex = (current: number, direction: number) =>
    Math.max(Math.min(current + direction, items.length - 1), 0);
  const navigate = (down = true) => {
    const current = getCurrentIndex();
    const next = getNextIndex(current, down ? 1 : -1);
    value = items[next];
    setActiveItem(next);
    tick()
      .then(placeItemList)
      .then(() => {
        scrollSelectedItemTo();
      });
  };
  const next = () => {
    navigate();
  };
  const prev = () => {
    navigate(false);
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
  const enum MoveTo {
    Auto,
    Top,
  }
  const scrollSelectedItemTo = (moveTo: MoveTo = MoveTo.Auto) => {
    if (activeDescendant == null) return;
    const selected = document.getElementById(activeDescendant);
    if (selected == null) return;
    const sr = selected.getBoundingClientRect();
    const ir = itemlist.getBoundingClientRect();
    if (moveTo === MoveTo.Auto) {
      if (sr.bottom > ir.bottom) {
        scrollToBottom(sr, ir);
      } else if (sr.y < ir.y) {
        scrollToTop(sr, ir);
      }
    } else if (moveTo === MoveTo.Top) {
      scrollToTop(sr, ir);
    }
  };
  const scrollToTop = (target: DOMRect, parent: DOMRect) => {
    itemlist.scrollBy({
      top: target.y - parent.y,
      behavior: "instant",
    });
  };
  const scrollToBottom = (target: DOMRect, parent: DOMRect) => {
    itemlist.scrollBy({
      top: target.bottom - parent.bottom,
      behavior: "instant",
    });
  };
  const placeItemList = async () => {
    if (trigger == null || itemlist == null) return;
    return computePosition(trigger, itemlist, options).then(({ x, y }) => {
      itemlist.style.top = `${y}px`;
      itemlist.style.left = `${x}px`;
    });
  };
  const registerAutoUpdate = () => {
    cleanUp?.();
    cleanUp = undefined;
    if (trigger == null || itemlist == null) return;
    cleanUp = autoUpdate(trigger, itemlist, placeItemList);
  };

  // props
  export let value: Value | undefined;
  export let items: Value[];
  export let key: string | undefined = undefined;
  export let label: string | undefined = undefined;
  export let showItems = 7;

  // elements
  let trigger: HTMLElement;
  let itemlist: HTMLElement;

  // reactivities
  let isOpen = false;
  let activeDescendant: string | undefined;
  let lastValue: Value | undefined;
  let cleanUp: (() => void) | undefined = undefined;
  let input: string | undefined = undefined;

  // derived reactivities
  $: {
    if (value == null) {
      value = items[0];
    } else {
      if (key == null) {
        if (!items.includes(value)) {
          value = items[0];
        }
      } else {
        if (
          !items.some((item) => keyHelper(item, key) === keyHelper(value!, key))
        ) {
          value = items[0];
        }
      }
    }
  }
  $: filteredItems =
    input == null
      ? items
      : items.filter((item) => keyHelper(item, key).startsWith(input!));

  // lifecycles
  onDestroy(() => {
    disposeIds();
    cleanUp?.();
  });
</script>

{#if label}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <label
    class="ui-select__label"
    id={labelId}
    for={comboboxId}
    on:click={() => trigger.focus()}
  >
    {label}
  </label>
{/if}
<div
  bind:this={trigger}
  role="combobox"
  class="ui-select__trigger"
  id={comboboxId}
  tabindex="0"
  aria-controls={listboxId}
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-labelledby={label ? labelId : undefined}
  aria-activedescendant={activeDescendant}
  on:click={() => {
    if (isOpen) cancel();
    else open();
  }}
  on:keydown={(e) => {
    for (const handler of keys) {
      if (handler(e) === true) {
        e.preventDefault();
        break;
      }
    }
  }}
>
  {#if value == null}
    <div>placeholder</div>
  {:else}
    {#if $$slots.image}
      <div class="ui-select__image">
        <slot name="image" {value} />
      </div>
    {/if}
    <div class="ui-select__text">
      <slot name="text" {value} />
    </div>
    {#if $$slots.icon}
      <div style="flex: 1;" />
      <div class="ui-select__icon">
        <slot name="icon" />
      </div>
    {/if}
  {/if}
</div>
{#if isOpen}
  <button class="ui-select__overlay" tabindex="-1" on:click={() => cancel()} />
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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        role="option"
        class="ui-select__item"
        class:ui-select__item--selected={v === value}
        id="{optionId}-{i}"
        aria-selected={v === value}
        on:click={() => {
          value = v;
          tick().then(confirm);
        }}
        tabindex="-1"
      >
        {#if $$slots.image}
          <div class="ui-select__image">
            <slot name="image" value={v} />
          </div>
        {/if}
        <div class="ui-select__text">
          <slot name="text" value={v} />
        </div>
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  @mixin container {
    background: white;
    border-radius: 0.5rem;
  }
  @mixin item {
    display: flex;
    user-select: none;
    box-sizing: border-box;
    width: 25ch;
    padding: 0.5rem;
    gap: 0.5rem;
    align-items: center;
    white-space: nowrap;
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
      position: absolute;
      overflow: hidden auto;
      box-shadow: 0 3px 12px hsl(210deg 5% 10% / 0.2);
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
    &__icon {
      @include fixed-size;
      display: flex;
      align-items: center;
    }
  }
</style>
