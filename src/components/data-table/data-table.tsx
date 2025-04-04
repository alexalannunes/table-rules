"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { ChevronDown, DatabaseIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dataTable, Payment } from "@/data/data-table";
import { columns, getCellRuleValue } from "./columns";
import { TValueBase } from "@/table";

type RuleOperator =
  | "contains"
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan";

export interface Rule<TData extends RowData, Value = TValueBase> {
  column: keyof TData;
  operator: RuleOperator;
  value: Value;
  styles: React.CSSProperties;
}

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // for string value to compare number value, should allow , but convert
  // improve operators functions
  // for user search
  // 10 === "10" or 10 !== "10"
  const rules: Rule<Payment>[] = [
    {
      column: "status",
      operator: "contains",
      value: "failed",
      styles: {
        backgroundColor: "#ffed9d",
      },
    },
    {
      column: "amount",
      operator: "equals",
      value: 316,
      styles: {
        color: "green",
        fontWeight: "600",
      },
    },
    {
      column: "amount",
      operator: "equals",
      value: 242,
      styles: {
        color: "green",
        fontWeight: "600",
        backgroundColor: "#c0ffc8",
      },
    },
    {
      column: "email",
      operator: "notEquals",
      value: "janedoe@example.com",
      styles: {
        color: "#777",
      },
    },
    {
      column: "email",
      operator: "contains",
      value: "ll",
      styles: {
        color: "red",
      },
    },
    {
      column: "amount",
      operator: "greaterThan",
      value: 900,
      styles: {
        color: "red",
      },
    },
    {
      column: "amount",
      operator: "contains",
      value: "7",
      styles: {
        color: "blue",
      },
    },
  ];

  const table = useReactTable({
    data: dataTable,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      rules,
      rulesFn: (cell) => {
        const columnId = cell?.column?.id || cell?.column?.columnDef?.id;

        if (!columnId) {
          throw new Error("Column ID is not defined");
        }
        const rules = cell.getContext().table?.options.meta?.rules || [];

        const operators: Record<
          RuleOperator,
          (a: TValueBase, b: TValueBase) => boolean
        > = {
          contains: (a, b) => {
            return a
              .toString()
              .toLowerCase()
              .includes(b.toString().toLowerCase());
          },
          equals: (a, b) => {
            if (typeof a === "number" && typeof b === "number") {
              return Number(a) === Number(b);
            }
            return a === b;
          },
          greaterThan: (a, b) => {
            if (typeof a === "number" && typeof b === "number") {
              return Number(a) > Number(b);
            }

            return false;
          },
          lessThan: (a, b) => {
            if (typeof a === "number" && typeof b === "number") {
              return Number(a) < Number(b);
            }
            return false;
          },
          notEquals: (a, b) => {
            if (typeof a === "number" && typeof b === "number") {
              return Number(a) !== Number(b);
            }
            return a !== b;
          },
        };

        const filterRules = rules?.filter((rule) => {
          const columnMatch = rule.column === columnId;
          const value = cell.getValue();

          const operatorFn = operators[rule.operator];
          const operatorMatch = operatorFn(value, rule.value);

          return columnMatch && operatorMatch;
        });
        if (filterRules.length) {
          const combinedStyles = filterRules?.reduce((acc, rule) => {
            return {
              ...acc,
              ...rule.styles,
            };
          }, {});

          return combinedStyles;
        }
        return {};
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-6">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
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
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="outline">
                <DatabaseIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Create rule</DrawerTitle>
              </DrawerHeader>

              <div className="flex flex-col">
                {rules.map((rule, index) => {
                  return (
                    <div key={index} style={rule.styles}>
                      {rule.operator}
                    </div>
                  );
                })}
              </div>

              <DrawerFooter className="flex-row justify-end">
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                <Button>Apply</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <Table className="text-gray-800 table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="bg-gray-100" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
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
                {row.getVisibleCells().map((cell) => {
                  const styles = getCellRuleValue(cell);
                  return (
                    <TableCell key={cell.id} className="px-6" style={styles}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
