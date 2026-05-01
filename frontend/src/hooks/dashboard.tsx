import { useTheme } from '../ThemeProvider';
import useAxios from '../lib/axios.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Notification } from '../lib/types';
import type { ApexOptions } from 'apexcharts';

export default function useDashboard() {
        const { theme } = useTheme();
        const { axiosPrivate } = useAxios();
        const [stats, setStasts] = useState({
            activeUser: 0,
            inactiveUser: 0,
            totalUser: 0
        });
        const [notifications, setNotifications] = useState<Notification[]>([]);
        const [lineChartOptions, setLineChartOptions] = useState<ApexOptions>({
            chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
            stroke: { curve: 'smooth', width: 3 },
            colors: ['#22D3EE'],
            grid: { borderColor: '#334155', strokeDashArray: 4 },
            xaxis: {
                categories: [],
                labels: { style: { colors: theme === 'dark' ? '#94A3B8' : '#64748B' } }
            },
            yaxis: { labels: { style: { colors: theme === 'dark' ? '#94A3B8' : '#64748B' } } },
            theme: { mode: 'dark' },
            legend: { show: false }
        });
        const [lineChartSeries, setLineChartSeries] = useState([
            { name: "Messages", data: [] }
        ]);
        const [matricStat, setMatricStat] = useState([
            {
                id: 1,
                title: lineChartSeries[0].data.length,
                des: "Total Messages",
                sub: "",
            },
            {
                id: 2,
                title: "",
                des: "Total Autoreply",
                sub: "",
            },
            {
                id: 3,
                title: "",
                des: "Total Knowledge",
                sub: "",
            }
        ])
    
        const fetchStatMessages = async () => {
            try {
                const res = await axiosPrivate.get(`/messages/stats`);
                const data = res.data;
                setLineChartSeries([
                    { name: "Messages", data: data.data }
                ])
                setLineChartOptions(prev => ({
                    ...prev,
                    xaxis: {
                        ...prev.xaxis,
                        categories: data.labels
                    },
                }));
                setMatricStat(prev => prev.map(p => {
                    if (p.id === 1) {
                        const total = (data.data as []).reduce((acc, curr) => acc + curr, 0);
                        return { ...p, title: total.toString() };
                    }
                    return p;
                }));
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Gagal mengambil data Messages";
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
            }
        }
    
        const fetchStatDashboard = async () => {
            try {
                const res = await axiosPrivate.get(`/dashboard/stats`);
                const data = res.data;
                console.log(data);
                setMatricStat(prev => prev.map(p => {
                    if (p.id === 2) {
                        const title = data.autoreply.total;
                        const growth = data.autoreply.growth;
                        return { ...p, title, sub: `${growth > 0 ? "+" : "-"}${growth}% last month` }
                    }
                    if (p.id === 3) {
                        const title = data.knowledge.total;
                        const growth = data.knowledge.growth;
                        return { ...p, title, sub: `${growth > 0 ? "+" : "-"}${growth}% last month` }
                    }
                    return p;
                }))
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Gagal mengambil data Stat";
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
            }
        }
    
        const fetchNotifications = async () => {
            try {
                const res = await axiosPrivate.get(`/notifications`);
                const data = res.data;
                console.log(data);
                setNotifications(data);
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
            }
        }
    
        const fetchStatUser = async () => {
            try {
                const res = await axiosPrivate.get(`/users/stats`);
                const data = res.data;
                setStasts(prev => ({ ...prev, activeUser: data.active, inactiveUser: data.inactive, totalUser: data.total }))
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
            }
        }
    
        useEffect(() => {
            fetchStatUser();
            fetchStatDashboard();
            fetchStatMessages();
            fetchNotifications();
        }, [])

    return {
        notifications,
        stats,
        setStasts,
        lineChartOptions,
        lineChartSeries,
        matricStat
    }
}