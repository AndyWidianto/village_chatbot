import { useState } from 'react';
import {
    User, Lock,
    Activity, Copy, Eye, EyeOff,
    Camera, Save, CheckCircle,
    Key,
    Users,
    Zap
} from 'lucide-react';

const ProfileSettings = () => {
    const [showApiKey, setShowApiKey] = useState(false);

    return (
        <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* --- 1. INFORMASI IDENTITAS (USER INFO) --- */}
                <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border dark:border-gray-800 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500/20">
                                <img
                                    src="https://ui-avatars.com/api/?name=Andy+Widianto&background=4f46e5&color=fff&size=128"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Andy Widianto</h1>
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full w-fit mx-auto md:mx-0">
                                    Admin Utama
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                <p>Email: <span className="text-gray-900 dark:text-gray-200">andy@desa.go.id</span></p>
                                <p>Username: <span className="text-gray-900 dark:text-gray-200">andy_dev</span></p>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20">
                            <Save className="w-4 h-4" /> Simpan Perubahan
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* KOLOM KIRI (70% Lebar di Desktop) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* --- 2. PENGATURAN AKUN & INSTANSI --- */}
                        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
                                <User className="w-5 h-5 text-indigo-500" /> Profil & Instansi Desa
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Nama Desa</label>
                                        <input type="text" defaultValue="Desa Karanganyar" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Nomor WhatsApp Utama</label>
                                        <input type="text" defaultValue="+628123456789" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Alamat Kantor Desa</label>
                                    <textarea rows={4} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">Jl. Balai Desa No. 45, Kec. Adiwerna, Tegal, Jawa Tengah</textarea>
                                </div>
                            </div>
                        </div>

                        {/* --- 4. API & INTEGRATION --- */}
                        <div className="bg-white dark:bg-[#1F2937] rounded-2xl border dark:border-gray-800 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                                    <Users className="w-5 h-5 text-indigo-500" /> WhatsApp Instances
                                </h3>
                                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">
                                    + Tambah Akun
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Contoh Item Instance */}
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                                            W
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold dark:text-white">Pelayanan Surat (ID: desa-01)</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                    <CheckCircle className="w-3 h-3" /> Instance Connected
                                                </span>
                                                {/* Info Webhook Otomatis */}
                                                <span className="flex items-center gap-1 text-[10px] text-indigo-500 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                                    <Zap className="w-3 h-3" /> Auto-Webhook Active
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500">Listening on:</p>
                                        <code className="text-[10px] text-indigo-400 font-mono">/webhooks/desa-01</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN (30% Lebar di Desktop) */}
                    <div className="space-y-6">

                        {/* --- SECURITY (UBAH PASSWORD) --- */}
                        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
                                <Lock className="w-5 h-5 text-rose-500" /> Keamanan Akun
                            </h3>
                            <form className="space-y-4">
                                <input type="password" placeholder="Password Lama" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                <input type="password" placeholder="Password Baru" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                <input type="password" placeholder="Konfirmasi Password" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                <button type="button" className="w-full py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold rounded-lg hover:bg-rose-100 transition">
                                    Update Password
                                </button>
                            </form>
                        </div>

                        {/* --- 5. LOG AKTIVITAS (ACTIVITY LOG) --- */}
                        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
                                <Activity className="w-5 h-5 text-emerald-500" /> Aktivitas Terbaru
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-gray-900 dark:text-gray-200 leading-tight">Berhasil kirim 500 broadcast</p>
                                        <p className="text-[10px] text-gray-500">10:00 WIB • Today</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-gray-900 dark:text-gray-200 leading-tight">Update keyword Auto Reply 'Info'</p>
                                        <p className="text-[10px] text-gray-500">14:00 WIB • Yesterday</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-gray-900 dark:text-gray-200 leading-tight">Login terakhir</p>
                                        <p className="text-[10px] text-gray-500">08:30 WIB • 01 Apr 2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;