import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3001/api"
});

// custom response
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance;
