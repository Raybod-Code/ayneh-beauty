// app/salon/(protected)/components/SalonSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  TrendingUp,
  Settings,
  MessageSquare,
  DollarSign,
  BarChart3,
  ChevronLeft,
  Sparkles,
  Mail,
} from 'lucide-react'
import { clsx } from 'clsx'

interface SalonSidebarProps {
  tenant: any
  user: any
  role: string
  logo: string | null
  brandName: string
}

export default function SalonSidebar({ 
  tenant, 
  user, 
  role, 
  logo, 
  brandName 
}: SalonSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  
  const menuItems = [
    {
      label: 'داشبورد',
      icon: LayoutDashboard,
      href: '/salon/dashboard',
      roles: ['owner', 'admin', 'staff'],
    },
    {
      label: 'رزروها',
      icon: Calendar,
      href: '/salon/bookings',
      roles: ['owner', 'admin', 'staff'],
      badge: 12, // تعداد رزروهای امروز
    },
    {
      label: 'مشتریان',
      icon: Users,
      href: '/salon/customers',
      roles: ['owner', 'admin', 'staff'],
    },
    {
      label: 'خدمات',
      icon: Scissors,
      href: '/salon/services',
      roles: ['owner', 'admin'],
    },
    {
      label: 'موجودی انبار',
      icon: Package,
      href: '/salon/inventory',
      roles: ['owner', 'admin'],
    },
    {
      label: 'مالی',
      icon: DollarSign,
      href: '/salon/financial',
      roles: ['owner', 'admin'],
    },
    {
      label: 'تحلیل و گزارش',
      icon: BarChart3,
      href: '/salon/analytics',
      roles: ['owner', 'admin'],
    },
    {
      label: 'بازاریابی',
      icon: TrendingUp,
      href: '/salon/marketing',
      roles: ['owner', 'admin'],
    },
    {
      label: 'پیام‌ها',
      icon: MessageSquare,
      href: '/salon/messages',
      roles: ['owner', 'admin', 'staff'],
    },
    {
      label: 'تنظیمات',
      icon: Settings,
      href: '/salon/settings',
      roles: ['owner', 'admin'],
    },
  ]
  
  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(role)
  )
  
  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 right-0 h-screen bg-white border-l border-[var(--color-primary,#D4AF37)]/10',
          'transition-all duration-300 z-40',
          collapsed ? 'w-20' : 'w-64',
          'shadow-lg'
        )}
        style={{
          borderLeftColor: `color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
        }}
      >
        {/* Logo/Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-primary,#D4AF37)]/10">
          {!collapsed && (
            <div className="flex items-center gap-3">
              {logo ? (
                <img 
                  src={logo} 
                  alt={brandName} 
                  className="h-10 w-auto"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span 
                    className="font-bold text-lg"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    {brandName}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft
              className={clsx(
                'w-5 h-5 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'relative group',
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                style={isActive ? {
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                } : {}}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                    style={{ background: 'var(--brand-secondary)' }}
                  />
                )}
                
                {/* Icon */}
                <Icon className={clsx('w-5 h-5 flex-shrink-0')} />
                
                {/* Label */}
                {!collapsed && (
                  <>
                    <span className="flex-1 font-medium">{item.label}</span>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span 
                        className="px-2 py-0.5 text-xs font-bold rounded-full"
                        style={{
                          background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--brand-primary)',
                          color: isActive ? 'white' : 'white',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute right-full mr-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* User Info */}
        {!collapsed && (
          <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: 'var(--brand-primary)' }}
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.email}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
      
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  )
}
