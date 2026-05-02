import { Save, X } from "lucide-react";
import Loading from "./Loading";

interface FormModalProps {
    title: string;
    onClose: () => void;
    onSave: () => void;
    loading: boolean;
    children: React.ReactNode[];
}
export default function FormModal({ onSave, onClose, children, title, loading } : FormModalProps) {

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{title}</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="px-8 py-4 space-y-5">
                {children}
            </div>

            {/* Footer */}
            <div className="p-8 pt-4 flex gap-3">
                <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Batal</button>
                <button onClick={onSave} className="flex-[2] py-3.5 rounded-2xl text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95">
                    <Loading loading={loading}>
                        <Save size={18} /> Simpan Perubahan
                    </Loading>
                </button>
            </div>
        </div>
    )
}