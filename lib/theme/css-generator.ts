// lib/theme/css-generator.ts
import { BrandTheme, ColorShades } from '@/types/theme'

type CssRule = {
  base: string[]
  hover?: string[]
  focus?: string[]
}

export class DynamicCSSGenerator {
  private theme: BrandTheme

  constructor(theme: BrandTheme) {
    this.theme = theme

    // Ensure colors exist & fill missing palettes (do not overwrite existing)
    const defaults = this.generateAllColorShades()
    if (!this.theme.colors) {
      this.theme.colors = defaults
    } else {
      for (const [name, shades] of Object.entries(defaults)) {
        const key = name as keyof BrandTheme['colors']
        if (!this.theme.colors[key]) {
          // @ts-expect-error - index signature depends on your type
          this.theme.colors[key] = shades
        }
      }
    }
  }

  // Main method - تولید CSS کامل
  public generateCSS(): string {
    return `
/* 🎨 Auto-Generated Theme CSS */
/* Brand: ${this.theme.brand.name} */
/* Generated at: ${new Date().toISOString()} */

${this.generateCSSVariables()}

${this.generateTypography()}

${this.generateLayoutStyles()}

${this.generateComponentStyles()}

${this.generateUtilityClasses()}

${this.generateAnimations()}

${this.generateEffects()}
    `.trim()
  }

  // Generate CSS Variables
  private generateCSSVariables(): string {
    const vars: string[] = [':root {']

    // Brand Colors
    vars.push('  /* Brand Identity */')
    vars.push(`  --brand-primary: ${this.theme.brand.primaryColor};`)
    vars.push(`  --brand-secondary: ${this.theme.brand.secondaryColor};`)
    vars.push(`  --brand-accent: ${this.theme.brand.accentColor};`)
    vars.push('')

    // Color Shades
    Object.entries(this.theme.colors).forEach(([name, shades]) => {
      vars.push(`  /* ${name} shades */`)
      Object.entries(shades as Record<string, string>).forEach(([shade, value]) => {
        vars.push(`  --color-${name}-${shade}: ${value};`)
      })
      vars.push('')
    })

    // Typography
    vars.push('  /* Typography */')
    vars.push(`  --font-heading: ${this.theme.typography.fontFamily.heading}, serif;`)
    vars.push(`  --font-body: ${this.theme.typography.fontFamily.body}, sans-serif;`)
    vars.push(`  --font-mono: ${this.theme.typography.fontFamily.mono}, monospace;`)
    vars.push('')

    Object.entries(this.theme.typography.scale).forEach(([size, value]) => {
      vars.push(`  --font-size-${size}: ${value};`)
    })
    vars.push('')

    // Layout
    vars.push('  /* Layout */')
    const radiusMap: Record<string, string> = {
      none: '0',
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      full: '9999px',
    }
    vars.push(`  --border-radius: ${radiusMap[this.theme.layout.borderRadius] ?? radiusMap.md};`)

    const spacingMap: Record<string, string> = {
      compact: '0.75',
      comfortable: '1',
      spacious: '1.5',
    }
    vars.push(`  --spacing-unit: ${(spacingMap[this.theme.layout.spacing] ?? spacingMap.comfortable)}rem;`)

    const containerMap: Record<string, string> = {
      narrow: '640px',
      default: '1024px',
      wide: '1280px',
      full: '100%',
    }
    vars.push(`  --container-width: ${containerMap[this.theme.layout.containerWidth] ?? containerMap.default};`)
    vars.push('')

    // Shadows: always define, even if "none" (to prevent var() from being undefined)
    vars.push('  /* Shadows */')
    const shadows = this.generateShadowVars()
    Object.entries(shadows).forEach(([key, value]) => {
      vars.push(`  --shadow-${key}: ${value};`)
    })
    vars.push('')

    vars.push('}')
    return vars.join('\n')
  }

  // Generate Typography Styles
  private generateTypography(): string {
    return `
/* Typography Styles */
body {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-neutral-900);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-neutral-900);
}

h1 { font-size: var(--font-size-5xl); }
h2 { font-size: var(--font-size-4xl); }
h3 { font-size: var(--font-size-3xl); }
h4 { font-size: var(--font-size-2xl); }
h5 { font-size: var(--font-size-xl); }
h6 { font-size: var(--font-size-lg); }

code, pre {
  font-family: var(--font-mono);
}
    `.trim()
  }

