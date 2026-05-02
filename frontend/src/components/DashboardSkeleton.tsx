


export const OverviewSkeleton = () => (
    <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 flex flex-col animate-pulse">
        <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
            </div>
        </div>
        <div className="flex items-center justify-between flex-1 gap-4">
            <div className="md:block lg:flex gap-4 space-y-5 lg:space-y-0">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="space-y-2">
                            <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
                            <div className="h-5 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="relative flex items-center justify-center">
                <div className="w-36 h-36 border-[10px] border-slate-100 dark:border-slate-800 rounded-full"></div>
                <div className="absolute w-28 h-28 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>
        </div>
    </div>
)

export const NotificationSkeleton = () => (
    <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-8 lg:p-5 animate-pulse">
        <div className="flex justify-between items-center mb-8 lg:px-3">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-2 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)
export const MatricSkeleton = () => (
    <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[1.5rem] p-4 animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                </div>
            </div>
        ))}
    </div>
)

export const ChartSkeleton = () => (
    <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-[2rem] p-8 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-2">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
            </div>
            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
        </div>
        <div className="w-full h-64 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"></div>
    </div>
)