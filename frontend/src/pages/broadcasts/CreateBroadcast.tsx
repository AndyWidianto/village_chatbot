import { useRef, useState } from 'react';
import { Paperclip, CheckCheck, Send, Users, Calendar, FileSpreadsheet, ClipboardList } from 'lucide-react';
import { ButtonPrimary } from '../../components/Buttons';

const CreateBroadcast = () => {
//   const refFileInput = useRef<HTMLInputElement | null>(null);
  const refExcelInput = useRef<HTMLInputElement | null>(null);
  
  const [form, setForm] = useState({
    campaignName: '',
    target: 'manual', // default ke manual untuk menampilkan input baru
    manualNumbers: '',
    content: '',
    schedule: '',
    imageFile: null as File | null,
    excelFile: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'excel') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'image') setForm({ ...form, imageFile: e.target.files[0] });
      else setForm({ ...form, excelFile: e.target.files[0] });
    }
  };

    return (
        <div className="p-6 dark:bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- CONTAINER 1: FORM INPUT --- */}
                <div className="bg-gray-100 dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-border">
                    <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        Buat Broadcast Baru
                    </h2>

                    <div className="space-y-5">
                        {/* Nama Campaign */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Nama Campaign</label>
                            <input
                                type="text"
                                placeholder="Contoh: Promo Ramadhan / Update Sistem"
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-border dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
                            />
                        </div>

                        {/* Target Kontak */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-gray-300 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Target Penerima
                            </label>
                            <select
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-border dark:text-white outline-none"
                                onChange={(e) => setForm({ ...form, target: e.target.value })}
                                defaultValue={form.target}
                            >
                                <option value="all">Semua Kontak</option>
                                <option value="group">Grup Tertentu</option>
                                <option value="manual">Input Manual / CSV</option>
                            </select>
                        </div>

                        {/* Isi Pesan */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Pesan Broadcast</label>
                            <textarea
                                rows={5}
                                placeholder="Tulis pesan yang ingin disiarkan..."
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-border dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                            ></textarea>
                            <p className="text-[10px] text-gray-500 mt-1 italic">*Gunakan {"{name}"} untuk menyapa nama kontak secara otomatis.</p>
                        </div>

                        {form.target === 'manual' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                {/* Textarea Manual */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 dark:text-gray-400 flex items-center gap-2">
                                        <ClipboardList className="w-3.5 h-3.5" /> List Nomor Telepon
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="628123xxx&#10;628574xxx"
                                        className="w-full p-2.5 text-sm font-mono rounded-lg border border-gray-300 dark:bg-slate-900 dark:border-border dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        onChange={(e) => setForm({ ...form, manualNumbers: e.target.value })}
                                    ></textarea>
                                    <p className="text-[10px] text-gray-400 mt-1">*Pisahkan nomor dengan baris baru (Enter)</p>
                                </div>

                                {/* Upload Excel */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5 dark:text-gray-400 flex items-center gap-2">
                                        <FileSpreadsheet className="w-3.5 h-3.5" /> Import dari Excel (.xlsx / .csv)
                                    </label>
                                    <div
                                        onClick={() => refExcelInput.current?.click()}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-border bg-white dark:bg-slate-900 cursor-pointer hover:border-primary transition-all group"
                                    >
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                            <FileSpreadsheet className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm dark:text-white truncate">
                                                {form.excelFile ? form.excelFile.name : 'Pilih file excel...'}
                                            </p>
                                            <p className="text-[10px] text-gray-400">Kolom A harus berisi nomor telepon</p>
                                        </div>
                                        <input
                                            type="file"
                                            ref={refExcelInput}
                                            accept=".xlsx, .xls, .csv"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'excel')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Jadwal Pengiriman */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-gray-300 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Jadwal Pengiriman (Opsional)
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-border dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                            />
                        </div>

                        {/* Media/File */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Media (Gambar/Dokumen)</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-border hover:bg-gray-100 dark:hover:bg-slate-700">
                                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                                        <Paperclip className="w-6 h-6 mb-2 text-gray-400" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {form.imageFile ? form.imageFile.name : 'Klik untuk lampirkan media'}
                                        </p>
                                    </div>
                                    <input type="file" onChange={(e) => handleFileChange(e, 'image')} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <ButtonPrimary onClick={() => alert('Broadcast Sedang Diproses!')}>
                            Mulai Kirim Broadcast
                        </ButtonPrimary>
                    </div>
                </div>

                {/* --- CONTAINER 2: WHATSAPP PREVIEW --- */}
                <div className="sticky top-6 h-fit">
                    <h2 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider dark:text-gray-400">Preview Pesan Terkirim</h2>

                    <div className="flex-1 p-3 space-y-3 overflow-y-auto pattern-wa w-[85%] lg:w-full mx-auto rounded-xl border border-gray-300 dark:border-gray-800 bg-[#E5DDD5] dark:bg-[#0B141A] shadow-lg">

                        {/* Bot Message (Broadcast Preview) */}
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-[#202C33] p-2 rounded-lg rounded-tl-none shadow-sm max-w-[90%] min-w-[150px]">
                                {/* Image Preview if available */}
                                {form.imageFile && (
                                    <div className="mb-2 overflow-hidden rounded">
                                        <img
                                            src={URL.createObjectURL(form.imageFile)}
                                            alt="Preview"
                                            className="w-full h-auto max-h-60 object-cover"
                                        />
                                    </div>
                                )}

                                <p className="text-[12px] whitespace-pre-wrap dark:text-gray-100 leading-relaxed">
                                    {form.content || 'Isi pesan broadcast akan muncul di sini...'}
                                </p>

                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">12:00</span>
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* Info Badge */}
                        <div className="flex justify-center">
                            <span className="bg-[#D9F1FE] dark:bg-[#182229] text-[10px] px-3 py-1 rounded-md text-gray-600 dark:text-gray-400 shadow-sm border border-blue-100 dark:border-slate-700">
                                Broadcast akan dikirim ke: <span className="font-bold uppercase">{form.target}</span>
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-slate-800/50 rounded-xl border border-blue-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">💡 Tips Broadcast</h3>
                        <p className="text-[11px] text-blue-700 dark:text-gray-400">Gunakan jeda waktu (delay) jika mengirim ke banyak kontak untuk menghindari resiko blokir nomor oleh sistem WhatsApp.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateBroadcast;