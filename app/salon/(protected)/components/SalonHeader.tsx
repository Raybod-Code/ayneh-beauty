// app/salon/(protected)/components/SalonHeader.tsx
'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { useState } from 'react'

interface SalonHeaderProps {
  tenant: any
  user: any
  role: string
}

export default function SalonHeader({ tenant, user, role }: SalonHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <header 
      className="sticky top-0 z-30 backdrop-blur-xl border-b"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        borderBottomColor: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
      }}
    >
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Left: Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 transition-all"
              style={{
                focusRingColor: 'var(--brand-primary)',
              }}
            />
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {/* Notification Badge */}
              <span 
                className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                style={{ background: 'var(--brand-primary)' }}
              >
                3
              </span>
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">اعلان‌ها</h3>
                  <button className="text-xs text-blue-600 hover:underline">
                    علامت‌گذاری همه به عنوان خوانده شده
                  </button>
                </div>
                
                {/* Notification List */}
                <div className="max-h-96 overflow-y-auto">
                  {/* Sample Notifications */}
                  {[
                    {
                      id: 1,
                      type: 'booking',
                      title: 'رزرو جدید',
                      message: 'فاطمه احمدی یک رزرو برای فردا ثبت کرد',
                      time: '5 دقیقه پیش',
                      unread: true,
                    },
                    {
                      id: 2,
                      type: 'payment',
                      title: 'پرداخت موفق',
                      message: 'پرداخت 250,000 تومان از مشتری ثبت شد',
                      time: '1 ساعت پیش',
                      unread: true,
                    },
                    {
                      id: 3,
                      type: 'inventory',
                      title: 'هشدار موجودی',
                      message: 'موجودی رنگ مو کمتر از حد مجاز است',
                      time: '3 ساعت پیش',
                      unread: false,
                    },
                  ].map((notif) => (
                    <div
                      key={notif.id}
                      className={clsx(
                        'px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors',
                        notif.unread ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Unread Indicator */}
                        {notif.unread && (
                          <div 
                            className="w-2 h-2 rounded-full mt-2"
                            style={{ background: 'var(--brand-primary)' }}
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">
                            {notif.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-200 text-center">
                  <Link 
                    href="/salon/notifications"
                    className="text-sm font-medium hover:underline"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    مشاهده همه اعلان‌ها
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: 'var(--brand-primary)' }}
            >
              {user.email?.charAt(0).toUpperCase()}
            </div>
            
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
