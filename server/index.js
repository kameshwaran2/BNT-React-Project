// const express = require("express");
// const cors = require("cors");

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
import userRoutes from "./routes/auth.js";

// ✅ MongoDB Atlas connection (without deprecated options)
mongoose
  .connect(
    "mongodb+srv://kamesh:K9xnNSMRPMh6xJhH@cluster0.0tjs11u.mongodb.net/userdb?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// ✅ Sample route
app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.use("/auth", userRoutes);

// ✅ Start the server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
