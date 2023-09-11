<script lang="ts">
  import { sw } from "../lib/sw";
  import { characters } from "../lib/characters";
  import { items, type ItemData } from "../lib/items";
  import { calcCritical } from "../lib/calc/critical";
  import { calcDamage } from "../lib/calc/damage";
  import Item from "../comps/Item.svelte";
  import { weaponTypeInfo } from "../lib/weaponTypeInfo";
  import Icon from "./icon/Icon.svelte";

  let character = characters[9];
  $: updateWeaponTypes(), character;
  let weaponTypes: string[];
  let weaponType: string | undefined = undefined;
  $: updateWeapons(), weaponType, includeLegendaryItem;
  let weapons: ItemData[];
  let weapon: ItemData | undefined = undefined;
  let characterLevel = 7;
  let weaponLevel = 5;
  let page = 0;
  let includeLegendaryItem = false;
  let combinations: {
    dps: number;
    damage: number;
    attackSpeed: number;
    equipments: number[];
  }[] = [];
  let targetDef = 120;
  let results = 0;
  $: paginationedCombinations = combinations.slice(page * 10, page * 10 + 10);
  let pages = [] as number[];
  $: updatePages(combinations, page);
  const updatePages = (combinations: unknown[], page: number) => {
    const start = Math.max(page - 5, 0);
    const end = Math.min(start + 10, Math.ceil(combinations.length / 10));
    pages = Array.from({ length: end - start }).map((_, i) => start + i + 1);
  };
  const updateWeaponTypes = () => {
    weaponTypes = sw
      .filter(([_, characterId]) => characterId === character.id)
      .map((x) => x[2]) as string[];
    weaponType = weaponTypes[0];
  };
  const updateWeapons = () => {
    weapons = items.filter(
      (item) =>
        item.type === weaponType &&
        (includeLegendaryItem || item.grade !== "legendary")
    );
    if (weapon == null || weapons.find((w) => w.id === weapon!.id) == null) {
      weapon = weapons.at(0);
    }
  };
  const getCombinations = () => {
    if (weapon == null) return;
    const typeToArmors = ["Chest", "Head", "Arm", "Leg"].map((type) =>
      items.filter(
        (item) =>
          item.type === type &&
          (includeLegendaryItem || item.grade !== "legendary")
      )
    );
    const current = <T extends string>(
      id: T,
      obj: { [key in T | `${T}Lv`]?: number }
    ) => (obj[id] ?? 0) + (obj[`${id}Lv`] ?? 0) * characterLevel;
    const dot = <T extends string>(
      id: T,
      ...objs: { [key in T | `${T}Lv`]?: number }[]
    ) => objs.reduce((acc, x) => acc + current(id, x), 0);

    const weaponData = sw.find(
      (x) => x[1] === character.id && x[2] === weaponType
    )![3];

    const __as = dot("as", character, weaponTypeInfo.get(weaponType!)!);
    const __asr = (weaponData.asr ?? 0) * weaponLevel;
    const adm = 1 + (weaponData.adm ?? 0) * weaponLevel;

    const combs = [];
    console.time("combination");
    for (const chest of typeToArmors[0]) {
      for (const head of typeToArmors[1]) {
        for (const arm of typeToArmors[2]) {
          for (const leg of typeToArmors[3]) {
            const atk = dot("atk", character, weapon, chest, head, arm, leg);
            const asr = dot("asr", weapon, chest, head, arm, leg) + __asr;
            const as = Math.max(
              Math.min(__as * (1 + asr), character.asl),
              character.asm
            );
            const cc = dot("cc", character, weapon, chest, head, arm, leg);
            const cd = dot("cd", weapon, chest, head, arm, leg);
            const pd = dot("pd", weapon, chest, head, arm, leg);
            const pdr = dot("pdr", weapon, chest, head, arm, leg);
            const critical = calcCritical(atk, cc, cd);
            const damage = calcDamage(critical, adm, pd, pdr);
            combs.push({
              dps: damage * as,
              damage,
              attackSpeed: as,
              equipments: [weapon.id, chest.id, head.id, arm.id, leg.id],
            });
          }
        }
      }
    }
    results = combs.length;
    combs.sort((a, b) => b.dps - a.dps);
    page = 0;
    combinations = combs;
    console.timeEnd("combination");
  };
</script>

