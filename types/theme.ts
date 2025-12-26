// types/theme.ts
export interface BrandTheme {
  // Brand Identity
  brand: {
    name: string
    logo: string | null
    favicon: string | null
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
  
  // Color System
  colors: {
    primary: ColorShades
    secondary: ColorShades
    accent: ColorShades
    success: ColorShades
    warning: ColorShades
    danger: ColorShades
    info: ColorShades
    neutral: ColorShades
  }
  
  // Typography
  typography: {
    fontFamily: {
      heading: string
      body: string
      mono: string
    }
    fontUrl?: string
    scale: TypographyScale
  }
  
  // Layout
  layout: {
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    spacing: 'compact' | 'comfortable' | 'spacious'
    containerWidth: 'narrow' | 'default' | 'wide' | 'full'
  }
  
  // Effects
  effects: {
    shadows: 'none' | 'subtle' | 'normal' | 'dramatic'
    gradients: boolean
    animations: 'none' | 'subtle' | 'normal' | 'playful'
    glassmorphism: boolean
    noiseTexture: boolean
  }
  
  // Component Styles
  components: {
    button: ButtonTheme
    card: CardTheme
    input: InputTheme
    navbar: NavbarTheme
  }
}

export interface ColorShades {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface TypographyScale {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
}

export interface ButtonTheme {
  variant: 'solid' | 'gradient' | 'outline' | 'ghost'
  hoverEffect: 'lift' | 'glow' | 'shimmer' | 'none'
  roundness: 'square' | 'rounded' | 'pill'
}

export interface CardTheme {
  variant: 'flat' | 'elevated' | 'bordered' | 'glass'
  hoverEffect: 'lift' | 'glow' | 'none'
}

export interface InputTheme {
  variant: 'outlined' | 'filled' | 'underlined'
  focusEffect: 'glow' | 'border' | 'both'
}

export interface NavbarTheme {
  variant: 'solid' | 'transparent' | 'glass'
  position: 'static' | 'sticky' | 'fixed'
}

// Default Theme
export const DEFAULT_THEME: BrandTheme = {
  brand: {
    name: 'My Salon',
    logo: null,
    favicon: null,
    primaryColor: '#D4AF37',
    secondaryColor: '#1A1A1A',
    accentColor: '#C8A951',
  },
  colors: {} as any, // Will be auto-generated
  typography: {
    fontFamily: {
      heading: 'Playfair Display',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
  layout: {
    borderRadius: 'lg',
    spacing: 'comfortable',
    containerWidth: 'default',
  },
  effects: {
    shadows: 'normal',
    gradients: true,
    animations: 'normal',
    glassmorphism: false,
    noiseTexture: true,
  },
  components: {
    button: {
      variant: 'gradient',
      hoverEffect: 'lift',
      roundness: 'rounded',
    },
    card: {
      variant: 'elevated',
      hoverEffect: 'lift',
    },
    input: {
      variant: 'outlined',
      focusEffect: 'both',
    },
    navbar: {
      variant: 'glass',
      position: 'sticky',
    },
  },
}
