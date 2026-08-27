"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, X, ChevronLeft, ChevronRight, Loader2, Inbox } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-3.5 min-w-0 font-sans">
      {/* ─── SEARCH & FILTER CONTROLS ─── */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9.5 pl-9 pr-8 text-xs bg-background border-border/80 rounded-xl focus-visible:ring-1 focus-visible:ring-cyan-500"
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => setGlobalFilter("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
              aria-label="Clear filter"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Total Records Counter */}
        <div className="hidden sm:block text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
          {table.getFilteredRowModel().rows.length} Total Records
        </div>
      </div>

      {/* ─── DATA TABLE CONTAINER ─── */}
      <div className="w-full overflow-x-auto rounded-2xl border border-border/80 bg-card min-w-0 shadow-xs">
        <Table className="whitespace-nowrap text-xs">
          <TableHeader className="bg-muted/40 border-b border-border/70">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 px-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground select-none"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              /* Loading State */
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      Loading data...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              /* Rows Display */
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-border/40 transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 text-foreground font-medium">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              /* Empty Search / Empty Data State */
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-36 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                    <Inbox className="h-6 w-6 stroke-[1.5] text-muted-foreground/60" />
                    <span className="text-xs font-semibold text-foreground">No records found</span>
                    <span className="text-[11px] text-muted-foreground">Try adjusting your search filters</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── PAGINATION CONTROLS ─── */}
      <div className="flex items-center justify-between gap-3 px-1 pt-0.5">
        <div className="text-[11px] font-mono text-muted-foreground">
          Page <span className="font-bold text-foreground">{table.getState().pagination.pageIndex + 1}</span> of{" "}
          <span className="font-bold text-foreground">{table.getPageCount() || 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
            className="h-8.5 px-3 text-xs rounded-xl border-border/80 hover:bg-accent cursor-pointer select-none gap-1"
          >
            <ChevronLeft size={13} />
            <span className="hidden xs:inline">Previous</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            className="h-8.5 px-3 text-xs rounded-xl border-border/80 hover:bg-accent cursor-pointer select-none gap-1"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}