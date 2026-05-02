import { useState } from "react";
import type { CreateKnowledge } from "../lib/types";
import useAxios from "../lib/axios.service";
import { toast } from "sonner";

export default function useCreateKnowledge() {
    const { axiosPrivate } = useAxios();
    const [formData, setFormData] = useState<CreateKnowledge>({
        name: "",
        content: "",
        file: null
    });
    const [loading, setLoading] = useState(false);


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
    return {
        handleSubmit,
        formData,
        setFormData,
        loading
    }
}