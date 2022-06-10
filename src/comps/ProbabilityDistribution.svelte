<script lang="ts">
  import { actualUsedCriticalChance } from "../lib/actual-cc";

  export let iterationCount = 100000;
  export let n = 4;
  export let atk = 150;
  export let cc = 0.7;
  export let cd = 1.7;
  $: aucc = actualUsedCriticalChance.get(cc) ?? 0;
  function getPd(
    iterationCount: number,
    n: number,
    attackPower: number,
    criticalChance: number,
    criticalDamage: number
  ) {
    const agg: Record<number, number> = {};
    for (let i = 0; i < iterationCount; i++) {
      let value = 0;
      for (let j = 0; j < n; j++) {
        value += (attackPower * (Math.random() < criticalChance ? criticalDamage : 1)) | 0;
      }
      agg[value] = (agg[value] ?? 0) + 1;
    }
    return Object.entries(agg)
      .map(([k, v]) => [k, v / iterationCount] as const)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  }
  $: pd = getPd(iterationCount, n, atk, aucc, cd);
  $: realE = (atk * (1 - aucc) + atk * aucc * cd) * n;
</script>

<div class="graph">
  <div>누적피해량</div>
  <div>확률</div>
  {#each pd as [k, v]}
    <div>{k}</div>
    <div
      class="probability"
      style={`---width: ${(v * 100).toFixed(2)}%`}
      data-content={`${(v * 100).toFixed(2)}%`}
    />
  {/each}
</div>
<div>
  기댓값 {realE | 0}
</div>

<style>
  .graph {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 4px;
  }
  .graph .probability {
    position: relative;
  }
  .graph .probability::before {
    position: absolute;
    content: "";
    width: var(---width);
    height: 100%;
    background: goldenrod;
  }
  .graph .probability::after {
    position: absolute;
    width: 100%;
    content: attr(data-content);
    text-align: right;
  }
</style>
