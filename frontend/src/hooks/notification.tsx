import { useEffect, useState } from "react"
import type { Notification } from "../lib/types"
import { toast } from "sonner";
import useAxios from "../lib/axios.service";

export default function useNotification() {
    const { axiosPrivate } = useAxios();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [nextPage, setNextPage] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const limit = 2;

    const fetchNotifications = async () => {
        if (!hasMore) return;
        setLoading(true);
        try {
            const res = await axiosPrivate.get(`/notifications?limit=${limit}&lastId=${nextPage}`);
            const data: Notification[] = res.data;
            if (data.length < limit) {
                setHasMore(false);
            }
            console.log(data);
            setNextPage(data[data.length - 1].id);
            setNotifications(prev => [...prev, ...data]);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data notification";
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
    useEffect(() => {
        fetchNotifications()
    }, []);
    return {
        notifications,
        hasMore,
        fetchNotifications,
        loading
    }
}