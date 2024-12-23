import { OkPacketParams } from "mysql2";
import { dal } from "../2-utils/dal";
import { NotFoundError } from "../3-models/error-models";
import { LikeModel } from "../3-models/like-model";
import { VacationModel } from "../3-models/vacation-model";
import { appConfig } from "../2-utils/app-config";
import { fileSaver } from "uploaded-file-saver";

class VacationService {

    public async getAllVacations(): Promise<LikeModel[]> {
        //Fetch all vacations and add likesCount, group them by vacationId and order be startDate
        const sql = `select v.id, v.destination, v.description, v.startDate, v.endDate, v.price, 
        concat('${appConfig.imagesWebPath}', v.imageName) as imageUrl, 
            count(l.userId) as likesCount
            from vacations as v
        left join likes as l on v.id = l.vacationId
        group by v.id order by v.startDate;`;

        const vacations = await dal.execute(sql);
        return vacations;
    };

    async getLikedVacations(userId: number): Promise<VacationModel[]> {
        //Fetch only the user's liked vacations and add likesCount
        const sql = `select v.id, v.destination, v.description, v.startDate, v.endDate, v.price, 
                concat('${appConfig.imagesWebPath}', v.imageName) as imageUrl,
                count(l.userId) as likesCount from vacations as v
            left join likes as l on v.id = l.vacationId
            where v.id in (select vacationId from likes where userId = ?)
            group by v.id, v.destination, v.description, v.startDate, v.endDate, v.price, v.imageName
            order by v.startDate;`;

        const values = [userId];
        const vacations = await dal.execute(sql, values);
        return vacations;
    };

    public async getOneVacation(id: number): Promise<VacationModel> {
        const sql = `select id, destination, description, startDate, endDate, price, 
        concat('${appConfig.imagesWebPath}', imageName) as imageUrl from vacations where id = ?;`;

        const values = [id];
        const vacationInArray = await dal.execute(sql, values);
        const vacation = vacationInArray[0];

        // If vacation not found:
        if (!vacation) throw new NotFoundError(`Id - ${id} is not found.`);
        return vacation;
    };

    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validateInsert();

        // Save image to disk and get the saved image name: 
        const imageName = vacation.image ? await fileSaver.add(vacation.image) : null;

        const sql = `insert into vacations(destination, description, startDate, endDate, price, imageName) 
        values(?, ?, ?, ?, ?, ?)`;

        const values = [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price,
            imageName];
        const successParams: OkPacketParams = await dal.execute(sql, values);

        //get the saved vacation
        const dbVacation = await this.getOneVacation(successParams.insertId);
        return dbVacation;
    };

    // get the imageName from the db
    private async getImageName(id: number): Promise<string> {

        const sql = "select imageName from vacations where id = ?";
        const values = [id];

        const vacationInArray = await dal.execute(sql, values);
        const vacation = vacationInArray[0];
        //if there is a vacation under this id - get it, otherwise, return
        if (!vacation) return null;
        return vacation.imageName;
    };

    public async getVacationsByDestination(destination: string): Promise<VacationModel[]> {
        //get vacations by destination name (or part of the name)
        const sql = `select v.id, v.destination, v.description, v.startDate, v.endDate, v.price, 
                concat('${appConfig.imagesWebPath}', v.imageName) as imageUrl,
                count(l.userId) as likesCount from vacations as v left join likes as l on v.id = l.vacationId
            where lower(v.destination) like lower(?)
            group by v.id, v.destination, v.description, v.startDate, v.endDate, v.price, v.imageName
            order by v.startDate;`;

        const values = [`%${destination}%`];
        const vacations = await dal.execute(sql, values);
        return vacations;
    };

    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validateUpdate();

        // Update image: 
        const oldImageName = await this.getImageName(vacation.id);
        const newImageName = vacation.image ? await fileSaver.update(oldImageName, vacation.image) : oldImageName;

        const sql = `update vacations set destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, 
        imageName = ? where id = ? `;

        const values = [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price,
            newImageName, vacation.id];
        const successParams: OkPacketParams = await dal.execute(sql, values);

        // If vacation does not exist: 
        if (successParams.affectedRows === 0) throw new NotFoundError(`Id - ${vacation.id} is not found.`);
        //get the db saved vacation
        const dbVacation = await this.getOneVacation(vacation.id);
        return dbVacation;
    };

    public async deleteVacation(id: number): Promise<void> {

        const oldImageName = await this.getImageName(id);

        const sql = `delete from vacations where id = ?;`;
        const values = [id];
        const successParams: OkPacketParams = await dal.execute(sql, values);
        if (successParams.affectedRows === 0) throw new NotFoundError(`id ${id} not found.`);

        // Delete image: 
        await fileSaver.delete(oldImageName);
    };

    public async getVacationsWithUserLikes(userId: number): Promise<VacationModel[]> {
        //check the condition - if there is a vacation the user picked - write 1, otherwise write 0.
        const sql = `select v.id, 
        case when exists (select 1 from likes where userId = ? and vacationId = v.id) then 1 else 0 end
        as isLiked from vacations as v order by v.startDate;`;

        const values = [userId];
        const vacations = await dal.execute(sql, values);
        return vacations;
    };
}

export const vacationService = new VacationService();

