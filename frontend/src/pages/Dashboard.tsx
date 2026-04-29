import Chart from 'react-apexcharts';
import { useTheme } from '../ThemeProvider';
import useAxios from '../lib/axios.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';



export default function Dashboard() {
    const { theme } = useTheme();
    const { axiosPrivate } = useAxios();
    const [stats, setStasts] = useState({
        activeUser: 0,
        inactiveUser: 0,
        totalUser: 0
    });
    const lineChartOptions: any = {
        chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#F87171', '#22D3EE'],
        grid: { borderColor: '#334155', strokeDashArray: 4 },
        xaxis: {
            categories: ['Oct 2021', 'Nov 2021', 'Dec 2021', 'Jan 2022', 'Feb 2022', 'Mar 2022'],
            labels: { style: { colors: theme === 'dark' ? '#94A3B8' : '#64748B' } }
        },
        yaxis: { labels: { style: { colors: theme === 'dark' ? '#94A3B8' : '#64748B' } } },
        theme: { mode: 'dark' },
        legend: { show: false }
    };

    const lineChartSeries = [
        { name: 'Achieved', data: [6, 7, 5, 8, 6, 7] },
        { name: 'Target', data: [4, 5, 3, 5, 6, 4] }
    ];

    const fetchStatUser = async () => {
        try {
            const res = await axiosPrivate.get(`/users/stats`);
            const data = res.data;
            console.log(data);
            setStasts(prev => ({...prev, activeUser: data.active, inactiveUser: data.inactive, totalUser: data.total }))
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
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-2">
            {/* Row 1: Device Activity */}
            {/* <div className="md:col-span-12 lg:col-span-4 group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] p-6">
                <div className="flex flex-col gap-1 mb-6">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Device Activity</h3>
                    <p className="text-xs text-slate-500">Monitoring real-time sessions</p>
                </div>
                <div id="chart" className="flex justify-center items-center">
                    <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={200} />
                </div>
            </div> */}

            {/* Row 1: Employee Overview */}
            <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Employees</h3>
                        <p className="text-xs text-slate-500">Headcount distribution</p>
                    </div>
                    <select className="bg-slate-50 dark:bg-slate-800 text-[10px] font-medium py-1 px-2 rounded-lg border-none ring-1 ring-slate-200 dark:ring-slate-700 outline-none">
                        <option>Aug 25 - Sept 25</option>
                    </select>
                </div>
                <div className="flex items-center justify-between flex-1 gap-4">
                    <div className="md:block lg:flex gap-4 space-y-5">
                        <StatItem label="Inactive" value={stats.inactiveUser} color="bg-orange-400" />
                        <StatItem label="Active" value={stats.activeUser} color="bg-emerald-400" />
                        <StatItem label="Total" value={stats.totalUser} color="bg-slate-800 dark:bg-white" />
                    </div>

                    {/* Enhanced Progress Circle */}
                    <div className="relative flex items-center justify-center">
                        <div className="w-36 h-36 border-[10px] border-slate-100 dark:border-slate-800 rounded-full"></div>
                        <div className="absolute w-36 h-36 border-[10px] border-orange-500 border-t-transparent border-l-transparent rounded-full rotate-45"></div>
                        <div className="absolute w-30 h-30 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden shadow-xl">
                            <img src="https://i.pravatar.cc/150?u=emp" alt="emp" className="object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 1: Mini Metrics */}
            <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-4">
                <MetricCard
                    title="Top 10"
                    desc="Dribbble Position"
                    sub="+20% this week"
                    icon="🎯"
                />
                <MetricCard
                    title="26"
                    desc="New Onboarded"
                    sub="+15% last month"
                    color="text-orange-500"
                    icon="👤"
                />
                <MetricCard
                    title="500"
                    desc="Clients Approached"
                    sub="+5% conversion"
                    color="text-cyan-500"
                    icon="💼"
                />
            </div>

            {/* Bottom Row: Messages Chart */}
            <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Incoming Messages</h3>
                        <p className="text-sm text-slate-500">Monthly engagement analytics</p>
                    </div>
                    <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]"></span> Achieved
                        </span>
                        <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span> Target
                        </span>
                    </div>
                </div>
                <div className="w-full">
                    <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={280} />
                </div>
            </div>

            {/* Bottom Row: Notifications */}
            <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                    <button className="px-3 py-1 text-xs font-bold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors">
                        View All
                    </button>
                </div>
                <div className="relative space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
                    <NotificationItem name="Ellie" action="joined team developers" time="04:00 PM" />
                    <NotificationItem name="Jenny" action="joined team HR" time="Yesterday" />
                    <NotificationItem name="Adam" action="employee of the month" time="2 days ago" isSpecial />
                    <NotificationItem name="Robert" action="joined team design" time="02:00 PM" />
                </div>
            </div>
        </div>
    )
};


const StatItem = ({ label, value, color }: any) => (
    <div>
        <p className="text-[10px] text-gray-500 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${color.replace('text', 'bg')}`}></span> {label}
        </p>
        <p className={`text-xl font-bold`}>{value}</p>
    </div>
);

const MetricCard = ({ title, desc, sub, color = "text-gray-800 dark:text-white" }: any) => (
    <div className="bg-white/80 backdrop-blur border border-gray-200 dark:border-gray-600 shadow-md rounded-2xl p-1 md:p-4 dark:bg-[#1E1E1E] p-1 md:p-4 rounded-2xl text-center border border-transparent hover:border-gray-700 transition">
        <h4 className={`text-2xl font-bold ${color}`}>{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{desc}</p>
        <p className="text-[10px] text-gray-500 mt-1">{sub}</p>
    </div>
);

const NotificationItem = ({ name, action, time }: any) => (
    <div className="flex gap-3 items-start bg-gray-300 dark:bg-black/20 p-3 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
        <div>
            <p className="text-xs"><strong>{name}</strong> {action}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-300 mt-1">{time}</p>
        </div>
    </div>
);