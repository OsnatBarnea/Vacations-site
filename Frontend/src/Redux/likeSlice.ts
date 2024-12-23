import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LikeModel } from "../Models/LikeModel";

export function initLikes(currentState: LikeModel[], action: PayloadAction<LikeModel[]>): LikeModel[] {
    const newState = action.payload;
    return newState;
};

export function addLike(currentState: LikeModel[], action: PayloadAction<LikeModel>): LikeModel[] {
    const newState = [...currentState];
    newState.push(action.payload);
    return newState;
};

export function deleteLike(currentState: LikeModel[], action: PayloadAction<number>): LikeModel[] {
    const newState = [...currentState];

    const index = newState.findIndex(l => l.id === action.payload);
    newState.splice(index, 1);

    return newState;
};


export function clearLikes(currentState: LikeModel[], action: PayloadAction): LikeModel[] {
    return [];
};

export const likeSlice = createSlice({
    name: "like",
    initialState: [],
    reducers: { initLikes, addLike, deleteLike, clearLikes }
});

export const likeActions = likeSlice.actions;