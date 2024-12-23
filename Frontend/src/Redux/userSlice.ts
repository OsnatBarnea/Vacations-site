import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";

const initialState: UserModel | null = null;

export function initUser(currentState: UserModel = initialState, action: PayloadAction<UserModel>): UserModel {
    const newState = action.payload;
    return newState;
};

export function logoutUser(currentState: UserModel, action: PayloadAction): UserModel {
    const newState: UserModel = null; //empty the state
    return newState;
};

export const userSlice = createSlice ({
    name: "user",
    initialState: null,
    reducers: { initUser, logoutUser } 
});

export const userActions = userSlice.actions;