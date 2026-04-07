import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export function Accordion({ isOpen, children }: AccordionProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="accordion"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.3 },
            opacity: { duration: 0.2 }
          }}
          style={{ overflow: 'hidden' }}
        >
          <div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}