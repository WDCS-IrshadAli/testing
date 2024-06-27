"use client"
 
import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { deleteModulesForm, getModulesData } from "@/app/lib/action"
import Link from "next/link"
import { useFormState } from "react-dom"
import { Toaster, toast } from "sonner"

    
const DirectusTable = ({ moduleName, modulesData, tableData, fieldsData, totalDataCount, totalPage, currentPage, dynamicTableFields }: any) => {
        console.log("field data = ", dynamicTableFields);
        console.log("table data = ", tableData);
        
        
        const data: any = tableData;
        // columns (header) 
        let cols: any = [];        
        dynamicTableFields?.map((curElem: any) => {
            if (curElem?.fieldName=="id" || curElem?.fieldName=="sort" || curElem?.fieldName=="date_created" || curElem?.fieldName=="user_created" || curElem?.fieldName=="status" || curElem?.fieldName=="user_updated" || curElem?.fieldName=="date_updated") return;
            cols = [
                ...cols,
                {
                    accessorKey: `${curElem?.fieldName}`,
                    header: ({ column }: any) => {
                    return (
                        <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                        {curElem?.tableColsName}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    )
                    },
                    cell: ({ row }: any) => <div className="lowercase">{row.getValue(`${curElem?.fieldName}`)}</div>,    
                }
            ]
        })
        const columns: any[] = [
            {
                id: "select",
                header: ({ table }: any) => (
                <Checkbox
                    checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
                ),
                cell: ({ row }: any) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            // {
            //     accessorKey: "status",
            //     header: "Status",
            //     cell: ({ row }: any) => (
            //     <div className="capitalize">{row.getValue("status")}</div>  
            //     ),
            // },
            ...cols,
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }: any) => {
                const payment = row.original
                
                const initialState: any = { message: null, error: null, success: null };                
                const createFormWithId = deleteModulesForm.bind(null, [row?.original?.modules_data_id], row?.original?.values_data_id);
                const [state, dispatch] = useFormState(createFormWithId, initialState);

                // error handling 
                if (state.success === false) {
                    toast.error(state.error);
                    state.success = null;
                    state.error = null;
                } else if (state.success === true) {
                    toast.success(state.message);
                    state.success = null;
                    state.message = null;
                    // setTimeout(() => {
                    // router.push(`/directus/${moduleName}`)
                    // }, 1000)
                }
                
                return (
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>
                            <form action={dispatch}>
                                <button type="submit">Delete</button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                )
                },
            },
        ]
        
        // filtering (sorting)
        const [sorting, setSorting] = React.useState<SortingState>([])
        const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
            []
        )
        const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
        const [rowSelection, setRowSelection] = React.useState({})
        
        const table = useReactTable({
            data,
            columns,
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            // getFilteredRowModel: getFilteredRowModel(),
            onColumnVisibilityChange: setColumnVisibility,
            onRowSelectionChange: setRowSelection,
            state: {
            sorting,
                columnFilters,
                columnVisibility,
                rowSelection,
            },
        })

        return (
            <>
                <Toaster position="top-right" theme="dark" richColors />
                <div className="w-full">
                    <div className="flex items-center py-4">
                        <Input
                        placeholder={`Filter ${dynamicTableFields[0]?.fieldName}...`}
                        value={(table.getColumn(`${dynamicTableFields[0]?.fieldName}`)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(`${dynamicTableFields[0]?.fieldName}`)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                        />
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                                )
                            })}
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
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
                                <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                    </TableCell>
                                ))}
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                                >
                                No results.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="space-x-2">
                            <Link href={`/directus/${moduleName}?page=1`}>
                                <Button variant="outline" size="sm" type="button">First</Button>    
                            </Link>
                            <Link href={`/directus/${moduleName}?page=${(currentPage<=1 ? 1 : currentPage-1)}`}>
                                <Button variant="outline" size="sm" type="button">Previous</Button>    
                            </Link>
                            <span className="text-[12px]">Page {currentPage} of {totalPage}</span>
                            <Link href={`/directus/${moduleName}?page=${(currentPage>=totalPage ? totalPage : currentPage+1)}`}>
                                <Button variant="outline" size="sm" type="button">Next</Button>    
                            </Link>
                            <Link href={`/directus/${moduleName}?page=${totalPage}`}>
                                <Button variant="outline" size="sm" type="button">Last</Button>    
                            </Link>
                            {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button> */}
                        </div>
                    </div>
                    </div>
            </>
        )
}

export default DirectusTable