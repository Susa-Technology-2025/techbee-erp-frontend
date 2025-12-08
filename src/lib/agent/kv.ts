type KV = {
    leads: any[];
    favorites: Record<string, string[]>;   // userKey -> listingIds
    alerts: any[];
    appointments: any[];
  };
  const g = globalThis as any;
  if (!g.__DEMO_KV__) g.__DEMO_KV__ = { leads: [], favorites: {}, alerts: [], appointments: [] } as KV;
  export const kv: KV = g.__DEMO_KV__;
  