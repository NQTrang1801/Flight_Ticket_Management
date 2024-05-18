import axios from "~/utils/axios";

const login = (email: string, password: string, userType: string) => {
    return axios
        .post(`/user/${userType !== "user" ? userType + "-" : ""}login`, {
            email,
            password
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

export default {
    login,
    logout
};
