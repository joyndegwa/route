import { supabase } from "../supabase/client";

export async function getPassports() {
  return await supabase
    .from("product_passports")
    .select("*");
}

export async function createPassport(passport: any) {
  return await supabase
    .from("product_passports")
    .insert([passport])
    .select()
    .single();
}

export async function getPassport(productId: string) {
  return await supabase
    .from("product_passports")
    .select("*")
    .eq("product_id", productId)
    .single();
}