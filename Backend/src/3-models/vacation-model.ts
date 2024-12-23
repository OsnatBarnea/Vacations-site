import Joi from "joi";
import { BadRequestError } from "./error-models";
import { UploadedFile } from "express-fileupload";

export class VacationModel {
    public id: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public image: UploadedFile;
    public imageUrl: string;

    public constructor(vacation: VacationModel) {
        this.id = vacation.id;
        this.destination = vacation.destination?.trim();
        this.description = vacation.description?.trim();
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.image = vacation.image;
        this.imageUrl = vacation.imageUrl;
    }

    // Custom validation for date (helpers is a custom Joi error reports)
    private static validateDates(value: { startDate: string; endDate: string }, helpers: Joi.CustomHelpers, 
        allowPastStartDate: boolean = false): { startDate: string; endDate: string } {
        const { startDate, endDate } = value;

        //endDate cannot be before the startDate
        if (new Date(endDate) <= new Date(startDate)) {
            throw new Error("End date must be after the start date");
        };

        // Deny past startDate for new vacations
        if (!allowPastStartDate && new Date(startDate) < new Date()) {
            throw new Error("Start date cannot be in the past");
        }
        return value; 
    };

    // Validation schema for insert
    private static insertValidationSchema = Joi.object({
        id: Joi.number().forbidden(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(2).max(2000),
        startDate: Joi.string().isoDate().required(),
        endDate: Joi.string().isoDate().required(),
        price: Joi.number().required().min(0).max(100000),
        image: Joi.object().required(),
        imageUrl: Joi.string().optional().max(200),
    }).custom((value, helpers) => {
        return VacationModel.validateDates(
            { startDate: value.startDate, endDate: value.endDate },
            helpers,
            false // Do not allow past start dates for insert
        );
    });

    // Validate insert (the full input - does not stop at the first error)
    public validateInsert(): void {
        const result = VacationModel.insertValidationSchema.validate(this, { abortEarly: false });
        if (result.error) throw new BadRequestError(result.error.message);
    };

    // Validation schema for update
    private static updateValidationSchema = Joi.object({
        id: Joi.number().required().integer().positive(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(2).max(2000),
        startDate: Joi.string().isoDate().required(),
        endDate: Joi.string().isoDate().required(),
        price: Joi.number().required().min(0).max(100000),
        image: Joi.object().optional(),
        imageUrl: Joi.string().optional().max(200),
    }).custom((value, helpers) => {
        return VacationModel.validateDates(
            { startDate: value.startDate, endDate: value.endDate },
            helpers,
            true // Allow past start dates for update
        );
    });

    // Validate update
    public validateUpdate(): void {
        const result = VacationModel.updateValidationSchema.validate(this, { abortEarly: false });
        if (result.error) throw new BadRequestError(result.error.message);
    }
}
