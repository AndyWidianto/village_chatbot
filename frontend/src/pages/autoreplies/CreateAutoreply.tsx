import { useRef, useState } from 'react';
import { Paperclip, CheckCheck } from 'lucide-react';
import { ButtonPrimary } from '../../components/Buttons';

const CreateAutoReply = () => {
  const refFileInput = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    keyword: '',
    type: 'keyword',
    content: '',
    prompt: '',
    file: null as File | null
  });
  
  const handleSelectFile = () => {
    if(refFileInput.current) {
      refFileInput.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  return (
    <div className="p-6 dark:bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* --- CONTAINER 1: FORM INPUT --- */}
        <div className="bg-gray-100 dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-border">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Buat Auto Reply Baru</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Keyword (Kata Kunci)</label>
              <input
                type="text"
                placeholder="Contoh: Halo, Info, Surat"
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-border dark:text-white focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) => setForm({ ...form, keyword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Tipe Pesan</label>
              <select
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-border dark:text-white outline-none"
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="keyword">Keyword</option>
                <option value="ai_rag">AI RAG</option>
              </select>
            </div>

            {form.type === 'keyword' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Isi Balasan</label>
                  <textarea
                    rows={4}
                    placeholder="Tulis balasan otomatis di sini..."
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-border dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Lampiran (Opsional)</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-border hover:bg-gray-100 dark:hover:bg-slate-700">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Paperclip className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Klik untuk upload file</p>
                      </div>
                      <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </>
            ) : <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Prompt AI</label>
              <textarea
                rows={4}
                placeholder="Tulis prompt untuk AI di sini..."
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-border dark:text-white focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              ></textarea>
            </div>}

            <ButtonPrimary onClick={() => alert('Auto Reply Disimpan!')}>Simpan Auto Reply</ButtonPrimary>
          </div>
        </div>

        {/* --- CONTAINER 2: WHATSAPP PREVIEW --- */}
        <div className="sticky top-6 h-fit">
          <h2 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider dark:text-gray-400">Live Preview</h2>

          {/* Chat Area */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto pattern-wa w-[80%] lg:w-full mx-auto rounded-lg border border-gray-300 dark:border-gray-800 bg-[#E5DDD5] dark:bg-[#0B141A] shadow-sm">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] dark:bg-[#005C4B] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[80%]">
                <p className="text-[11px] dark:text-gray-100">{form.keyword || 'Keyword anda'}</p>
                <span className="text-[9px] text-gray-500 dark:text-gray-300 block text-right">12:00</span>
              </div>
            </div>

            {/* Bot Message (Preview) */}
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#202C33] p-2 rounded-lg rounded-tl-none shadow-sm max-w-[80%] min-w-[100px]">
                {form.file && <img src={form.file ? URL.createObjectURL(form.file) : 'https://via.placeholder.com/150'} alt="Attachment" className={`w-full h-auto mb-2 rounded ${form.file ? '' : 'opacity-50'}`} />}
                <p className="text-[11px] whitespace-pre-wrap dark:text-gray-100">
                  {form.content || 'Teks balasan otomatis akan muncul di sini...'}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[9px] text-gray-500 dark:text-gray-300">12:00</span>
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateAutoReply;