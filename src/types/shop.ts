export interface Shop {
  id: string;
  name: string;
  type: "repair" | "recycle";
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  services?: string[];
  hours?: string;
  rating: number;
  distance?: number;
}

export interface CreateShopInput {
  name: string;
  type: "repair" | "recycle";
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  services?: string[];
  hours?: string;
  rating?: number;
}
