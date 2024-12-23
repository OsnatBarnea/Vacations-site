import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../Models/VacationModel";

export function initVacations(currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    const newState = action.payload;
    return newState;
};

export function addVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const newState = [...currentState];
    newState.push(action.payload);
    return newState;
};

export function updateVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[]{
    const newState = [...currentState];
    const index = newState.findIndex(v => v.id === action.payload.id);
    newState[index] = action.payload;
    return newState;
};

export function deleteVacation(currentState: VacationModel[], action: PayloadAction<number>): VacationModel[] {
    const newState = [...currentState];
    const index = newState.findIndex(v => v.id === action.payload);
    newState.splice(index, 1);
    return newState;
};

export function upcomingVacations(currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    const newState = action.payload;
    return newState;
};

export function activeVacations(currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    const newState = action.payload;
    return newState;
};

export function clearVacations(currentState: VacationModel[], action: PayloadAction): VacationModel[] {
    return [];
};

export const vacationSlice = createSlice({
    name: "vacations",
    initialState: [],
    reducers: { initVacations, addVacation, updateVacation, deleteVacation, clearVacations }
});

export const vacationActions = vacationSlice.actions;