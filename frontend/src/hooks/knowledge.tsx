import { useEffect, useState } from "react";
import useAxios from "../lib/axios.service";
import { toast } from "sonner";
import type { Knowledge } from "../lib/types";

interface CreateKnowledge {
    name: string;
    content?: string;
    file?: File | null;
}
export default function useKnowledge() {
    const { axiosPrivate } = useAxios();
    const [formData, setFormData] = useState<CreateKnowledge>({
        name: "",
        content: "",
        file: null
    });
    const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
    const [lastId, setLastId] = useState<string | null>(null);
    const [oldLastId, setOldLastId] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState<Knowledge | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [totalPages, setTotalPages] = useState(100);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this knowledge?")) {
            try {
                const res = await axiosPrivate.delete(`/knowledges/${id}`);
                const data = res.data;
                setKnowledges(prev => prev.filter(p => p.id !== id));
                toast.success(data.message || `Delete ${id} successfully`);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Gagal hapus data Knowledge";
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

    const handleUpdate = (knowledge: Knowledge) => {
        setSelected(knowledge);
        setIsOpen(true);
        setFormData({
            name: knowledge.name,
            content: knowledge.content
        })
    };

    const handleClose = () => {
        setSelected(null);
        setIsOpen(false);
        setFormData({
            name: "",
            content: "",
        })
    }

    const fetchKnowledges = async () => {
        let query = "";
        if (lastId) {
            query += `&lastId=${lastId}`;
        }
        if (searchTerm.trim()) {
            query += `&search=${searchTerm}`;
        }
        if (!lastId) {
            setOldLastId([""]);
        }

        try {
            const res = await axiosPrivate.get(`/knowledges?limit=${20}${query}`);
            const data = res.data;

            setKnowledges(data.knowledges);
            setTotalPages(data.totalPage);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data knowledges";
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
    const updateKnowledge = async () => {
        if (!selected?.id) return;
        setLoading(true);

        try {
            const dataToSend: Partial<Knowledge> = {};
            const formEntries = Object.entries(formData) as [keyof Knowledge, any][];

            formEntries.forEach(([key, newValue]) => {
                if (key === 'id') return;

                const oldValue = (selected as any)[key];
                if (newValue !== undefined && newValue !== oldValue) {
                    (dataToSend as any)[key] = newValue;
                }
            });

            if (Object.keys(dataToSend).length === 0) {
                return;
            }

            const res = await axiosPrivate.patch(`/knowledges/${selected.id}`, dataToSend);
            const updatedData = res.data;

            setKnowledges(prev => prev.map(item =>
                item.id === selected.id ? { ...item, ...updatedData } : item
            ));

            toast.success("Knowledge berhasil diperbarui");
            setIsOpen(false);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal memperbarui data";

            toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage, {
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

    const handleCurrent = () => {
        if (lastId) {
            setOldLastId([...oldLastId, lastId]);
        }
        setCurrentPage(currentPage + 1);
        setLastId(knowledges[knowledges.length - 1].id);
        console.log("lastId: ", lastId);
    }
    const handlePrev = () => {
        if (oldLastId.length === 0) return;
        const historyCopy = [...oldLastId];

        const prevId = historyCopy.pop();

        setLastId(prevId || null);
        setOldLastId(historyCopy);
        setCurrentPage(currentPage - 1);
        console.log(oldLastId)
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append("name", formData.name);
            if (formData.content) {
                dataToSend.append("content", formData.content);
            }
            if (formData.file) {
                dataToSend.append("file", formData.file);
            }

            const res = await axiosPrivate.post("/knowledges", dataToSend);
            const data = res.data;
            console.log(data.messge)
            toast.success("Knowledge berhasil ditambahkan");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal membuat knowledge";
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



    useEffect(() => {
        fetchKnowledges();
    }, [lastId, searchTerm]);

    return {
        handleUpdate,
        handleDelete,
        knowledges,
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
        updateKnowledge,
        setFormData,
        formData,
        loading,
        handleSubmit,
        handleCurrent,
        handlePrev
    }

}