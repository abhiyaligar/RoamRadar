import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface GlassContainerProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  dark?: boolean;
}

const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ className, dark = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl backdrop-blur-xl border shadow-xl',
          dark 
            ? 'bg-slate-900/40 border-slate-700/50' 
            : 'bg-white/10 border-white/20',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassContainer.displayName = 'GlassContainer';

export { GlassContainer };
