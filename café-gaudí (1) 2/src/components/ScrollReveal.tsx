import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 100 | 150 | 200 | 300 | 400 | 500;
  duration?: 500 | 700 | 800 | 1000;
  distance?: 'sm' | 'md' | 'lg';
  threshold?: number;
  rootMargin?: string;
  as?: React.ElementType;
  id?: string;
}

const DELAY_CLASSES: Record<number, string> = {
  0: '',
  100: 'delay-100',
  150: 'delay-150',
  200: 'delay-200',
  300: 'delay-300',
  400: 'delay-400',
  500: 'delay-500',
};

const DURATION_CLASSES: Record<number, string> = {
  500: 'duration-500',
  700: 'duration-700',
  800: 'duration-800',
  1000: 'duration-1000',
};

const DISTANCE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'translate-y-6',
  md: 'translate-y-10',
  lg: 'translate-y-14',
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 800,
  distance = 'md',
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  as: Component = 'div',
  id,
}) => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold, rootMargin });

  const delayClass = DELAY_CLASSES[delay] || '';
  const durationClass = DURATION_CLASSES[duration] || 'duration-800';
  const distanceClass = DISTANCE_CLASSES[distance] || 'translate-y-10';

  return (
    <Component
      ref={ref}
      id={id}
      className={`scroll-reveal transition-all ${durationClass} ease-out transform ${delayClass} ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : `opacity-0 ${distanceClass} motion-reduce:opacity-100 motion-reduce:translate-y-0`
      } ${className}`}
    >
      {children}
    </Component>
  );
};
