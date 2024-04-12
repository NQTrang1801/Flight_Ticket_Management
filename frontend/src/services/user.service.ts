import axios from "~/utils/axios";
import authHeader from "./auth-header";

const getAdminBoard = () => {
    return axios.get("/", { headers: authHeader() });
};

export default {
    getAdminBoard
};
