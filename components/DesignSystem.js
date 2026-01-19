/**
 * 🎨 DG97 Design System Component
 * 
 * Detta är det centrala designsystemet för hela DG97-sajten.
 * Använd dessa komponenter och stilar för att säkerställa konsekvent design.
 */

import React from 'react';

// ========== FÄRGPALETT ==========
export const colors = {
  // Primära varumärkesfärger
  primary: {
    50: '#f0f4ff',
    100: '#e0ebff',
    200: '#c7d8ff',
    300: '#a5b9ff',
    400: '#7c8eff',
    500: '#4B5B9C',  // Huvudfärg
    600: '#3d4a7d',
    700: '#343d6a',
    800: '#2f3659',
    900: '#293356',
  },
  
  // Sekundära accentfärger
  secondary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ff6b6b',  // Accentfärg
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  // Orange accent
  accent: {
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },
  
  // Neutrala färger
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Framgångsfärger
  success: {
    100: '#dcfce7',
    500: '#22c55e',
    700: '#15803d',
  }
};

// ========== SPACING SYSTEM ==========
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
  '3xl': '6rem',  // 96px
};

// ========== TYPOGRAFI ==========
export const typography = {
  hero: 'heading-hero',      // 4xl-7xl
  h1: 'heading-1',           // 3xl-5xl
  h2: 'heading-2',           // 2xl-4xl
  h3: 'heading-3',           // xl-3xl
  h4: 'heading-4',           // lg-2xl
  lead: 'text-lead',         // lg-xl
  body: 'text-body',         // base
  gradient: 'text-gradient', // Gradient text
};

// ========== KOMPONENTER ==========

// Button Component
export const Button = ({ 
  variant = 'primary', 
  size = 'default', 
  children, 
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
  };
  
  const sizes = {
    sm: 'btn-sm',
    default: '',
    lg: 'btn-lg',
  };
  
  return (
    <button 
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ 
  variant = 'default', 
  children, 
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'card',
    interactive: 'card-interactive',
    gradient: 'card-gradient',
  };
  
  return (
    <div 
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Section Component
export const Section = ({ 
  variant = 'default', 
  children, 
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'section-container',
    tight: 'section-tight',
    gradientPrimary: 'section-container section-gradient-primary',
    gradientAccent: 'section-container section-gradient-accent',
    dark: 'section-container section-dark',
  };
  
  return (
    <section 
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

// Badge Component
export const Badge = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    accent: 'badge-accent',
  };
  
  return (
    <span 
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Input Component
export const Input = ({ 
  error = false, 
  className = '',
  ...props 
}) => {
  return (
    <input 
      className={`input-field ${error ? 'input-error' : ''} ${className}`}
      {...props}
    />
  );
};

// ========== DESIGN TOKENS ==========
export const designTokens = {
  // Border Radius
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.12)',
    xl: '0 20px 25px rgba(0,0,0,0.15)',
  },
  
  // Transitions
  transition: {
    fast: '150ms ease',
    base: '300ms ease-out',
    slow: '500ms ease-out',
  },
};

// ========== UTILITY FUNCTIONS ==========

// Get consistent gradient
export const getGradient = (type = 'primary') => {
  const gradients = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700',
    secondary: 'bg-gradient-to-r from-secondary-500 to-accent-500',
    dark: 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800',
    light: 'bg-gradient-to-br from-primary-50 via-white to-primary-50/50',
  };
  return gradients[type] || gradients.primary;
};

// Get consistent spacing
export const getSpacing = (size = 'md') => spacing[size] || spacing.md;

// ========== USAGE EXAMPLES ==========
/*
  Exempel på användning:

  import { Button, Card, Section, Badge, typography } from '../components/DesignSystem';

  <Section variant="gradientPrimary">
    <h1 className={typography.h1}>Välkommen till DG97</h1>
    
    <Card variant="interactive">
      <Badge variant="accent">Nyhet</Badge>
      <p className={typography.body}>Innehåll här...</p>
      <Button variant="primary" size="lg">
        Boka nu
      </Button>
    </Card>
  </Section>
*/

const designSystem = {
  colors,
  spacing,
  typography,
  designTokens,
  Button,
  Card,
  Section,
  Badge,
  Input,
  getGradient,
  getSpacing,
};

export default designSystem;
