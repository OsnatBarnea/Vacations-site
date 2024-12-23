import Joi from "joi";
import { BadRequestError } from "./error-models";

export class LikeModel {
    public id: number;
    public userId: number;
    public vacationId: number;

    public constructor(like: LikeModel) {
        this.id = like.id;
        this.userId = like.userId;
        this.vacationId = like.vacationId;
     }
     
     //validation 
    private static insertValidationSchema = Joi.object({
        id: Joi.number().forbidden(),
        userId: Joi.number().integer().required().min(0).required(),
        vacationId: Joi.number().integer().required().min(0).required()
    });
    
//throw error if the user does not follow the validation rules 
    public validateInsert(): void {
        const result = LikeModel.insertValidationSchema.validate(this);
        if (result.error) throw new BadRequestError(result.error.message);
    }
}