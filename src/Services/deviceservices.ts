import { supabase } from "../supabase/client";

export async function getDevices() {
  return await supabase
    .from("devices")
    .select("*");
}

export async function getUserDevices(userId: string) {
  return await supabase
    .from("devices")
    .select("*")
    .eq("user_id", userId);
}

export async function createDevice(device: any) {
  return await supabase
    .from("devices")
    .insert([device]);
}

export async function updateDevice(id: string, updates: any) {
  return await supabase
    .from("devices")
    .update(updates)
    .eq("id", id);
}

export async function deleteDevice(id: string) {
  return await supabase
    .from("devices")
    .delete()
    .eq("id", id);
}