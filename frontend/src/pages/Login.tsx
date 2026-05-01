import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useLogin from '../hooks/login';
import Loading from '../components/Loading';

export default function LoginPage() {
    const { loading, setFormData, setShowPassword, showPassword, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Illustration & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-gray-400 text-white relative">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
               <div className="w-5 h-5 bg-white rounded-sm rotate-45"></div>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
              Automate your <br /> WhatsApp business.
            </h1>
            <p className="text-gray-50/80 max-w-sm">
              Kelola ribuan pesan, otomatisasi balasan, dan tingkatkan konversi pelanggan dengan platform EvolveWA.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
             <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 inline-block">
                <p className="text-sm italic">"Sistem RAG chatbot-nya sangat membantu efisiensi pelayanan desa kami."</p>
                <p className="text-xs mt-2 font-bold opacity-70">— Perangkat Desa</p>
             </div>
          </div>
          
          {/* Abstract pattern decoration */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
             <svg width="100%" height="100%"><pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#pattern)"/></svg>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Selamat Datang</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Silakan masuk ke akun EvolveWA Anda</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  onChange={(e) => setFormData((prev) => ({...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800/50 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all duration-200 outline-none ring-0 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs font-bold text-blue-500 hover:text-blue-600">Lupa Password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gray-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  onChange={(e) => setFormData((prev) => ({...prev, password: e.target.value }))}
                  className="w-full pl-12 pr-12 py-4 bg-slate-100 dark:bg-slate-800/50 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all duration-200 outline-none ring-0 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group">
              <Loading loading={loading} >
                Masuk Sekarang
              </Loading>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="my-15"></div>

          {/* <div className="relative my-10 text-center">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-200 dark:bg-slate-800"></span>
            <span className="relative bg-white dark:bg-[#0f172a] px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Atau masuk dengan</span>
          </div> */}

          {/* <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-200">
              <Box size={20} />
              GitHub
            </button>
          </div> */}

          {/* <p className="text-center mt-10 text-sm text-slate-500">
            Belum punya akun? <a href="#" className="font-bold text-orange-500 hover:underline">Daftar gratis</a>
          </p> */}
        </div>
      </div>
    </div>
  );
}