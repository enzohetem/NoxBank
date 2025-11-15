import { usePage, router } from '@inertiajs/react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface LogoutButtonProps {
  confirm?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LogoutButton({
  confirm = true,
  label = 'Sair',
  size = 'md',
}: LogoutButtonProps) {
  const page = usePage<{ user: { fullName?: string } | null }>()
  const user = page.props.user
  const [hover, setHover] = useState(false)

  const dims = {
    sm: 'w-9 h-9 p-2 text-sm',
    md: 'w-12 h-12 p-3 text-sm',
    lg: 'w-14 h-14 p-3 text-base',
  }[size]

  const handleLogout = () => {
    if (confirm) {
      const ok = window.confirm('Deseja sair da sua conta?')
      if (!ok) return
    }
    router.visit('/logout')
  }

  return (
    <div className="flex items-center gap-3 select-none">
      {user?.fullName && (
        <span
          className="hidden md:inline text-gray-300 text-sm truncate max-w-[160px]"
          title={user.fullName}
        >
          {user.fullName}
        </span>
      )}
      <button
        type="button"
        onClick={handleLogout}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={label}
        className={`group ${dims} rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-600/30`}
        title={label}
      >
        <ArrowRightOnRectangleIcon
          className={`w-full h-full text-rose-600 transition-colors ${hover ? 'text-rose-500' : 'text-rose-600'}`}
        />
      </button>
    </div>
  )
}
