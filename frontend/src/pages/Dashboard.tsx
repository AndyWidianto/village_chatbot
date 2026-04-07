import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { useTheme } from '../ThemeProvider';



export default function Dashboard() {
    const { theme } = useTheme();
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

    const pieChartSeries = [44, 55, 13, 43, 22];
    const pieChartOptions: ApexOptions = {
        chart: {
            type: 'pie',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        legend: {
            labels: {
                colors: theme === 'dark' ? '#ffffff' : '#000000'
            }
        },
  stroke: {
    show: false
  },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Top Row */}
            <div className="md:col-span-6 lg:col-span-4 bg-white/80 backdrop-blur border border-gray-200 dark:border-gray-600 shadow-md rounded-2xl p-5 dark:bg-[#1E1E1E] rounded-3xl">
                <h3 className="mb-1 md:mb-4 font-medium">Device Activity</h3>
                <div id="chart" className='dark:text-white'>
                    <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={180} />
                </div>
            </div>

            <div className="md:col-span-6 lg:col-span-4 bg-white/80 backdrop-blur border border-gray-200 dark:border-gray-600 shadow-md rounded-2xl dark:bg-[#1E1E1E] p-5 rounded-3xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Employees</h3>
                    <select className="bg-transparent text-xs text-gray-800 dark:text-gray-400 border-none outline-none">
                        <option>Aug 25-Sept 25</option>
                    </select>
                </div>
                <div className="flex items-center justify-between flex-1">
                    <div className="space-y-4">
                        <StatItem label="Inactive" value="254" color="text-orange-400" />
                        <StatItem label="Active" value="3000" color="text-red-400" />
                        <StatItem label="Total" value="3254" color="text-gray-800 dark:text-white" />
                    </div>
                    {/* Placeholder for Radial/Circle Chart */}
                    <div className="w-32 h-32 border-4 border-gray-800 rounded-full flex items-center justify-center relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img src="https://i.pravatar.cc/150?u=emp" alt="emp" />
                        </div>
                        <div className="absolute inset-0 border-t-4 border-orange-400 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-6 lg:col-span-4 space-y-4">
                <MetricCard title="Top 10" desc="Position in Dribbble" sub="20% increase from last week" />
                <MetricCard title="26" desc="New Employees Onboarded" sub="15% increase from last month" color="text-orange-400" />
                <MetricCard title="500" desc="New Clients Approached" sub="5% increase from last week" color="text-cyan-400" />
            </div>

            {/* Bottom Row */}
            <div className="md:col-span-6 lg:col-span-8 bg-white/80 backdrop-blur border border-gray-200 dark:border-gray-600 shadow-md rounded-2xl p-1 md:p-4 dark:bg-[#1E1E1E] p-6 rounded-3xl">
                <div className="flex justify-between mb-1 md:mb-4">
                    <h3 className="font-medium">Incoming Messages</h3>
                    <div className="flex g p-1amd:p-4 text-xs">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div> Achieved</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> Target</span>
                    </div>
                </div>
                <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={250} />
            </div>

            <div className="md:col-span-6 lg:col-span-4 bg-white/80 backdrop-blur border border-gray-200 dark:border-gray-600 shadow-md rounded-2xl p-1 md:p-4 dark:bg-[#1E1E1E] p-6 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium">Notifications</h3>
                    <button className="text-orange-400 text-xs">View All</button>
                </div>
                <div className="space-y-4">
                    <NotificationItem name="Ellie" action="joined team developers" time="04 April, 2021 | 04:00 PM" />
                    <NotificationItem name="Jenny" action="joined team HR" time="03 April, 2021 | 04:00 PM" />
                    <NotificationItem name="Adam" action="got employee of the month" time="03 April, 2021 | 02:00 PM" />
                    <NotificationItem name="Robert" action="joined team design" time="02 April, 2021 | 02:00 PM" />
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
        <p className={`text-xl font-bold ${color}`}>{value}</p>
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