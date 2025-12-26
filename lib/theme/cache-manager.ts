// lib/theme/cache-manager.ts
import { createClient } from '@/lib/supabase/server'
import { DynamicCSSGenerator } from './css-generator'
import { BrandTheme } from '@/types/theme'

export class ThemeCacheManager {
  private supabase = createClient()
  
  // Generate and cache CSS for a tenant
  async generateAndCache(tenantId: string): Promise<string> {
    // 1. Get tenant theme from database
    const theme = await this.getTenantTheme(tenantId)
    if (!theme) {
      throw new Error('Theme not found')
    }
    
    // 2. Generate CSS
    const generator = new DynamicCSSGenerator(theme)
    const css = generator.generateCSS()
    
    // 3. Upload to Supabase Storage
    const filename = `themes/${tenantId}.css`
    const supabase = await this.supabase
    
    const { data, error } = await supabase.storage
      .from('tenant-themes')
      .upload(filename, css, {
        contentType: 'text/css',
        upsert: true,
        cacheControl: '3600', // 1 hour cache
      })
    
    if (error) {
      console.error('Failed to upload theme CSS:', error)
      throw error
    }
    
    // 4. Get public URL
    const { data: urlData } = supabase.storage
      .from('tenant-themes')
      .getPublicUrl(filename)
    
    // 5. Store URL in database
    await supabase
      .from('tenant_settings')
      .update({
        theme_css_url: urlData.publicUrl,
        theme_updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', tenantId)
    
    return urlData.publicUrl
  }
  
  // Get cached CSS URL or generate new one
  async getCSSUrl(tenantId: string): Promise<string> {
    const supabase = await this.supabase
    
    const { data, error } = await supabase
      .from('tenant_settings')
      .select('theme_css_url, theme_updated_at, updated_at')
      .eq('tenant_id', tenantId)
      .single()
    
    if (error || !data) {
      // No cache, generate new
      return this.generateAndCache(tenantId)
    }
    
    // Check if cache is stale
    const themeUpdated = new Date(data.updated_at || data.theme_updated_at)
    const now = new Date()
    const hoursSinceUpdate = (now.getTime() - themeUpdated.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceUpdate > 24 || !data.theme_css_url) {
      // Cache expired or missing, regenerate
      return this.generateAndCache(tenantId)
    }
    
    return data.theme_css_url
  }
  
  // Invalidate cache when theme is updated
  async invalidateCache(tenantId: string): Promise<void> {
    await this.generateAndCache(tenantId)
  }
  
  // Get tenant theme from database
  private async getTenantTheme(tenantId: string): Promise<BrandTheme | null> {
    const supabase = await this.supabase
    
    const { data, error } = await supabase
      .from('tenant_settings')
      .select('theme, public_config')
      .eq('tenant_id', tenantId)
      .single()
    
    if (error || !data) {
      return null
    }
    
    // Merge theme with public_config if needed
    return data.theme as BrandTheme
  }
  
  // Bulk regenerate all tenants (for system updates)
  async regenerateAll(): Promise<void> {
    const supabase = await this.supabase
    
    const { data: tenants } = await supabase
      .from('tenants')
      .select('id')
      .eq('status', 'active')
    
    if (!tenants) return
    
    console.log(`Regenerating themes for ${tenants.length} tenants...`)
    
    for (const tenant of tenants) {
      try {
        await this.generateAndCache(tenant.id)
        console.log(`✅ Generated theme for tenant ${tenant.id}`)
      } catch (error) {
        console.error(`❌ Failed for tenant ${tenant.id}:`, error)
      }
    }
    
    console.log('✅ Bulk regeneration complete!')
  }
}
