import { START_LOADING, STOP_LOADING } from "~/actions/types";
import { LoadingAction } from "~/actions/loading";

interface LoadingState {
    isLoading: boolean;
}

const initialState: LoadingState = {
    isLoading: false
};

export default function (state = initialState, action: LoadingAction) {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true };
        case STOP_LOADING:
            return { ...state, isLoading: false };
        default:
            return state;
    }
}
