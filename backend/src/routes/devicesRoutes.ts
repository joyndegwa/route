import { Router } from "express";
import {
    createDevice,
    getDevices
} from "../controllers/devicecontroller";

const router = Router();

router.get("/", getDevices);
router.post("/", createDevice);

export default router;