import { Payment } from "@/data/data-table";
import { cn } from "@/lib/utils";
import { TValueBase } from "@/table";
import { Cell, ColumnDef, RowData } from "@tanstack/react-table";
import { ArrowUp } from "lucide-react";
import { CSSProperties } from "react";
import { Button } from "../ui/button";

export const getCellRuleValue = <
  TData extends RowData,
  TValue extends TValueBase = TValueBase
>(
  cell: Cell<TData, TValue>
): CSSProperties => {
  let styles = {};
  // extract meta
  const { table } = cell.getContext();
  const { meta } = table.options;
  if (meta?.rulesFn && meta?.rules?.length) {
    styles = meta?.rulesFn?.(cell) || {};
  }

  return styles;
};

export const columns: ColumnDef<Payment, TValueBase>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      return <div className="capitalize">{info.getValue<string>()}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUp
            className={cn("transition-transform transform", {
              "rotate-z-180": column.getIsSorted() === "asc",
            })}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase pl-3">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right">{formatted}</div>;
    },
  },
];
