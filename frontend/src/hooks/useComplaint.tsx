import { useEffect, useState } from "react";
import useAxios from "../lib/axios.service";
import type { Complaint, CreateComplaint } from "../lib/types";
import { toast } from "sonner";

export default function useComplaint() {
    const { axiosPrivate } = useAxios();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [lastId, setLastId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string | undefined>(undefined);
    const [formData, setFormData] = useState<CreateComplaint>({
        category: "OTHERS",
        description: "",
        officerNotes: "",
        citizenId: "",
        status: "PENDING",
        file: null,
        title: ""
    })
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [totalPages, setTotalPages] = useState(100);
    const items = complaints.slice(indexOfFirstItem, indexOfLastItem);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this autoreply?")) {
            try {
                const res = await axiosPrivate.delete(`/complaints/${id}`);
                const data = res.data;
                setComplaints(prev => prev.filter(p => p.id !== id));
                toast.success(data.message || `Delete ${id} successfully`);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Gagal hapus data autoreply";
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
    };

    const handleUpdate = (complaint: Complaint) => {
        setSelected(complaint);
        setIsOpen(true);
        setFormData({
            category: complaint.category,
            description: complaint.description,
            officerNotes: complaint.officerNotes || "",
            citizenId: complaint.citizenId,
            status: complaint.status,
            title: complaint.title,
            file: null
        })
    };

    const handleClose = () => {
        setSelected(null);
        setIsOpen(false);
        setFormData({
            category: "OTHERS",
            description: "",
            officerNotes: "",
            citizenId: "",
            status: "PENDING",
            title: "",
            file: null
        })
    }

    const fetchcomplaints = async () => {
        let query = "";
        if (lastId) {
            query += `&lastId=${lastId}`;
        }
        if (searchTerm.trim()) {
            query += `&search=${searchTerm}`;
        }
        setLoading(true);

        try {
            if (itemsPerPage * currentPage < complaints.length) return;
            const res = await axiosPrivate.get(`/complaints?limit=${itemsPerPage}${query}`);
            const data = res.data;
            setComplaints(prev => [...prev, ...data.data]);
            setTotalPages(data.totalPage);
            setLastId(data.nextId);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data Warga";
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
        } finally {
            setLoading(false);
        }
    }
    const updateComplaint = async () => {
        if (!selected?.id) return;
        setLoading(true);

        try {
            const dataToSend: Partial<Complaint> = {};
            const formEntries = Object.entries(formData) as [keyof Complaint, any][];
            console.log(formEntries);

            formEntries.forEach(([key, newValue]) => {
                if (key === 'id') return;
                if ((key as any) === "file") return;

                const oldValue = (selected as any)[key];
                if (newValue !== undefined && newValue !== oldValue) {
                    (dataToSend as any)[key] = newValue;
                }
            });
            let updateComplaint: Complaint | null = null;
            if (Object.keys(dataToSend).length !== 0) {
                const res = await axiosPrivate.patch(`/complaints/${selected.id}`, dataToSend);
                const updatedData = res.data;
                updateComplaint = updatedData;
            }
            if (formData.file) {
                const dataFileToSave = new FormData();
                dataFileToSave.append("file", formData.file);
                const res = await axiosPrivate.post(`/complaints/${selected.id}/upload`, dataFileToSave);
                const updatedData = res.data;
                updateComplaint = updatedData;
            }
            if (updateComplaint) {
                setComplaints(prev => prev.map(item =>
                    item.id === selected.id ? { ...item, ...updateComplaint } : item
                ));
                toast.success("Autoreply berhasil diperbarui");
                setIsOpen(false);
            }

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal memperbarui data";

            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Update Error:", err);
        } finally {
            setLoading(false);
        }
    };
    const handleCurrent = async () => {
        setCurrentPage(currentPage + 1);
        await fetchcomplaints();
    }
    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue !== undefined) {
                setComplaints([]);
                setLastId(null);
                setSearchTerm(inputValue);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    useEffect(() => {
        fetchcomplaints();
    }, [searchTerm])

    return {
        handleUpdate,
        handleDelete,
        complaints,
        items,
        totalPages,
        setSearchTerm,
        setCurrentPage,
        indexOfFirstItem,
        currentPage,
        indexOfLastItem,
        handleClose,
        selected,
        setSelected,
        isOpen,
        setIsOpen,
        updateComplaint,
        setFormData,
        formData,
        loading,
        handleCurrent,
        handlePrev,
        itemsPerPage,
        handleSearch
    }
}