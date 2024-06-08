import { render, screen } from "@testing-library/svelte";
import Item from "./Item.svelte";
describe("Item", () => {
  test("button to be in the document", () => {
    render(Item);
    expect(screen.getByRole("button")).toBeInTheDocument();
  })
});