  // Generate Layout Styles
  private generateLayoutStyles(): string {
    return `
/* Layout Styles */
.container {
  max-width: var(--container-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: calc(var(--spacing-unit) * 2);
  padding-right: calc(var(--spacing-unit) * 2);
}

.section {
  padding-top: calc(var(--spacing-unit) * 4);
  padding-bottom: calc(var(--spacing-unit) * 4);
}

.grid {
  display: grid;
  gap: var(--spacing-unit);
}

.flex {
  display: flex;
  gap: var(--spacing-unit);
}
    `.trim()
  }

  // Generate Component Styles
  private generateComponentStyles(): string {
    const btnPrimary = this.getButtonRule('primary')
    const btnSecondary = this.getButtonRule('secondary')
    const cardRule = this.getCardRule()
    const inputRule = this.getInputRule()
    const navbarRule = this.getNavbarRule()

    const css: string[] = []
    css.push('/* Component Styles */')
    css.push('')

    // Button base
    css.push('/* Button */')
    css.push('.btn {')
    css.push('  display: inline-flex;')
    css.push('  align-items: center;')
    css.push('  justify-content: center;')
    css.push('  gap: 0.5rem;')
    css.push('  padding: 0.75rem 1.5rem;')
    css.push('  font-weight: 600;')
    css.push('  border-radius: var(--border-radius);')
    css.push('  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);')
    css.push('  cursor: pointer;')
    css.push('  border: none;')
    css.push('  font-family: var(--font-body);')
    css.push('}')
    css.push('')

    // Primary
    css.push('.btn-primary {')
    css.push(...btnPrimary.base.map((l) => `  ${l}`))
    css.push('}')
    if (btnPrimary.hover?.length) {
      css.push('')
      css.push('.btn-primary:hover {')
      css.push(...btnPrimary.hover.map((l) => `  ${l}`))
      css.push('}')
    }
    css.push('')

    // Secondary
    css.push('.btn-secondary {')
    css.push(...btnSecondary.base.map((l) => `  ${l}`))
    css.push('}')
    if (btnSecondary.hover?.length) {
      css.push('')
      css.push('.btn-secondary:hover {')
      css.push(...btnSecondary.hover.map((l) => `  ${l}`))
      css.push('}')
    }
    css.push('')

    // Outline
    css.push('.btn-outline {')
    css.push('  background: transparent;')
    css.push('  border: 2px solid var(--brand-primary);')
    css.push('  color: var(--brand-primary);')
    css.push('}')
    css.push('')
    css.push('.btn-outline:hover {')
    css.push('  background: var(--brand-primary);')
    css.push('  color: white;')
    css.push('}')
    css.push('')

    // Card
    css.push('/* Card */')
    css.push('.card {')
    css.push(...cardRule.base.map((l) => `  ${l}`))
    css.push('}')
    if (cardRule.hover?.length) {
      css.push('')
      css.push('.card:hover {')
      css.push(...cardRule.hover.map((l) => `  ${l}`))
      css.push('}')
    }
    css.push('')

    // Input
    css.push('/* Input */')
    css.push('.input {')
    css.push(...inputRule.base.map((l) => `  ${l}`))
    css.push('}')
    if (inputRule.focus?.length) {
      css.push('')
      css.push('.input:focus {')
      css.push('  outline: none;')
      css.push(...inputRule.focus.map((l) => `  ${l}`))
      css.push('}')
    }
    css.push('')

    // Navbar
    css.push('/* Navbar */')
    css.push('.navbar {')
    css.push(...navbarRule.base.map((l) => `  ${l}`))
    css.push('}')

    return css.join('\n')
  }

