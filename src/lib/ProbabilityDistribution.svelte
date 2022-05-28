<script lang="ts">
  let iterationCount = 100000;
  let n = 4;
  let attackPower = 150;
  let criticalChance = 0.7;
  let criticalDamage = 1.7;
  const actualUsedCriticalChance = new Map<number, number>([
    [0, 0],
    [0.01, 0.0005],
    [0.02, 0.0014],
    [0.03, 0.0022],
    [0.04, 0.003],
    [0.05, 0.0038],
    [0.06, 0.006],
    [0.07, 0.0082],
    [0.08, 0.0104],
    [0.09, 0.0126],
    [0.1, 0.0148],
    [0.11, 0.0182],
    [0.12, 0.0217],
    [0.13, 0.0252],
    [0.14, 0.0287],
    [0.15, 0.0322],
    [0.16, 0.0369],
    [0.17, 0.0416],
    [0.18, 0.0463],
    [0.19, 0.051],
    [0.2, 0.0557],
    [0.21, 0.0615],
    [0.22, 0.0673],
    [0.23, 0.0731],
    [0.24, 0.0789],
    [0.25, 0.0848],
    [0.26, 0.0916],
    [0.27, 0.0984],
    [0.28, 0.1053],
    [0.29, 0.1121],
    [0.3, 0.119],
    [0.31, 0.1264],
    [0.32, 0.134],
    [0.33, 0.1418],
    [0.34, 0.1498],
    [0.35, 0.158],
    [0.36, 0.1663],
    [0.37, 0.1749],
    [0.38, 0.1836],
    [0.39, 0.1925],
    [0.4, 0.2016],
    [0.41, 0.2109],
    [0.42, 0.2204],
    [0.43, 0.2299],
    [0.44, 0.2395],
    [0.45, 0.2493],
    [0.46, 0.2599],
    [0.47, 0.2705],
    [0.48, 0.281],
    [0.49, 0.2916],
    [0.5, 0.3021],
    [0.51, 0.3127],
    [0.52, 0.3233],
    [0.53, 0.3341],
    [0.54, 0.3474],
    [0.55, 0.3604],
    [0.56, 0.3732],
    [0.57, 0.3858],
    [0.58, 0.3983],
    [0.59, 0.4106],
    [0.6, 0.4227],
    [0.61, 0.4346],
    [0.62, 0.4464],
    [0.63, 0.4581],
    [0.64, 0.4697],
    [0.65, 0.4811],
    [0.66, 0.4925],
    [0.67, 0.5075],
    [0.68, 0.5294],
    [0.69, 0.5507],
    [0.7, 0.5714],
    [0.71, 0.5916],
    [0.72, 0.6111],
    [0.73, 0.6301],
    [0.74, 0.6487],
    [0.75, 0.6667],
    [0.76, 0.6842],
    [0.77, 0.7013],
    [0.78, 0.718],
    [0.79, 0.7342],
    [0.8, 0.75],
    [0.81, 0.7654],
    [0.82, 0.7805],
    [0.83, 0.7952],
    [0.84, 0.8095],
    [0.85, 0.8235],
    [0.86, 0.8372],
    [0.87, 0.8506],
    [0.88, 0.8636],
    [0.89, 0.8764],
    [0.9, 0.8889],
    [0.91, 0.9011],
    [0.92, 0.913],
    [0.93, 0.9247],
    [0.94, 0.9362],
    [0.95, 0.9474],
    [0.96, 0.9583],
    [0.97, 0.9691],
    [0.98, 0.9796],
    [0.99, 0.9899],
    [1, 1],
  ]);
  function getPd(
    iterationCount: number,
    n: number,
    attackPower: number,
    criticalChance: number,
    criticalDamage: number
  ) {
    const agg: Record<number, number> = {};
    const cc = actualUsedCriticalChance.get(criticalChance);
    if (cc == null) throw new Error("Critical chance not found" + criticalChance);
    for (let i = 0; i < iterationCount; i++) {
      let value = 0;
      for (let j = 0; j < n; j++) {
        value += attackPower * (Math.random() < cc ? criticalDamage : 1) | 0;
      }
      agg[value] = (agg[value] ?? 0) + 1;
    }
    return Object.entries(agg)
      .map(([k, v]) => [k, v / iterationCount] as const)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  }
  $: pd = getPd(iterationCount, n, attackPower, criticalChance, criticalDamage);
  $: expectedValue = pd.reduce((acc, [k, v]) => acc + parseInt(k) * v, 0);
</script>

<div class="container">
  <label>
    <input type="range" min={0} max={10} step={1} bind:value={n} />
    시행 횟수 {n}
  </label>
  <label>
    <input type="range" min={50} max={250} step={1} bind:value={attackPower} />
    공격력 {attackPower}
  </label>
  <label>
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      bind:value={criticalChance}
    />
    치명타 확률 {(criticalChance * 100) | 0}%
  </label>
  <label>
    <input
      type="range"
      min={1.7}
      max={2.25}
      step={0.01}
      bind:value={criticalDamage}
    />
    치명타 피해량 {(criticalDamage * 100) | 0}%
  </label>
</div>
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
  기댓값 {expectedValue | 0}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }
  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5em;
  }
  input {
    width: 100%;
  }
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
