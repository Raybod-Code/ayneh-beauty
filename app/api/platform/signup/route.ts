// app/api/platform/signup/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!; // 👈 اینجا تغییر کرد

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salonName, slug, ownerName, email, phone, city, staffCount } = body;

    console.log('Received signup data:', { salonName, slug, ownerName, email });

    if (!salonName || !slug || !ownerName || !email || !phone || !city || !staffCount) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check slug
    const { data: existing } = await supabase
      .from('platform_signups')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'این آدرس قبلاً استفاده شده است' },
        { status: 409 }
      );
    }

    // Insert
    const { data, error } = await supabase
      .from('platform_signups')
      .insert([
        {
          salon_name: salonName,
          slug,
          owner_name: ownerName,
          email,
          phone,
          city,
          staff_count: staffCount,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Success:', data);

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Catch error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
