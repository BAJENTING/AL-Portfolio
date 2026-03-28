'use client';

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/app/auth/actions'
import { 
  LayoutDashboard, 
  Building2, 
  Trophy, 
  ScrollText, 
  Lightbulb, 
  Code2, 
  Mail, 
  LogOut, 
  X, 
  Menu,
  Globe
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true)
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true)
      }
    })
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleResize = () => {
      const isMobile = window.innerWidth <= 1024
      setIsSidebarOpen(prev => {
        if (isMobile && prev) return false
        if (!isMobile && !prev) return true
        return prev
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted])

  // Mobile auto-close on navigation
  useEffect(() => {
    if (mounted && window.innerWidth <= 1024) {
      requestAnimationFrame(() => setIsSidebarOpen(false))
    }
  }, [pathname, mounted])

  const menuItems = useMemo(() => [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Companies', href: '/admin/companies', icon: <Building2 size={18} /> },
    { label: 'Awards', href: '/admin/awards', icon: <Trophy size={18} /> },
    { label: 'Credentials', href: '/admin/credentials', icon: <ScrollText size={18} /> },
    { label: 'Coaching', href: '/admin/coaching', icon: <Lightbulb size={18} /> },
    { label: 'Developers', href: '/admin/developers', icon: <Code2 size={18} /> },
    { label: 'Contacts', href: '/admin/contacts', icon: <Mail size={18} /> },
  ], [])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (!mounted) return null;

  return (
    <div className="admin-root">
      {/* 1. TOP HEADER NAVIGATION - LINKS ON THE RIGHT */}
      <header className="admin-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="header-navigation">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* 2. ADMIN PANEL SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <div className="admin-logo">Admin <span>Panel</span></div>
            <p className="sidebar-hint">Management Console</p>
          </div>

          <div className="sidebar-section">
            <Link href="/" className="sidebar-action-btn">
              <Globe size={18} />
              <span>Visit Website</span>
            </Link>
          </div>

          <div className="sidebar-push-bottom"></div>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
            <div className="admin-badge">
              <span className="pulse-dot"></span>
              Administrator
            </div>
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className={`admin-main ${isSidebarOpen ? 'sidebar-pushed' : ''}`}>
        <div className="main-inner">
          {children}
        </div>
      </main>

      {/* Mobile Backdrop */}
      <div 
        className={`mobile-overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <style>{`
        .admin-root {
          min-height: 100vh;
          background: #0F0F0F;
          color: white;
        }

        /* --- FIXED TOP HEADER --- */
        .admin-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 70px;
          background: #1A1A1A;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 5000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 25px;
          width: 100%;
          box-sizing: border-box;
        }

        .header-left {
          flex-shrink: 0;
          z-index: 5100;
        }

        .sidebar-toggle {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s;
          position: relative;
        }
        .sidebar-toggle:hover { background: #D21F17; border-color: #D21F17; }

        .header-navigation {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scrollbar-width: none;
          justify-content: flex-end;
          flex: 1;
          margin-left: 40px;
        }
        .header-navigation::-webkit-scrollbar { display: none; }

        .nav-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; color: #A0A0A0; text-decoration: none;
          font-size: 0.85rem; font-weight: 600; border-radius: 8px;
          white-space: nowrap; transition: all 0.2s;
        }
        .nav-item:hover { background: rgba(255, 255, 255, 0.05); color: white; }
        .nav-item.active { background: rgba(210, 31, 23, 0.1); color: #D21F17; }

        /* --- SIDEBAR --- */
        .admin-sidebar {
          position: fixed;
          top: 70px;
          left: 0; bottom: 0;
          width: 280px;
          background: #1A1A1A;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 4000;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        .admin-sidebar.open { transform: translateX(0); }

        .sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 30px 25px;
        }

        .sidebar-section { margin-bottom: 25px; }

        .admin-logo { font-family: 'Oswald', sans-serif; font-size: 1.5rem; font-weight: 700; text-transform: uppercase; line-height: 1; margin-bottom: 8px; }
        .admin-logo span { color: #D21F17; }
        .sidebar-hint { font-size: 0.65rem; color: #666; text-transform: uppercase; letter-spacing: 0.1em; }

        .sidebar-action-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px; color: #D1D1D1; text-decoration: none;
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px; font-weight: 600; transition: all 0.3s;
          font-size: 0.9rem;
        }
        .sidebar-action-btn:hover { background: #D21F17; color: white; border-color: #D21F17; transform: translateY(-2px); }

        .sidebar-push-bottom { flex: 1; }

        .sidebar-footer {
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logout-btn {
          width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px;
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px; color: #A0A0A0; cursor: pointer; transition: all 0.3s;
          font-weight: 600; font-size: 0.85rem;
        }
        .logout-btn:hover { background: rgba(210, 31, 23, 0.1); color: #D21F17; border-color: rgba(210, 31, 23, 0.2); }

        .admin-badge {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.6rem; text-transform: uppercase; color: #666;
          margin-top: 15px; padding-left: 5px;
        }
        .pulse-dot { 
          width: 6px; height: 6px; background: #27ae60; border-radius: 50%; 
          box-shadow: 0 0 10px #27ae60; animation: pulse 2s infinite; 
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        /* --- MAIN CONTENT --- */
        .admin-main {
          padding-top: 70px;
          min-height: 100vh;
          transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .main-inner { max-width: 1200px; margin: 0 auto; padding: 40px; }

        @media (min-width: 1025px) {
          .admin-main.sidebar-pushed { padding-left: 280px; }
        }

        .mobile-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          z-index: 3500; opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .mobile-overlay.visible { opacity: 1; pointer-events: auto; }

        @media (max-width: 1024px) {
          .main-inner { padding: 30px 20px; }
          .admin-sidebar { width: 300px; box-shadow: 10px 0 40px rgba(0,0,0,0.5); }
          .header-navigation { margin-left: 20px; }
        }
      `}</style>
    </div>
  )
}
