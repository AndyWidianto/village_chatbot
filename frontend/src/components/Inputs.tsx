import type { LucideIcon } from "lucide-react";


type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
interface InputProps {
    title: string;
    icon: LucideIcon;
    value: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<FormElement>) => void;
}

interface SelectProps extends Omit<InputProps, "icon"> {
    children: React.ReactNode[] | React.ReactNode;
}
export function Select({ title, value, children, onChange }: SelectProps) {

    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{title}</label>
            <select defaultValue={value} onChange={onChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600/20 text-sm appearance-none cursor-pointer">
                {children}
            </select>
        </div>
    )
}

export function Input({ icon, onChange, placeholder, title, value }: InputProps) {
    const Icon = icon;
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{title}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input defaultValue={value} onChange={onChange} placeholder={placeholder} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600/20 text-sm" />
            </div>
        </div>
    )
}

interface TextareaProps extends InputProps {
    rows?: number;
}

export function Textarea({ icon, onChange, placeholder, value, title, rows }: TextareaProps) {
    const Icon = icon;
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{title}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-4 text-slate-400" size={16} />
                <textarea rows={rows ? rows : 4} defaultValue={value} onChange={onChange} placeholder={placeholder} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600/20 text-sm" />
            </div>
        </div>
    )
}

interface Checkbox extends Omit<InputProps, "value"> {
    isActive: boolean,
    description?: string;
}
export function InputCheckbox({ icon, onChange, title, isActive, description }: Checkbox) {
    const Icon = icon;
    return (
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
            <div className="flex items-center gap-3">
                <Icon className={isActive ? "text-blue-500" : "text-slate-400"} />
                <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</p>
                    <p className="text-[10px] text-slate-500">{description || "Nonaktifkan untuk sementara"}</p>
                </div>
            </div>
            <input type="checkbox" onChange={onChange} defaultChecked={isActive} className="w-5 h-5 accent-blue-500 cursor-pointer" />
        </div>
    )
}