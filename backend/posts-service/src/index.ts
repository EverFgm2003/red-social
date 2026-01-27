import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import postRoutes from "./routes/posts";
import { errorHandler } from "./middlewares/errorHandler";
import { seedPosts } from "./seeders/seedPosts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use("/posts", postRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    seedPosts();
    app.listen(PORT, () => {
      console.log(`Posts Service corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  console.log("\nCerrando servidor...");
  process.exit(0);
});