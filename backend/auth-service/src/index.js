"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const db_1 = require("./db");
const auth_1 = __importDefault(require("./routes/auth"));
const errorHandler_1 = require("./middlewares/errorHandler");
const userSeeder_1 = require("./seeders/userSeeder");
const app_1 = __importDefault(require("./app"));
app_1.default.use((0, cors_1.default)());
app_1.default.use(express_1.default.json());
app_1.default.use("/auth", auth_1.default);
app_1.default.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3001;
async function startServer() {
    try {
        await (0, userSeeder_1.seedUsers)();
        app_1.default.listen(PORT, () => {
            console.log(`Auth Service corriendo en puerto ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
}
startServer();
process.on("SIGINT", async () => {
    console.log("\nCerrando conexiones...");
    await db_1.pool.end();
    console.log("Conexiones cerradas. Adiós!");
    process.exit(0);
});
