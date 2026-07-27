import type { Request, Response } from "express";
import * as authService from "../services/authservice";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  const { data, error } = await authService.registerUser(
    email,
    password
  );

  if (error) {
    return res.status(400).json(error);
  }

  res.status(201).json(data);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const { data, error } = await authService.loginUser(
    email,
    password
  );

  if (error) {
    return res.status(401).json(error);
  }

  res.json(data);
}