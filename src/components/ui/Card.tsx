import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hover?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}: CardProps) {
  const baseClasses = 'rounded-2xl overflow-hidden';
  
  const variantClasses = {
    default: 'bg-spotify-gray/50 border border-white/5',
    glass: 'glass',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };
  
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;

