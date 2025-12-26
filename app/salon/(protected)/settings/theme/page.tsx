// app/salon/(protected)/settings/theme/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Upload,
  Palette,
  Save,
  Eye,
  RotateCcw,
  Check,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { getThemeMetadata } from '@/lib/theme/marketplace'
import {
  updateTenantTheme,
  uploadLogo,
  resetThemeToDefault,
  applyThemePreset,
} from './actions'
import type { BrandTheme } from '@/types/theme'
import { clsx } from 'clsx'

type TabId = 'colors' | 'typography' | 'effects' | 'marketplace'

const DEFAULT_THEME: BrandTheme = {
  brand: {
    logo: null,
    primaryColor: '#D4AF37',
    secondaryColor: '#0F172A',
    accentColor: '#C8A951',
  },
  typography: {
    fontFamily: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
  },
  effects: {
    shadows: 'normal',
    gradients: true,
    glassmorphism: true,
    noiseTexture: true,
    animations: 'subtle',
  },
  layout: {
    borderRadius: 'xl',
  },
  components: {
    card: {
      variant: 'bordered',
    },
  },
}

const RADIUS_MAP = {
  none: '0',
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
} as const

export default function ThemeSettingsPage() {
  const [theme, setTheme] = useState<BrandTheme | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('colors')
  const [previewMode, setPreviewMode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const themePresets = getThemeMetadata()

  useEffect(() => {
    void fetchCurrentTheme()
  }, [])

  const fetchCurrentTheme = async () => {
    try {
      setError(null)
      const res = await fetch('/api/tenant/theme')

      if (!res.ok) {
        throw new Error(`Theme API failed with status ${res.status}`)
      }

      const data = await res.json()
      const themeFromApi = (data?.theme ?? {}) as Partial<BrandTheme>

      // safe merge با تم پیش‌فرض
      const safeTheme: BrandTheme = {
        brand: {
          logo: themeFromApi.brand?.logo ?? DEFAULT_THEME.brand.logo,
          primaryColor:
            themeFromApi.brand?.primaryColor ?? DEFAULT_THEME.brand.primaryColor,
          secondaryColor:
            themeFromApi.brand?.secondaryColor ?? DEFAULT_THEME.brand.secondaryColor,
          accentColor:
            themeFromApi.brand?.accentColor ?? DEFAULT_THEME.brand.accentColor,
        },
        typography: {
          fontFamily: {
            heading:
              themeFromApi.typography?.fontFamily?.heading ??
              DEFAULT_THEME.typography.fontFamily.heading,
            body:
              themeFromApi.typography?.fontFamily?.body ??
              DEFAULT_THEME.typography.fontFamily.body,
          },
        },
        effects: {
          shadows: themeFromApi.effects?.shadows ?? DEFAULT_THEME.effects.shadows,
          gradients:
            themeFromApi.effects?.gradients ?? DEFAULT_THEME.effects.gradients,
          glassmorphism:
            themeFromApi.effects?.glassmorphism ??
            DEFAULT_THEME.effects.glassmorphism,
          noiseTexture:
            themeFromApi.effects?.noiseTexture ?? DEFAULT_THEME.effects.noiseTexture,
          animations:
            themeFromApi.effects?.animations ?? DEFAULT_THEME.effects.animations,
        },
        layout: {
          borderRadius:
            themeFromApi.layout?.borderRadius ?? DEFAULT_THEME.layout.borderRadius,
        },
        components: {
          card: {
            variant:
              themeFromApi.components?.card?.variant ??
              DEFAULT_THEME.components.card.variant,
          },
        },
      }

      setTheme(safeTheme)
    } catch (err) {
      console.error(err)
      setError('خطا در بارگذاری تنظیمات ظاهری. یک تم پیش‌فرض اعمال شد.')
      setTheme(DEFAULT_THEME)
    }
  }

  const handleSave = async () => {
    if (!theme) return
    setSaving(true)
    setError(null)

    try {
      const result = await updateTenantTheme(theme)
      if (!result.success) {
        setError(result.error ?? 'ذخیره‌سازی ناموفق بود')
      }
    } catch (err) {
      console.error(err)
      setError('خطای غیرمنتظره هنگام ذخیره‌سازی')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !theme) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadLogo(formData)
      if (result.success && result.url) {
        setTheme({
          ...theme,
          brand: {
            ...theme.brand,
            logo: result.url,
          },
        })
      } else {
        setError(result.error ?? 'خطا در آپلود لوگو')
      }
    } catch (err) {
      console.error(err)
      setError('خطای غیرمنتظره هنگام آپلود لوگو')
    } finally {
      setUploading(false)
    }
  }

  const handleResetTheme = async () => {
    if (!confirm('آیا مطمئن هستید؟ تمام تنظیمات به حالت پیش‌فرض برمی‌گردد.')) return

    setError(null)
    try {
      const result = await resetThemeToDefault()
      if (result.success) {
        await fetchCurrentTheme()
      } else {
        setError(result.error ?? 'بازگردانی تم ناموفق بود')
      }
    } catch (err) {
      console.error(err)
      setError('خطای غیرمنتظره هنگام بازگردانی تم')
    }
  }

  const handleApplyPreset = async (presetName: string) => {
    setError(null)
    try {
      const result = await applyThemePreset(presetName)
      if (result.success) {
        await fetchCurrentTheme()
      } else {
        setError(result.error ?? 'اعمال تم ناموفق بود')
      }
    } catch (err) {
      console.error(err)
      setError('خطای غیرمنتظره هنگام اعمال تم')
    }
  }

  if (!theme) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-3xl font-bold gold-gradient-text"
            style={{ fontFamily: theme.typography.fontFamily.heading }}
          >
            تنظیمات ظاهری
          </h1>
          <p className="text-luxury-slate-600 mt-2">
            سایت خود را با هویت برند خودتان کاملاً هماهنگ کنید.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          <Button
            variant="ghost"
            leftIcon={<RotateCcw className="w-5 h-5" />}
            onClick={handleResetTheme}
          >
            بازگشت به پیش‌فرض
          </Button>

          <Button
            variant="outline"
            leftIcon={<Eye className="w-5 h-5" />}
            onClick={() => setPreviewMode((p) => !p)}
          >
            {previewMode ? 'خروج از پیش‌نمایش' : 'پیش‌نمایش'}
          </Button>

          <Button
            leftIcon={<Save className="w-5 h-5" />}
            onClick={handleSave}
            loading={saving}
          >
            ذخیره تغییرات
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {([
          { id: 'colors', label: 'رنگ‌ها', icon: Palette },
          { id: 'typography', label: 'فونت‌ها', icon: Wand2 },
          { id: 'effects', label: 'افکت‌ها', icon: Sparkles },
          { id: 'marketplace', label: 'مارکت‌پلیس', icon: Check },
        ] as const).map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx('tab', active && 'active')}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Colors */}
          {activeTab === 'colors' && (
            <>
              <Card className="luxury-card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-luxury-gold-500" />
                  لوگو و نشان تجاری
                </h3>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div
                    className="w-32 h-32 rounded-luxury border-2 border-dashed flex items-center justify-center overflow-hidden bg-luxury-slate-50"
                    style={{ borderColor: theme.brand.primaryColor }}
                  >
                    {theme.brand.logo ? (
                      <img
                        src={theme.brand.logo}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-luxury-slate-400" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="btn-luxury cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      {uploading ? 'در حال آپلود...' : 'آپلود لوگو'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-sm text-luxury-slate-500">
                      PNG، JPG یا SVG - حداکثر 2MB
                    </p>
                    {theme.brand.logo && (
                      <button
                        type="button"
                        onClick={() =>
                          setTheme({
                            ...theme,
                            brand: { ...theme.brand, logo: null },
                          })
                        }
                        className="text-sm text-luxury-rose-600 hover:underline"
                      >
                        حذف لوگو
                      </button>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="luxury-card p-6">
                <h3 className="text-xl font-semibold mb-4">رنگ‌های اصلی برند</h3>

                <div className="space-y-6">
                  {/* primary */}
                  <ColorRow
                    label="رنگ اصلی (Primary)"
                    value={theme.brand.primaryColor}
                    placeholder="#D4AF37"
                    onChange={(val) =>
                      setTheme({
                        ...theme,
                        brand: { ...theme.brand, primaryColor: val },
                      })
                    }
                  />

                  {/* secondary */}
                  <ColorRow
                    label="رنگ ثانویه (Secondary)"
                    value={theme.brand.secondaryColor}
                    placeholder="#0F172A"
                    onChange={(val) =>
                      setTheme({
                        ...theme,
                        brand: { ...theme.brand, secondaryColor: val },
                      })
                    }
                  />

                  {/* accent */}
                  <ColorRow
                    label="رنگ تاکیدی (Accent)"
                    value={theme.brand.accentColor}
                    placeholder="#C8A951"
                    onChange={(val) =>
                      setTheme({
                        ...theme,
                        brand: { ...theme.brand, accentColor: val },
                      })
                    }
                  />
                </div>
              </Card>
            </>
          )}

          {/* Typography */}
          {activeTab === 'typography' && (
            <Card className="luxury-card p-6">
              <h3 className="text-xl font-semibold mb-4">تنظیمات فونت</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-luxury-slate-700 mb-2">
                    فونت عناوین
                  </label>
                  <select
                    value={theme.typography.fontFamily.heading}
                    onChange={(e) =>
                      setTheme({
                        ...theme,
                        typography: {
                          ...theme.typography,
                          fontFamily: {
                            ...theme.typography.fontFamily,
                            heading: e.target.value,
                          },
                        },
                      })
                    }
                    className="input-luxury"
                  >
                    <option value="Playfair Display">Playfair Display (کلاسیک)</option>
                    <option value="Poppins">Poppins (مدرن)</option>
                    <option value="Montserrat">Montserrat (جسورانه)</option>
                    <option value="Cormorant Garamond">Cormorant Garamond (الگانت)</option>
                    <option value="Bebas Neue">Bebas Neue (اسپرت)</option>
                    <option value="Righteous">Righteous (خلاقانه)</option>
                    <option value="Vazirmatn">وزیرمتن (فارسی)</option>
                    <option value="Amiri">امیری (عربی)</option>
                  </select>
                  <p
                    className="text-sm text-luxury-slate-500 mt-2"
                    style={{ fontFamily: theme.typography.fontFamily.heading }}
                  >
                    پیش‌نمایش: این یک متن نمونه است
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-luxury-slate-700 mb-2">
                    فونت متن
                  </label>
                  <select
                    value={theme.typography.fontFamily.body}
                    onChange={(e) =>
                      setTheme({
                        ...theme,
                        typography: {
                          ...theme.typography,
                          fontFamily: {
                            ...theme.typography.fontFamily,
                            body: e.target.value,
                          },
                        },
                      })
                    }
                    className="input-luxury"
                  >
                    <option value="Inter">Inter (مدرن)</option>
                    <option value="Open Sans">Open Sans (خوانا)</option>
                    <option value="Roboto">Roboto (کلاسیک)</option>
                    <option value="Lato">Lato (ساده)</option>
                    <option value="Outfit">Outfit (جوان)</option>
                    <option value="Nunito">Nunito (دوستانه)</option>
                    <option value="Vazirmatn">وزیرمتن (فارسی)</option>
                    <option value="Cairo">کایرو (عربی)</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {/* Effects */}
          {activeTab === 'effects' && (
            <Card className="luxury-card p-6">
              <h3 className="text-xl font-semibold mb-4">افکت‌های بصری</h3>

              <div className="space-y-6">
                {/* shadows */}
                <div>
                  <label className="block text-sm font-medium text-luxury-slate-700 mb-3">
                    سایه‌ها
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(['none', 'subtle', 'normal', 'dramatic'] as const).map((shadow) => (
                      <button
                        key={shadow}
                        type="button"
                        onClick={() =>
                          setTheme({
                            ...theme,
                            effects: { ...theme.effects, shadows: shadow },
                          })
                        }
                        className={clsx(
                          'px-4 py-3 rounded-luxury border-2 transition-all text-sm font-medium',
                          theme.effects.shadows === shadow
                            ? 'border-luxury-gold-500 bg-luxury-gold-50 text-luxury-gold-700'
                            : 'border-luxury-slate-200 hover:border-luxury-slate-300',
                        )}
                      >
                        {shadow === 'none' && 'بدون سایه'}
                        {shadow === 'subtle' && 'ملایم'}
                        {shadow === 'normal' && 'معمولی'}
                        {shadow === 'dramatic' && 'شدید'}
                      </button>
                    ))}
                  </div>
                </div>

                <ToggleRow
                  title="استفاده از گرادیانت"
                  description="رنگ‌آمیزی دوتایی دکمه‌ها و پس‌زمینه‌ها"
                  checked={theme.effects.gradients}
                  onChange={(val) =>
                    setTheme({
                      ...theme,
                      effects: { ...theme.effects, gradients: val },
                    })
                  }
                />

                <ToggleRow
                  title="Glass Morphism"
                  description="افکت شیشه‌ای و Blur برای کارت‌ها و نوار بالا"
                  checked={theme.effects.glassmorphism}
                  onChange={(val) =>
                    setTheme({
                      ...theme,
                      effects: { ...theme.effects, glassmorphism: val },
                    })
                  }
                />

                <ToggleRow
                  title="بافت نویز (Noise Texture)"
                  description="افکت دانه‌دار روی پس‌زمینه صفحات"
                  checked={theme.effects.noiseTexture}
                  onChange={(val) =>
                    setTheme({
                      ...theme,
                      effects: { ...theme.effects, noiseTexture: val },
                    })
                  }
                />

                {/* animations */}
                <div>
                  <label className="block text-sm font-medium text-luxury-slate-700 mb-3">
                    سرعت انیمیشن‌ها
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(['none', 'subtle', 'normal', 'playful'] as const).map((anim) => (
                      <button
                        key={anim}
                        type="button"
                        onClick={() =>
                          setTheme({
                            ...theme,
                            effects: { ...theme.effects, animations: anim },
                          })
                        }
                        className={clsx(
                          'px-4 py-3 rounded-luxury border-2 transition-all text-sm font-medium',
                          theme.effects.animations === anim
                            ? 'border-luxury-gold-500 bg-luxury-gold-50 text-luxury-gold-700'
                            : 'border-luxury-slate-200 hover:border-luxury-slate-300',
                        )}
                      >
                        {anim === 'none' && 'بدون'}
                        {anim === 'subtle' && 'ملایم'}
                        {anim === 'normal' && 'معمولی'}
                        {anim === 'playful' && 'پرانرژی'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* radius */}
                <div>
                  <label className="block text-sm font-medium text-luxury-slate-700 mb-3">
                    گوشه‌ها (Border Radius)
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((radius) => (
                      <button
                        key={radius}
                        type="button"
                        onClick={() =>
                          setTheme({
                            ...theme,
                            layout: { ...theme.layout, borderRadius: radius },
                          })
                        }
                        className={clsx(
                          'px-3 py-2 border-2 transition-all text-xs font-medium',
                          theme.layout.borderRadius === radius
                            ? 'border-luxury-gold-500 bg-luxury-gold-50 text-luxury-gold-700'
                            : 'border-luxury-slate-200 hover:border-luxury-slate-300',
                        )}
                        style={{ borderRadius: RADIUS_MAP[radius] }}
                      >
                        {radius.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Marketplace */}
          {activeTab === 'marketplace' && (
            <Card className="luxury-card p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-luxury-gold-500" />
                تم‌های آماده
              </h3>
              <p className="text-luxury-slate-600 mb-6">
                با یک کلیک، از تم‌های آماده و حرفه‌ای برای سالن خود استفاده کنید.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {themePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="group relative text-left rounded-luxury border-2 border-luxury-slate-200 hover:border-luxury-gold-500 transition-all overflow-hidden bg-white cursor-pointer"
                    onClick={() => handleApplyPreset(preset.id)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-luxury-slate-50 to-luxury-slate-100 relative overflow-hidden">
                      <div className="absolute inset-0 flex">
                        {preset.colors.map((color: string, idx: number) => (
                          <div
                            key={idx}
                            style={{ background: color }}
                            className="flex-1"
                          />
                        ))}
                      </div>

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <Check className="w-10 h-10 mx-auto mb-2" />
                          <p className="font-semibold">اعمال این تم</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-semibold text-luxury-slate-900 mb-1">
                        {preset.name}
                      </h4>
                      <p className="text-sm text-luxury-slate-600 mb-3">
                        {preset.description}
                      </p>

                      <div className="flex gap-2 mb-3">
                        {preset.colors.map((color: string, idx: number) => (
                          <div
                            key={idx}
                            className="w-5 h-5 rounded-full border border-white shadow-sm"
                            style={{ background: color }}
                          />
                        ))}
                      </div>

                      <span className="inline-block px-3 py-1 text-xs font-medium bg-luxury-slate-50 text-luxury-slate-700 rounded-full">
                        {preset.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: Live preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="luxury-card p-6">
              <h3 className="text-lg font-semibold mb-4">پیش‌نمایش زنده</h3>

              <div className="space-y-4 p-4 rounded-luxury border border-luxury-slate-100 bg-luxury-slate-50/70">
                {/* button */}
                <div>
                  <p className="text-xs text-luxury-slate-500 mb-2">دکمه:</p>
                  <button
                    type="button"
                    className="btn-luxury"
                    style={{
                      background: theme.effects.gradients
                        ? `linear-gradient(135deg, ${theme.brand.primaryColor}, ${theme.brand.accentColor})`
                        : theme.brand.primaryColor,
                      borderRadius: RADIUS_MAP[theme.layout.borderRadius],
                    }}
                  >
                    دکمه نمونه
                  </button>
                </div>

                {/* card */}
                <div>
                  <p className="text-xs text-luxury-slate-500 mb-2">کارت:</p>
                  <div
                    className="luxury-card p-4 transition-transform hover:scale-[1.01]"
                    style={{
                      borderRadius: RADIUS_MAP[theme.layout.borderRadius],
                      boxShadow:
                        theme.effects.shadows === 'none'
                          ? 'none'
                          : '0 10px 25px rgba(15,23,42,0.12)',
                      border:
                        theme.components.card.variant === 'bordered'
                          ? '1px solid #E5E7EB'
                          : 'none',
                    }}
                  >
                    <h4
                      className="font-semibold mb-2"
                      style={{ fontFamily: theme.typography.fontFamily.heading }}
                    >
                      عنوان کارت
                    </h4>
                    <p
                      className="text-sm text-luxury-slate-600"
                      style={{ fontFamily: theme.typography.fontFamily.body }}
                    >
                      این یک متن نمونه برای نمایش است.
                    </p>
                  </div>
                </div>

                {/* input */}
                <div>
                  <p className="text-xs text-luxury-slate-500 mb-2">ورودی:</p>
                  <input
                    type="text"
                    placeholder="متن نمونه..."
                    className="input-luxury"
                    style={{
                      borderRadius: RADIUS_MAP[theme.layout.borderRadius],
                      fontFamily: theme.typography.fontFamily.body,
                    }}
                  />
                </div>

                {/* badge */}
                <div>
                  <p className="text-xs text-luxury-slate-500 mb-2">نشان:</p>
                  <span
                    className="badge"
                    style={{
                      background: theme.brand.primaryColor,
                      color: '#fff',
                    }}
                  >
                    فعال
                  </span>
                </div>
              </div>
            </Card>

            <Card className="luxury-card p-6">
              <h3 className="text-lg font-semibold mb-4">پالت رنگی فعلی</h3>
              <div className="space-y-3">
                <PaletteRow label="Primary" color={theme.brand.primaryColor} />
                <PaletteRow label="Secondary" color={theme.brand.secondaryColor} />
                <PaletteRow label="Accent" color={theme.brand.accentColor} />
              </div>
            </Card>

            <Card className="luxury-card p-6">
              <h3 className="text-lg font-semibold mb-4">خلاصه تنظیمات</h3>
              <div className="space-y-2 text-sm">
                <SummaryRow
                  label="فونت عناوین"
                  value={theme.typography.fontFamily.heading}
                />
                <SummaryRow
                  label="فونت متن"
                  value={theme.typography.fontFamily.body}
                />
                <SummaryRow
                  label="گرادیانت"
                  value={theme.effects.gradients ? 'فعال' : 'غیرفعال'}
                />
                <SummaryRow
                  label="سایه‌ها"
                  value={theme.effects.shadows}
                />
                <SummaryRow
                  label="انیمیشن"
                  value={theme.effects.animations}
                />
                <SummaryRow
                  label="Glass Effect"
                  value={theme.effects.glassmorphism ? 'فعال' : 'غیرفعال'}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Helpers */

function ColorRow(props: {
  label: string
  value: string
  placeholder: string
  onChange: (val: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-luxury-slate-700">
        {props.label}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="w-20 h-12 rounded-luxury border-2 border-luxury-slate-200 cursor-pointer"
        />
        <input
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="flex-1 input-luxury"
          placeholder={props.placeholder}
        />
      </div>
    </div>
  )
}

function ToggleRow(props: {
  title: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-luxury bg-luxury-slate-50 border border-luxury-slate-100">
      <div>
        <p className="font-medium text-luxury-slate-900">{props.title}</p>
        <p className="text-sm text-luxury-slate-500">{props.description}</p>
      </div>
      <label className="switch" aria-label={props.title}>
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
          className="sr-only"
        />
        <span className="switch-thumb" />
      </label>
    </div>
  )
}

function PaletteRow({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-luxury border border-luxury-slate-200"
        style={{ background: color }}
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-luxury-slate-900">{label}</p>
        <p className="text-xs text-luxury-slate-500 font-mono">{color}</p>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-luxury-slate-600">{label}:</span>
      <span className="font-medium text-luxury-slate-900">{value}</span>
    </div>
  )
}
