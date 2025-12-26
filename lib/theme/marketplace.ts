// lib/theme/marketplace.ts
import { BrandTheme } from '@/types/theme'

export const THEME_MARKETPLACE: Record<string, BrandTheme> = {
  // 1. Golden Luxury (Default)
  golden_luxury: {
    brand: {
      name: 'Luxury Salon',
      logo: null,
      favicon: null,
      primaryColor: '#D4AF37',
      secondaryColor: '#1A1A1A',
      accentColor: '#C8A951',
    },
    colors: {} as any, // Auto-generated
    typography: {
      fontFamily: {
        heading: 'Playfair Display',
        body: 'Inter',
        mono: 'JetBrains Mono',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap',
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
      borderRadius: 'xl',
      spacing: 'comfortable',
      containerWidth: 'default',
    },
    effects: {
      shadows: 'dramatic',
      gradients: true,
      animations: 'normal',
      glassmorphism: true,
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
  },
  
  // 2. Modern Pink
  modern_pink: {
    brand: {
      name: 'Modern Beauty',
      logo: null,
      favicon: null,
      primaryColor: '#EC4899',
      secondaryColor: '#1F2937',
      accentColor: '#F472B6',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Poppins',
        body: 'Outfit',
        mono: 'Fira Code',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Outfit:wght@400;500;600&display=swap',
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
      shadows: 'subtle',
      gradients: true,
      animations: 'playful',
      glassmorphism: false,
      noiseTexture: false,
    },
    components: {
      button: {
        variant: 'solid',
        hoverEffect: 'lift',
        roundness: 'pill',
      },
      card: {
        variant: 'bordered',
        hoverEffect: 'lift',
      },
      input: {
        variant: 'filled',
        focusEffect: 'border',
      },
      navbar: {
        variant: 'solid',
        position: 'sticky',
      },
    },
  },
  
  // 3. Elegant Blue
  elegant_blue: {
    brand: {
      name: 'Elegant Spa',
      logo: null,
      favicon: null,
      primaryColor: '#0EA5E9',
      secondaryColor: '#0F172A',
      accentColor: '#38BDF8',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Cormorant Garamond',
        body: 'Lato',
        mono: 'Source Code Pro',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Lato:wght@400;700&display=swap',
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
      borderRadius: 'md',
      spacing: 'spacious',
      containerWidth: 'wide',
    },
    effects: {
      shadows: 'normal',
      gradients: true,
      animations: 'subtle',
      glassmorphism: true,
      noiseTexture: false,
    },
    components: {
      button: {
        variant: 'gradient',
        hoverEffect: 'glow',
        roundness: 'rounded',
      },
      card: {
        variant: 'glass',
        hoverEffect: 'glow',
      },
      input: {
        variant: 'outlined',
        focusEffect: 'glow',
      },
      navbar: {
        variant: 'glass',
        position: 'sticky',
      },
    },
  },
  
  // 4. Bold Purple
  bold_purple: {
    brand: {
      name: 'Bold Salon',
      logo: null,
      favicon: null,
      primaryColor: '#A855F7',
      secondaryColor: '#18181B',
      accentColor: '#C084FC',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Montserrat',
        body: 'Open Sans',
        mono: 'IBM Plex Mono',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Open+Sans:wght@400;600&display=swap',
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
      shadows: 'dramatic',
      gradients: true,
      animations: 'playful',
      glassmorphism: false,
      noiseTexture: true,
    },
    components: {
      button: {
        variant: 'gradient',
        hoverEffect: 'shimmer',
        roundness: 'rounded',
      },
      card: {
        variant: 'elevated',
        hoverEffect: 'lift',
      },
      input: {
        variant: 'filled',
        focusEffect: 'both',
      },
      navbar: {
        variant: 'solid',
        position: 'sticky',
      },
    },
  },
  
  // 5. Natural Green
  natural_green: {
    brand: {
      name: 'Nature Spa',
      logo: null,
      favicon: null,
      primaryColor: '#10B981',
      secondaryColor: '#134E4A',
      accentColor: '#34D399',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Crimson Text',
        body: 'Nunito',
        mono: 'Roboto Mono',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;700&family=Nunito:wght@400;700&display=swap',
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
      borderRadius: 'md',
      spacing: 'spacious',
      containerWidth: 'default',
    },
    effects: {
      shadows: 'subtle',
      gradients: false,
      animations: 'subtle',
      glassmorphism: false,
      noiseTexture: false,
    },
    components: {
      button: {
        variant: 'solid',
        hoverEffect: 'lift',
        roundness: 'rounded',
      },
      card: {
        variant: 'bordered',
        hoverEffect: 'none',
      },
      input: {
        variant: 'outlined',
        focusEffect: 'border',
      },
      navbar: {
        variant: 'solid',
        position: 'sticky',
      },
    },
  },
  
  // 6. Minimalist Black
  minimalist_black: {
    brand: {
      name: 'Minimalist Studio',
      logo: null,
      favicon: null,
      primaryColor: '#18181B',
      secondaryColor: '#FAFAFA',
      accentColor: '#71717A',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Space Grotesk',
        body: 'Inter',
        mono: 'JetBrains Mono',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;600&display=swap',
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
      borderRadius: 'sm',
      spacing: 'compact',
      containerWidth: 'narrow',
    },
    effects: {
      shadows: 'none',
      gradients: false,
      animations: 'none',
      glassmorphism: false,
      noiseTexture: false,
    },
    components: {
      button: {
        variant: 'solid',
        hoverEffect: 'none',
        roundness: 'square',
      },
      card: {
        variant: 'bordered',
        hoverEffect: 'none',
      },
      input: {
        variant: 'underlined',
        focusEffect: 'border',
      },
      navbar: {
        variant: 'solid',
        position: 'static',
      },
    },
  },
  
  // 7. Warm Orange (Barber Shop)
  warm_orange: {
    brand: {
      name: 'Barber Shop',
      logo: null,
      favicon: null,
      primaryColor: '#F97316',
      secondaryColor: '#431407',
      accentColor: '#FB923C',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Bebas Neue',
        body: 'Roboto',
        mono: 'Courier New',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@400;700&display=swap',
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
      borderRadius: 'sm',
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
        variant: 'solid',
        hoverEffect: 'lift',
        roundness: 'square',
      },
      card: {
        variant: 'elevated',
        hoverEffect: 'lift',
      },
      input: {
        variant: 'filled',
        focusEffect: 'border',
      },
      navbar: {
        variant: 'solid',
        position: 'sticky',
      },
    },
  },
  
  // 8. Persian Traditional
  persian_traditional: {
    brand: {
      name: 'سالن سنتی',
      logo: null,
      favicon: null,
      primaryColor: '#0891B2', // فیروزه‌ای
      secondaryColor: '#78350F', // قهوه‌ای
      accentColor: '#14B8A6',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Vazirmatn',
        body: 'Vazirmatn',
        mono: 'JetBrains Mono',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap',
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
      borderRadius: 'md',
      spacing: 'comfortable',
      containerWidth: 'default',
    },
    effects: {
      shadows: 'normal',
      gradients: true,
      animations: 'subtle',
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
        variant: 'bordered',
        hoverEffect: 'lift',
      },
      input: {
        variant: 'outlined',
        focusEffect: 'both',
      },
      navbar: {
        variant: 'solid',
        position: 'sticky',
      },
    },
  },
  
  // 9. Arabic Luxury
  arabic_luxury: {
    brand: {
      name: 'صالون فاخر',
      logo: null,
      favicon: null,
      primaryColor: '#C026D3', // ارغوانی
      secondaryColor: '#1C1917',
      accentColor: '#E879F9',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Amiri',
        body: 'Cairo',
        mono: 'Courier New',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;700&display=swap',
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
      borderRadius: 'xl',
      spacing: 'spacious',
      containerWidth: 'wide',
    },
    effects: {
      shadows: 'dramatic',
      gradients: true,
      animations: 'normal',
      glassmorphism: true,
      noiseTexture: true,
    },
    components: {
      button: {
        variant: 'gradient',
        hoverEffect: 'glow',
        roundness: 'rounded',
      },
      card: {
        variant: 'glass',
        hoverEffect: 'glow',
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
  },
  
  // 10. Nail Studio Chic
  nail_studio_chic: {
    brand: {
      name: 'Nail Studio',
      logo: null,
      favicon: null,
      primaryColor: '#DB2777', // صورتی تیره
      secondaryColor: '#27272A',
      accentColor: '#F9A8D4',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Quicksand',
        body: 'Nunito Sans',
        mono: 'Consolas',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&family=Nunito+Sans:wght@400;700&display=swap',
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
      borderRadius: 'full',
      spacing: 'comfortable',
      containerWidth: 'default',
    },
    effects: {
      shadows: 'normal',
      gradients: true,
      animations: 'playful',
      glassmorphism: false,
      noiseTexture: false,
    },
    components: {
      button: {
        variant: 'gradient',
        hoverEffect: 'shimmer',
        roundness: 'pill',
      },
      card: {
        variant: 'elevated',
        hoverEffect: 'lift',
      },
      input: {
        variant: 'filled',
        focusEffect: 'both',
      },
      navbar: {
        variant: 'solid',
        position: 'sticky',
      },
    },
  },
  
  // 11. Professional Medical
  professional_medical: {
    brand: {
      name: 'Medical Spa',
      logo: null,
      favicon: null,
      primaryColor: '#0284C7',
      secondaryColor: '#1E293B',
      accentColor: '#7DD3FC',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Roboto',
        body: 'Roboto',
        mono: 'Roboto Mono',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
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
      borderRadius: 'sm',
      spacing: 'comfortable',
      containerWidth: 'wide',
    },
    effects: {
      shadows: 'subtle',
      gradients: false,
      animations: 'subtle',
      glassmorphism: false,
      noiseTexture: false,
    },
    components: {
      button: {
        variant: 'solid',
        hoverEffect: 'lift',
        roundness: 'rounded',
      },
      card: {
        variant: 'bordered',
        hoverEffect: 'none',
      },
      input: {
        variant: 'outlined',
        focusEffect: 'border',
      },
      navbar: {
        variant: 'solid',
        position: 'sticky',
      },
    },
  },
  
  // 12. Sunset Vibes
  sunset_vibes: {
    brand: {
      name: 'Sunset Beauty',
      logo: null,
      favicon: null,
      primaryColor: '#EA580C',
      secondaryColor: '#451A03',
      accentColor: '#FDBA74',
    },
    colors: {} as any,
    typography: {
      fontFamily: {
        heading: 'Righteous',
        body: 'Raleway',
        mono: 'Inconsolata',
      },
      fontUrl: 'https://fonts.googleapis.com/css2?family=Righteous&family=Raleway:wght@400;700&display=swap',
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
        variant: 'filled',
        focusEffect: 'both',
      },
      navbar: {
        variant: 'solid',
        position: 'sticky',
      },
    },
  },
}

// Helper function to get theme by name
export function getThemePreset(presetName: string): BrandTheme | null {
  return THEME_MARKETPLACE[presetName] || null
}

// Get all theme names
export function getAllThemeNames(): string[] {
  return Object.keys(THEME_MARKETPLACE)
}

// Get theme metadata for marketplace display
export function getThemeMetadata() {
  return [
    {
      id: 'golden_luxury',
      name: 'طلایی لوکس',
      description: 'تم کلاسیک با رنگ‌های طلایی و نویز تکسچر',
      preview: '/themes/previews/golden-luxury.jpg',
      category: 'luxury',
      colors: ['#D4AF37', '#1A1A1A', '#C8A951'],
    },
    {
      id: 'modern_pink',
      name: 'صورتی مدرن',
      description: 'تم مدرن و جوان‌پسند با رنگ‌های صورتی',
      preview: '/themes/previews/modern-pink.jpg',
      category: 'modern',
      colors: ['#EC4899', '#1F2937', '#F472B6'],
    },
    {
      id: 'elegant_blue',
      name: 'آبی الگانت',
      description: 'تم آرام و حرفه‌ای با glass morphism',
      preview: '/themes/previews/elegant-blue.jpg',
      category: 'elegant',
      colors: ['#0EA5E9', '#0F172A', '#38BDF8'],
    },
    {
      id: 'bold_purple',
      name: 'بنفش جسورانه',
      description: 'تم پرانرژی با رنگ‌های بنفش',
      preview: '/themes/previews/bold-purple.jpg',
      category: 'bold',
      colors: ['#A855F7', '#18181B', '#C084FC'],
    },
    {
      id: 'natural_green',
      name: 'سبز طبیعی',
      description: 'تم آرامش‌بخش برای اسپا',
      preview: '/themes/previews/natural-green.jpg',
      category: 'nature',
      colors: ['#10B981', '#134E4A', '#34D399'],
    },
    {
      id: 'minimalist_black',
      name: 'مشکی مینیمال',
      description: 'تم ساده و حرفه‌ای بدون زیاده‌روی',
      preview: '/themes/previews/minimalist-black.jpg',
      category: 'minimalist',
      colors: ['#18181B', '#FAFAFA', '#71717A'],
    },
    {
      id: 'warm_orange',
      name: 'نارنجی گرم',
      description: 'تم پرانرژی برای آرایشگاه مردانه',
      preview: '/themes/previews/warm-orange.jpg',
      category: 'barber',
      colors: ['#F97316', '#431407', '#FB923C'],
    },
    {
      id: 'nail_studio_chic',
      name: 'شیک نیل استودیو',
      description: 'تم خاص برای سالن‌های ناخن',
      preview: '/themes/previews/nail-studio.jpg',
      category: 'nail',
      colors: ['#DB2777', '#27272A', '#F9A8D4'],
    },
    {
      id: 'persian_traditional',
      name: 'سنتی ایرانی',
      description: 'تم با الهام از هنر ایرانی',
      preview: '/themes/previews/persian-traditional.jpg',
      category: 'traditional',
      colors: ['#0891B2', '#78350F', '#14B8A6'],
    },
    {
      id: 'arabic_luxury',
      name: 'لوکس عربی',
      description: 'تم فاخر با فونت‌های عربی',
      preview: '/themes/previews/arabic-luxury.jpg',
      category: 'luxury',
      colors: ['#C026D3', '#1C1917', '#E879F9'],
    },
    {
      id: 'professional_medical',
      name: 'حرفه‌ای پزشکی',
      description: 'تم تمیز برای کلینیک‌های زیبایی',
      preview: '/themes/previews/medical.jpg',
      category: 'medical',
      colors: ['#0284C7', '#1E293B', '#7DD3FC'],
    },
    {
      id: 'sunset_vibes',
      name: 'حس غروب آفتاب',
      description: 'تم گرم و دلنشین',
      preview: '/themes/previews/sunset.jpg',
      category: 'warm',
      colors: ['#EA580C', '#451A03', '#FDBA74'],
    },
  ]
}
