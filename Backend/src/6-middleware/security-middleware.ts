import { NextFunction, Request, Response } from "express";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "../3-models/error-models";
import { cyber } from "../2-utils/cyber";

class SecurityMiddleware {

    public validateToken(request: Request, response: Response, next: NextFunction): void {
        const header = request.headers.authorization; //the token is in the header
        const token = header?.substring(7); //cut the beginning

        if (!cyber.validateToken(token)) {
            next(new UnauthorizedError("You are not logged-in."));
            return;
        }
        next();
    }

    public validateAdmin(request: Request, response: Response, next: NextFunction): void {

        const header = request.headers.authorization;
        const token = header?.substring(7);

        if (!cyber.validateAdmin(token)) {
            next(new ForbiddenError("You are not authorized."));
            return;
        }
        next();
    }

    public preventXssAttack(request: Request, response: Response, next: NextFunction): void {
        for (const prop in request.body) {
            const value = request.body[prop];
            if (typeof value === "string" && value.includes("<script")) {

                next(new BadRequestError("Invalid value"));
                return;
            }
        }
        next();
    }

}
export const securityMiddleware = new SecurityMiddleware();
