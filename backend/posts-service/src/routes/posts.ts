import { Router } from "express";
import { PostController } from "../controllers/postController";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/upload";

const router = Router();
const postController = new PostController();

router.post(
  "/",
  authenticate,
  upload.single("image"),
  postController.createPost.bind(postController)
);
router.get("/", postController.getAllPosts.bind(postController));

export default router;