<script lang="ts">
  import Item from "../comps/Item.svelte";
  import { type PlayerStateOptions } from "../comps/PlayerState.svelte";
  import { calcCritical } from "../lib/calc/critical";
  import { calcDamage } from "../lib/calc/damage";
  import { items, type ItemData } from "../lib/items";
  import { sw } from "../lib/sw";
  import { weaponTypeInfo } from "../lib/weaponTypeInfo";
  import Icon from "./icon/Icon.svelte";
  import ItemsByType from "./items-by-type/ItemsByType.svelte";
  import Pagination from "./pagination/Pagination.svelte";
  // consts
  const getCombinations = () => {
    if (weapon == null) return;
    if (character == null) return;

    const filteredItems = items
      .filter((item) => includeLegendaryItem || item.grade !== "legendary")
      .filter((item) => includeMythicItem || item.grade !== "mythic");
    const itemsBy = ["Chest", "Head", "Arm", "Leg"].reduce(
      (acc, type) => ({
        ...acc,
        [type.toLowerCase()]: filteredItems
          .filter((item) => item.type === type)
          .filter(
            (item) =>
              excludedItems[type].size === 0 ||
              !excludedItems[type].has(item.id),
          )
          .filter(
            (item) =>
              includedItems[type].size === 0 ||
              includedItems[type].has(item.id),
          ),
      }),
      {} as Record<string, ItemData[]>,
    );

    const weaponData = sw.find(
      ({ id, weaponType }) => id === character.id && weaponType === weaponType,
    )?.stats;

    const base = {
      as: dot("as", character, weaponTypeInfo.get(weaponType!)!),
      asr: (weaponData?.asr ?? 0) * weaponLevel,
      adm: (weaponData?.adm ?? 0) * weaponLevel,
    };

    let combs = [];
    console.time("combination");
    for (const chest of itemsBy.chest) {
      for (const head of itemsBy.head) {
        for (const arm of itemsBy.arm) {
          for (const leg of itemsBy.leg) {
            const atk =
              dot("atk", character, weapon, chest, head, arm, leg) -
              character.atkLv;
            const asr = dot("asr", weapon, chest, head, arm, leg) + base.asr;
            const as = Math.max(
              Math.min(base.as * (1 + asr), character.asl),
              character.asm,
            );
            const adm = base.adm;
            const cc = dot("cc", character, weapon, chest, head, arm, leg);
            const cd = dot("cd", weapon, chest, head, arm, leg);
            const pd = dot("pd", weapon, chest, head, arm, leg);
            const pdr = dot("pdr", weapon, chest, head, arm, leg);
            const critical = calcCritical((atk * (1 + adm)) | 0, cc, cd);
            const damage = calcDamage(critical, pd, pdr, targetDefense);
            combs.push({
              equipments: [weapon.id, chest.id, head.id, arm.id, leg.id],
              stats: {
                dps: damage * as,
                atk,
                asr,
                adm,
                as,
                cc,
                cd,
                pd,
                pdr,
                critical,
                damage,
              },
            });
          }
        }
      }
    }
    results = combs.length;
    combs.sort((a, b) => b.stats.atk - a.stats.atk);
    combs.sort((a, b) => b.stats.dps - a.stats.dps);
    sortedBy = "dps";
    console.log(combs.at(0)!.stats);
    combinations = combs;
    console.timeEnd("combination");

    function current<T extends string>(
      id: T,
      idLv: `${T}Lv`,
      obj: { [key in T | `${T}Lv`]?: number },
    ) {
      const base = obj[id] ?? 0;
      const lv = obj[idLv] ?? 0;
      return base + lv * characterLevel;
    }
    function dot<T extends string>(
      id: T,
      ...objs: { [key in T | `${T}Lv`]?: number }[]
    ) {
      const idLv = `${id}Lv` as const;
      return objs.reduce((acc, x) => acc + current(id, idLv, x), 0);
    }
  };
  function sortBy(stats: string) {
    if (!Object.hasOwn(combinations[0]?.stats, stats)) return;
    if (sortedBy === stats) return;

    sortedBy = stats;
    combinations.sort((a, b) => b.stats[stats] - a.stats[stats]);
    combinations = combinations;
  }

  // props
  export let playerState: PlayerStateOptions;

  // states
  let includeLegendaryItem = false;
  let includeMythicItem = false;
  let includedItems: Record<string, Set<number>>;
  let excludedItems: Record<string, Set<number>>;
  let combinations: {
    equipments: number[];
    stats: Record<string, number>;
  }[] = [];
  let sortedBy = "dps";
  let results = 0;

  // derived states
  $: character = playerState.character;
  $: weaponType = playerState.weaponType;
  $: weapon = playerState.weapon;
  $: characterLevel = playerState.characterLevel;
  $: weaponLevel = playerState.weaponLevel;
  $: targetDefense = playerState.targetDefense;
</script>

<div class="settings">
  <div class="option">
    <label for="include-legendary-item">전설 아이템 포함</label>
    <input
      type="checkbox"
      id="include-legendary-item"
      bind:checked={includeLegendaryItem}
    />
  </div>
  <div class="option">
    <label for="include-mythic-item">신화 아이템 포함</label>
    <input
      type="checkbox"
      id="include-mythic-item"
      bind:checked={includeMythicItem}
    />
  </div>
  <details>
    <summary>포함</summary>
    <ItemsByType bind:itemIdSetBy={includedItems} />
  </details>
  <details>
    <summary>제외</summary>
    <ItemsByType bind:itemIdSetBy={excludedItems} />
  </details>
  <button on:click={getCombinations}>생성</button>
</div>
{#if results > 0}
  <div class="results">
    <div>{results}건의 계산 결과</div>
    <div class="combination">
      {#each [{ key: "dps", name: "DPS" }, { key: "damage", name: "피해량" }, { key: "atk", name: "공격력" }, { key: "as", name: "공속" }] as { key, name }}
        <button
          class="c c--7 c--center"
          class:c--sorted={sortedBy === key}
          on:click={() => sortBy(key)}>{name}</button
        >
      {/each}
      <div class="c--center c--fill">아이템</div>
      <div class="c--7 c--center">루트</div>
    </div>
  </div>
  <Pagination items={combinations}>
    <div slot="item" class="combination" let:item={combination}>
      <div class="c--7 c--right">{combination.stats.dps.toFixed(2)}</div>
      <div class="c--7 c--right">{combination.stats.damage}</div>
      <div class="c--7 c--right">{combination.stats.atk | 0}</div>
      <div class="c--7 c--right">{combination.stats.as.toFixed(2)}</div>
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
            ({ id, weaponType }) =>
              id === character.id && weaponType === weaponType,
          )?.index ?? ''}&i1={combination.equipments.join(',')}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon as="map" />
        </a>
      </div>
    </div>
  </Pagination>
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
  .c {
    all: unset;
  }
  .c--7 {
    width: 6ch;
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
  .c--sorted::after {
    content: "▼";
    position: absolute;
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
</style>
