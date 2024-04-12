import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import loading from "./loading";
import searching from "./searching";

export default combineReducers({
    auth,
    message,
    loading,
    searching
});
