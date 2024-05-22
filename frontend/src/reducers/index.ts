import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import loading from "./loading";
import searching from "./searching";
import permissions from "./permissions";

export default combineReducers({
    auth,
    message,
    loading,
    searching,
    permissions
});
