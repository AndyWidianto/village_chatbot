import { ChevronLeft, ChevronRight, Edit3, Filter, Hash, MessageSquare, Paperclip, Search } from "lucide-react";
import FormModal from "../components/FormModal";
import { Input, Select, Textarea } from "../components/Inputs";
import MotionModal from "../components/Motion";
import { TdActionSkeleton, TdNameSkeleton, TdNoSkeleton, TrSkeleton } from "../components/Skeletons";
import useComplaint from "../hooks/useComplaint";
import type { ComplaintStatus } from "../lib/types";


export default function ComplaintPage() {
    const {
        handleClose,
        isOpen,
        loading,
        selected,
        setFormData,
        handleSearch,
        items,
        handleUpdate,
        updateComplaint,
        handlePrev,
        handleCurrent,
        currentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem
    } = useComplaint();
    return (
        <div className="md:p-8 min-h-screen dark:bg-background dark:text-white">
            <MotionModal onClose={handleClose} isOpen={isOpen}>
<FormModal title='Update Status Keluhan' onClose={handleClose} onSave={updateComplaint} loading={loading}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input icon={Hash} title='Nomor Tiket' value={selected?.ticketNumber || ""} disabled />
                        <Select title='Status' onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ComplaintStatus }))} value={selected?.status || "PENDING"}>
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">Diproses</option>
                            <option value="RESOLVED">Selesai</option>
                            <option value="REJECTED">Ditolak</option>
                        </Select>
                    </div>
                    <div className="mt-4">
                        <Textarea icon={MessageSquare} title='Catatan Petugas' onChange={(e) => setFormData(prev => ({ ...prev, officerNotes: e.target.value }))} value={selected?.officerNotes || ""} />
                    </div>
                    
                    {/* INPUT FILE / LAMPIRAN TAMBAHAN */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                            Lampiran Pendukung (Opsional)
                        </label>
                        <input 
                            type="file" 
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setFormData(prev => ({ ...prev, file: file }));
                            }}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                border border-gray-300 rounded-md p-1 w-full"
                        />
                    </div>
                </FormModal>
            </MotionModal>

            <div className="w-full mx-1 md:mx-auto space-y-4">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nomor tiket atau judul..."
                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                        <Filter size={16} /> Filter
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-300 dark:border-gray-800">
                    <div className="overflow-x-auto block w-full">
                        <table className="w-full min-w-[1000px] text-left dark:border-collapse dark:bg-[#111827]">
                            <thead>
                                <tr className="bg-[#6366f1] text-white">
                                    <th className="px-6 py-4 font-semibold text-sm">No.</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Tiket</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Judul</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Kategori</th>
                                    <th className="px-6 py-4 font-semibold text-sm">Status</th>
                                    <th className="px-6 py-4 font-semibold text-sm text-center">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-400 dark:divide-gray-800">
                                {loading ?
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <TrSkeleton key={i}><TdNoSkeleton /><TdNameSkeleton /><TdNameSkeleton /><TdNameSkeleton /><TdNameSkeleton /><TdActionSkeleton /></TrSkeleton>
                                    ))
                                    :
                                    items.length > 0 ? (
                                        items.map((item, idx) => (
                                            <tr key={item.id} className="hover:bg-gray-300/40 hover:dark:bg-gray-800/40 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium">{idx + 1}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{item.ticketNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400 max-w-[200px] truncate">{item.title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400">{item.category}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500' :
                                                        item.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center">
                                                    <button onClick={() => handleUpdate(item)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition">
                                                        <Edit3 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Tidak ada keluhan ditemukan</td></tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>

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