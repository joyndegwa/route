require("dotenv").config();

import express = require("express");
import cors = require("cors");
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ReTrace API",
  });
});

export default app;