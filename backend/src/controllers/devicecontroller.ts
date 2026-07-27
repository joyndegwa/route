import type { Request, Response } from "express";
import { supabase } from "../config/supabase";

export async function getDevices(req: Request, res: Response) {

    const { data, error } = await supabase
        .from("devices")
        .select("*");

    if (error) {
        return res.status(400).json(error);
    }

    return res.json(data);

}

export async function createDevice(req: Request, res: Response) {

    const {
        user_id,
        product_name,
        brand,
        model,
        serial_number,
        imei
    } = req.body;

    const { data, error } = await supabase
        .from("devices")
        .insert([
            {
                user_id,
                product_name,
                brand,
                model,
                serial_number,
                imei
            }
        ])
        .select();

    if (error) {
        return res.status(400).json(error);
    }

    return res.status(201).json(data);

}