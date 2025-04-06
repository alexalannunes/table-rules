"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
import {
  Bold,
  ChevronDown,
  DatabaseIcon,
  Italic,
  Underline,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { TValueBase } from "@/table";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { columns, getCellRuleValue } from "./columns";

type RuleOperator =
  | "contains"
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan";

const operatorOptions: Record<RuleOperator, string> = {
  contains: "Contains",
  equals: "Equals",
  notEquals: "Not Equals",
  greaterThan: "Greater Than",
  lessThan: "Less Than",
};

export function ColorPicker({
  background,
  setBackground,
}: {
  background: string;
  setBackground: (background: string) => void;
  className?: string;
}) {
  const solids = [
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
  ];

  return (
    <div className="flex gap-2">
      {solids.map((s) => (
        <div
          key={s}
          style={{ background: s }}
          role="button"
          className={cn("rounded-md h-6 w-6 cursor-pointer", {
            "ring-offset-1 ring-2 ring-gray-200": s === background,
          })}
          onClick={() => setBackground(s)}
        />
      ))}
    </div>
  );
}

export interface Rule<TData extends RowData, Value = TValueBase> {
  column: Array<keyof TData>;
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

  const [newRule, setNewRule] = React.useState({
    color: "",
    styles: [] as string[],
    operator: "contains",
    value: "",
    column: [] as Array<keyof Payment>,
  });

  const [ruleOpen, setRuleOpen] = React.useState(false);

  // for string value to compare number value, should allow , but convert
  // improve operators functions
  // for user search
  // 10 === "10" or 10 !== "10"
  const [rules, setRules] = React.useState<Rule<Payment>[]>([
    {
      column: ["status"],
      operator: "contains",
      value: "failed",
      styles: {
        backgroundColor: "#ffed9d",
      },
    },
    {
      column: ["amount"],
      operator: "equals",
      value: 316,
      styles: {
        color: "green",
        fontWeight: "600",
      },
    },
    {
      column: ["amount"],
      operator: "equals",
      value: 242,
      styles: {
        color: "green",
        fontWeight: "600",
        backgroundColor: "#c0ffc8",
      },
    },
    {
      column: ["email"],
      operator: "notEquals",
      value: "janedoe@example.com",
      styles: {
        color: "#777",
      },
    },
    {
      column: ["email"],
      operator: "contains",
      value: "ll",
      styles: {
        color: "red",
      },
    },
    {
      column: ["amount"],
      operator: "greaterThan",
      value: 900,
      styles: {
        color: "red",
      },
    },
    {
      column: ["amount"],
      operator: "contains",
      value: "7",
      styles: {
        color: "blue",
      },
    },
    {
      column: ["status", "email"],
      operator: "contains",
      value: "uc",
      styles: {
        color: "pink",
      },
    },
  ]);

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
        // keyof TData
        const columnId = (cell?.column?.id ||
          cell?.column?.columnDef?.id) as keyof Payment;

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
          const columnMatch = rule.column.includes(columnId);
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

          <Drawer
            direction="right"
            handleOnly
            open={ruleOpen}
            onOpenChange={setRuleOpen}
          >
            <DrawerTrigger asChild>
              <Button variant="outline">
                <DatabaseIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Create rule</DrawerTitle>
                <DrawerDescription />
              </DrawerHeader>

              <div className="space-y-2">
                <div className="flex flex-col">
                  <h4 className="mx-4 font-semibold mb-2 text-sm">Columns</h4>
                  {columns.map((column, index) => {
                    return (
                      <Label
                        htmlFor={index.toString()}
                        key={index.toString()}
                        className="flex items-center gap-2 hover:bg-accent rounded-md p-2 mx-2 cursor-pointer"
                      >
                        <Checkbox
                          id={index.toString()}
                          checked={newRule.column.includes(
                            column.id as keyof Payment
                          )}
                          onCheckedChange={() => {
                            setNewRule((prev) => ({
                              ...prev,
                              column: prev.column.includes(
                                column.id as keyof Payment
                              )
                                ? prev.column.filter(
                                    (c) => c !== (column.id as keyof Payment)
                                  )
                                : [...prev.column, column.id as keyof Payment],
                            }));
                          }}
                        />
                        {column.meta?.title}
                      </Label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex flex-col">
                  <h4 className="mx-4 font-semibold mb-2 text-sm">Rule</h4>
                  <div className="mx-4 flex gap-2 flex-col mt-1">
                    <span className="text-gray-400 text-xs">
                      Format cell if...
                    </span>
                    <Select
                      value={newRule.operator}
                      onValueChange={(value) =>
                        setNewRule((prev) => ({ ...prev, operator: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(operatorOptions).map(
                          ([operator, value]) => {
                            return (
                              <SelectItem key={operator} value={operator}>
                                {value}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectContent>
                    </Select>

                    <Input
                      value={newRule.value}
                      onChange={(e) => {
                        setNewRule((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="mx-4 flex gap-2 flex-col mt-6">
                    <span className="text-gray-400 text-xs">Style</span>
                    <div className="flex gap-2 flex-col">
                      <div className="flex gap-2">
                        <ToggleGroup
                          size={"sm"}
                          type="multiple"
                          variant="outline"
                          value={newRule.styles}
                          onValueChange={(v) => {
                            console.log(v);
                            setNewRule((prev) => ({ ...prev, styles: v }));
                          }}
                        >
                          <ToggleGroupItem
                            value="bold"
                            aria-label="Toggle bold"
                          >
                            <Bold className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="italic"
                            aria-label="Toggle italic"
                          >
                            <Italic className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="underline"
                            aria-label="Toggle underline"
                          >
                            <Underline className="h-4 w-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>

                      <ColorPicker
                        background={newRule.color}
                        setBackground={(v) =>
                          setNewRule((prev) => ({ ...prev, color: v }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DrawerFooter className="flex-row justify-end">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                <Button
                  onClick={() => {
                    const mappedStyles: React.CSSProperties =
                      newRule.styles.reduce((acc, item) => {
                        if (item === "bold")
                          return { ...acc, fontWeight: "bold" };
                        if (item === "italic")
                          return { ...acc, fontStyle: "italic" };
                        if (item === "underline")
                          return { ...acc, textDecoration: "underline" };
                        return acc;
                      }, {});
                    if (newRule.color) {
                      mappedStyles.backgroundColor = newRule.color;
                    }
                    const transformRule: Rule<Payment, TValueBase> = {
                      column: newRule.column,
                      operator: newRule.operator as RuleOperator,
                      value: newRule.value || "99",
                      styles: mappedStyles,
                    };
                    setRules((prev) => [...prev, transformRule]);
                    setRuleOpen(false);
                    setNewRule({
                      color: "",
                      styles: [],
                      operator: "contains",
                      value: "",
                      column: [],
                    });
                    // add validation
                    // or style or color
                  }}
                >
                  Apply
                </Button>
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
