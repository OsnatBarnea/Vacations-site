import express, { NextFunction, Request, Response } from "express";
import { StatusCode } from "../3-models/enums";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { fileSaver } from "uploaded-file-saver";
import { vacationService } from "../4-services/vacation-service";
import { VacationModel } from "../3-models/vacation-model";

class VacationController {

    public readonly router = express.Router();

    public constructor() {
        this.router.get("/vacations/", securityMiddleware.validateToken, this.getAllVacations);
        this.router.get("/liked-vacations/:userId(\\d+)", securityMiddleware.validateToken, this.getLikedVacations);
        this.router.get("/vacations/:id(\\d+)", securityMiddleware.validateToken, this.getOneVacation);
        this.router.get("/search-vacations/:destination([a-zA-Z]+)", securityMiddleware.validateToken, this.getVacationsBySearch);
        this.router.get("/vacations-isLiked/:userId(\\d+)", securityMiddleware.validateToken, this.getVacationsWithUserLikes);

        this.router.post("/add-vacation", securityMiddleware.validateToken, securityMiddleware.validateAdmin, this.addVacation);
        this.router.put("/update-vacation/:id(\\d+)", securityMiddleware.validateToken, securityMiddleware.validateAdmin, this.updateVacation);
        this.router.delete("/vacations/:id(\\d+)", securityMiddleware.validateToken, securityMiddleware.validateAdmin, this.deleteVacation);

        this.router.get("/vacations/images/:imageName", this.getImageFile);
    };

    private async getAllVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const vacations = await vacationService.getAllVacations();
            response.json(vacations);
        }
        catch (err: any) { next(err); }
    };

    private async getLikedVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = +request.params.userId;
            const vacations = await vacationService.getLikedVacations(userId);
            response.json(vacations);
        }
        catch (err: any) { next(err); }
    };

    private async getVacationsBySearch(request: Request, response: Response, next: NextFunction) {
        try {
            const destination = request.params.destination;
            const vacations = await vacationService.getVacationsByDestination(destination);
            response.json(vacations);
        }
        catch (err: any) { next(err); }
    };

    private async getOneVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id;
            const vacation = await vacationService.getOneVacation(id);
            response.json(vacation);
        }
        catch (err: any) { next(err); }
    };

    private async addVacation(request: Request, response: Response, next: NextFunction) {
        try {
            request.body.image = request.files?.image; //the image is in the body
            const vacation = new VacationModel(request.body);
            const dbVacation = await vacationService.addVacation(vacation);
            response.status(StatusCode.Created).json(dbVacation);
        }
        catch (err: any) { next(err); }
    };

    private async updateVacation(request: Request, response: Response, next: NextFunction) {
        try {
            request.body.id = +request.params.id;

            //take id and image from route and add to the body
            request.body.image = request.files?.image;

            const vacation = new VacationModel(request.body);
            const dbVacation = await vacationService.updateVacation(vacation);
            response.json(dbVacation);
        }
        catch (err: any) { next(err); }
    };

    private async deleteVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id;
            await vacationService.deleteVacation(id);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err: any) { next(err); }
    };

    private async getImageFile(request: Request, response: Response, next: NextFunction) {
        try {
            const imageName = request.params.imageName;
            const absolutePath = fileSaver.getFilePath(imageName);
            response.sendFile(absolutePath);
        }
        catch (err: any) { next(err); }
    };

    private async getVacationsWithUserLikes(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = +request.params.userId;
            const vacations = await vacationService.getVacationsWithUserLikes(userId);
            response.json(vacations);
        }
        catch (err: any) { next(err); }
    };

}

export const vacationController = new VacationController();
