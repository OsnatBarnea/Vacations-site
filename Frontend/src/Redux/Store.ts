import { configureStore } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel"
import { userSlice } from "./userSlice";
import { VacationModel } from "../Models/VacationModel";
import { vacationSlice } from "./vacationSlice";
import { LikeModel } from "../Models/LikeModel";
import { likeSlice } from "./likeSlice";

//Global state
export type AppState = {
    user: UserModel;
    vacations: VacationModel[];
    like: LikeModel[];
};

//Store
export const store = configureStore<AppState>({
    reducer: {
        user: userSlice.reducer,
        vacations: vacationSlice.reducer,
        like: likeSlice.reducer
    }
});
