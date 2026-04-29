import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { RefreshCw, X, AlertCircle } from 'lucide-react';
import useAxios from '../lib/axios.service';
import { toast } from 'sonner';

interface QrCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    deviceId: string;
}
const QRCodeModal = ({ isOpen, onClose, deviceId }: QrCodeModalProps) => {
    if (!deviceId) return;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [qrValue, setQrValue] = useState("");
    const { axiosPrivate } = useAxios();

    // Simulasi pengambilan data/generate QR
    const fetchQRCode = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await axiosPrivate.post(`/devices/connection/${deviceId}`);
            const data = res.data;
            console.log(data);
            setQrValue(data.code);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data devices";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });
            setError(true);

            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchQRCode();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="p-6 text-center border-b border-gray-100 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">QR Code Pembayaran</h3>
                    <p className="text-sm text-gray-500 mt-1">Scan kode di bawah ini</p>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-500 mt-4 font-medium">Menyiapkan kode...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <p className="text-gray-800 dark:text-white font-semibold">Gagal memuat QR Code</p>
                            <p className="text-xs text-gray-500 mt-1">Koneksi tidak stabil atau data tidak ditemukan.</p>
                            <button
                                onClick={fetchQRCode}
                                className="mt-6 flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-medium mx-auto shadow-lg shadow-indigo-500/30"
                            >
                                <RefreshCw className="w-4 h-4" /> Refresh
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100">
                            <QRCodeCanvas
                                value={qrValue}
                                size={200}
                                level={"H"} // High error correction
                                includeMargin={true}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && !error && (
                    <div className="p-6 bg-gray-50 dark:bg-slate-800/50 flex justify-center">
                        <button
                            onClick={fetchQRCode}
                            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Kode
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRCodeModal;