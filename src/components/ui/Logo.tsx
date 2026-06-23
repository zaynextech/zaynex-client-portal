"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LogoProps {
  isFolded?: boolean;
}

export const Logo = ({ isFolded = false }: LogoProps) => {
  return (
    <div className="group flex items-center gap-3 select-none">
      {/* The Mark: Wireframe geometric icon */}
      <div className="relative h-6 w-6 shrink-0">
        <div className="absolute left-0 top-0 h-4 w-4 rounded-[3px] border-2 border-zinc-900 dark:border-zinc-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-[3px] border-2 border-cyan-500 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
      </div>
      
      {/* The Typography: Fold-away brand text */}
      <AnimatePresence mode="wait">
        {!isFolded && (
          <motion.span 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap overflow-hidden"
          >
            Zaynex
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};