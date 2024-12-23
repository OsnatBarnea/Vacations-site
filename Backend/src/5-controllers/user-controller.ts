import express, { Request, Response, NextFunction } from "express";
import { UserModel } from "../3-models/user-model";
import { userService } from "../4-services/user-service";
import { CredentialsModel } from "../3-models/credentials-model";

class UserController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);
        this.router.get("/emails", this.getEmails);
    };

    public async register(request: Request, response: Response, next: NextFunction) {
        try {
            const user = new UserModel(request.body);

            const token = await userService.register(user);
            response.send(token);
        }
        catch (err: any) { next(err); }
    };

    public async login(request: Request, response: Response, next: NextFunction) {
        try {
            const credentials = new CredentialsModel(request.body);

            const token = await userService.login(credentials);

            console.log("login token " + token);

            response.send(token);
        }
        catch (err: any) { next(err); }
    };


    private async getEmails(request: Request, response: Response, next: NextFunction) {
        try {
            const emails = await userService.getEmails();
            response.json(emails);
        }
        catch (err: any) { next(err); }
    };
}

export const userController = new UserController();
