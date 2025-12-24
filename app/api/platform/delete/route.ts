// app/api/platform/delete/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { signupId } = await request.json();
    
    if (!signupId) {
      return NextResponse.json({ error: 'شناسه درخواست الزامی است' }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Get signup details
    const { data: signup, error: fetchError } = await supabaseAdmin
      .from('platform_signups')
      .select('*, notes')
      .eq('id', signupId)
      .single();

    if (fetchError || !signup) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: 'درخواست یافت نشد' }, { status: 404 });
    }

    console.log('Deleting signup:', signup);

    const deletedItems = {
      tenant: false,
      user: false,
      signup: false,
    };

    // 2. اگر تایید شده بود، tenant و user رو پیدا کن و حذف کن
    if (signup.status === 'approved') {
      
      // Extract tenant_id and user_id from notes (if available)
      let tenantId = null;
      let userId = null;

      if (signup.notes) {
        const tenantMatch = signup.notes.match(/Tenant ID: ([a-f0-9-]+)/);
        const userMatch = signup.notes.match(/User ID: ([a-f0-9-]+)/);
        
        if (tenantMatch) tenantId = tenantMatch[1];
        if (userMatch) userId = userMatch[1];
      }

      // اگر tenant_id نداشتیم، با slug پیدا کن
      if (!tenantId) {
        const { data: tenant } = await supabaseAdmin
          .from('tenants')
          .select('id')
          .eq('slug', signup.slug)
          .single();
        
        if (tenant) tenantId = tenant.id;
      }

      // اگر user_id نداشتیم، با email پیدا کن
      if (!userId) {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const user = users.find(u => u.email === signup.email);
        if (user) userId = user.id;
      }

      // 3. Delete User from auth
      if (userId) {
        const { error: userDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        
        if (userDeleteError) {
          console.error('User delete error:', userDeleteError);
        } else {
          console.log('User deleted:', userId);
          deletedItems.user = true;
        }
      }

      // 4. Delete Tenant
      if (tenantId) {
        const { error: tenantDeleteError } = await supabaseAdmin
          .from('tenants')
          .delete()
          .eq('id', tenantId);
        
        if (tenantDeleteError) {
          console.error('Tenant delete error:', tenantDeleteError);
        } else {
          console.log('Tenant deleted:', tenantId);
          deletedItems.tenant = true;
        }
      }
    }

    // 5. Delete Platform Signup
    const { error: signupDeleteError } = await supabaseAdmin
      .from('platform_signups')
      .delete()
      .eq('id', signupId);

    if (signupDeleteError) {
      console.error('Signup delete error:', signupDeleteError);
      return NextResponse.json({ 
        error: 'خطا در حذف درخواست: ' + signupDeleteError.message 
      }, { status: 500 });
    }

    deletedItems.signup = true;
    console.log('Signup deleted:', signupId);

    return NextResponse.json({
      success: true,
      message: 'حذف با موفقیت انجام شد',
      deletedItems,
    });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: 'خطای سرور: ' + error.message 
    }, { status: 500 });
  }
}
