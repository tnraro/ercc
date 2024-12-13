export const prerender = true;

export function load() {
  return {
    routes: [
      { label: "조합", link: "/best-combinations" },
      { label: "비교", link: "/compare-item-values" },
    ],
  };
}
