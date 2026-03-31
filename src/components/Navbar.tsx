'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { logout } from '@/app/auth/actions';

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const pathname = usePathname();
  const supabase = createClient();

  const closeAll = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    closeAll();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    const getInitialAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            setIsAdmin(profile?.role === 'admin');
        }
    };
    getInitialAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentUser.id)
                .single();
            setIsAdmin(profile?.role === 'admin');
        } else {
            setIsAdmin(false);
        }
    });

    window.addEventListener('scroll', handleScroll);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light-mode') {
        setIsLightMode(true);
        document.body.classList.add('light-mode');
    }
    setMounted(true);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    if (newMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light-mode');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', '');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    closeAll();
  };

  const navLinks = [
    { name: 'Home', href: '/#hero' },
    { name: 'About', href: '/#about' },
    { name: 'Coaching', href: '/#coaching' },
    { name: 'Companies', href: '/#companies' },
    { name: 'Developers', href: '/#developers' },
    { name: 'Education', href: '/#education' },
    { name: 'News', href: '/#news' },
    { name: 'Awards', href: '/#awards' },
    { name: 'Contact', href: '/#contact' },
  ];

  if (!mounted) {
    return (
      <nav id="navbar">
        <Link href="/" className="nav-logo">Anthony <span>Leuterio</span><sup>Realty</sup></Link>
        <div className="nav-right">
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <Link href="/#hero" className="nav-logo" onClick={closeAll}>Anthony <span>Leuterio</span><sup>Realty</sup></Link>
      <div className="nav-right">
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} onClick={closeAll}>{link.name}</Link>
            </li>
          ))}
          
          {user ? (
            <li className="admin-link-nav">
              <Link href="/admin" onClick={closeAll} style={{ color: 'var(--red)' }}>Admin</Link>
            </li>
          ) : (
            <li><Link href="/login" onClick={closeAll}>Login</Link></li>
          )}
        </ul>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {!isLightMode ? (
            <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"/></svg>
          ) : (
            <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
        <button className={`mobile-nav-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu} aria-label="Toggle Menu">
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
