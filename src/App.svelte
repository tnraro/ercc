<script lang="ts">
  import ItemInput from "./comps/ItemInput.svelte";
  import ProbabilityDistribution from "./comps/ProbabilityDistribution.svelte";
  import RawInput from "./comps/RawInput.svelte";

  let lv = 10;
  let n = 4;
  let atk = 150;
  let cc = 0.7;
  let cd = 1.7;
</script>

<main>
  <RawInput bind:lv bind:n bind:atk bind:cc bind:cd />
  <ProbabilityDistribution {n} {atk} {cc} {cd} />
  <ItemInput bind:lv bind:atk bind:cc bind:cd />
</main>
<footer>
  <p>치명타만 계산함.</p>
  <p>코발트, 캐릭터 스탯, 캐릭터 레벨 당 스탯, 기본 공격 증폭, 공격 속도, 이동 속도, 각종 유틸, ... 등등은 생략함</p>
  <p>루트 짜는 사이트: <a href="https://aya.gg/">aya.gg</a></p>
</footer>

<style>
  :root {
    font-family: sans-serif;
  }
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
    height: 100vh;
  }
</style>
