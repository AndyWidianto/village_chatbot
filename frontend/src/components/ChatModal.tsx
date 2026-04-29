import { X, Send, Bot, User, Zap, MoreVertical, ShieldCheck, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";
import { id } from 'date-fns/locale';
import type { Message } from '../lib/types';


interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: string;
    messages: Message[];
    loading: boolean;
    handleChatbot: () => void;
    setMessage: (message: string) => void;
    message: string;
}
const ChatModal = ({ isOpen, onClose, messages, loading, handleChatbot, setMessage, message }: ChatModalProps) => {
    if (!isOpen) return null;

    const formatAIResponse = (text: string) => {
        if (!text) return "";

        return text
            .split('\n')
            .map((line: string, index: number) => {

                let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900 dark:text-white">$1</strong>');
                if (formattedLine.trim().startsWith('* ')) {
                    return (
                        <li key={index} className="ml-4 list-disc marker:text-indigo-500 mb-1">
                            <span dangerouslySetInnerHTML={{ __html: formattedLine.replace('* ', '') }} />
                        </li>
                    );
                }
                return formattedLine.trim() === "" ? (
                    <div key={index} className="h-2" />
                ) : (
                    <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />
                );
            });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop dengan Blur lebih tebal */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[650px] border border-slate-200 dark:border-slate-800 scale-in-center">

                {/* Header dengan Glassmorphism Effect */}
                <div className="p-5 border-b dark:border-slate-800/60 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {/* Ring Animasi di sekitar Bot */}
                            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-full blur opacity-30 animate-pulse"></div>
                            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                                <Bot className="w-7 h-7" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-[#0F172A] rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-2">
                                Asisten Digital
                                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    <Zap className="w-3 h-3 fill-emerald-500" /> Online
                                </span>
                                {/* <span className="text-[10px] text-slate-400 font-medium">DeepSeek-R1 Engine</span> */}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 active:scale-90">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-all text-rose-500 active:scale-90">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Chat Body - Gradient Background */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-[#0F172A] dark:to-[#0F172A]">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'client' ? 'flex-row-reverse' : 'flex-row'}`}>

                                {/* Avatar dengan Border Neon */}
                                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${msg.sender === 'client'
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600'
                                    }`}>
                                    {msg.sender === 'client' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                {/* Bubble Chat dengan Efek Bayangan Lembut */}
                                <div className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all hover:shadow-md ${msg.sender === 'client'
                                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200 dark:shadow-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700/50 shadow-slate-200/50 dark:shadow-none'
                                        }`}>
                                        {formatAIResponse(msg.text)}
                                    </div>
                                    <span className="text-[10px] mt-1.5 font-semibold text-slate-400 uppercase tracking-tighter opacity-70">
                                        {formatDistanceToNow(new Date(msg.time), { addSuffix: true, locale: id })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator Modern */}
                    {loading && (
                        <div className="flex justify-start items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-500/30 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-indigo-600 animate-pulse" />
                            </div>
                            <div className="px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 flex gap-1.5 items-center">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Input - Floating Style */}
                <div className="p-6 bg-white dark:bg-[#0F172A] border-t dark:border-slate-800/60">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-300"></div>
                        <div className="relative flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 ring-indigo-500/20 transition-all">
                            <input
                                type="text"
                                placeholder="Tanyakan prosedur desa..."
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                                onKeyDown={(e) => e.key === 'Enter' && handleChatbot()}
                                className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm dark:text-white placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleChatbot}
                                disabled={loading || !message.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30 active:scale-95 disabled:shadow-none"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                            Secure AI Services
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;