<script lang="ts">
  import { findItemById } from "../lib/items";
  import { createPopperActions } from "svelte-popperjs";
  const [popperRef, popperContent] = createPopperActions();

  export let id: number = 0;
  $: item = findItemById(id);
  let isHovering = false;
  const onFocus = () => (isHovering = true);
  const onBlur = () => (isHovering = false);
</script>

<button
  class="item"
  data-grade={item?.grade}
  on:click
  use:popperRef
  on:mouseover={onFocus}
  on:focus={onFocus}
  on:mouseleave={onBlur}
  on:blur={onBlur}
>
  {#if item != null}
    <img
      src={`https://static.tnraro.com/er/images/items/${item.id}.png`}
      alt={item.name}
      title={item.name}
      width="58"
      height="30"
      loading="lazy"
    />
  {/if}
</button>
{#if isHovering && item != null}
  <div class="tooltip" use:popperContent>
    <div>
      <div class="item-name">
        {item.name}
      </div>
      <div class="item-type">
        {item.type}
      </div>
    </div>
    <div class="item-stats">
      {#if item.atk !== 0}
        <div>공격력 {item.atk}</div>
      {/if}
      {#if item.atkLv !== 0}
        <div>레벨 당 공격력 {item.atkLv}</div>
      {/if}
      {#if item.asr !== 0}
        <div>공격 속도 {item.asr * 100 | 0}%</div>
      {/if}
      {#if item.asrLv !== 0}
        <div>레벨 당 공격 속도 {item.asrLv * 100 | 0}%</div>
      {/if}
      {#if item.cc !== 0}
        <div>치명타 확률 {item.cc * 100 | 0}%</div>
      {/if}
      {#if item.cd !== 0}
        <div>치명타 피해량 {item.cd * 100 | 0}%</div>
      {/if}
      {#if item.pd !== 0}
        <div>방어 관통 {item.pd | 0}</div>
      {/if}
      {#if item.pdr !== 0}
        <div>방어 관통 {item.pdr * 100 | 0}%</div>
      {/if}
    </div>
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
{/if}

<style>
  .item {
    background: linear-gradient(
      var(---color-background-dark, #2b2c2d),
      var(---color-background, #5b5d60)
    );
    height: 36px;
    border: none;
    appearance: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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
  .tooltip {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: absolute;
    background-color: hsl(0deg 0% 100% / 80%);
    backdrop-filter: blur(10px);
    padding: 4px 8px;
    border-radius: 4px;
    pointer-events: none;
    font-size: 0.75em;
    box-shadow: 1px 1px 1px hsl(240deg 20% 10% / 15%);
    box-shadow: 1px 1px 2px hsl(240deg 20% 10% / 15%);
    box-shadow: 1px 1px 4px hsl(240deg 20% 10% / 15%);
    box-shadow: 1px 1px 8px hsl(240deg 20% 10% / 15%);
  }
  .tooltip .item-name {
    font-size: 1rem;
    font-weight: 700;
  }
</style>
