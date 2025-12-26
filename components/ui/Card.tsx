// components/ui/Card.tsx
'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Card({
  children,
  hover = false,
  padding = 'md',
  shadow = 'md',
  className,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }
  
  const classes = clsx(
    'bg-white rounded-lg border border-gray-200 transition-all duration-300',
    hover && 'hover:shadow-xl hover:scale-[1.02]',
    paddingClasses[padding],
    shadowClasses[shadow],
    className
  )
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
