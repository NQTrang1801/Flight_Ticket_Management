import axios from "~/utils/axios";

const login = (email: string, password: string) => {
    return axios
        .post("/user/administrator-login", {
            email,
            password
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response));
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
