import Joi from "joi";
import { BadRequestError } from "./error-models";

export class UserModel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public role: string;

    public constructor(user: UserModel) {
        this.id = user.id;
        this.firstName = user.firstName?.trim();
        this.lastName = user.lastName?.trim();
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
    }

    // Validation
    private static registerValidationSchema = Joi.object({
        id: Joi.number().forbidden(),
        firstName: Joi.string().required().min(2).max(100),
        lastName: Joi.string().required().min(2).max(100),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(4).max(8),
        role: Joi.string().forbidden()
    });

    //throw error
    public validateRegister(): void {
        const result = UserModel.registerValidationSchema.validate(this);
        if (result.error) throw new BadRequestError(result.error.message);
    }

}
