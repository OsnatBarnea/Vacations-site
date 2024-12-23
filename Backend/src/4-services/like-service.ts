import { OkPacketParams } from "mysql2";
import { dal } from "../2-utils/dal";
import { NotFoundError } from "../3-models/error-models";
import { LikeModel } from "../3-models/like-model";

class LikeService {

    public async getAllLikes(): Promise<LikeModel[]> {
        const sql = `select * from likes;`;

        const likes = await dal.execute(sql);
        return likes;
    };
    
    public async getOneLike(id: number): Promise<LikeModel> {
        
        const sql = `select * from likes where id = ?`;
        const values = [id];
        const checkForLikeInArray = await dal.execute(sql, values);
        const checkForLike = checkForLikeInArray[0];

        // If no like - throw error 
        if (!checkForLike) throw new NotFoundError(`This vacation (id - ${id}) has no likes in the data base`);
        return checkForLike;
    };

    public async addLikes(like: LikeModel): Promise<LikeModel> {
        //check validation 
        like.validateInsert();

        const sql = `insert into likes values(default, ?, ?);`;
        const values = [like.userId, like.vacationId];
        const successParams: OkPacketParams = await dal.execute(sql, values);

        const dbLike = await this.getOneLike(successParams.insertId);
        return dbLike;
    };

    public async deleteLike(id: number): Promise<void> {
            const sql = `delete from likes where id = ? ;`;
            const values = [id];
            const successParams: OkPacketParams = await dal.execute(sql, values);
            if (successParams.affectedRows === 0) throw new NotFoundError(`Id - ${id} is not found.`);
            return;
    };
}
export const likeService = new LikeService();

