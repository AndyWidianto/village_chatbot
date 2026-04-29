import axios from "axios";
import { useAuthStore } from "./store/authStore";
import { useNavigate } from "react-router";


export default function useAxios() {
    const { accessToken, updateAccessToken, logout } = useAuthStore();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const axiosPublic = axios.create({
        baseURL: baseUrl,
    });

    const axiosPrivate = axios.create({
        baseURL: baseUrl,
        withCredentials: true,
    });

    axiosPrivate.interceptors.request.use(
        (config) => {
            if (accessToken && !config.headers["Authorization"]) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );


    axiosPrivate.interceptors.response.use(
        (response) => response,
        async (error) => {
            const prevRequest = error?.config;

            if (error?.response?.status === 401 && !prevRequest?.sent) {
                prevRequest.sent = true;

                try {
                    const response = await axiosPublic.post("/refreshToken", {}, {
                        withCredentials: true,
                    });

                    const newAccessToken = response.data.accessToken;
                    updateAccessToken(newAccessToken);
                    console.log(newAccessToken);

                    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                } catch (refreshError) {
                    logout();
                    navigate("/login");
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return {
        axiosPrivate,
        axiosPublic
    }
}