  // Button rule (base + hover separated)
  private getButtonRule(type: 'primary' | 'secondary'): CssRule {
    const color = type === 'primary' ? 'primary' : 'secondary'
    const { variant, hoverEffect } = this.theme.components.button

    const base: string[] = []
    const hover: string[] = []

    if (variant === 'solid') {
      base.push(`background: var(--color-${color}-500);`)
      base.push('color: white;')
    } else if (variant === 'gradient' && this.theme.effects.gradients) {
      base.push(`background: linear-gradient(135deg, var(--color-${color}-500), var(--color-${color}-600));`)
      base.push('color: white;')
    } else {
      // fallback
      base.push(`background: var(--color-${color}-500);`)
      base.push('color: white;')
    }

    if (this.theme.effects.shadows !== 'none') {
      base.push('box-shadow: var(--shadow-md);')
    }

    if (hoverEffect === 'lift') {
      hover.push('transform: translateY(-2px) scale(1.02);')
      hover.push('box-shadow: var(--shadow-lg);')
    } else if (hoverEffect === 'glow') {
      hover.push(`box-shadow: 0 0 20px var(--color-${color}-400);`)
    }

    return { base, hover: hover.length ? hover : undefined }
  }

  // Card rule (base + hover separated)
  private getCardRule(): CssRule {
    const { variant, hoverEffect } = this.theme.components.card

    const base: string[] = []
    const hover: string[] = []

    base.push('background: white;')
    base.push('border-radius: var(--border-radius);')
    base.push('padding: calc(var(--spacing-unit) * 2);')
    base.push('transition: all 0.3s ease;')

    if (variant === 'elevated') {
      base.push('box-shadow: var(--shadow-md);')
    } else if (variant === 'bordered') {
      base.push('border: 1px solid var(--color-neutral-200);')
    } else if (variant === 'glass' && this.theme.effects.glassmorphism) {
      base.push('background: rgba(255, 255, 255, 0.7);')
      base.push('backdrop-filter: blur(10px);')
      base.push('border: 1px solid rgba(255, 255, 255, 0.3);')
    }

    if (hoverEffect === 'lift') {
      hover.push('transform: translateY(-4px);')
      hover.push('box-shadow: var(--shadow-lg);')
    }

    return { base, hover: hover.length ? hover : undefined }
  }

  // Input rule (base + focus separated)
  private getInputRule(): CssRule {
    const { variant, focusEffect } = this.theme.components.input

    const base: string[] = []
    const focus: string[] = []

    base.push('width: 100%;')
    base.push('padding: 0.75rem 1rem;')
    base.push('font-family: var(--font-body);')
    base.push('border-radius: var(--border-radius);')
    base.push('transition: all 0.3s ease;')

    if (variant === 'outlined') {
      base.push('background: white;')
      base.push('border: 2px solid var(--color-neutral-300);')
    } else if (variant === 'filled') {
      base.push('background: var(--color-neutral-100);')
      base.push('border: 2px solid transparent;')
    } else if (variant === 'underlined') {
      base.push('background: transparent;')
      base.push('border: none;')
      base.push('border-bottom: 2px solid var(--color-neutral-300);')
      base.push('border-radius: 0;')
    }

    if (focusEffect === 'border' || focusEffect === 'both') {
      focus.push('border-color: var(--brand-primary);')
    }
    if (focusEffect === 'glow' || focusEffect === 'both') {
      focus.push('box-shadow: 0 0 0 4px var(--color-primary-100);')
    }

    return { base, focus: focus.length ? focus : undefined }
  }

  // Navbar rule
  private getNavbarRule(): CssRule {
    const { variant, position } = this.theme.components.navbar

    const base: string[] = []
    base.push('display: flex;')
    base.push('align-items: center;')
    base.push('justify-content: space-between;')
    base.push('padding: 1rem 2rem;')
    base.push('height: 4rem;')

    if (position === 'sticky') {
      base.push('position: sticky;')
      base.push('top: 0;')
      base.push('z-index: 50;')
    } else if (position === 'fixed') {
      base.push('position: fixed;')
      base.push('top: 0;')
      base.push('left: 0;')
      base.push('right: 0;')
      base.push('z-index: 50;')
    }

    if (variant === 'solid') {
      base.push('background: white;')
      base.push('border-bottom: 1px solid var(--color-neutral-200);')
    } else if (variant === 'transparent') {
      base.push('background: transparent;')
    } else if (variant === 'glass') {
      base.push('background: rgba(255, 255, 255, 0.8);')
      base.push('backdrop-filter: blur(12px);')
      base.push('border-bottom: 1px solid rgba(255, 255, 255, 0.3);')
    }

    return { base }
  }

