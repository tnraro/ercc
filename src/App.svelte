<script lang="ts">
    import BestCombinations from "./features/BestCombinations.svelte";

</script>

<main>
  <BestCombinations />
</main>
<footer>
  <h1>Disclaimer</h1>
  <p>본 계산기는 한정된 정보를 이용하여 주관적인 결과를 제공합니다.</p>
  <p>본 계산기는 정보의 완전성, 정확성, 적시성을 보증하지 않습니다.</p>
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
