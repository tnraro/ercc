<script lang="ts">
  import { findItemById } from "../lib/items";

  export let id: number = 0;
  $: item = findItemById(id);
</script>

<div data-grade={item?.grade} on:click>
  {#if item != null}
    <img
      src={`https://tnraro.github.io/er-static/items/${item.id}.webp`}
      alt={item.name}
      width="62"
      height="36"
      loading="lazy"
    />
  {/if}
</div>

<style>
  div {
    background: linear-gradient(
      var(---color-background-dark, #2b2c2d),
      var(---color-background, #5b5d60)
    );
    height: 36px;
  }
  div > img {
    object-fit: cover;
  }
  div[data-grade="uncommon"] {
    ---color-background: #476b49;
    ---color-background-dark: #242b1e;
  }
  div[data-grade="rare"] {
    ---color-background: #344a6d;
    ---color-background-dark: #262b37;
  }
  div[data-grade="epic"] {
    ---color-background: #74569c;
    ---color-background-dark: #2d2b3f;
  }
  div[data-grade="legendary"] {
    ---color-background: #9a7533;
    ---color-background-dark: #3d3224;
  }
  div[data-grade="mythic"] {
    ---color-background: #903034;
    ---color-background-dark: #48231D;
  }
</style>
