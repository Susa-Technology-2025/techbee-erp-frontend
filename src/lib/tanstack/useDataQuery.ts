"use client";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { sessionActions } from "../store/global-state/auth/auth-slice";
let currentAccessToken: string | null = null;
let refreshTokenPromise: Promise<string> | null = null;
let globalStoreDispatch: any;
export function initializeAuthDispatch(dispatchFn: any) {
  globalStoreDispatch = dispatchFn;
}
function getAccessToken(): string | null {
  return currentAccessToken;
}
function setAccessToken(token: string) {
  currentAccessToken = token;
}
interface QueryParams {
  apiEndPoint: string;
  columnFilters?: any;
  globalFilter?: string;
  sorting?: any;
  pagination?: { pageIndex: number; pageSize: number };
  refetchInterval?: number | false;
  enabled?: boolean;
  noFilter?: boolean;
  fetchWithoutRefresh?: boolean;
  tenantCode?: string;
}
interface MutationParams<TData, TVariables> {
  apiEndPoint: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  onSuccessInvalidate?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
  getBody?: (variables: TVariables) => BodyInit | null | undefined;
  invalidateQueryKey?: unknown[];
  fetchWithoutRefresh?: boolean;
  tenantCode?: string;
}
function getTenantCode(): string | null {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  const parts = host.split(".");
  return parts.length > 0 ? parts[0] : null;
}
async function fetchWithoutAutoRefresh<T>(
  url: string,
  options: RequestInit,
  tenantCode: string
): Promise<T> {
  const token = getAccessToken();
  const finalOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-tenant-code": tenantCode,
      ...(token && { authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
  const response = await fetch(url, finalOptions);
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const errorMessage =
      errorData?.message || `Server responded with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
}
async function fetchWithAutoRefresh<T>(
  url: string,
  options: RequestInit,
  tenantCode: string
): Promise<T> {
  const token = getAccessToken();
  const initialHeaders = {
    "Content-Type": "application/json",
    "x-tenant-code": tenantCode,
    ...(token && { authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const initialOptions: RequestInit = {
    ...options,
    headers: initialHeaders,
  };
  let response = await fetch(url, initialOptions);
  if (response.status === 401 || response.status === 403) {
    if (!refreshTokenPromise) {
      refreshTokenPromise = (async () => {
        try {
          const refreshResponse = await fetch(
            "https://api.techbee.et/api/auth/auth/refresh-token",
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                "x-tenant-code": tenantCode,
              },
            }
          );
          if (!refreshResponse.ok) {
            refreshTokenPromise = null;
            if (globalStoreDispatch) {
              globalStoreDispatch(sessionActions.clearSession());
            }
            throw new Error("Failed to refresh access token. Please log in.");
          }
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.accessToken as string;
          setAccessToken(newAccessToken);
          if (globalStoreDispatch) {
            const { user, organization, permissions } = refreshData;
            globalStoreDispatch(
              sessionActions.setSession({
                loggedIn: true,
                accessToken: newAccessToken,
                user: user,
                organization: organization,
                permissions: permissions,
                tenantCode: tenantCode,
              })
            );
          }
          return newAccessToken;
        } catch (error) {
          refreshTokenPromise = null;
          throw error;
        }
      })();
    }
    const newAccessToken = await refreshTokenPromise;
    response = await fetch(url, {
      ...options,
      headers: {
        ...initialHeaders,
        authorization: `Bearer ${newAccessToken}`,
      },
    });
    refreshTokenPromise = null;
  }
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const errorMessage =
      errorData?.message || `Server responded with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
}
export function useDataQuery<T>({
  apiEndPoint,
  refetchInterval,
  columnFilters = [],
  globalFilter = "",
  sorting = [],
  pagination = { pageIndex: 0, pageSize: 10 },
  enabled,
  noFilter,
  fetchWithoutRefresh,
  tenantCode: paramTenantCode,
}: QueryParams) {
  const finalTenantCode = paramTenantCode || getTenantCode();
  const fetcher = fetchWithoutRefresh
    ? fetchWithoutAutoRefresh
    : fetchWithAutoRefresh;
  return useQuery<T>({
    queryKey: [
      "data",
      apiEndPoint,
      { columnFilters, globalFilter, sorting, pagination, noFilter },
    ],
    enabled: Boolean(finalTenantCode) && enabled,
    queryFn: async () => {
      const fetchURL = new URL(apiEndPoint, window.location.origin);
      if (!noFilter) {
        if (apiEndPoint.includes("https://api.")) {
          fetchURL.searchParams.set(
            "start",
            `${pagination.pageIndex * pagination.pageSize}`
          );
          fetchURL.searchParams.set("size", `${pagination.pageSize}`);
          fetchURL.searchParams.set(
            "filters",
            JSON.stringify(columnFilters ?? [])
          );
          fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
          fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));
        }
      }
      return fetcher<T>(
        fetchURL.toString(),
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-code": finalTenantCode!,
          },
        },
        finalTenantCode!
      );
    },
    placeholderData: keepPreviousData,
    refetchInterval,
  });
}
export function useDataMutation<TData = any, TVariables = any>({
  apiEndPoint,
  method = "POST",
  onSuccessInvalidate = true,
  onSuccess,
  onError,
  getBody = (variables) => JSON.stringify(variables),
  invalidateQueryKey,
  fetchWithoutRefresh,
  tenantCode: paramTenantCode,
}: MutationParams<TData, TVariables>) {
  const queryClient = useQueryClient();
  const finalTenantCode = paramTenantCode || getTenantCode();
  const fetcher = fetchWithoutRefresh
    ? fetchWithoutAutoRefresh
    : fetchWithAutoRefresh;
  return useMutation<
    TData,
    unknown,
    TVariables & { __pathParams?: Record<string, string | number> }
  >({
    mutationFn: async (
      variables: TVariables & { __pathParams?: Record<string, string | number> }
    ) => {
      const { __pathParams, ...cleanVariables } = variables || {};
      let finalEndpoint = apiEndPoint;
      if (__pathParams) {
        Object.entries(__pathParams).forEach(([key, value]) => {
          finalEndpoint = finalEndpoint.replace(`:${key}`, String(value));
        });
      }
      const body =
        method === "DELETE" && !getBody
          ? undefined
          : getBody(cleanVariables as TVariables);
      return fetcher<TData>(
        finalEndpoint,
        {
          method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-code": finalTenantCode!,
          },
          body: body,
        },
        finalTenantCode!
      );
    },
    onSuccess: (data, variables) => {
      if (onSuccessInvalidate) {
        const isSingleResourceMutation =
          method === "PATCH" || method === "PUT" || method === "DELETE";
        let defaultKeyEndPoint = apiEndPoint;
        if (variables?.__pathParams) {
          Object.entries(variables.__pathParams).forEach(([key, value]) => {
            defaultKeyEndPoint = defaultKeyEndPoint.replace(
              `:${key}`,
              String(value)
            );
          });
        }
        if (isSingleResourceMutation) {
          const parts = apiEndPoint.split("/");
          if (parts.length > 1) {
            defaultKeyEndPoint = parts.slice(0, parts.length - 1).join("/");
          }
        }
        const defaultKeyToInvalidate = ["data", defaultKeyEndPoint];
        const keyToInvalidate = invalidateQueryKey ?? defaultKeyToInvalidate;
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
      onSuccess?.(data);
    },
    onError,
  });
}
