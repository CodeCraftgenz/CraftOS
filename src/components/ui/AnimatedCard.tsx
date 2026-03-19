/// Card com animação de entrada escalonada

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
  onClick?: () => void;
}

export function AnimatedCard({ children, className = "", index = 0, onClick }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