<div class="settings">
  <div class="option">
    <label for="character">실험체</label>
    <select id="character" bind:value={character}>
      {#each characters as character (character.id)}
        <option value={character}>{character.name}</option>
      {/each}
    </select>
  </div>
  <div class="option">
    <label for="weapon-type">무기</label>
    <select id="weapon-type" bind:value={weaponType}>
      {#each weaponTypes as weaponType}
        <option>{weaponType}</option>
      {/each}
    </select>
    <select id="weapon" bind:value={weapon}>
      {#each weapons as weapon (weapon.id)}
        <option value={weapon}>{weapon.name}</option>
      {/each}
    </select>
  </div>
  <div class="option">
    <label for="character-level">실험체 레벨</label>
    <input type="number" min={1} max={20} bind:value={characterLevel} />
    <input
      id="character-level"
      type="range"
      min={1}
      max={20}
      bind:value={characterLevel}
    />
  </div>
  <div class="option">
    <label for="weapon-level">무기 숙련도</label>
    <input type="number" min={1} max={20} bind:value={weaponLevel} />
    <input
      id="weapon-level"
      type="range"
      min={1}
      max={20}
      bind:value={weaponLevel}
    />
  </div>
  <div class="option">
    <label for="target-def">상대 방어력</label>
    <input type="number" min={0} max={200} bind:value={targetDef} />
    <input
      id="target-def"
      type="range"
      min={0}
      max={200}
      bind:value={targetDef}
    />
  </div>
  <div class="option">
    <label for="include-legendary-item">전설 아이템 포함</label>
    <input
      type="checkbox"
      id="include-legendary-item"
      bind:checked={includeLegendaryItem}
    />
  </div>
  <button on:click={getCombinations}>생성</button>
</div>
{#if results > 0}
  <div class="results">
    <div>{results}건의 계산 결과</div>
    <div class="combination">
      <div class="c--7 c--center">DPS</div>
      <div class="c--7 c--center">피해량</div>
      <div class="c--7 c--center">공속</div>
      <div class="c--center c--fill">아이템</div>
      <div class="c--7 c--center">루트</div>
    </div>
    {#each paginationedCombinations as combination}
      <div class="combination">
        <div class="c--7 c--right">{combination.dps.toFixed(2)}</div>
        <div class="c--7 c--right">{combination.damage}</div>
        <div class="c--7 c--right">{combination.attackSpeed.toFixed(2)}</div>
        <div class="spacer" />
        <div class="equipments">
          {#each combination.equipments as itemId}
            <Item id={itemId} />
          {/each}
        </div>
        <div class="c--7 c--center">
          <a
            class="map"
            href="https://aya.gg/route?sw1={sw.find(
              (x) => x[1] === character.id && x[2] === weaponType
            )?.[0] ?? ''}&i1={combination.equipments.join(',')}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon as="map" />
          </a>
        </div>
      </div>
    {/each}
  </div>
  <div class="pagination">
    <div class="buttons">
      <button on:click={(_) => (page = 0)}>|&lt;</button>
      <button on:click={(_) => (page = Math.max(0, page - 1))}>&lt;</button>
    </div>
    <div class="buttons">
      {#each pages as pageNum}
        <button
          class:current-page={pageNum - 1 === page}
          on:click={(_) => {
            page = pageNum - 1;
          }}
        >
          {pageNum}
        </button>
      {/each}
    </div>
    <div class="buttons">
      <button
        on:click={(_) =>
          (page = Math.min(Math.ceil(combinations.length / 10), page + 1))}
        >&gt;</button
      >
      <button on:click={(_) => (page = Math.ceil(combinations.length / 10) - 1)}
        >&gt;|</button
      >
    </div>
  </div>
{/if}

<style>
  .settings {
    display: flex;
    flex-flow: column;
    gap: 0.5rem;
  }
  .option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .results {
    display: flex;
    flex-flow: column;
    gap: 0.25rem;
  }
  .combination {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .spacer {
    flex: 1;
  }
  .c--7 {
    width: 7ch;
  }
  .c--right {
    text-align: right;
  }
  .c--center {
    text-align: center;
  }
  .c--fill {
    flex: 1;
  }
  .equipments {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(5, 64px);
    gap: 0.25rem;
  }
  .map {
    color: hsl(210deg 5% 40%);
  }
  .pagination {
    display: flex;
    justify-content: space-between;
  }
  .buttons {
    display: flex;
    gap: 0.25rem;
  }
  .current-page {
    background: brown;
    color: white;
  }
</style>
