type FetchOptions<T = any> = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  tenantCode?: string;
  body?: T;
  params?: Record<string, string | number | boolean>;
  tags?: string[];
};

type FetchResult<T = any> = {
  success: boolean;
  message: string;
  data: T | null;
};

export async function fetcher<TResponse = any, TBody = any>({
  method = "GET",
  endpoint,
  tenantCode = "default",
  body,
  params,
  tags,
}: FetchOptions<TBody>): Promise<FetchResult<TResponse>> {
  const queryString = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!baseUrl) {
    const result = {
      success: false,
      message: "Missing backend URL configuration",
      data: null,
    };
    console.log("[fetcher] Final Result:", result);
    return result;
  }

  const url = `${baseUrl}${endpoint}${queryString}`;

  const headers: HeadersInit = {
    "x-tenant-code": tenantCode,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
    ...(method !== "GET" && body ? { body: JSON.stringify(body) } : {}),
    ...(method === "GET" && tags?.length ? { next: { tags } } : {}),
  };

  try {
    const res = await fetch(url, options);
    const json = await res.json().catch(() => null);

    let result: FetchResult<TResponse>;

    if (res.ok) {
      result = {
        success: true,
        message: "Request successful",
        data: json,
      };
    } else {
      result = {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
        data: json,
      };
    }

    console.log("[fetcher] Final Result:", result);
    return result;
  } catch (err: any) {
    const result = {
      success: false,
      message: err.message || "Network error",
      data: null,
    };
    console.error("[fetcher] Request error:", err);
    console.log("[fetcher] Final Result:", result);
    return result;
  }
}