  // Generate Utility Classes
  private generateUtilityClasses(): string {
    return `
/* Utility Classes */
.text-primary { color: var(--brand-primary); }
.text-secondary { color: var(--brand-secondary); }
.text-accent { color: var(--brand-accent); }

.bg-primary { background-color: var(--brand-primary); }
.bg-secondary { background-color: var(--brand-secondary); }
.bg-accent { background-color: var(--brand-accent); }

.border-primary { border-color: var(--brand-primary); }
.border-secondary { border-color: var(--brand-secondary); }

.rounded { border-radius: var(--border-radius); }
.rounded-sm { border-radius: calc(var(--border-radius) * 0.5); }
.rounded-lg { border-radius: calc(var(--border-radius) * 1.5); }

.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
    `.trim()
  }

  // Generate Animations
  private generateAnimations(): string {
    if (this.theme.effects.animations === 'none') return ''

    const speed = this.theme.effects.animations === 'playful' ? '0.3s' : '0.5s'

    return `
/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px var(--brand-primary); }
  50% { box-shadow: 0 0 40px var(--brand-primary); }
}

.animate-fade-in { animation: fadeIn ${speed} ease-out; }
.animate-fade-in-up { animation: fadeInUp ${speed} ease-out; }
.animate-slide-in-right { animation: slideInRight ${speed} ease-out; }
    `.trim()
  }

  // Generate Effects
  private generateEffects(): string {
    const effects: string[] = []

    // Noise Texture
    if (this.theme.effects.noiseTexture) {
      effects.push(`
/* Noise Texture */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  z-index: 1;
}
      `.trim())
    }

    // Glassmorphism
    if (this.theme.effects.glassmorphism) {
      effects.push(`
/* Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
      `.trim())
    }

    // Gradients
    if (this.theme.effects.gradients) {
      effects.push(`
/* Gradient Effects */
.bg-gradient-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-600));
}

.text-gradient-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
      `.trim())
    }

    return effects.join('\n\n')
  }

  // Generate Shadow Variables
  private generateShadowVars(): Record<string, string> {
    if (this.theme.effects.shadows === 'none') {
      return {
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        glow: 'none',
      }
    }

    const intensity =
      ({
        subtle: 0.05,
        normal: 0.1,
        dramatic: 0.2,
      } as const)[this.theme.effects.shadows] ?? 0.1

    const primary = this.theme.brand.primaryColor

    return {
      sm: `0 1px 2px 0 rgba(0, 0, 0, ${intensity})`,
      md: `0 4px 6px -1px rgba(0, 0, 0, ${intensity}), 0 2px 4px -1px rgba(0, 0, 0, ${intensity * 0.6})`,
      lg: `0 10px 15px -3px rgba(0, 0, 0, ${intensity}), 0 4px 6px -2px rgba(0, 0, 0, ${intensity * 0.5})`,
      xl: `0 20px 25px -5px rgba(0, 0, 0, ${intensity}), 0 10px 10px -5px rgba(0, 0, 0, ${intensity * 0.4})`,
      glow: `0 0 20px ${this.hexToRGBA(primary, 0.4)}`,
    }
  }

  // تولید تمام color shades
  private generateAllColorShades(): BrandTheme['colors'] {
    return {
      primary: this.generateColorShades(this.theme.brand.primaryColor),
      secondary: this.generateColorShades(this.theme.brand.secondaryColor),
      accent: this.generateColorShades(this.theme.brand.accentColor),
      success: this.generateColorShades('#10B981'),
      warning: this.generateColorShades('#F59E0B'),
      danger: this.generateColorShades('#F43F5E'),
      info: this.generateColorShades('#0EA5E9'),
      neutral: this.generateColorShades('#64748B'),
    }
  }

  // تولید 11 shade از یک رنگ پایه
  private generateColorShades(baseColor: string): ColorShades {
    const hsl = this.hexToHSL(baseColor)

    return {
      50: this.hslToHex(hsl.h, hsl.s * 0.5, 95),
      100: this.hslToHex(hsl.h, hsl.s * 0.6, 90),
      200: this.hslToHex(hsl.h, hsl.s * 0.7, 80),
      300: this.hslToHex(hsl.h, hsl.s * 0.8, 70),
      400: this.hslToHex(hsl.h, hsl.s * 0.9, 60),
      500: baseColor,
      600: this.hslToHex(hsl.h, hsl.s, hsl.l - 10),
      700: this.hslToHex(hsl.h, hsl.s, hsl.l - 20),
      800: this.hslToHex(hsl.h, hsl.s, hsl.l - 30),
      900: this.hslToHex(hsl.h, hsl.s, hsl.l - 40),
      950: this.hslToHex(hsl.h, hsl.s, hsl.l - 50),
    }
  }

