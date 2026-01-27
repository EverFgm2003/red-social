import bcrypt from "bcrypt";
import { pool } from "../db";

const testUsers = [
  {
    username: "juan perez",
    password: "password123",
    first_name: "Juan",
    last_name: "Pérez",
    email: "juan.perez@example.com",
    phone: "3001234567"
  },
  {
    username: "maria garcia",
    password: "password123",
    first_name: "María",
    last_name: "García",
    email: "maria.garcia@example.com",
    phone: "3007654321"
  },
  {
    username: "carlos rodriguez",
    password: "password123",
    first_name: "Carlos",
    last_name: "Rodríguez",
    email: "carlos.rodriguez@example.com",
    phone: "3009876543"
  },
  {
    username: "ana martinez",
    password: "password123",
    first_name: "Ana",
    last_name: "Martínez",
    email: "ana.martinez@example.com",
    phone: "3005555555"
  },
  {
    username: "luis fernandez",
    password: "password123",
    first_name: "Luis",
    last_name: "Fernández",
    email: "luis.fernandez@example.com",
    phone: "3003333333"
  },
];

export async function seedUsers() {
  try {
    const existingUsers = await pool.query("SELECT COUNT(*) FROM users");
    const count = parseInt(existingUsers.rows[0].count);

    if (count > 0) {
      console.log(`ℹYa existen ${count} usuarios en la base de datos. Saltando seeding.`);
      return;
    }

    for (const user of testUsers) {
      const hash = await bcrypt.hash(user.password, 10);
      await pool.query(
        `INSERT INTO users (username, password, first_name, last_name, email, phone) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.username, hash, user.first_name, user.last_name, user.email, user.phone]
      );
    }
    testUsers.forEach((user) => {
      console.log(`   - ${user.username} | ${user.email} | ${user.phone} | Password: ${user.password}`);
    });
  } catch (error) {
    console.error("Error en seeding:", error);
    throw error;
  }
}