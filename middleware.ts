import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * همه مسیرها رو match میکنه به جز:
     * - _next/static (فایل‌های static)
     * - _next/image (image optimization)
     * - favicon.ico
     * - فایل‌های public
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