  // Hex to HSL Converter
  private hexToHSL(hex: string): { h: number; s: number; l: number } {
    hex = hex.replace('#', '')

    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // HSL to Hex Converter
  private hslToHex(h: number, s: number, l: number): string {
    let hh = h / 360
    let ss = s / 100
    let ll = l / 100

    let r = 0
    let g = 0
    let b = 0

    if (ss === 0) {
      r = g = b = ll
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        let tt = t
        if (tt < 0) tt += 1
        if (tt > 1) tt -= 1
        if (tt < 1 / 6) return p + (q - p) * 6 * tt
        if (tt < 1 / 2) return q
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
        return p
      }

      const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss
      const p = 2 * ll - q
      r = hue2rgb(p, q, hh + 1 / 3)
      g = hue2rgb(p, q, hh)
      b = hue2rgb(p, q, hh - 1 / 3)
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? `0${hex}` : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  // Hex to RGBA Converter
  private hexToRGBA(hex: string, alpha: number): string {
    const clean = hex.replace('#', '')
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Generate Tailwind Config dynamically
  // (اگر Tailwind config رو TS می‌نویسی، معمولاً با type Config تعریف می‌شه) [web:50]
  public generateTailwindConfig(): object {
    return {
      theme: {
        extend: {
          colors: {
            brand: {
              primary: this.theme.brand.primaryColor,
              secondary: this.theme.brand.secondaryColor,
              accent: this.theme.brand.accentColor,
            },
            // از رنگ‌های واقعی تم استفاده کن، نه اینکه دوباره generateAllColorShades() صدا بزنی
            ...this.theme.colors,
          },
          fontFamily: {
            heading: [this.theme.typography.fontFamily.heading, 'serif'],
            body: [this.theme.typography.fontFamily.body, 'sans-serif'],
            mono: [this.theme.typography.fontFamily.mono, 'monospace'],
          },
          fontSize: this.theme.typography.scale,
          borderRadius: {
            DEFAULT: `var(--border-radius)`,
          },
          spacing: {
            unit: `var(--spacing-unit)`,
          },
          boxShadow: this.generateShadowVars(),
        },
      },
    }
  }

  // Export as minified CSS string (no filesystem)
  public async exportToFile(_tenantId: string): Promise<string> {
    const css = this.generateCSS()
    return this.minifyCSS(css)
  }

  // Minify CSS
  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .trim()
  }

  // Generate preview HTML
  public generatePreviewHTML(): string {
    const css = this.generateCSS()
    return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.theme.brand.name} - Preview</title>
  ${this.theme.typography.fontUrl ? `<link href="${this.theme.typography.fontUrl}" rel="stylesheet">` : ''}
  <style>${css}</style>
</head>
<body>
  <div class="navbar">
    <div class="container">
      ${
        this.theme.brand.logo
          ? `<img src="${this.theme.brand.logo}" alt="Logo" height="40">`
          : `<span style="font-size: 1.5rem; font-weight: bold;">${this.theme.brand.name}</span>`
      }
      <nav style="display: flex; gap: 2rem;">
        <a href="#">خانه</a>
        <a href="#">خدمات</a>
        <a href="#">درباره ما</a>
        <a href="#">تماس</a>
      </nav>
    </div>
  </div>

  <div class="container section">
    <h1>به ${this.theme.brand.name} خوش آمدید</h1>
    <p style="margin-top: 1rem;">این یک پیش‌نمایش از تم شماست.</p>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-top: 2rem;">
      <div class="card">
        <h3>کارت نمونه</h3>
        <p>این یک کارت نمونه است</p>
        <button class="btn btn-primary" style="margin-top: 1rem;">دکمه اصلی</button>
      </div>

      <div class="card">
        <h3>فرم نمونه</h3>
        <input class="input" placeholder="نام خود را وارد کنید" style="margin-top: 1rem;">
        <button class="btn btn-secondary" style="margin-top: 1rem;">ارسال</button>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim()
  }
}
