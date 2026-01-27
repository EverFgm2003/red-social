import { pool } from "../db";
import { PostService } from "../services/postService";

const postService = new PostService();

const defaultMessages = [
  "¡Hola a todos!",
  "Este es mi primer post.",
  "Probando la red social de microservicios.",
  "Aprendiendo Node.js y Docker.",
  "Hoy es un gran día para programar."
];

export async function seedPosts() {
  try {
    const usersResult = await pool.query("SELECT id FROM users");
    const users = usersResult.rows;
    if (users.length === 0) {
      return;
    }

    for (const user of users) {
      const message = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
      await postService.createPost(user.id, message, null);
    }

    console.log("Seeder de posts completado!");
  } catch (error) {
    console.error("Error en seeding posts:", error);
  }
}
