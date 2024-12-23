import express, { NextFunction, Request, Response } from "express";
import { StatusCode } from "../3-models/enums";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { LikeModel } from "../3-models/like-model";
import { likeService } from "../4-services/like-service";

class LikeController {

    public readonly router = express.Router();

    public constructor() {
        this.router.get("/likes/", securityMiddleware.validateToken, this.getAllLikes);
        this.router.get("/like/:id(\\d+)", securityMiddleware.validateToken, this.getOneLike);
        this.router.post("/add-like/", securityMiddleware.validateToken, this.addLike);
        this.router.delete("/like/:id(\\d+)", securityMiddleware.validateToken, this.deleteLike);
    };

    private async getAllLikes(request: Request, response: Response, next: NextFunction) {
        try {
            const likes = await likeService.getAllLikes();
            response.json(likes);
        }
        catch (err: any) { next(err); }
    };


    private async getOneLike(request: Request, response: Response, next: NextFunction) {
        try {
            //Get id from the route
            const id = +request.params.id;

            const dbLike = await likeService.getOneLike(id);

            response.json(dbLike);
        }
        catch (err: any) { next(err); }
    };

    private async addLike(request: Request, response: Response, next: NextFunction) {
        try {
            const like = new LikeModel(request.body);

            const dbLike = await likeService.addLikes(like);
            console.log(dbLike);

            response.status(StatusCode.Created).json(dbLike);
        }
        catch (err: any) { next(err); }
    };

    private async deleteLike(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id;

            await likeService.deleteLike(id);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err: any) { next(err); }
    };
}

export const likeController = new LikeController();
