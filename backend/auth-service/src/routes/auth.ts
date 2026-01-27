import { Router } from "express";
import { AuthController } from "../controllers/authControllers";
import { authenticate } from "../middlewares/authenticate";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/verify-token", authController.verifyToken.bind(authController));

router.get("/verify", authenticate, authController.verify.bind(authController));

export default router;