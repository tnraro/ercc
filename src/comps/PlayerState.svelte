<script context="module" lang="ts">
  export interface PlayerStateOptions {
    character: (typeof characters)[0] | undefined,
    weaponType: string | undefined;
    weapon: ItemData | undefined;
    characterLevel: number;
    weaponLevel: number;
    targetDefense: number;
  }
</script>
<script lang="ts">
  import { onDestroy } from "svelte";
  import Icon from "../features/icon/Icon.svelte";
  import Select from "../features/select/Select.svelte";
  import { characters } from "../lib/characters";
  import { items, type ItemData } from "../lib/items";
  import { sw } from "../lib/sw";
  import { generateUniqueIds } from "../lib/uniqueId";

  // consts
  const [ids, disposeIds] = generateUniqueIds(
    "characterLevel",
    "weaponLevel",
    "targetDefense"
  );

  // props
  export let character: (typeof characters)[0] | undefined = undefined;
  export let weaponType: string | undefined = undefined;
  export let weapon: ItemData | undefined = undefined;
  export let characterLevel: number = 6;
  export let weaponLevel: number = 3;
  export let targetDefense: number = 90;

  // derived
  $: weaponTypes = sw
    .filter(({ id }) => id === character?.id)
    .map(({ weaponType }) => weaponType);

  $: weapons = items.filter((item) => item.type === weaponType);

  // lifecycles
  onDestroy(() => {
    disposeIds();
  });
</script>

<div class="player-state">
  <div class="row">
    <Select bind:value={character} items={characters} key="name" label="실험체">
      <img
        slot="image"
        let:value
        class="option__image"
        src="https://er-static.pages.dev/image/character/portrait/{value.name}_S000.webp"
        width="24"
        height="24"
        loading="lazy"
        alt={value.name}
      />
      <div slot="text" let:value class="character-item__text">
        {value.name}
      </div>
      <Icon as="chevron-down" slot="icon" strokeWidth={1} />
    </Select>
  </div>
  <div class="row">
    <Select bind:value={weaponType} items={weaponTypes} label="무기">
      <img
        slot="image"
        let:value
        class="option__image option__image--bg-black option__image--p-2"
        src="https://er-static.pages.dev/image/icon/ability/{value}.webp"
        width="24"
        height="24"
        loading="lazy"
        alt={value}
      />
      <div slot="text" let:value>{value}</div>
      <Icon as="chevron-down" slot="icon" strokeWidth={1} />
    </Select>
    <Select bind:value={weapon} items={weapons} key="name">
      <img
        slot="image"
        let:value
        class="option__image option__image--p-2"
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
      <div slot="text" let:value>{value.name}</div>
      <Icon as="chevron-down" slot="icon" strokeWidth={1} />
    </Select>
  </div>
  <div class="row">
    <label for={ids.characterLevel}>실험체 레벨</label>
    <input
      id={ids.characterLevel}
      type="number"
      bind:value={characterLevel}
      min="1"
      max="20"
    />
    <input type="range" bind:value={characterLevel} min="1" max="20" />
  </div>
  <div class="row">
    <label for={ids.weaponLevel}>무기 숙련도</label>
    <input
      id={ids.weaponLevel}
      type="number"
      bind:value={weaponLevel}
      min="1"
      max="20"
    />
    <input type="range" bind:value={weaponLevel} min="1" max="20" />
  </div>
  <div class="row">
    <label for={ids.targetDefense}>대상 방어력</label>
    <input
      id={ids.targetDefense}
      type="number"
      bind:value={targetDefense}
      min="0"
      max="200"
    />
    <input type="range" bind:value={targetDefense} min="0" max="200" />
  </div>
</div>

<style lang="scss">
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
