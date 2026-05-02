import {
    Search, Bell,
    Menu, Sun, Moon,
    X,
    Settings,
    CreditCard,
    ShieldCheck,
    LogOut
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import { NavLink } from "react-router";
import { Accordion } from "./Animate";
import useHeaderHook from "../hooks/HeaderHook";



interface HeaderContent {
    title: string;
    description: string;
}
interface HeaderProps {
    handleToggleSidebar: () => void;
    headerContent: HeaderContent;
}
export default function Header({ handleToggleSidebar, headerContent }: HeaderProps) {
    const themeContext = useContext(ThemeContext);
    if (themeContext === undefined) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    const { theme, toggleTheme } = themeContext;
    const {
        showNotifications,
        setShowNotifications,
        notifications,
        showSearch,
        setShowSearch, 
        isOpenProfile,
        setIsOpenProfile,
        refNotification,
        setSearchTerm,
        getGreeting,
        user,
        refProfile } = useHeaderHook();

    return (
        <>
            {showSearch && (
                <div className="fixed w-full h-screen left-0 right-0 top-0 bg-gray-800/80 p-4 z-55"></div>
            )}
            <Accordion isOpen={showSearch}>
                <div className="fixed top-10 md:top-17 w-[100%] lg:w-[calc(100%-15rem)] right-0 z-60">
                    <div className="flex items-center justify-center p-4 w-full mx-auto">
                        <div className="relative w-2xl">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="input-search"
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={() => setShowSearch(false)} className="block p-2 text-gray-100">
                            <X size={20} />
                        </button>
                    </div>

                </div>
            </Accordion>
            <header className={`flex items-center mb-8 h-17 fixed top-0 right-0 bg-gray-100 dark:bg-background z-10 p-2 w-full lg:w-[calc(100%-16rem)]`}>
                <button onClick={() => handleToggleSidebar()} className="text-gray-400 lg:hidden">
                    <Menu size={20} />
                </button>
                <div className="flex md:justify-between justify-end items-center w-full ml-5 lg:ml-0">
                    <div className="hidden md:block">
                        {headerContent.title.toLowerCase() !== "dashboard" ? <div>
                            <h2 className="text-2xl font-semibold">{headerContent.title}</h2>
                            <p className="text-gray-400 text-sm">{headerContent.description}</p>
                        </div> : <div>
                            <h2 className="text-2xl font-semibold">{getGreeting()}</h2>
                            <p className="text-gray-400 text-sm">Semoga harimu menyenangkan</p>
                        </div>}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl w-64 shadow-inner">

                            {/* Slider Background (Bola/Kotak yang bergeser) */}
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-[#6366f1] rounded-lg shadow-md transition-all duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-full' : 'translate-x-0'
                                    }`}
                            />

                            {/* Tombol Light */}
                            <button
                                onClick={() => toggleTheme()}
                                className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-300 ${theme === 'light' ? 'text-indigo-600' : 'text-gray-500'
                                    }`}
                            >
                                <Sun size={18} />
                                Light
                            </button>

                            {/* Tombol Dark */}
                            <button
                                onClick={() => toggleTheme()}
                                className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-500'
                                    }`}
                            >
                                <Moon size={18} />
                                Dark
                            </button>
                        </div>
                        <button onClick={() => setShowSearch(!showSearch)} className="block text-gray-400 cursor-pointer">
                            <Search size={20} />
                        </button>
                        <div className="relative" ref={refNotification}>
                            <button className="block" onClick={() => setShowNotifications(!showNotifications)}>
                                <Bell className="text-gray-400 cursor-pointer" size={20} />
                            </button>
                            {notifications.some(n => n.unread) && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                            )}
                            {showNotifications && notifications.length > 0 && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#202C33] rounded-lg shadow-lg overflow-hidden">
                                    {notifications.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`px-4 py-3 transition-colors ${item.unread ? 'bg-gray-50/50 dark:bg-zinc-800/30' : 'bg-white dark:bg-zinc-900'}`}
                                        >
                                            <div className="flex gap-1">
                                                <img
                                                    src={item.avatar}
                                                    alt={item.user}
                                                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800"
                                                />

                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                        <span className="font-bold text-gray-900 dark:text-zinc-100">{item.user}</span>
                                                        <span className="text-gray-500 dark:text-zinc-400 text-sm">{item.action}</span>
                                                        {item.target && (
                                                            <span className="font-bold text-gray-900 dark:text-zinc-100 text-sm">{item.target}</span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-gray-400 dark:text-zinc-500">{item.time}</span>
                                                        <span className="text-gray-300 dark:text-zinc-700">•</span>
                                                        <span className="text-xs text-gray-400 dark:text-zinc-500">{item.category}</span>
                                                    </div>

                                                    {/* Conditional Rendering for File attachment */}
                                                    {item.file && (
                                                        <div className="mt-3 p-3 border border-gray-100 dark:border-zinc-800 rounded-lg flex items-center gap-3 bg-white dark:bg-zinc-900 shadow-sm w-fit pr-8">
                                                            <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" className="w-4 h-4" alt="figma" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{item.file.name}</span>
                                                                <span className="text-[10px] text-gray-400 dark:text-zinc-500">{item.file.size}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <NavLink to="/dashboard/notifications" className="block text-center text-sm  hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 transition">Lihat Semua</NavLink>
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={refProfile}>
                            <button
                                onClick={() => setIsOpenProfile(!isOpenProfile)}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700"
                            >
                                <img src={user?.profileUrl} alt="avatar" />
                            </button>
                            {isOpenProfile && (
                                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl z-[99] overflow-hidden animate-in fade-in zoom-in duration-150">

                                    {/* User Info Header */}
                                    <div className="px-4 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Akun Saya</p>
                                        <p className="text-sm font-medium dark:text-white mt-1 truncate">{user?.email}</p>
                                    </div>

                                    <div className="p-1.5">
                                        {/* Menu Items */}
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                                            <Settings size={18} className="group-hover:text-primary transition-colors" />
                                            <span>Pengaturan Profil</span>
                                        </button>

                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                                            <CreditCard size={18} className="group-hover:text-primary transition-colors" />
                                            <span>Billing & Plan</span>
                                        </button>

                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                                            <ShieldCheck size={18} className="group-hover:text-primary transition-colors" />
                                            <span>Keamanan</span>
                                        </button>
                                    </div>

                                    {/* Logout Section */}
                                    <div className="p-1.5 border-t border-gray-100 dark:border-slate-800">
                                        <button
                                            onClick={() => alert('Logging out...')}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors group"
                                        >
                                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                            <span className="font-semibold">Keluar Aplikasi</span>
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}