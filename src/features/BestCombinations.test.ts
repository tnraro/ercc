import { fireEvent, render, screen } from "@testing-library/svelte";
import type { PlayerStateOptions } from "src/comps/PlayerState.svelte";
import BestCombinations from "./BestCombinations.svelte";

test("initial", async () => {
  render(BestCombinations, defaultProps);

  const button = await screen.findByRole("button", { name: "생성" });

  fireEvent.click(button);

  expect(await screen.findByText(/\d+건의 계산 결과/)).toBeInTheDocument();

  expect(await screen.findByText("218.75")).toBeInTheDocument();
  expect(await screen.findByText("210.30")).toBeInTheDocument();
});

const defaultProps: { playerState: PlayerStateOptions } = {
  playerState: {
    character: {
      id: 1,
      name: "Jackie",
      atk: 43,
      atkLv: 4.5,
      as: 0.1,
      asl: 2.5,
      asm: 0,
      asLv: 0,
      cc: 0,
      ccLv: 0
    },
    weapon: {
      id: 101401,
      name: "카른웬난",
      type: "OneHandSword",
      modeType: 0,
      grade: "epic",
      atk: 59,
      atkLv: 0,
      asr: 0.2,
      asrLv: 0,
      cc: 0,
      cd: 0,
      pd: 0,
      pdr: 0,
      upd: 0,
      updr: 0
    },
    weaponType: "OneHandSword",
    characterLevel: 6,
    weaponLevel: 3,
    targetDefense: 90
  }
}
