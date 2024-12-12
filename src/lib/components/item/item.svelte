<script lang="ts" module>
  export const itemVariants = tv({
    slots: {
      container: "inline-flex items-center justify-center",
      image: "object-contain overflow-clip text-white/50",
    },
    variants: {
      size: {
        sm: {
          container: "rounded-sm text-xs p-[1px] w-[40px] h-[20px]",
          image: "w-[38px] h-[18px]",
        },
        md: {
          container: "rounded text-xs p-[2px] w-[60px] h-[30px]",
          image: "w-[56px] h-[26px]",
        },
      },
      grade: {
        common: {
          container: "from-common to-common-dark bg-gradient-to-t",
        },
        uncommon: {
          container: "from-uncommon to-uncommon-dark bg-gradient-to-t",
        },
        rare: {
          container: "from-rare to-rare-dark bg-gradient-to-t",
        },
        epic: {
          container: "from-epic to-epic-dark bg-gradient-to-t",
        },
        legendary: {
          container: "from-legendary to-legendary-dark bg-gradient-to-t",
        },
        mythic: {
          container: "from-mythic to-mythic-dark bg-gradient-to-t",
        },
      },
    },
    defaultVariants: {
      size: "md",
      grade: "common",
    },
  });
  export type ItemSize = VariantProps<typeof itemVariants>["size"];
</script>

<script lang="ts">
  import { findItemById } from "$lib/items";
  import { tv, type VariantProps } from "tailwind-variants";
  import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
  import { Separator } from "../ui/separator";

  interface Props {
    id: number;
    size?: ItemSize;
    onclick?: (id: number) => void;
  }

  let { id, size = "md", onclick }: Props = $props();

  let item = $derived(findItemById(id));
  let grade = $derived(item?.grade ?? "common");

  let { container, image } = $derived(itemVariants({ size, grade }));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class={container()} data-grade={grade} onclick={() => onclick?.(id)}>
  {#if item != null}
    {#if onclick != null}
      {@render itemImage(item.id, item.name)}
    {:else}
      <Popover>
        <PopoverTrigger>
          {@render itemImage(item.id, item.name)}
        </PopoverTrigger>
        <PopoverContent class="w-40">
          <div class="font-bold leading-none">{item.name}</div>
          <div class="text-sm text-muted-foreground">{item.type}</div>
          <Separator class="my-2" />
          {#if item.atk > 0}{@render stat("공격력", item.atk)}{/if}
          {#if item.atkLv > 0}{@render stat("레벨 당 공격력", item.atkLv)}{/if}
          {#if item.asr > 0}{@render percentStat("공격 속도", item.asr)}{/if}
          {#if item.asrLv > 0}{@render percentStat(
              "레벨 당 공격 속도",
              item.asrLv,
            )}{/if}
          {#if item.cc > 0}{@render percentStat("치명타 확률", item.cc)}{/if}
          {#if item.cd > 0}{@render percentStat("치명타 피해량", item.cd)}{/if}
          {#if item.pd > 0}{@render stat("방어 관통", item.pd)}{/if}
          {#if item.pdr > 0}{@render percentStat("방어 관통", item.pdr)}{/if}
          {#if item.modeType !== 0}
            <div>
              {#if (item.modeType & 0b1) === 0b1}
                솔로
              {/if}
              {#if (item.modeType & 0b10) === 0b10}
                듀오
              {/if}
              {#if (item.modeType & 0b100) === 0b100}
                스쿼드
              {/if}
              {#if (item.modeType & 0b1000) === 0b1000}
                코발트
              {/if}
            </div>
          {/if}
        </PopoverContent>
      </Popover>
    {/if}
  {:else}
    <div class={image()}>{id}</div>
  {/if}
</div>

{#snippet itemImage(id: number, name: string)}
  <img
    class={image()}
    src={`https://er-static.pages.dev/image/item/${id}.webp`}
    alt={name}
    title={name}
    width="58"
    height="30"
    loading="lazy"
  />
{/snippet}
{#snippet stat(label: string, value: number)}
  <div class="stat">
    <div class="stat__label">{label}</div>
    <div class="stat__value">{Math.floor(value)}</div>
  </div>
{/snippet}
{#snippet percentStat(label: string, value: number)}
  <div class="stat">
    <div class="stat__label">{label}</div>
    <div class="stat__value">{Math.round(value * 100)}%</div>
  </div>
{/snippet}

<style lang="scss">
  .stat {
    @apply flex whitespace-nowrap break-keep text-sm;

    &__name {
      @apply font-bold;
    }

    &__value {
      @apply flex-1 text-right;
    }
  }
</style>
