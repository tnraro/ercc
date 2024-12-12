<script lang="ts" generics="TData, TValue">
  import {
    createSvelteTable,
    FlexRender,
  } from "$lib/components/ui/data-table/index.js";
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNextButton,
    PaginationPrevButton,
  } from "$lib/components/ui/pagination";
  import * as Table from "$lib/components/ui/table/index.js";
  import {
    type ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
  } from "@tanstack/table-core";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

  let { data, columns }: DataTableProps<TData, TValue> = $props();

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let sorting = $state<SortingState>([{ id: "dps", desc: true }]);

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      get pagination() {
        return pagination;
      },
      get sorting() {
        return sorting;
      },
    },
    onPaginationChange(updater) {
      if (typeof updater === "function") {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    onSortingChange(updater) {
      if (typeof updater === "function") {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
  });
</script>

<div class="flex flex-col gap-2">
  <div class="equipment-stat-table h-[411.5px] rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head>
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && "selected"}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell>
                <FlexRender
                  content={cell.column.columnDef.cell}
                  context={cell.getContext()}
                />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">
              No results.
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <Pagination
    class="items-end"
    count={data.length}
    perPage={pagination.pageSize}
    page={pagination.pageIndex + 1}
    onPageChange={(page) => {
      pagination.pageIndex = page - 1;
      table.setPageIndex(pagination.pageIndex);
    }}
  >
    {#snippet children({ pages, currentPage })}
      <PaginationContent>
        {#each pages as page (page.key)}
          {#if page.type === "ellipsis"}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          {:else}
            <PaginationItem>
              <PaginationLink {page} isActive={currentPage === page.value}
                >{page.value}</PaginationLink
              >
            </PaginationItem>
          {/if}
        {/each}
        <PaginationItem>
          <PaginationPrevButton class="px-3">
            <ChevronLeft />
          </PaginationPrevButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationNextButton class="px-3">
            <ChevronRight />
          </PaginationNextButton>
        </PaginationItem>
      </PaginationContent>
    {/snippet}
  </Pagination>
</div>

<style>
  .equipment-stat-table :global(th:not(:last-child)) {
    width: 0;
  }
</style>
