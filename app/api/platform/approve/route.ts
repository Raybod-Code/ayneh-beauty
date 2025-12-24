// app/api/platform/approve/route.ts
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

    // Use service role client for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Get signup details
    const { data: signup, error: fetchError } = await supabaseAdmin
      .from('platform_signups')
      .select('*')
      .eq('id', signupId)
      .single();

    if (fetchError || !signup) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: 'درخواست یافت نشد' }, { status: 404 });
    }

    console.log('Processing signup:', signup);

    // 2. Create tenant
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert([
        {
          name: signup.salon_name,
          slug: signup.slug,
          owner_name: signup.owner_name,
          email: signup.email,
          phone: signup.phone,
          city: signup.city,
          status: 'active',
          subscription_plan: 'free',
          subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 روز رایگان
          settings: {
            staff_count: signup.staff_count,
          },
        },
      ])
      .select()
      .single();

    if (tenantError) {
      console.error('Tenant creation error:', tenantError);
      return NextResponse.json({ 
        error: 'خطا در ساخت سالن: ' + tenantError.message 
      }, { status: 500 });
    }

    console.log('Tenant created:', tenant);

    // 3. Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'Aa1!';
    
    // 4. Create user account
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: signup.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: signup.owner_name,
        tenant_id: tenant.id,
        tenant_slug: tenant.slug,
        role: 'owner',
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      
      // Rollback: delete tenant if user creation failed
      await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
      
      return NextResponse.json({ 
        error: 'خطا در ساخت کاربر: ' + authError.message 
      }, { status: 500 });
    }

    console.log('User created:', authUser.user.id);

    // 5. Update signup status to approved
    const { error: updateError } = await supabaseAdmin
      .from('platform_signups')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString(),
        notes: `Tenant ID: ${tenant.id}, User ID: ${authUser.user.id}`,
      })
      .eq('id', signupId);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    // 6. TODO: Send welcome email
    // await sendWelcomeEmail({
    //   email: signup.email,
    //   name: signup.owner_name,
    //   salonName: signup.salon_name,
    //   slug: signup.slug,
    //   tempPassword,
    // });

    return NextResponse.json({
      success: true,
      message: 'سالن با موفقیت ساخته شد',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      credentials: {
        email: signup.email,
        tempPassword, // فقط برای تست - در production نباید return بشه
        loginUrl: `https://${signup.slug}.ayneh.beauty/login`,
      },
    });

  } catch (error: any) {
    console.error('Approval error:', error);
    return NextResponse.json({ 
      error: 'خطای سرور: ' + error.message 
    }, { status: 500 });
  }
}
