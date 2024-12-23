import axios, { AxiosRequestConfig } from "axios";
import { appConfig } from "../Utils/AppConfig";
import { LikeModel } from "../Models/LikeModel";
import { VacationModel } from "../Models/VacationModel";
import { store } from "../Redux/Store";
import { vacationActions } from "../Redux/vacationSlice";

class VacationService {

    public async getAllVacations(): Promise<VacationModel[]> {
        // check global state (instead of getting to db)
        if (store.getState().vacations.length > 0) return store.getState().vacations;

        //if data is not saved in redux - go to the db
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
        const vacations = response.data;

        // Init in global state: 
        const action = vacationActions.initVacations(vacations);
        store.dispatch(action);

        return vacations;
    };

    public async getVacationsBySearch(destination: string): Promise<VacationModel[]> {
        //if the data in global state - fetch the searched destinations
        if (store.getState().vacations.length > 0) return store.getState().vacations.filter(v => v.destination.toLowerCase().includes(destination.toLowerCase()));

        const response = await axios.get(appConfig.searchVacationsUrl + destination);
        const vacations = response.data;
        return vacations;
    };

    public async getLikedVacations(userId: number): Promise<VacationModel[]> {
        //fetch all likes and vacations from redux
        const allLikes = store.getState().like;
        const allVacations = store.getState().vacations;

        if (allLikes.length > 0 && allVacations.length > 0) {
            //filter the vacationId'd of the user's likes 
            const likedVacationsId = allLikes.filter(l => l.userId === userId).map(l => l.vacationId);
            //filter only the vacations the user liked
            return allVacations.filter(v => likedVacationsId.includes(v.id))
        }

        const response = await axios.get(appConfig.userLikeVacationUrl + userId);
        const likedVacations = response.data;
        return likedVacations;
    };

    public async addVacation(vacation: VacationModel): Promise<void> {
        // Add header for sending json + files(images)
        const options: AxiosRequestConfig = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        const response = await axios.post<VacationModel>(appConfig.addVacationsUrl, vacation, options);
        const dbVacation = response.data;

        // Send vacation to global state: 
        const action = vacationActions.addVacation(dbVacation);
        store.dispatch(action);
    };

    public async deleteVacation(id: number): Promise<void> {
        //delete from db
        await axios.delete<void>(appConfig.vacationsUrl + id);

        // delete from global state: 
        const action = vacationActions.deleteVacation(id);
        store.dispatch(action);
    };

    public async getOneVacation(id: number): Promise<VacationModel> {
        //get from global state
        const vacationInState = store.getState().vacations.find(v => v.id === id);
        if (vacationInState) return vacationInState;

        // Fetch vacation from db 
        const response = await axios.get<VacationModel>(appConfig.vacationsUrl + id);
        const vacation = response.data;
        return vacation;
    };

    public async updateVacation(vacation: VacationModel): Promise<void> {
        // Add header for sending json + files:
        const options: AxiosRequestConfig = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        const response = await axios.put<VacationModel>(appConfig.updateVacationUrl + vacation.id, vacation, options);

        // Extract the vacation from the response: 
        const dbVacation = response.data;

        // Update vacation in global state: 
        const action = vacationActions.updateVacation(dbVacation);
        store.dispatch(action);
    };

    //clear vacations from global state
    public clearAllVacations(): void {
        const action = vacationActions.clearVacations();
        store.dispatch(action);
    };

    public async getVacationsWithUserLikes(userId: number): Promise<VacationModel[]> {
        // Fetch vacations id with user isLiked (0 or 1) from db - to check if the view is "my favorites"
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUserIsLikesUrl + userId);
        const vacations = response.data;
        return vacations;
    };
}

export const vacationService = new VacationService();

