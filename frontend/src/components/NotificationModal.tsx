import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  isVisible: boolean;
  message: string;
  senderName: string;
  onClose: () => void;
}

const NotificationModal = ({ isVisible, message, senderName, onClose }: NotificationProps) => {
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 6000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          // Posisi awal: di luar layar kiri bawah
          initial={{ x: -400, opacity: 0 }}
          // Muncul ke: posisi normal
          animate={{ x: 0, opacity: 1 }}
          // Keluar: Geser ke kanan (melewati layar)
          exit={{ x: 800, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed bottom-5 right-5 z-[9999] w-80 bg-white border-l-4 border-green-500 shadow-2xl rounded-lg p-4 flex items-center space-x-4"
        >
          {/* Avatar Placeholder */}
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
             <div className="flex h-full items-center justify-center font-bold text-gray-500">
                {senderName.charAt(0)}
             </div>
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm">{senderName}</h4>
            <p className="text-gray-600 text-xs truncate">{message}</p>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;