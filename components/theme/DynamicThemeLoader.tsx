// components/theme/DynamicThemeLoader.tsx
'use client'

import { useEffect } from 'react'
import { BrandTheme } from '@/types/theme'

interface DynamicThemeLoaderProps {
  theme: BrandTheme
  cssUrl?: string
}

export function DynamicThemeLoader({ theme, cssUrl }: DynamicThemeLoaderProps) {
  useEffect(() => {
    // Method 1: Load external CSS file (Cached version)
    if (cssUrl) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = cssUrl
      link.id = 'tenant-theme-css'
      document.head.appendChild(link)
      
      return () => {
        document.getElementById('tenant-theme-css')?.remove()
      }
    }
    
    // Method 2: Inject inline CSS (Fallback)
    if (theme) {
      const style = document.createElement('style')
      style.id = 'tenant-theme-inline'
      style.textContent = generateInlineCSS(theme)
      document.head.appendChild(style)
      
      return () => {
        document.getElementById('tenant-theme-inline')?.remove()
      }
    }
  }, [theme, cssUrl])
  
  useEffect(() => {
    // Apply CSS Variables to :root
    const root = document.documentElement
    
    // Brand colors
    root.style.setProperty('--brand-primary', theme.brand.primaryColor)
    root.style.setProperty('--brand-secondary', theme.brand.secondaryColor)
    root.style.setProperty('--brand-accent', theme.brand.accentColor)
    
    // Font families
    root.style.setProperty('--font-heading', theme.typography.fontFamily.heading)
    root.style.setProperty('--font-body', theme.typography.fontFamily.body)
    
    // Border radius
    const radiusMap = {
      none: '0',
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      full: '9999px',
    }
    root.style.setProperty('--border-radius', radiusMap[theme.layout.borderRadius])
    
    // Favicon
    if (theme.brand.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = theme.brand.favicon
    }
    
    // Page title
    if (theme.brand.name) {
      document.title = theme.brand.name
    }
  }, [theme])
  
  // Load custom fonts
  useEffect(() => {
    if (theme.typography.fontUrl) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = theme.typography.fontUrl
      link.id = 'tenant-fonts'
      document.head.appendChild(link)
      
      return () => {
        document.getElementById('tenant-fonts')?.remove()
      }
    }
  }, [theme.typography.fontUrl])
  
  return null // This component doesn't render anything
}

// Generate minimal inline CSS as fallback
function generateInlineCSS(theme: BrandTheme): string {
  return `
    :root {
      --brand-primary: ${theme.brand.primaryColor};
      --brand-secondary: ${theme.brand.secondaryColor};
      --brand-accent: ${theme.brand.accentColor};
    }
    
    .btn-primary {
      background: var(--brand-primary);
      color: white;
    }
    
    .text-primary {
      color: var(--brand-primary);
    }
    
    .bg-primary {
      background-color: var(--brand-primary);
    }
  `
}
