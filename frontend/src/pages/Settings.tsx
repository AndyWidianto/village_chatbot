import {
    User, Lock,
    Activity,
    Camera, Save, CheckCircle,
    Users,
    Zap,
    Mail,
    UserCircle,
    Link2,
    Trash2,
    Tag
} from 'lucide-react';
import MotionModal from '../components/Motion';
import useSetting from '../hooks/settings';
import FormModal from '../components/FormModal';
import { Input } from '../components/Inputs';
import Loading from '../components/Loading';
import QRCodeModal from '../components/QrCode';

const ProfileSettings = () => {

    const {
        isOpen,
        setFormData,
        handleClose,
        handleSubmit,
        handleDelete,
        formData,
        loading,
        setIsOpen,
        devices,
        user,
        handleUpdateUser,
        loadingUser,
        setFormDataUser,
        formDataUser,
        setFormDataPassword,
        formDataPassword,
        handleUpdatePassword,
        errors,
        isOpenQrCode,
        handleSelectDevice,
        selectDevice
    } = useSetting();

    const Role = () => {
        const roleConfig = {
            super_admin: {
                label: "Admin Utama",
                classes: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
            },
            admin: {
                label: "Admin",
                classes: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
            },
            review: {
                label: "Reviewer",
                classes: "bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-500/20"
            }
        };

        const config = roleConfig[user?.role as "super_admin" | "admin" | "review"] || roleConfig.review;

        return (
            <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg border w-fit mx-auto md:mx-0 ${config.classes}`}>
                {config.label}
            </span>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen transition-all duration-500">
            <MotionModal isOpen={isOpen} onClose={handleClose}>
                <FormModal title='Create device' onSave={handleSubmit} onClose={handleClose} loading={loading}>
                    <Input title='Name' value={formData.name} icon={Tag} placeholder='Pelayanan...' onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
                    <Input title='Instance Name' value={formData.instanceName} placeholder='pelayanan-1234' onChange={(e) => setFormData(prev => ({ ...prev, instanceName: e.target.value }))} icon={Tag} />
                </FormModal>
            </MotionModal>
            <MotionModal isOpen={isOpenQrCode} onClose={handleClose}>
                <QRCodeModal isOpen={isOpenQrCode} deviceId={selectDevice?.id || ""} onClose={handleClose} />
            </MotionModal>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* --- 1. HERO SECTION (USER INFO) --- */}
                <div className="relative overflow-hidden bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl shadow-indigo-500/5 border border-gray-100 dark:border-slate-800 p-6 md:p-10">
                    {/* Decorative Background Glow */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src="https://ui-avatars.com/api/?name=Andy+Widianto&background=4f46e5&color=fff&size=128"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-1 right-1 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl transition-all hover:scale-110 active:scale-95">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="space-y-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{user?.name}</h1>
                                    {Role()}
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email}</span>
                                    <span className="flex items-center gap-1.5"><UserCircle className="w-4 h-4" /> @{user?.username}</span>
                                </div>
                            </div>
                        </div>

                        <button className="group flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0">
                            <Save className="w-5 h-5 group-hover:animate-pulse" /> Simpan Perubahan
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* KOLOM KIRI */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* --- 2. PENGATURAN AKUN & INSTANSI --- */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                    <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profil</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-5">
                                    <div className="group">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nama</label>
                                        <input type="text" defaultValue={formDataUser.name} onChange={(e) => setFormDataUser(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Email</label>
                                        <input type="text" defaultValue={formDataUser.email} onChange={(e) => setFormDataUser(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Username</label>
                                        <input type="text" defaultValue={formDataUser.username} onChange={(e) => setFormDataUser(prev => ({ ...prev, username: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>
                                {/* <div className="group">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Alamat Kantor Desa</label>
                                    <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none">Jl. Balai Desa No. 45, Kec. Adiwerna, Tegal, Jawa Tengah</textarea>
                                </div> */}
                                <button onClick={handleUpdateUser} className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0">
                                    <Loading loading={loadingUser}>
                                        <Save className="w-5 h-5 group-hover:animate-pulse" /> Simpan Perubahan
                                    </Loading>
                                </button>
                            </div>
                        </div>

                        {/* --- 3. WHATSAPP INSTANCES --- */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                                        <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">WhatsApp Instances</h3>
                                </div>
                                <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-all active:scale-95">
                                    + Tambah Akun
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Item Instance */}
                                {devices.map(device => (
                                    <div className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-500/50">

                                        {/* Sisi Kiri: Info Utama */}
                                        <div className="flex items-center gap-5">
                                            {/* <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/30">
                                                W
                                            </div> */}
                                            <div>
                                                <h4 className="text-md font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {device.name} <span className="text-slate-400 font-normal">({device.instanceName})</span>
                                                </h4>
                                                <code className="text-xs text-indigo-500 dark:text-indigo-400 font-mono font-bold">/webhooks/desa-01</code>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-500/20">
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-100 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-200/50 dark:border-indigo-500/20">
                                                        <Zap className="w-3.5 h-3.5" /> Webhook Active
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sisi Kanan: Webhook & Actions */}
                                        <div className="flex flex-col md:flex-row items-center gap-4">

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Connection Button */}
                                                <button
                                                    onClick={() => handleSelectDevice(device)} 
                                                    title="Reconnect Instance"
                                                    className="p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all shadow-sm active:scale-90"
                                                >
                                                    <Link2 className="w-5 h-5" />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(device.id)}
                                                    title="Delete Instance"
                                                    className="p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30 transition-all shadow-sm active:scale-90"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="space-y-8">
                        {/* --- SECURITY --- */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
                                    <Lock className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Keamanan</h3>
                            </div>
                            <form className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Password Lama"
                                    defaultValue={formDataPassword.password}
                                    onChange={(e) => setFormDataPassword(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                />

                                <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

                                <input
                                    type="password"
                                    placeholder="Password Baru"
                                    defaultValue={formDataPassword.newPassword}
                                    onChange={(e) => setFormDataPassword(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-rose-500' : 'border-gray-200'} dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all`}
                                />

                                <input
                                    type="password"
                                    placeholder="Konfirmasi Password"
                                    defaultValue={formDataPassword.confirmPassword}
                                    onChange={(e) => setFormDataPassword(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-rose-500' : 'border-gray-200'} dark:bg-slate-800/50 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all`}
                                />

                                {errors.password && (
                                    <p className="text-rose-500 text-xs mt-1 ml-2 font-medium">
                                        {errors.password}
                                    </p>
                                )}

                                <button
                                    onClick={handleUpdatePassword}
                                    type="button"
                                    className="w-full py-3.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95 mt-2"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>

                        {/* --- ACTIVITY LOG --- */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                                    <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aktivitas</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { text: "Berhasil kirim 500 broadcast", time: "10:00 WIB • Today", color: "bg-emerald-500" },
                                    { text: "Update keyword Auto Reply 'Info'", time: "14:00 WIB • Yesterday", color: "bg-indigo-500" },
                                    { text: "Login terakhir", time: "08:30 WIB • 01 Apr 2026", color: "bg-slate-300" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="relative">
                                            <div className={`w-3 h-3 rounded-full ${item.color} z-10 relative mt-1`}></div>
                                            {idx !== 2 && <div className="absolute top-4 left-1.5 w-px h-full bg-slate-100 dark:bg-slate-700"></div>}
                                        </div>
                                        <div className="-mt-1">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors cursor-default">{item.text}</p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;