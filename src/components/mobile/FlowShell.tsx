import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onBack?: () => void;
  footer?: ReactNode;
}

export function FlowShell({ children, onBack, footer }: Props) {
  return (
    <div className="flex h-full flex-col bg-white pt-[max(12px,env(safe-area-inset-top))] sm:pt-12">
      <div className="flex shrink-0 items-center px-5 pb-1">
        <AnimatePresence>
          {onBack ? (
            <motion.button
              type="button"
              onClick={onBack}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              whileTap={{ scale: 0.9 }}
              className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-black active:bg-black/5"
              aria-label="Back"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2} />
            </motion.button>
          ) : (
            <div className="h-10 w-10" />
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex-1 overflow-hidden">{children}</div>

      {footer && (
        <div className="flex shrink-0 flex-col items-end px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
          {footer}
        </div>
      )}
    </div>
  );
}
