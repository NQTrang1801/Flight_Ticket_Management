import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "./types";

import AuthService from "../services/auth.service";
import { Dispatch } from "redux";

export const login = (email: string, password: string, userType: string) => (dispatch: Dispatch) => {
    return AuthService.login(email, password, userType).then(
        (data) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user: data }
            });

            return Promise.resolve();
        },
        (error) => {
            dispatch({
                type: LOGIN_FAIL
            });

            return Promise.reject(error);
        }
    );
};

export const logout = () => (dispatch: Dispatch) => {
    AuthService.logout();

    dispatch({
        type: LOGOUT
    });
};
