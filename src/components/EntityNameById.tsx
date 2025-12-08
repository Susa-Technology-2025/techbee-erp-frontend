import React from "react";
import { CircularProgress, Typography } from "@mui/material";

interface EntityNameByIdProps<T = any> {
  id?: string;
  useQuery: (id: string, options?: any) => { 
    data?: T; 
    isLoading: boolean; 
    isError: boolean;
    error?: any;
  };
  field?: string;
  fallback?: string;
  queryOptions?: any;
}

export function EntityNameById<T extends Record<string, any> = any>({
  id,
  useQuery,
  field = "name",
  fallback = "N/A",
  queryOptions,
}: EntityNameByIdProps<T>) {
  if (!id) return <>{fallback}</>;
  const { data, isLoading, isError } = useQuery(id, queryOptions);

  if (isLoading) return <CircularProgress size={14} sx={{ verticalAlign: 'middle' }} />;
  if (isError || !data) return <>{fallback}</>;
  
  let value: React.ReactNode = fallback;
  if (typeof data === 'object' && data !== null && field in data) {
    const v = (data as any)[field];
    value = typeof v === 'string' || typeof v === 'number' ? v : fallback;
  }
  
  return <Typography component="span">{value}</Typography>;
}

export default EntityNameById; 