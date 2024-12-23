import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import { LikeModel } from "../Models/LikeModel";
import { store } from "../Redux/Store";
import { likeActions } from "../Redux/likeSlice";

class LikeService {

    public async getAllLikes(): Promise<LikeModel[]> {
        if (store.getState().like.length > 0) return store.getState().like;

        const response = await axios.get<LikeModel[]>(appConfig.allLikesUrl);
        const likes = response.data;

        // Init in global state: 
        const action = likeActions.initLikes(likes);
        store.dispatch(action);

        return likes;
    };

    public async getOneLike(userId: number, vacationId: number): Promise<LikeModel> {
        //check global state
        const allLikes = store.getState().like;

        if (allLikes.length > 0) {
            //check for existing like
            const checkExistingLike = allLikes.filter(l => vacationId === l.vacationId && l.userId === userId);

            if (!checkExistingLike) {
                return;
            }
            return checkExistingLike[0];
        };

        //check the data base
        const response = await axios.get<LikeModel[]>(appConfig.allLikesUrl);
        const dbLikes = response.data;
        const checkExistingLikeDB = dbLikes.filter(dbl => dbl.userId === userId && dbl.vacationId === vacationId);

        if (!checkExistingLikeDB) {
            return;
        }
        return checkExistingLikeDB[0];
    };


    public async addLike(userId: number, vacationId: number): Promise<void> {
        const like = { userId, vacationId }
        const response = await axios.post<LikeModel>(appConfig.addLikeUrl, like);
        const dbLike = response.data;

        // Send like to redux: 
        const action = likeActions.addLike(dbLike);
        store.dispatch(action);
    };

    public async deleteLike(userId: number, vacationId: number): Promise<void> {
        const allLikes = store.getState().like;

        //check for existing like
        const checkExistingLike = allLikes.find(l => vacationId === l.vacationId && l.userId === userId);

        //delete from db. the axios basic format uses {data: ...} to get more information
        await axios.delete<void>(appConfig.likeUrl + checkExistingLike.id);

        // delete from global state: 
        const action = likeActions.deleteLike(checkExistingLike.id);
        store.dispatch(action);
    };
}
export const likeService = new LikeService();

