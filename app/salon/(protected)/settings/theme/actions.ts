// app/salon/(protected)/settings/theme/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { getTenantFromRequest } from '@/lib/tenant/get-tenant'
import { ThemeCacheManager } from '@/lib/theme/cache-manager'
import { BrandTheme } from '@/types/theme'
import { revalidatePath } from 'next/cache'

export async function updateTenantTheme(theme: BrandTheme) {
  const tenant = await getTenantFromRequest()
  if (!tenant) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const supabase = await createClient()
  
  // Update theme in database
  const { error } = await supabase
    .from('tenant_settings')
    .update({
      theme,
      updated_at: new Date().toISOString(),
    })
    .eq('tenant_id', tenant.id)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  // Regenerate CSS cache
  try {
    const cacheManager = new ThemeCacheManager()
    await cacheManager.invalidateCache(tenant.id)
  } catch (e) {
    console.error('Failed to regenerate CSS:', e)
  }
  
  revalidatePath('/salon/settings/theme')
  return { success: true }
}

export async function uploadLogo(formData: FormData) {
  const tenant = await getTenantFromRequest()
  if (!tenant) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const file = formData.get('file') as File
  if (!file) {
    return { success: false, error: 'No file provided' }
  }
  
  // Validate file type and size
  const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    return { success: false, error: 'Invalid file type' }
  }
  
  if (file.size > 2 * 1024 * 1024) { // 2MB
    return { success: false, error: 'File too large (max 2MB)' }
  }
  
  const supabase = await createClient()
  
  // Upload to Supabase Storage
  const filename = `logos/${tenant.id}/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('tenant-assets')
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('tenant-assets')
    .getPublicUrl(filename)
  
  return { success: true, url: urlData.publicUrl }
}

export async function resetThemeToDefault() {
  const tenant = await getTenantFromRequest()
  if (!tenant) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const { DEFAULT_THEME } = await import('@/types/theme')
  
  return updateTenantTheme({
    ...DEFAULT_THEME,
    brand: {
      ...DEFAULT_THEME.brand,
      name: tenant.name,
    },
  })
}

export async function applyThemePreset(presetName: string) {
  const tenant = await getTenantFromRequest()
  if (!tenant) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const { THEME_MARKETPLACE } = await import('@/lib/theme/marketplace')
  const preset = THEME_MARKETPLACE[presetName]
  
  if (!preset) {
    return { success: false, error: 'Preset not found' }
  }
  
  return updateTenantTheme({
    ...preset,
    brand: {
      ...preset.brand,
      name: tenant.name,
      logo: tenant.logo,
      favicon: tenant.favicon,
    },
  })
}
