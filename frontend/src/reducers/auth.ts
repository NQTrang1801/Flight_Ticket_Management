import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../actions/types";
import { AxiosResponse } from "axios";

interface UserState {
    isLoggedIn: boolean;
    user: AxiosResponse | null;
}

interface Action {
    type: string;
    payload: {
        user: AxiosResponse | null;
    };
}

const user = JSON.parse(localStorage.getItem("user")!);

const initialState: UserState = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user: null };

export default function (state = initialState, action: Action) {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user
            };
        case LOGIN_FAIL:
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null
            };
        default:
            return state;
    }
}
