// app/api/tenant/theme/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTenantFromRequest } from '@/lib/tenant/get-tenant'
import { DEFAULT_THEME } from '@/types/theme'

export async function GET() {
  try {
    const tenant = await getTenantFromRequest()
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('tenant_settings')
      .select('theme')
      .eq('tenant_id', tenant.id)
      .single()
    
    if (error || !data) {
      // Return default theme if not found
      return NextResponse.json({
        theme: {
          ...DEFAULT_THEME,
          brand: {
            ...DEFAULT_THEME.brand,
            name: tenant.name,
            logo: tenant.logo,
          },
        },
      })
    }
    
    return NextResponse.json({
      theme: data.theme,
    })
  } catch (error) {
    console.error('Error fetching theme:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const tenant = await getTenantFromRequest()
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { theme } = await request.json()
    
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('tenant_settings')
      .update({
        theme,
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', tenant.id)
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Theme updated successfully',
    })
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
