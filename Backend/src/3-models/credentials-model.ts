import Joi from "joi";
import { BadRequestError } from "./error-models";

export class CredentialsModel {

    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    };

    // Validation
    private static loginValidationSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(4).max(8)
    });

    public validateLogin(): void {
        const result = CredentialsModel.loginValidationSchema.validate(this);
        if (result.error) throw new BadRequestError(result.error.message);
    };

}

