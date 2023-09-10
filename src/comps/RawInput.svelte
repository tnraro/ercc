<script lang="ts">
  export let lv: number;
  export let n: number;
  export let atk: number;
  export let cc: number;
  export let cd: number;
  export let pd: number;
  export let pdr: number;
  export let def: number;
</script>

<div class="container">
  <label>
    <input type="range" min={1} max={20} step={1} bind:value={lv} />
    캐릭터 레벨 {lv}
  </label>
  <label>
    <input type="range" min={0} max={10} step={1} bind:value={n} />
    시행 횟수 {n}
  </label>
  <label>
    <input type="range" min={50} max={250} step={1} bind:value={atk} />
    공격력 {atk}
  </label>
  <label>
    <input type="range" min={0} max={1} step={0.01} bind:value={cc} />
    치명타 확률 {(cc * 100) | 0}%
  </label>
  <label>
    <input type="range" min={1.7} max={2.25} step={0.01} bind:value={cd} />
    치명타 피해량 {(cd * 100) | 0}%
  </label>
  <label>
    <input type="range" min={0} max={80} step={1} bind:value={pd} />
    방어 관통 {pd}
  </label>
  <label>
    <input type="range" min={0} max={1} step={0.01} bind:value={pdr} />
    방어 관통(%) {(pdr * 100) | 0}%
  </label>
  <label>
    <input type="range" min={0} max={200} step={1} bind:value={def} />
    상대 방어력 {def}
  </label>
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
</style>
