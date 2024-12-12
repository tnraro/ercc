<script lang="ts">
  import { characters, type Character } from "$lib/characters";
  import Heading1 from "$lib/components/ui/heading/heading1.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import Select from "$lib/components/ui/select2/select.svelte";
  import { Slider } from "$lib/components/ui/slider";
  import { items, type ItemData } from "$lib/items";
  import { sw } from "$lib/sw";
  import { generateUniqueIds } from "$lib/unique-id";
  import { onDestroy, setContext } from "svelte";
  import "../app.css";

  const [ids, disposeIds] = generateUniqueIds(
    "characterLevel",
    "weaponLevel",
    "targetDefense",
  );
  onDestroy(() => {
    disposeIds();
  });

  let { children } = $props();

  let character = $state<Character>();
  let weaponType = $state<string>();
  let weapon = $state<ItemData>();
  let characterLevel = $state(6);
  let weaponLevel = $state(3);
  let targetDefense = $state(90);
  setContext("player-stat", () => ({
    character,
    weaponType,
    weapon,
    characterLevel,
    weaponLevel,
    targetDefense,
  }));

  let weaponTypes = $derived(
    sw
      .filter(({ id }) => id === character?.id)
      .map(({ weaponType }) => weaponType),
  );

  let weapons = $derived(items.filter((item) => item.type === weaponType));
</script>

<nav>
  <ul>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/best-combinations">Best Combinations</a>
    </li>
    <li>
      <a href="/compare-item-values">CompareItemValues</a>
    </li>
  </ul>
</nav>

<main>
  <div class="player-state">
    <div class="row">
      <Select
        bind:value={character}
        items={characters}
        key="name"
        label="실험체"
      >
        {#snippet image(value)}
          <img
            class="option__image h-[24px] w-[24px]"
            src="https://er-static.pages.dev/image/character/portrait/{value.name}_S000.webp"
            width="24"
            height="24"
            loading="lazy"
            alt={value.name}
          />
        {/snippet}
        {#snippet text(value)}
          <div class="character-item__text">{value.name}</div>
        {/snippet}
      </Select>
    </div>
    <div class="row">
      <Select bind:value={weaponType} items={weaponTypes} label="무기">
        {#snippet image(value)}
          <img
            class="option__image option__image--bg-black option__image--p-2 h-[24px] w-[24px]"
            src="https://er-static.pages.dev/image/icon/ability/{value}.webp"
            width="24"
            height="24"
            loading="lazy"
            alt={value}
          />
        {/snippet}
        {#snippet text(value)}
          <div>{value}</div>
        {/snippet}
      </Select>
      <Select bind:value={weapon} items={weapons} key="name">
        {#snippet image(value)}
          <img
            class="option__image option__image--p-2 h-[24px] w-[30px]"
            class:option__image--bg-red={value.grade === "mythic"}
            class:option__image--bg-yellow={value.grade === "legendary"}
            class:option__image--bg-purple={value.grade === "epic"}
            class:option__image--bg-blue={value.grade === "rare"}
            class:option__image--bg-green={value.grade === "uncommon"}
            class:option__image--bg-gray={value.grade === "common"}
            src="https://er-static.pages.dev/image/item/{value.id}.webp"
            width="30"
            height="24"
            loading="lazy"
            alt={value.name}
          />
        {/snippet}
        {#snippet text(value)}
          <div>{value.name}</div>
        {/snippet}
      </Select>
    </div>
    <div class="row">
      <Label for={ids.characterLevel}>실험체 레벨</Label>
      <Input
        id={ids.characterLevel}
        class="w-[contents]"
        type="number"
        bind:value={characterLevel}
        min="1"
        max="20"
      />
      <Slider
        value={[characterLevel]}
        onValueChange={([v]) => (characterLevel = v)}
        min={1}
        max={20}
      />
    </div>
    <div class="row">
      <Label for={ids.weaponLevel}>무기 숙련도</Label>
      <Input
        id={ids.weaponLevel}
        class="w-[contents]"
        type="number"
        bind:value={weaponLevel}
        min="1"
        max="20"
      />
      <Slider
        value={[weaponLevel]}
        onValueChange={([v]) => (weaponLevel = v)}
        min={1}
        max={20}
      />
    </div>
    <div class="row">
      <Label for={ids.targetDefense}>대상 방어력</Label>
      <Input
        id={ids.targetDefense}
        class="w-[contents]"
        type="number"
        bind:value={targetDefense}
        min="0"
        max="200"
      />
      <Slider
        value={[targetDefense]}
        onValueChange={([v]) => (targetDefense = v)}
        min={0}
        max={200}
      />
    </div>
  </div>
  {@render children()}
</main>

<footer>
  <Heading1>Disclaimer</Heading1>
  <p>본 계산기는 한정된 정보를 이용하여 주관적인 결과를 제공합니다.</p>
  <p>본 계산기는 정보의 완전성, 정확성, 적시성을 보증하지 않습니다.</p>
</footer>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 640px;
    margin: 0 auto;
  }
  footer {
    max-width: 640px;
    margin: 0 auto;
    margin-top: 4rem;
    height: 100vh;
  }
  .player-state {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .option__image {
    border-radius: 0.25rem;
    object-fit: contain;
    box-sizing: border-box;
    &--p-2 {
      padding: 0.125rem;
    }
    &--bg-black {
      background: hsl(210deg 5% 10%);
    }
    &--bg-yellow {
      background: hsl(44deg 57% 60%);
    }
    &--bg-red {
      background: hsl(350deg 57% 60%);
    }
    &--bg-blue {
      background: hsl(210deg 57% 60%);
    }
    &--bg-green {
      background: hsl(120deg 43% 60%);
    }
    &--bg-purple {
      background: hsl(280deg 43% 60%);
    }
  }
</style>
