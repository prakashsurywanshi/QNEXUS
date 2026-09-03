import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Columns3,
  Download,
  type LucideIcon,
} from "lucide-react"
import * as React from "react"

import EmptyState from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: LucideIcon | null
  selectable?: boolean
  getRowId?: (row: TData) => string
  bulkActions?: (rows: Row<TData>[]) => React.ReactNode
  exportable?: boolean
  exportFilename?: string
  exportColumns?: ColumnDef<TData, TValue>[]
}

function toCsv<TData, TValue>(rows: TData[], columns: ColumnDef<TData, TValue>[]): string {
  const colDefs = columns.filter(
    (col) => col.id !== "__select" && col.id !== "actions",
  )

  const headers = colDefs.map((col) =>
    escapeCsv(typeof col.header === "string" ? col.header : ""),
  )

  const body = rows.map((row) =>
    colDefs
      .map((col) => {
        const key = (col as { accessorKey?: string }).accessorKey ?? col.id ?? ""
        const value = key.split(".").reduce<unknown>((acc, part) => {
          return acc && typeof acc === "object"
            ? (acc as Record<string, unknown>)[part]
            : acc
        }, row as unknown)
        return escapeCsv(String(value ?? ""))
      })
      .join(","),
  )

  return [headers.join(","), ...body].join("\n")
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  pageSize = 10,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  selectable = false,
  getRowId,
  bulkActions,
  exportable = false,
  exportFilename = "export.csv",
  exportColumns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const allColumns = React.useMemo(() => {
    if (!selectable) return columns
    const selectCol: ColumnDef<TData, TValue> = {
      id: "__select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }
    return [selectCol, ...columns]
  }, [columns, selectable])

  const table = useReactTable({
    data,
    columns: allColumns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  })

  const pageCount = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex

  const handleExport = () => {
    const rows = table.getFilteredRowModel().rows.map((r) => r.original)
    const cols = exportColumns ?? columns
    const csv = toCsv(rows, cols)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = exportFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const selectedRows = table.getSelectedRowModel().rows

  const buildPageLinks = () => {
    const visible: number[] = []
    const total = pageCount
    const current = pageIndex
    const start = Math.max(0, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) {
      visible.push(i)
    }
    return visible
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        )}
        <div className="ml-auto flex items-center gap-2">
          {exportable && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 size-4" />
              Export
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="mr-2 size-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {String(column.columnDef.header ?? column.id)}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {selectable && selectedRows.length > 0 && bulkActions && (
        <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} selected
          </span>
          <div className="ml-auto">{bulkActions(selectedRows)}</div>
        </div>
      )}

      <div className="hidden overflow-x-auto rounded-md border sm:block">
        <Table className="min-w-[640px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column
                  const isSortable = column.getCanSort()
                  return (
                    <TableHead key={header.id}>
                      {isSortable ? (
                        <button
                          type="button"
                          className="flex items-center gap-1 font-medium"
                          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                          {flexRender(column.columnDef.header, header.getContext())}
                          {column.getIsSorted() === "asc" ? (
                            <ChevronUp className="size-3.5" />
                          ) : column.getIsSorted() === "desc" ? (
                            <ChevronDown className="size-3.5" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="p-0">
                  <EmptyState
                    compact
                    icon={emptyIcon}
                    title={emptyTitle ?? "No results"}
                    description={
                      emptyDescription ??
                      (searchKey
                        ? "Try adjusting your search or filters."
                        : "Nothing to show right now. Create your first record to get started.")
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {table.getRowModel().rows?.length ? (
        <div className="space-y-3 sm:hidden">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="rounded-md border p-3"
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => {
                const id = cell.column.id
                if (id === "__select") {
                  return (
                    <div key={cell.id} className="mb-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  )
                }
                if (id === "actions") {
                  return (
                    <div key={cell.id} className="mt-3 flex justify-end gap-2 border-t pt-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  )
                }
                return (
                  <div key={cell.id} className="flex items-start justify-between gap-3 py-1.5">
                    <span className="text-sm font-medium text-muted-foreground">
                      {typeof cell.column.columnDef.header === "string"
                        ? cell.column.columnDef.header
                        : ""}
                    </span>
                    <span className="text-right text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="sm:hidden">
          <EmptyState
            compact
            icon={emptyIcon}
            title={emptyTitle ?? "No results"}
            description={
              emptyDescription ??
              (searchKey
                ? "Try adjusting your search or filters."
                : "Nothing to show right now. Create your first record to get started.")
            }
          />
        </div>
      )}
      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            {pageIndex > 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {buildPageLinks().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === pageIndex}
                  onClick={() => table.setPageIndex(page)}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {pageIndex < pageCount - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  !table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {table.getState().pagination.pageSize * pageIndex + 1}–
            {Math.min(
              table.getFilteredRowModel().rows.length,
              table.getState().pagination.pageSize * (pageIndex + 1),
            )}{" "}
            of {table.getFilteredRowModel().rows.length}
          </p>
          <Button variant="outline" size="sm" onClick={() => table.resetPageIndex()}>
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}
