import type { Cell, RowData } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { Rule } from "./components/data-table/data-table";

type TValueBase = string | number | boolean;

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData, TValue = unknown> {
    rules: Rule<TData, TValue>[];
    rulesFn?: (cell: Cell<TData, TValue>) => CSSProperties;
  }
}

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    title?: string;
  }
}
