// types/animations.ts

export type AnimationType = 
  | 'fadeInUp' 
  | 'fadeInLeft' 
  | 'fadeInRight' 
  | 'fadeIn' 
  | 'scaleIn';

export interface ScrollAnimationConfig {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  animationType?: AnimationType;
}

export interface ScrollAnimationSectionProps extends ScrollAnimationConfig {
  children: React.ReactNode;
  className?: string;
}

// Preset configurations for common use cases
export const AnimationPresets = {
  hero: {
    animationType: 'fadeInUp' as AnimationType,
    threshold: 0.2,
    duration: 1.2,
  },
  card: {
    animationType: 'scaleIn' as AnimationType,
    threshold: 0.3,
    duration: 0.8,
  },
  slideLeft: {
    animationType: 'fadeInLeft' as AnimationType,
    threshold: 0.25,
    duration: 0.9,
  },
  slideRight: {
    animationType: 'fadeInRight' as AnimationType,
    threshold: 0.25,
    duration: 0.9,
  },
  subtle: {
    animationType: 'fadeIn' as AnimationType,
    threshold: 0.1,
    duration: 1.0,
  },
} as const;