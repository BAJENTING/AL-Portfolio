'use client';

import { useEffect, useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <div className="admin-root">
      <main className="admin-main-full">
        {children}
      </main>

      <style>{`
        .admin-root {
          min-height: 100vh;
          background: #0F0F0F;
          color: white;
        }

        .admin-main-full {
          min-height: 100vh;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
