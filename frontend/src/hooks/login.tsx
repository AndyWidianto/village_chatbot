import { useState } from "react";
import { useAuthStore } from "../lib/store/authStore";
import type { Login } from "../lib/types";
import useAxios from "../lib/axios.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";




export default function useLogin() {
    const { setAuth } = useAuthStore();
    const { axiosPublic } = useAxios();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<Login>({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    // const validate = () => {
    //     let error: Partial<Login> = {};
    //     if (!formData.email.trim()) {
    //         error.email = "email is required";
    //     }
    //     if (!formData.password.trim()) {
    //         error.password = "password is required";
    //     }
    // }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosPublic.post("/login", formData, { withCredentials: true });
            const data = res.data;
            console.log(data);
            setAuth(data.user, data.accessToken);
            toast.success("Login successfully!", {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#00ff44',
                    color: '#fff',
                }
            })
            navigate("/dashboard");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data autoreply";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        formData,
        setFormData,
        handleSubmit,
        showPassword,
        setShowPassword
    }
}