import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middlewares/errorHandler";
import { seedUsers } from "./seeders/userSeeder";
import app from "./app";

app.use(cors());
app.use(express.json());



app.use("/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await seedUsers();

    app.listen(PORT, () => {
      console.log(`Auth Service corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  console.log("\nCerrando conexiones...");
  await pool.end();
  console.log("Conexiones cerradas. Adiós!");
  process.exit(0);
});