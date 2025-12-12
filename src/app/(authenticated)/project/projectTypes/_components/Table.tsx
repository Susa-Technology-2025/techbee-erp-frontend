"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import type { MRT_RowVirtualizer } from "material-react-table";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { getTableOptions } from "./TableConfig";

export default function MaterialTable({ idString,defaultValues ,invalidateQueryKey}: { idString?: string,defaultValues?:any,invalidateQueryKey:string[] }) {
  const apiEndPoint = "https://api.techbee.et/api/project/projectTypes" + (Boolean(idString)  ? String(idString) : "");
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isError, refetch, isRefetching, error } =
    useDataQuery<{
      data: any[];
      meta: { totalRowCount: number };
    }>({
      apiEndPoint,
      columnFilters,
      globalFilter,
      pagination,
    });

  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  useEffect(() => {
    const shouldScroll = sorting.length > 0;

    if (shouldScroll) {
      try {
        rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
      } catch (_) {}
    }
  }, [sorting]);

  const tableState = {
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    pagination,
    setPagination,
    isLoading,
    isError,
    refetch,
    isRefetching,
    error,
    apiEndPoint,
  };

  const tableOptions = getTableOptions(
    data,
    tableState,
    refetch,
    rowVirtualizerInstanceRef,
    defaultValues,
    invalidateQueryKey
  );

  const table = useMaterialReactTable(tableOptions as any);

  return <MaterialReactTable table={table} />;
}