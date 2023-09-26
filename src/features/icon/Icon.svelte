<script lang="ts">
  import Icon from "./icons.svg";
  export let as: "map" | "chevron-down";
  export let strokeWidth: 1 | 2 | 4 | undefined = undefined;
</script>

<svg
  ><use
    href="{Icon}#{as}"
    class:stroke-width-1={strokeWidth === 1}
    class:stroke-width-2={strokeWidth === 2}
    class:stroke-width-4={strokeWidth === 4}
  /></svg
>

<style lang="scss">
  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .stroke-width {
    &-1 {
      stroke-width: 1;
    }
    &-2 {
      stroke-width: 2;
    }
    &-4 {
      stroke-width: 4;
    }
  }
</style>
