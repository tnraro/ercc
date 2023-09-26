<script lang="ts">
  import Tooltip from "../features/tooltip/Tooltip.svelte";
  import { findItemById } from "../lib/items";

  export let id: number = 0;

  let trigger: HTMLElement;

  $: item = findItemById(id);
</script>

<div class="container">
  <button bind:this={trigger} class="item" data-grade={item?.grade} on:click>
    {#if item != null}
      <img
        src={`https://er-static.pages.dev/image/item/${item.id}.webp`}
        alt={item.name}
        title={item.name}
        width="58"
        height="30"
        loading="lazy"
      />
    {:else}
      <slot />
    {/if}
  </button>
  {#if item != null}
    <Tooltip {trigger}>
      <div class="item__name">
        {item.name}
      </div>
      <div class="item__type">
        {item.type}
      </div>
      <div class="item__stats">
        {#if item.atk !== 0}
          <div class="item__stat-name">공격력</div>
          <div class="item__stat-value">{item.atk}</div>
        {/if}
        {#if item.atkLv !== 0}
          <div class="item__stat-name">레벨 당 공격력</div>
          <div class="item__stat-value">{item.atkLv}</div>
        {/if}
        {#if item.asr !== 0}
          <div class="item__stat-name">공격 속도</div>
          <div class="item__stat-value">{(item.asr * 100) | 0}%</div>
        {/if}
        {#if item.asrLv !== 0}
          <div class="item__stat-name">레벨 당 공격 속도</div>
          <div class="item__stat-value">{(item.asrLv * 100) | 0}%</div>
        {/if}
        {#if item.cc !== 0}
          <div class="item__stat-name">치명타 확률</div>
          <div class="item__stat-value">{(item.cc * 100) | 0}%</div>
        {/if}
        {#if item.cd !== 0}
          <div class="item__stat-name">치명타 피해량</div>
          <div class="item__stat-value">{(item.cd * 100) | 0}%</div>
        {/if}
        {#if item.pd !== 0}
          <div class="item__stat-name">방어 관통</div>
          <div class="item__stat-value">{item.pd | 0}</div>
        {/if}
        {#if item.pdr !== 0}
          <div class="item__stat-name">방어 관통</div>
          <div class="item__stat-value">{(item.pdr * 100) | 0}%</div>
        {/if}
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
      </div>
    </Tooltip>
  {/if}
</div>

<style lang="scss">
  .item {
    background: linear-gradient(
      var(---color-background-dark, #2b2c2d),
      var(---color-background, #5b5d60)
    );
    color: white;
    width: 64px;
    height: 36px;
    border: none;
    appearance: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &__name {
      grid-area: name;
      font-size: 1rem;
      font-weight: 700;
    }
    &__type {
      grid-area: type;
    }
    &__stats {
      display: grid;
      grid-area: stats;
      grid-template-columns: auto 1fr;
    }
    &__stat-value {
      text-align: right;
    }
  }
  .item > img {
    object-fit: contain;
  }
  .item[data-grade="uncommon"] {
    ---color-background: #476b49;
    ---color-background-dark: #242b1e;
  }
  .item[data-grade="rare"] {
    ---color-background: #344a6d;
    ---color-background-dark: #262b37;
  }
  .item[data-grade="epic"] {
    ---color-background: #74569c;
    ---color-background-dark: #2d2b3f;
  }
  .item[data-grade="legendary"] {
    ---color-background: #9a7533;
    ---color-background-dark: #3d3224;
  }
  .item[data-grade="mythic"] {
    ---color-background: #903034;
    ---color-background-dark: #48231d;
  }
  .container :global(.ui-tooltip) {
    display: grid;
    font-size: 0.75rem;
    grid-template:
      "name" auto
      "type" 1.5rem
      "stats" auto
      / auto;
    min-inline-size: 20ch;
  }
</style>
