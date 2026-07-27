import { supabase } from "../supabase/client";
import type { CreateShopInput, Shop } from "../types/shop";

export interface ShopRow {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  services: string[] | null;
  hours: string | null;
  rating: number;
  distance: number | null;
  created_at: string;
}

const SHOPS_TABLE = "shops";

const MOCK_SHOPS: Shop[] = [
  {
    id: "mock-1",
    name: "GreenFix Repair Hub",
    type: "repair",
    address: "12 Eco Street, Green District, Nairobi",
    lat: -1.2921,
    lng: 36.8219,
    phone: "+254 700 123 456",
    services: ["Smartphone", "Laptop", "Tablet"],
    hours: "Mon-Fri 8am-6pm",
    rating: 4.7,
  },
  {
    id: "mock-2",
    name: "ReCycle Point",
    type: "recycle",
    address: "45 Reuse Avenue, Central, Nairobi",
    lat: -1.2864,
    lng: 36.8172,
    phone: "+254 700 234 567",
    services: ["E-waste", "Batteries", "Cables"],
    hours: "Mon-Sat 9am-5pm",
    rating: 4.4,
  },
  {
    id: "mock-3",
    name: "TechCare Studio",
    type: "repair",
    address: "88 Circuit Road, Tech Park, Nairobi",
    lat: -1.2975,
    lng: 36.8125,
    phone: "+254 700 345 678",
    services: ["Laptop", "Desktop", "Printer"],
    hours: "Mon-Fri 9am-7pm",
    rating: 4.9,
  },
  {
    id: "mock-4",
    name: "EcoDrop Center",
    type: "recycle",
    address: "7 Sustainability Lane, Westlands, Nairobi",
    lat: -1.2639,
    lng: 36.8068,
    phone: "+254 700 456 789",
    services: ["E-waste", "Appliances", "TVs"],
    hours: "Tue-Sun 8am-4pm",
    rating: 4.2,
  },
];

export function mapShopRow(row: ShopRow): Shop {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Shop["type"],
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    phone: row.phone ?? undefined,
    services: row.services ?? undefined,
    hours: row.hours ?? undefined,
    rating: row.rating,
    distance: row.distance ?? undefined,
  };
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

export const shopService = {
  listAll: async (): Promise<Shop[]> => {
    const { data, error } = await supabase
      .from(SHOPS_TABLE)
      .select("*")
      .order("rating", { ascending: false });

    if (error) throw error;
    const dbShops = (data ?? []).map((row) => mapShopRow(row as ShopRow));
    return dbShops.length > 0 ? dbShops : MOCK_SHOPS;
  },

  listNearby: async (lat: number, lng: number,radiusKm = 50): Promise<Shop[]> => {
    const all = await shopService.listAll();
    return all
      .map((shop) => ({
        ...shop,
        distance: haversineKm(lat, lng, shop.lat, shop.lng),
      }))
      .filter((shop) => (shop.distance ?? 0) <= radiusKm)
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  },

  listRepair: async (lat?: number, lng?: number): Promise<Shop[]> => {
    const all = lat !== undefined && lng !== undefined
      ? await shopService.listNearby(lat, lng)
      : await shopService.listAll();
    return all.filter((shop) => shop.type === "repair");
  },

  listRecycle: async (lat?: number, lng?: number): Promise<Shop[]> => {
    const all = lat !== undefined && lng !== undefined
      ? await shopService.listNearby(lat, lng)
      : await shopService.listAll();
    return all.filter((shop) => shop.type === "recycle");
  },

  create: async (input: CreateShopInput): Promise<Shop> => {
    const { data, error } = await supabase
      .from(SHOPS_TABLE)
      .insert({
        name: input.name,
        type: input.type,
        address: input.address,
        lat: input.lat,
        lng: input.lng,
        phone: input.phone ?? null,
        services: input.services ?? null,
        hours: input.hours ?? null,
        rating: input.rating ?? 4.5,
      })
      .select("*")
      .single();

    if (error) throw error;
    return mapShopRow(data as ShopRow);
  },
};
