import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import type { Column, ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import Equipment from "./equipment.svelte";
import SortButton from "./sort-button.svelte";

export interface EquipmentStat {
  equipments: number[];
  dps: number;
  atk: number;
  asr: number;
  adm: number;
  as: number;
  cc: number;
  cd: number;
  pd: number;
  pdr: number;
  critical: number;
  damage: number;
}

export const columns: ColumnDef<EquipmentStat>[] = [
  {
    accessorKey: "dps",
    header: renderSortableHeader("DPS"),
    cell: ({ row }) => renderNumber(row.getValue("dps"), 2),
  },
  {
    accessorKey: "damage",
    header: renderSortableHeader("단일 피해"),
    cell: ({ row }) => renderNumber(row.getValue("damage")),
  },
  {
    accessorKey: "atk",
    header: renderSortableHeader("공격력"),
    cell: ({ row }) => renderNumber(row.getValue("atk")),
  },
  {
    accessorKey: "as",
    header: renderSortableHeader("공속"),
    cell: ({ row }) => renderNumber(row.getValue("as"), 2),
  },
  {
    accessorKey: "equipments",
    header: () => renderRight("장비"),
    cell: ({ row }) => renderEquipments(row.getValue("equipments")),
  },
];

function renderNumber(value: number, fixed?: number) {
  return renderRight(fixed != null ? value.toFixed(fixed) : value);
}

function renderRight(text: string | number) {
  return renderSnippet(
    createRawSnippet<[string | number]>((get) => ({
      render: () => `<div class="text-right">${get()}</div>`,
    })),
    text,
  );
}

function renderEquipments(equipments: number[]) {
  return renderComponent(Equipment, {
    equipments,
    size: "sm",
  });
}

function renderSortableHeader<T>(label: string) {
  return ({ column }: { column: Column<T, unknown> }) =>
    renderComponent(SortButton, {
      label,
      state: column.getIsSorted(),
      onclick: () => {
        switch (column.getIsSorted()) {
          case false:
            column.toggleSorting(true);
            break;
          case "desc":
            column.toggleSorting(false);
            break;
          case "asc":
            column.clearSorting();
            break;
        }
      },
    });
}
