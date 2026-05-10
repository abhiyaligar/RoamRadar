import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  hoverEffect?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
        className={cn(
          'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden',
          hoverEffect && 'hover:shadow-xl transition-shadow duration-300',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
