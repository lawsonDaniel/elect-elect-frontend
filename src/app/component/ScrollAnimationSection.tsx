import React, { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

type AnimationType = 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn';

interface ScrollAnimationSectionProps {
  children: ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  animationType?: AnimationType;
  delay?: number;
}

const ScrollAnimationSection: React.FC<ScrollAnimationSectionProps> = ({ 
  children, 
  threshold = 0.25, 
  triggerOnce = false,
  className = "",
  animationType = 'fadeInUp',
  delay = 0
}) => {
  const { ref, inView } = useInView({
    triggerOnce,
    threshold,
  });

  const getAnimationClass = (type: AnimationType) => {
    switch (type) {
      case 'fadeInLeft':
        return 'fade-left';
      case 'fadeInRight':
        return 'fade-right';
      case 'fadeIn':
        return 'fade-only';
      default:
        return '';
    }
  };

  return (
    <div
      ref={ref}
      className={`scroll-animation ${getAnimationClass(animationType)} ${inView ? 'in-view' : ''} ${className}`}
      style={{
        animationDelay: inView ? `${delay}ms` : '0ms'
      }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimationSection;