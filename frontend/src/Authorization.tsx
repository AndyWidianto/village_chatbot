import { Navigate } from "react-router";
import { useAuthStore } from "./lib/store/authStore";

export default function Authorization({ children } : { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();

    return isAuthenticated ? children : <Navigate to="/login" />
}