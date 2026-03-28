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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const pathname = usePathname();
  const supabase = createClient();

  const toggleDropdown = (e: React.MouseEvent, name: string) => {
    // We don't preventDefault or stopPropagation to allow outside click listener to work
    // and naturally handle link clicks if they happen.
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Close all menus when pathname changes (navigation)
  useEffect(() => {
    closeAll();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    // Close dropdowns on outside click
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.dropdown')) {
            setActiveDropdown(null);
        }
    };

    // Check auth status
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
    window.addEventListener('click', handleClickOutside);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light-mode') {
        setIsLightMode(true);
        document.body.classList.add('light-mode');
    }
    setMounted(true);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('click', handleClickOutside);
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
    if (activeDropdown) setActiveDropdown(null);
  };

  const handleLogout = async () => {
    await logout();
    closeAll();
  };

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
      <Link href="/" className="nav-logo" onClick={closeAll}>Anthony <span>Leuterio</span><sup>Realty</sup></Link>
      <div className="nav-right">
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} onClick={(e) => {
            if (e.target === e.currentTarget) closeAll();
        }}>
          <li><Link href="/" onClick={closeAll}>Home</Link></li>
          
          <li className={`dropdown ${activeDropdown === 'coaching' ? 'active' : ''}`}>
            <span className="dropbtn" onClick={(e) => toggleDropdown(e, 'coaching')}>Coaching <svg className="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <ul className="dropdown-content">
              <li><Link href="/about" onClick={closeAll}>About</Link></li>
              <li><Link href="/#companies" onClick={closeAll}>Companies</Link></li>
              <li><Link href="/executive-coaching" onClick={closeAll}>Executive Coaching</Link></li>
              <li><Link href="/team-leadership" onClick={closeAll}>Team Leadership</Link></li>
              <li><Link href="/sales-mastery" onClick={closeAll}>Sales Mastery</Link></li>
            </ul>
          </li>

          <li className={`dropdown ${activeDropdown === 'training' ? 'active' : ''}`}>
            <span className="dropbtn" onClick={(e) => toggleDropdown(e, 'training')}>Training <svg className="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <ul className="dropdown-content">
              <li><Link href="/real-estate-basics" onClick={closeAll}>Real Estate Basics</Link></li>
              <li><Link href="/digital-marketing" onClick={closeAll}>Digital Marketing</Link></li>
              <li><Link href="/legal-compliance" onClick={closeAll}>Legal Compliance</Link></li>
            </ul>
          </li>

          <li className={`dropdown ${activeDropdown === 'events' ? 'active' : ''}`}>
            <span className="dropbtn" onClick={(e) => toggleDropdown(e, 'events')}>Events <svg className="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <ul className="dropdown-content">
              <li><Link href="/upcoming-summits" onClick={closeAll}>Upcoming Summits</Link></li>
              <li><Link href="/workshops" onClick={closeAll}>Workshops</Link></li>
              <li><Link href="/webinars" onClick={closeAll}>Webinars</Link></li>
            </ul>
          </li>

          <li className={`dropdown ${activeDropdown === 'resources' ? 'active' : ''}`}>
            <span className="dropbtn" onClick={(e) => toggleDropdown(e, 'resources')}>Resources <svg className="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <ul className="dropdown-content">
              <li><Link href="/market-reports" onClick={closeAll}>Market Reports</Link></li>
              <li><Link href="/templates" onClick={closeAll}>Templates</Link></li>
              <li><Link href="/e-books" onClick={closeAll}>E-books</Link></li>
            </ul>
          </li>
          
          {/* Auth Links */}
          {user ? (
            <li className={`dropdown ${activeDropdown === 'account' ? 'active' : ''}`}>
              <span className="dropbtn" style={{ color: 'var(--red)' }} onClick={(e) => toggleDropdown(e, 'account')}>Account <svg className="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              <ul className="dropdown-content">
                <li><Link href="/admin" onClick={closeAll}>Admin Dashboard</Link></li>
                <li><button onClick={handleLogout} style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit', 
                    width: '100%', 
                    textAlign: 'left', 
                    padding: 'inherit',
                    font: 'inherit',
                    cursor: 'pointer'
                }}>Logout</button></li>
              </ul>
            </li>
          ) : (
            <li><Link href="/login" onClick={closeAll}>Admin Login</Link></li>
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
