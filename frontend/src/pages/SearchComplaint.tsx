import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Filter, Ticket, User, MapPin, Calendar, Paperclip, AlertCircle, FileText,
    ChevronLeft, ChevronRight, Inbox
} from 'lucide-react';
import useAxios from '../lib/axios.service';
import type { ComplaintCategory, ComplaintStatus, SearchComplaint } from '../lib/types';

export type ChatPlatform = "WHATSAPP" | "TELEGRAM" | "WEB_CHAT";
interface Filters {
    status: "ALL" | ComplaintStatus;
    category: "ALL" | ComplaintCategory;
    sort: "DESC" | "ASC";
}
interface FilterBarProps {
    filters: Filters;
    // Mengubah parameter menjadi fungsi penentu partial state (opsional, agar lebih fleksibel)
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(date));
};

const ComplaintStatusBadge = ({ status }: { status: ComplaintStatus }) => {
    const styles = {
        PENDING: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500 border-red-200 dark:border-red-500/20",
        IN_PROGRESS: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20",
        RESOLVED: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500 border-green-200 dark:border-green-500/20",
        REJECTED: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200 dark:border-gray-500/20"
    };
    const labels = {
        PENDING: "Menunggu", IN_PROGRESS: "Diproses", RESOLVED: "Selesai", REJECTED: "Ditolak"
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

const ComplaintCategoryBadge = ({ category }: { category: ComplaintCategory }) => {
    const styles: Record<ComplaintCategory, string> = {
        INFRASTRUCTURE: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
        ADMINISTRATION: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        SECURITY: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
        SOCIAL_ASSISTANCE: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
        HEALTH: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        OTHERS: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400",
    };

    const labels: Record<ComplaintCategory, string> = {
        INFRASTRUCTURE: "Infrastruktur", ADMINISTRATION: "Administrasi", SECURITY: "Keamanan",
        SOCIAL_ASSISTANCE: "Bantuan Sosial", HEALTH: "Kesehatan", OTHERS: "Lainnya"
    };

    return (
        <span className={`px-2 py-1 rounded-md text-[11px] font-medium ${styles[category]}`}>
            {labels[category]}
        </span>
    );
};

const SearchBar = ({ onSearch }: { onSearch: (val: string) => void }) => {
    const [inputValue, setInputValue] = useState("");

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(inputValue);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue, onSearch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(inputValue);
        }
    };

    return (
        <div className="relative w-full shadow-sm rounded-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari berdasarkan nomor tiket, judul, nama pelapor..."
                className="w-full bg-white dark:bg-[#111827] border border-gray-300 dark:border-gray-700 rounded-xl py-3.5 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-all"
            />
            <button
                onClick={() => onSearch(inputValue)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
                Cari
            </button>
        </div>
    );
};

const FilterBar = ({ filters, setFilters }: FilterBarProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-[#111827] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1"><Filter size={14} /> Status</label>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value as Filters["status"] }))}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg py-2 px-3 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="ALL">Semua Status</option>
                    <option value="OPEN">Menunggu</option>
                    <option value="PROCESS">Diproses</option>
                    <option value="RESOLVED">Selesai</option>
                    <option value="REJECTED">Ditolak</option>
                </select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1"><AlertCircle size={14} /> Kategori</label>
                <select
                    value={filters.category}
                    onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value as Filters["category"] }))}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg py-2 px-3 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="ALL">Semua Kategori</option>
                    <option value="INFRASTRUCTURE">Infrastruktur</option>
                    <option value="ADMINISTRATION">Administrasi</option>
                    <option value="SECURITY">Keamanan</option>
                    <option value="SOCIAL_ASSISTANCE">Bantuan Sosial</option>
                    <option value="HEALTH">Kesehatan</option>
                    <option value="OTHERS">Lainnya</option>
                </select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1"><Calendar size={14} /> Urutkan</label>
                <select
                    value={filters.sort}
                    onChange={(e) => setFilters((p: any) => ({ ...p, sort: e.target.value }))}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg py-2 px-3 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="DESC">Terbaru</option>
                    <option value="ASC">Terlama</option>
                </select>
            </div>
        </div>
    );
};

