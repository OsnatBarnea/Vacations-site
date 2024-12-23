import { UserModel } from "../3-models/user-model";
import jwt, { JsonWebTokenError, SignOptions, TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "./app-config";
import crypto from "crypto";

class Cyber {

    public hash(plainText: string): string {

        if (!plainText) return null;
        // Hashing (un-reversible change to the password) with salt (spreading chars in the password): 
        return crypto.createHmac("sha512", appConfig.hashingSalt).update(plainText).digest("hex");
    };

    public getNewToken(user: UserModel): string {
        // Remove password from the user frontend and create a token 
        delete user.password;

        const payload = { user }; //payload gets object user
        const options: SignOptions = { expiresIn: "1h" }; //expiration of the token - 1hr 
        const token = jwt.sign(payload, appConfig.jwtSecret, options);
        return token;
    };

    public validateToken(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        }
        catch (err: any) {
            console.log("-------------------");
            console.log(err instanceof TokenExpiredError); //check expiration
            console.log(err instanceof JsonWebTokenError); //check if it is legal
            console.log(err);
            console.log("-------------------");
            return false;
        }
    };

    //check if the user is admin by decoding password and getting to user's role
    public validateAdmin(token: string): boolean {
        const payload = jwt.decode(token) as { user: UserModel };
        const user = payload.user; 
        return user.role === "Admin";
    };
}

export const cyber = new Cyber();
