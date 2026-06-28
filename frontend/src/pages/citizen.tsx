import { ChevronLeft, ChevronRight, Edit3, Filter, Hash, MapPin, Search, Tag, Trash2, User } from "lucide-react";
import MotionModal from "../components/Motion";
import FormModal from "../components/FormModal";
import { Input, Select } from "../components/Inputs";
import { TdActionSkeleton, TdNameSkeleton, TdNoSkeleton, TrSkeleton } from "../components/Skeletons";
import useCitizen from "../hooks/useCitizen";
import type { ChatPlatform } from "../lib/types";

export default function CitizenPage() {
    const {
        selected,
        handleClose,
        isOpen,
        loading,
        setFormData,
        items,
        itemsPerPage,
        indexOfLastItem,
        indexOfFirstItem,
        handleCurrent,
        handleDelete,
        handlePrev,
        handleUpdate,
        currentPage,
        totalPages,
        handleSearch,
        updateCitizen
    } = useCitizen();
    return (
        <div className="md:p-8 min-h-screen dark:bg-background dark:text-white">
            <MotionModal onClose={handleClose} isOpen={isOpen}>
                <FormModal title='Update Data Warga' onClose={handleClose} onSave={updateCitizen} loading={loading}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            icon={Tag}
                            title='NIK'
                            onChange={(e) => setFormData(prev => ({ ...prev, nik: e.target.value }))}
                            value={selected?.nik || ""}
                            placeholder="Masukkan NIK"
                        />
                        <Input
                            icon={User}
                            title='Nama Lengkap'
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            value={selected?.fullName || ""}
                            placeholder="Masukkan Nama Lengkap"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Input
                            icon={MapPin}
                            title='Desa / Kecamatan'
                            onChange={(e) => setFormData(prev => ({ ...prev, subDistrict: e.target.value }))}
                            value={selected?.subDistrict || ""}
                            placeholder="Masukkan Desa/Kecamatan"
                        />
                        <Select
                            title='Platform'
                            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value as ChatPlatform }))}
                            value={selected?.platform || ""}
                        >
                            <option value="">Pilih Platform</option>
                            <option value="WHATSAPP">WhatsApp</option>
                            <option value="TELEGRAM">Telegram</option>
                            {/* Tambahkan opsi platform lain sesuai $Enums.ChatPlatform */}
                        </Select>
                    </div>
                    <div className="mt-4">
                        <Input
                            icon={Hash}
                            title='Platform ID'
                            onChange={(e) => setFormData(prev => ({ ...prev, platformId: e.target.value }))}
                            value={selected?.platformId || ""}
                            placeholder="Misal: 628123456789 (No WA)"
                        />
                    </div>
                </FormModal>
            </MotionModal>
            <div className="w-full mx-1 md:mx-auto space-y-4">

                {/* Toolbar: Search & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Cari NIK atau Nama..."
                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            onChange={handleSearch}
                        />
                    </div>

                    <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                        <Filter size={16} /> Filter
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-300 dark:border-gray-800">
                    <div className="overflow-x-auto block w-full">
                        <table className="w-full min-w-[1000px] text-left dark:border-collapse dark:bg-[#111827]">
                            <thead>
                                <tr className="bg-[#6366f1] text-white">
                                    <th className="px-6 py-4 font-semibold text-sm">No.</th>
                                    <th className="px-6 py-4 font-semibold text-sm">NIK</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Nama Lengkap</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Desa / Kecamatan</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Platform</th>
                                    <th className="px-6 py-4 font-semibold text-sm">ID Platform</th>
                                    <th className="px-6 py-4 font-semibold text-sm text-center">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-400 dark:divide-gray-800">
                                {loading ?
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <TrSkeleton key={i}>
                                            <TdNoSkeleton />
                                            <TdNameSkeleton />
                                            <TdNameSkeleton />
                                            <TdNameSkeleton />
                                            <TdNameSkeleton />
                                            <TdNameSkeleton />
                                            <TdActionSkeleton />
                                        </TrSkeleton>
                                    ))
                                    :
                                    items.length > 0 ? (
                                        items.map((item, idx) => (
                                            <tr key={item.id} className="hover:bg-gray-300/40 hover:dark:bg-gray-800/40 transition-colors">
                                                <td className="px-6 py-4 text-sm truncate max-w-100 font-medium text-gray-800 dark:text-gray-200">
                                                    {(idx + 1 * itemsPerPage * currentPage) - itemsPerPage + 1}
                                                </td>
                                                <td className="px-6 py-4 text-sm truncate max-w-100 font-medium text-gray-800 dark:text-gray-200">
                                                    {item.nik || <span className="text-gray-400 italic">Belum diatur</span>}
                                                </td>
                                                <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">
                                                    {item.fullName || <span className="text-gray-400 italic">Belum diatur</span>}
                                                </td>
                                                <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">
                                                    {item.subDistrict || <span className="text-gray-400 italic">-</span>}
                                                </td>
                                                <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">
                                                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-bold">
                                                        {item.platform}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm truncate max-w-100 text-gray-900 dark:text-gray-400">
                                                    {item.platformId}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center">
                                                    <div className="flex justify-center gap-3">
                                                        <div className="relative group">
                                                            <button
                                                                onClick={() => handleUpdate(item)}
                                                                className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition"
                                                            >
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                Update
                                                            </div>
                                                        </div>
                                                        <div className="relative group">
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                Delete
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-10 text-center text-gray-500">Tidak ada data ditemukan</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Control */}
                <div className="flex justify-between items-center dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Menampilkan <span className="text-gray-900 dark:text-white font-medium">{indexOfFirstItem + 1}</span> hingga <span className="text-gray-900 dark:text-white font-medium">{Math.min(indexOfLastItem, items.length || 0)}</span> dari <span className="text-gray-900 dark:text-white font-medium">{totalPages || 0}</span> Halaman
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center px-4 text-sm font-medium">
                            Halaman {currentPage} dari {totalPages || 1}
                        </div>
                        <button
                            onClick={handleCurrent}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}