const ComplaintCard = ({ complaint }: { complaint: SearchComplaint }) => {
    return (
        <div className="flex flex-col bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center gap-2">
                    <Ticket className="text-indigo-500" size={18} />
                    <span className="font-bold text-gray-900 dark:text-white tracking-tight">{complaint.ticketNumber}</span>
                </div>
                <ComplaintStatusBadge status={complaint.status} />
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2">
                        {complaint.title}
                    </h3>
                    <ComplaintCategoryBadge category={complaint.category} />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                    {truncateText(complaint.description)}
                </p>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-gray-500 dark:text-gray-500 mt-2 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                    <div className="flex items-center gap-1.5"><User size={14} /> <span className="truncate">{complaint.citizen.fullName}</span></div>
                    <div className="flex items-center gap-1.5"><FileText size={14} /> <span>{'-'}</span></div>
                    <div className="flex items-center gap-1.5"><MapPin size={14} /> <span className="truncate">{complaint.citizen.subDistrict || '-'}</span></div>
                    <div className="flex items-center gap-1.5"><Calendar size={14} /> <span>{formatDate(complaint.createdAt)}</span></div>
                </div>
            </div>

            {/* Footer */}
            {(complaint.officerNotes || complaint.attachmentUrl) && (
                <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800/50 flex flex-col gap-3">
                    {complaint.officerNotes && (
                        <div className="pl-3 border-l-4 border-indigo-500">
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 block">Catatan Petugas</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">{complaint.officerNotes}</p>
                        </div>
                    )}
                    {complaint.attachmentUrl && (
                        <a href={complaint.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <Paperclip size={16} /> Lihat Lampiran
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl h-80 animate-pulse flex flex-col">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="p-5 flex flex-col gap-4 flex-1">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md mt-2"></div>
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyState = ({ message = "Pengaduan tidak ditemukan." }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-[#111827]/50">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
            <Inbox className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{message}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">Periksa kembali nomor tiket, kata kunci, atau ubah filter pencarian yang Anda gunakan.</p>
    </div>
);

const Pagination = ({ current, total, onPageChange }: { current: number, total: number, onPageChange: (p: number) => void }) => {
    if (total <= 1) return null;
    return (
        <div className="flex justify-between items-center bg-white dark:bg-[#111827] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mt-8">
            <button
                onClick={() => onPageChange(current - 1)} disabled={current === 1}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
                <ChevronLeft size={18} /> <span className="text-sm font-medium hidden sm:block">Sebelumnya</span>
            </button>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Halaman <span className="text-gray-900 dark:text-white font-bold">{current}</span> dari {total}
            </div>
            <button
                onClick={() => onPageChange(current + 1)} disabled={current === total}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
                <span className="text-sm font-medium hidden sm:block">Selanjutnya</span> <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default function SearchComplaintPage() {
    const { axiosPublic } = useAxios();
    const [complaints, setComplaints] = useState<SearchComplaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalData, setTotalData] = useState(0);
    const [nextId, setNextId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<Filters>({ status: "ALL", category: "ALL", sort: "DESC" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleFetchComplaints = async () => {
        setLoading(true);
        try {
            let query = `&order=${filters.sort.toLowerCase()}${searchTerm && searchTerm.trim() ? `&search=${searchTerm}` : ''}`;
            if (filters.category !== "ALL") {
                query += `&category=${filters.category}`;
            }
            if (filters.status !== "ALL") {
                query += `&status=${filters.status}`;
            }
            if (nextId) {
                query += `&lastId=${nextId}`;
            }
            const res = await axiosPublic.get(`complaints/search?limit=${itemsPerPage}${query}`);
            const data = res.data;
            console.log(data);
            setNextId(data.nextId);
            setComplaints(prev => [...prev, ...data.data]);
            setTotalData(data.total);
        } catch (error) {
            console.error("Gagal load data", error);
        } finally {
            setLoading(false);
        }
    }
    const handleSearch = useCallback(async (val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
    }, []);
    useEffect(() => {
        handleFetchComplaints();
    }, [currentPage, filters, searchTerm])
    const totalPages = Math.ceil(totalData / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background text-gray-900 dark:text-white py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Cari Pengaduan</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm md:text-base">
                        Pantau terus perkembangan laporan Anda. Masukkan nomor tiket atau kata kunci untuk melihat status pengaduan terbaru.
                    </p>
                </div>

                {/* Toolbar: Search & Filter */}
                <div className="space-y-4">
                    <SearchBar onSearch={handleSearch} />
                    <FilterBar filters={filters} setFilters={setFilters} />
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    {!loading && (
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 pl-1">
                            Ditemukan <span className="text-indigo-600 dark:text-indigo-400 font-bold">{totalData}</span> pengaduan
                        </div>
                    )}

                    {loading ? (
                        <LoadingSkeleton />
                    ) : complaints.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {complaints.map((complaint) => (
                                <ComplaintCard key={complaint.id} complaint={complaint} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>

                {/* Pagination */}
                {!loading && (
                    <Pagination current={currentPage} total={totalPages} onPageChange={setCurrentPage} />
                )}

            </div>
        </div>
    );
}