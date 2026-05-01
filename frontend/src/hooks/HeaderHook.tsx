import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../ThemeProvider";
import type { Notification } from "../lib/types";
import useAxios from "../lib/axios.service";
import { toast } from "sonner";

export default function useHeaderHook() {
    const notifications = [
        {
            id: 1,
            user: "Paul Svensson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul",
            action: "invite you to",
            target: "Prototyping",
            time: "Now",
            category: "Courses",
            type: "invite",
            file: {
                name: "Cover-Templates",
                size: "9mb"
            },
            unread: true,
        },
        {
            id: 2,
            user: "Adam Nolan",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adam",
            action: "mentioned you in",
            target: "UX Basics",
            time: "9h ago",
            category: "Notes",
            unread: true,
        },
        {
            id: 3,
            user: "Paul Morgan",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
            action: "commented in",
            target: "UI Design",
            time: "9h ago",
            category: "Blog",
            unread: false,
        }
    ];
    const { axiosPrivate } = useAxios();
    // const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const refNotification = useRef<HTMLDivElement | null>(null);
    const themeContext = useContext(ThemeContext);
    if (themeContext === undefined) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    const refProfile = useRef<HTMLDivElement | null>(null);

    const getGreeting = () => {
        const hour = new Date().getHours(); // Mengambil jam saat ini (0-23)

        if (hour >= 5 && hour < 10) {
            return "Selamat Pagi ☀️";
        } else if (hour >= 10 && hour < 15) {
            return "Selamat Siang 🌤️";
        } else if (hour >= 15 && hour < 18) {
            return "Selamat Sore 🌅";
        } else {
            return "Selamat Malam 🌙";
        }
    }
    const handleSearch = () => {
        if (!showSearch) {
            setShowSearch(true);
            const inputSearch = document.getElementById("input-search") as HTMLInputElement | null;
            if (inputSearch) {
                inputSearch.focus();
            }
        }
        // Logic untuk fokus ke input search
        alert("Fokus ke input search! (Implementasi logika pencarian di sini)");
    }

        // const fetchNotifications = async () => {
        //     try {
        //         const res = await axiosPrivate.get(`/notifications`);
        //         const data = res.data;
        //         setNotifications(data);
        //     } catch (err: any) {
        //         const errorMessage = err.response?.data?.message || "Gagal mengambil data notification";
        //         toast.error(errorMessage, {
        //             duration: 4000,
        //             position: 'top-right',
        //             style: {
        //                 borderRadius: '12px',
        //                 background: '#1e293b',
        //                 color: '#fff',
        //             },
        //         });
    
        //         console.error("Fetch Error:", err);
        //     }
        // }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (refNotification.current && !refNotification.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (refProfile.current && !refProfile.current.contains(event.target as Node)) {
                setIsOpenProfile(false);
            }   
        };

        // fetchNotifications();

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return {
        notifications,
        showNotifications,
        setShowNotifications,
        showSearch,
        setShowSearch,
        isOpenProfile,
        setIsOpenProfile,
        searchTerm,
        setSearchTerm,
        refNotification,
        refProfile,
        getGreeting,
        handleSearch,
    }
}