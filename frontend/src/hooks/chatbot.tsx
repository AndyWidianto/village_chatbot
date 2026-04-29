import { useState } from "react";
import useAxios from "../lib/axios.service";
import type { Message } from "../lib/types";

export default function useChatbot({ sessionId }: { sessionId: string }) {
    const { axiosPrivate } = useAxios();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChatbot = async () => {
        if (!sessionId || !message.trim()) return;

        const userMessage = message;
        setMessage("");

        const clientMsg: Message = {
            id: Date.now(),
            sender: "client",
            text: userMessage,
            time: new Date()
        };

        setMessages((prev) => [...prev, clientMsg]);
        setLoading(true);

        try {
            const res = await axiosPrivate.post("/chatbot", { id: sessionId, message: userMessage });
            const data = res.data;
            const botMsg: Message = {
                id: Date.now() + 1,
                sender: "bot",
                text: data.answer,
                time: new Date()
            };

            setMessages((prev) => [...prev, botMsg]);
            setMessage("");
        } catch (err) {
            console.error("Error: ", err);
        } finally {
            setLoading(false);
        }
    }
    return {
        messages,
        setMessages,
        handleChatbot,
        setMessage,
        message,
        loading,
        setLoading,
    }
}