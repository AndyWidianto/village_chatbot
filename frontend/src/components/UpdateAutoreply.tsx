import { X, Save, ToggleLeft, MessageSquare, Tag } from 'lucide-react';
import type { Autoreply } from '../lib/types';


interface UpdateAutoreplyProps {
    data: Autoreply | null;
    onClose: () => void;
    onSave: () => void;
}
export default function UpdateAutoreply({ data, onClose, onSave }: UpdateAutoreplyProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-8 pb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Update Autoreply</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400"><X size={20} /></button>
      </div>

      <div className="px-8 py-4 space-y-5">
        {/* Keyword & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Keyword</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input defaultValue={data?.type} onChange={() => {}} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Type</label>
            <select defaultValue={data?.type} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-sm appearance-none cursor-pointer">
              <option value="keyword">Keyword</option>
              <option value="ai_rag">AI Rag</option>
              <option value="list">List Menu</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Response Content</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-4 text-slate-400" size={16} />
            <textarea rows={4} defaultValue={data?.aiPrompt || data?.replyContent || ""} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-sm" />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-500/5 rounded-2xl border border-orange-100 dark:border-orange-500/10">
          <div className="flex items-center gap-3">
            <ToggleLeft className={data?.isActive ? "text-orange-500" : "text-slate-400"} />
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Status Aktif</p>
              <p className="text-[10px] text-slate-500">Nonaktifkan untuk sementara</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked={data?.isActive} className="w-5 h-5 accent-orange-500 cursor-pointer" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 pt-4 flex gap-3">
        <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Batal</button>
        <button onClick={onSave} className="flex-[2] py-3.5 rounded-2xl text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95">
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>
    </div>
  );
}