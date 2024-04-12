import { START_LOADING, STOP_LOADING } from "./types";
import { Dispatch } from "redux";

export const startLoading = () => ({
    type: START_LOADING
});

export const stopLoading = () => ({
    type: STOP_LOADING
});

export type LoadingAction = ReturnType<typeof startLoading | typeof stopLoading>;

export const toggleLoading = (isLoading: boolean) => (dispatch: Dispatch<LoadingAction>) => {
    if (isLoading) {
        dispatch(startLoading());
    } else {
        dispatch(stopLoading());
    }
};
