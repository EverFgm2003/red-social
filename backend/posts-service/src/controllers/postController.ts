import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/postService";
import path from "path";

const postService = new PostService();

export class PostController {
 
    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
        const { message } = req.body;
        const userId = req.user!.id; 
        let imageUrl: string | null = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const post = await postService.createPost(userId, message, imageUrl);

        res.status(201).json({
            status: "success",
            data: post,
        });
        } catch (error) {
        next(error);
        }
    }

    async getAllPosts(req: Request, res: Response, next: NextFunction) {
        try {
        const posts = await postService.getAllPosts();

        res.json({
            status: "success",
            data: posts,
        });
        } catch (error) {
        next(error);
        }
    }

}