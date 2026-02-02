import { pool } from "../db";
import { Post, PostWithUser, PostResponse } from "../types";
import { ValidationError, NotFoundError } from "../utils/errors";

export class PostService {
    async createPost(
        userId: number,
        message: string,
        imageUrl: string | null
    ): Promise<PostResponse> {
        if (message.length > 5000) {
        throw new ValidationError("El mensaje es muy largo (máximo 5000 caracteres)");
        }

        try {
        const result = await pool.query<Post>(
            `INSERT INTO posts (user_id, message, image_url, status) 
            VALUES ($1, $2, $3, 'active') 
            RETURNING *`,
            [userId, message.trim(), imageUrl]
        );

        const post = result.rows[0];

        const userResult = await pool.query(
            "SELECT username FROM users WHERE id = $1",
            [userId]
        );

        return {
            id: post.id,
            user_id: post.user_id,
            username: userResult.rows[0].username,
            message: post.message,
            image_url: post.image_url,
            created_at: post.created_at,
        };
        } catch (error) {
        console.error("Error al crear post:", error);
        throw error;
        }
    }

    async getAllPosts(): Promise<PostResponse[]> {
        try {
        const result = await pool.query<PostWithUser>(
            `SELECT p.*, u.username 
            FROM posts p
            INNER JOIN users u ON p.user_id = u.id
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC`
        );

        return result.rows.map((row) => ({
            id: row.id,
            user_id: row.user_id,
            username: row.username,
            message: row.message,
            image_url: row.image_url,
            created_at: row.created_at,
        }));
        } catch (error) {
        console.error("Error al obtener posts:", error);
        throw error;
        }
    }


    async updatePost(
        postId: number,
        userId: number,
        message: string,
        imageUrl: string | null
    ): Promise<PostResponse> {        
        if (message.length > 5000) {
        throw new ValidationError("El mensaje es muy largo (máximo 5000 caracteres)");
        }

        try {
        const result = await pool.query(
            `UPDATE posts set message= ($2) , image_url = ($3) , created_at= NOW()  where id = $1
            RETURNING *`,
            [postId, message.trim(), imageUrl]
        );
        
        const post = result.rows[0];

        const userResult = await pool.query(
            "SELECT username FROM users WHERE id = $1",
            [userId]
        );

        return {
            id: post.id,
            user_id: post.user_id,
            username: userResult.rows[0].username,
            message: post.message,
            image_url: post.image_url,
            created_at: post.created_at,
        };
        } catch (error) {
        console.error("Error al crear post:", error);
        throw error;
        }
    }

}