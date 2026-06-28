import { useEffect, useState } from "react";
import useAxios from "../lib/axios.service";
import type { CreateCitizen, Citizen } from "../lib/types";
import { toast } from "sonner";

export default function useCitizen() {
    const { axiosPrivate } = useAxios();

    const [citizens, setCitizen] = useState<Citizen[]>([]);
    const [lastId, setLastId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState<Citizen | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string | undefined>(undefined);
    const [formData, setFormData] = useState<CreateCitizen>({
        fullName: "",
        nik: "",
        phoneNumber: "",
        platform: "WHATSAPP",
        platformId: "",
        subDistrict: ""
    })
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [totalPages, setTotalPages] = useState(100);
    const items = citizens.slice(indexOfFirstItem, indexOfLastItem);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this autoreply?")) {
            try {
                const res = await axiosPrivate.delete(`/citizens/${id}`);
                const data = res.data;
                setCitizen(prev => prev.filter(p => p.id !== id));
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

    const handleUpdate = (citizen: Citizen) => {
        setSelected(citizen);
        setIsOpen(true);
        setFormData({
            fullName: citizen.fullName || "",
            nik: citizen.nik || "",
            phoneNumber: citizen.id,
            platform: citizen.platform,
            platformId: citizen.platformId,
            subDistrict: citizen.subDistrict || ""
        })
    };

    const handleClose = () => {
        setSelected(null);
        setIsOpen(false);
        setFormData({
            fullName: "",
            nik: "",
            phoneNumber: "",
            platform: "WHATSAPP",
            platformId: "",
            subDistrict: ""
        })
    }

    const fetchcitizens = async () => {
        let query = "";
        if (lastId) {
            query += `&lastId=${lastId}`;
        }
        if (searchTerm.trim()) {
            query += `&search=${searchTerm}`;
        }
        setLoading(true);

        try {
            if (itemsPerPage * currentPage < citizens.length) return;
            const res = await axiosPrivate.get(`/citizens?limit=${itemsPerPage}${query}`);
            const data = res.data;
            setCitizen(prev => [...prev, ...data.data]);
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
    const updateCitizen = async () => {
        if (!selected?.id) return;
        setLoading(true);

        try {
            const dataToSend: Partial<Citizen> = {};
            const formEntries = Object.entries(formData) as [keyof Citizen, any][];
            console.log(formEntries);

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

            const res = await axiosPrivate.patch(`/citizens/${selected.id}`, dataToSend);
            const updatedData = res.data;

            setCitizen(prev => prev.map(item =>
                item.id === selected.id ? { ...item, ...updatedData } : item
            ));

            toast.success("Autoreply berhasil diperbarui");
            setIsOpen(false);

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
        await fetchcitizens();
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
                setCitizen([]);
                setLastId(null);
                setSearchTerm(inputValue);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    useEffect(() => {
        fetchcitizens();
    }, [searchTerm])

    return {
        handleUpdate,
        handleDelete,
        citizens,
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
        updateCitizen,
        setFormData,
        formData,
        loading,
        handleCurrent,
        handlePrev,
        itemsPerPage,
        handleSearch
    }
}