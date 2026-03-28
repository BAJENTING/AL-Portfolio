'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ScrollReveal from '@/components/ScrollReveal';
import NewsSection from '@/components/NewsSection';
import { submitContactForm } from './actions';

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
}

interface Credential {
  id: string;
  category: string;
  title: string;
  institution: string;
  organization: string | null;
}

interface Award {
  id: string;
  title: string;
  organization: string;
  year: number;
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [latestAward, setLatestAward] = useState<Award | null>(null);
  const [currentCredentialIndex, setCurrentCredentialIndex] = useState(0);
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(1); // Start at 1 because of clone
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3); // Default for SSR

  const sliderItems = credentials.length > 0 ? credentials : [1, 2, 3, 4, 5, 6, 7, 8];

  // Clone slides for infinite loop
  const clonedCompanies = companies.length > 0 
    ? [companies[companies.length - 1], ...companies, companies[0]] 
    : [];

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth <= 768) setVisibleCards(1);
      else if (window.innerWidth <= 1100) setVisibleCards(2);
      else setVisibleCards(3);
      setCurrentCredentialIndex(0);
      setCurrentCompanyIndex(1);
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  useEffect(() => {
    if (currentCompanyIndex === 0 && !isTransitioning) {
      // Jump from clone of last to actual last
      setIsTransitioning(false);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentCompanyIndex(clonedCompanies.length - 2);
      }, 0);
    } else if (currentCompanyIndex === clonedCompanies.length - 1 && !isTransitioning) {
      // Jump from clone of first to actual first
      setIsTransitioning(false);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentCompanyIndex(1);
      }, 0);
    }
  }, [currentCompanyIndex, isTransitioning, clonedCompanies.length]);

  const handleTransitionEnd = () => {
    if (currentCompanyIndex === 0) {
      setIsTransitioning(false);
      setCurrentCompanyIndex(clonedCompanies.length - 2);
    } else if (currentCompanyIndex === clonedCompanies.length - 1) {
      setIsTransitioning(false);
      setCurrentCompanyIndex(1);
    }
  };

  const nextCompany = () => {
    if (!isTransitioning && (currentCompanyIndex === 0 || currentCompanyIndex === clonedCompanies.length - 1)) return;
    setIsTransitioning(true);
    setCurrentCompanyIndex(prev => prev + 1);
  };

  const prevCompany = () => {
    if (!isTransitioning && (currentCompanyIndex === 0 || currentCompanyIndex === clonedCompanies.length - 1)) return;
    setIsTransitioning(true);
    setCurrentCompanyIndex(prev => prev - 1);
  };

  const nextCredential = () => {
    const maxIndex = Math.max(0, sliderItems.length - visibleCards);
    setCurrentCredentialIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevCredential = () => {
    const maxIndex = Math.max(0, sliderItems.length - visibleCards);
    setCurrentCredentialIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  const getShift = () => {
    return (100 / visibleCards);
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const [credentialsRes, awardRes, companiesRes] = await Promise.all([
        supabase.from('credentials').select('*'),
        supabase.from('awards').select('*').order('year', { ascending: false }).limit(1).single(),
        supabase.from('companies').select('*')
      ]);

      if (credentialsRes.data && credentialsRes.data.length > 0) {
        setCredentials(credentialsRes.data);
      }
      if (awardRes.data) setLatestAward(awardRes.data);
      if (companiesRes.data) setCompanies(companiesRes.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    
    const btn = document.getElementById('submitBtn');
    if (result.success) {
      if (btn) {
        btn.textContent = 'Message Sent ✓';
        (btn as HTMLButtonElement).style.background = '#27ae60';
      }
      (e.target as HTMLFormElement).reset();
    } else {
      if (btn) {
        btn.textContent = 'Error sending message';
        (btn as HTMLButtonElement).style.background = '#d21f17';
      }
    }
    
    setTimeout(() => {
      if (btn) {
        btn.textContent = 'Send Message';
        (btn as HTMLButtonElement).style.background = '';
      }
      setIsSubmitting(false);
    }, 3000);
  };

  return (
    <main>
      {/* HERO */}
      <section id="hero">
        <div className="hero-right">
          <video className="hero-img" autoPlay loop muted playsInline>
            <source src="/images/hero_vid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="hero-card">
            <div className="card-award">
              <span>🏆 Award</span>
              <a href="/about#awards" className="award-link" title="View All Awards">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
            <div className="card-title">
              {latestAward ? (
                <>
                  {latestAward.title} <br />
                  <span style={{ fontSize: '0.7rem', fontWeight: 300 }}>{latestAward.organization} · {latestAward.year}</span>
                </>
              ) : (
                <>2024 International <br />Realtor of the Year</>
              )}
            </div>
            <div className="card-sub">Certified Real Estate Broker</div>
          </div>
        </div>

        <div className="hero-left">
          <div className="hero-eyebrow"><span></span>THE PHILIPPINES&apos; #1 REAL ESTATE VISIONARY</div>
          <h1>
            <span className="name-line">DOMINATE THE</span>
            <span className="name-line" style={{ color: 'var(--red)' }}>REAL ESTATE</span>
            <span className="name-line">MARKET</span>
          </h1>
          <p className="hero-tagline">Anthony Leuterio is the driving force behind the country&apos;s most successful property ecosystems, empowering 15,000+ professionals to achieve elite-level results.</p>
          
          <div className="hero-ctas">
            <a href="#contact" className="btn-red" style={{ textDecoration: 'none' }}>Hire Me</a>
          </div>

          <div className="hero-numbers">
            <div>
              <div className="num-val">1,000<sup>+</sup></div>
              <div className="num-lbl">Awards Won</div>
            </div>
            <div>
              <div className="num-val">15,000</div>
              <div className="num-lbl">Professionals</div>
            </div>
            <div>
              <div className="num-val">20<sup>+</sup></div>
              <div className="num-lbl">Cities Nationwide</div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-circle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          <span className="marquee-item">Founder @ Filipinohomes</span>
          <span className="marquee-item">Motivational Speaker</span>
          <span className="marquee-item">Real Estate Influencer</span>
          <span className="marquee-item">Marketing Consultant</span>
          <span className="marquee-item">Realtor</span>
          <span className="marquee-item">Investor</span>
          <span className="marquee-item">Founder @ Filipinohomes</span>
          <span className="marquee-item">Motivational Speaker</span>
          <span className="marquee-item">Real Estate Influencer</span>
          <span className="marquee-item">Marketing Consultant</span>
          <span className="marquee-item">Realtor</span>
          <span className="marquee-item">Investor</span>
        </div>
      </div>

      {/* NEWS */}
      <NewsSection />

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="testi-bg-text">Results</div>
        <div className="testi-header">
          <ScrollReveal>
            <div className="section-eyebrow">Testimonials</div>
            <h2>What Clients<br /><em>Say</em></h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="testi-intro">Every closed deal represents a family&apos;s dream fulfilled, an investor&apos;s goal achieved. These are the words that fuel my passion for this work every single day.</p>
          </ScrollReveal>
        </div>

        <div className="testi-grid">
          <ScrollReveal className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <span className="quote-mark">“</span>
            <div className="testi-text">Anthony made the entire process effortless. He found us a beautiful home in BGC within our budget and handled every detail. Truly exceptional service.</div>
            <div className="testi-author">
              <div className="testi-avatar">MR</div>
              <div>
                <div className="author-n">Maria Reyes</div>
                <div className="author-d">Bought in BGC · 2024</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1} className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <span className="quote-mark">“</span>
            <div className="testi-text">I&apos;ve worked with many brokers across Asia — Anthony is in a class of his own. He sold my Cebu property in 18 days, 8% above my asking price. Phenomenal.</div>
            <div className="testi-author">
              <div className="testi-avatar">JT</div>
              <div>
                <div className="author-n">James Tan</div>
                <div className="author-d">Sold Property · Cebu</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2} className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <span className="quote-mark">“</span>
            <div className="testi-text">As an OFW, I was nervous about buying property remotely. Anthony guided me every step of the way and I now own my dream condo. I couldn&apos;t be happier.</div>
            <div className="testi-author">
              <div className="testi-avatar">GA</div>
              <div>
                <div className="author-n">Grace Aquino</div>
                <div className="author-d">OFW Buyer · Pasig</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* COMPANIES SECTION */}
      {companies.length > 0 && (
        <section id="companies">
          <div className="companies-container">
            <ScrollReveal className="section-header">
              <div className="section-eyebrow">THE LEUTERIO GROUP</div>
              <h2>ARCHITECTS OF THE <em>PROPERTY</em> REVOLUTION</h2>
            </ScrollReveal>
            
            <div className="companies-slider-container">
              <button onClick={prevCompany} className="slider-btn side-btn prev" aria-label="Previous Company">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>

              <div className="companies-slider-wrapper">
                <div 
                  className="companies-slider" 
                  onTransitionEnd={handleTransitionEnd}
                  style={{ 
                    transform: `translateX(-${currentCompanyIndex * 100}%)`,
                    transition: isTransitioning ? 'transform 0.7s cubic-bezier(0.85, 0, 0.15, 1)' : 'none'
                  }}
                >
                  {clonedCompanies.map((company, index) => (
                    <div key={`${company.id}-${index}`} className="company-slide">
                      <div className="company-card">
                        <div className="company-logo-wrapper">
                          {(() => {
                            const name = company.name.toLowerCase();
                            let logoSrc = company.logo_url;
                            
                            if (name.includes('leuterio realty')) logoSrc = '/images/LEUTERIO REALTY & BROKERAGE.svg';
                            else if (name.includes('rentph') || name.includes('rent.ph')) logoSrc = '/images/RentPh.png';
                            else if (name.includes('filipinohomes') || name.includes('filipino homes')) logoSrc = '/images/filipinohomes.png';

                            return logoSrc ? (
                              <img src={logoSrc} alt={company.name} className="company-logo" />
                            ) : (
                              <div className="company-logo-placeholder">{company.name}</div>
                            );
                          })()}
                        </div>
                        <div className="company-info">
                          <h3>{company.name}</h3>
                          <p>{company.description}</p>
                          {company.website_url && (
                            <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="company-link">
                              Visit Website ➜
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={nextCompany} className="slider-btn side-btn next" aria-label="Next Company">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CREDENTIALS */}
      <section id="credentials">
        <ScrollReveal className="section-header">
          <div className="section-eyebrow">PROFESSIONAL STATUS</div>
          <h2>LICENSES & <em>CREDENTIALS</em></h2>
        </ScrollReveal>

        <div className="credentials-slider-container">
          <button onClick={prevCredential} className="slider-btn side-btn prev" aria-label="Previous" suppressHydrationWarning>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div className="credentials-slider-wrapper">
            <div 
              className="credentials-slider" 
              style={{ transform: `translateX(-${currentCredentialIndex * getShift()}%)` }}
            >
              {sliderItems.map((c, i) => (
                <div key={(typeof c === 'object' ? c.id : c) + '-' + i} className="eco-card-wrapper">
                  <div className="eco-card">
                    <div className="eco-num">0{i + 1}</div>
                    <div className="news-badge" style={{ marginBottom: '10px' }}>
                      {typeof c === 'object' ? c.category : (i % 2 === 0 ? 'License' : 'Certification')}
                    </div>
                    <h3 style={{ textTransform: 'uppercase' }}>
                      {typeof c === 'object' ? c.title : (
                        i % 4 === 0 ? 'REAL ESTATE BROKER' :
                        i % 4 === 1 ? 'INTERNATIONAL REALTOR' :
                        i % 4 === 2 ? 'REAL ESTATE APPRAISER' :
                        'CERTIFIED RESIDENTIAL SPECIALIST'
                      )}
                    </h3>
                    <p>
                      {typeof c === 'object' ? (
                        <>
                          {c.institution}{c.organization ? ` · ${c.organization}` : ''}
                        </>
                      ) : (
                        i % 4 === 0 ? 'Professional Regulation Commission (PRC) · Philippines' :
                        i % 4 === 1 ? 'National Association of REALTORS® (NAR) · USA' :
                        i % 4 === 2 ? 'Professional Regulation Commission (PRC) · Philippines' :
                        'Residential Real Estate Council · International'
                      )}
                    </p>
                    <a href="#contact" className="eco-link">Verify ➜</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={nextCredential} className="slider-btn side-btn next" aria-label="Next" suppressHydrationWarning>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <ScrollReveal className="contact-left">
          <div className="section-eyebrow">Get In Touch</div>
          <h2>Let&apos;s Find Your<br /><em>Perfect</em> Property</h2>
          <span className="red-divider"></span>
          <p style={{ color: 'var(--text-mid)', lineHeight: 1.9, fontSize: '0.95rem', fontWeight: 300 }}>Whether you&apos;re buying your first home, selling a property, or growing your real estate portfolio — I&apos;m here to make it happen. Reach out and let&apos;s start the conversation.</p>

          <div className="contact-detail">
            <div className="c-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.65 3.42 2 2 0 013.62 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            </div>
            <div>
              <div className="c-lbl">Phone / Viber</div>
              <div className="c-val">+63 917 555 0192</div>
            </div>
          </div>

          <div className="contact-detail">
            <div className="c-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <div className="c-lbl">Email</div>
              <div className="c-val">anthony@leuterioproperties.com</div>
            </div>
          </div>

          <div className="contact-detail">
            <div className="c-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div className="c-lbl">Office</div>
              <div className="c-val">Cebu City & BGC, Taguig, Philippines</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="f-group">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="Juan" required suppressHydrationWarning />
              </div>
              <div className="f-group">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="dela Cruz" required suppressHydrationWarning />
              </div>
            </div>
            <div className="f-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="juan@email.com" required suppressHydrationWarning />
            </div>
            <div className="f-group">
              <label>Phone / Viber</label>
              <input type="tel" name="phone" placeholder="+63 9XX XXX XXXX" suppressHydrationWarning />
            </div>
            <div className="f-group">
              <label>I&apos;m Looking To</label>
              <select name="lookingTo" suppressHydrationWarning>
                <option value="">Choose an option…</option>
                <option>Buy a Property</option>
                <option>Sell a Property</option>
                <option>Invest in Real Estate</option>
                <option>OFW Realty Assistance</option>
                <option>Real Estate Coaching</option>
              </select>
            </div>
            <div className="f-group">
              <label>Budget Range</label>
              <select name="budget" suppressHydrationWarning>
                <option value="">Select a range…</option>
                <option>Below ₱3M</option>
                <option>₱3M – ₱8M</option>
                <option>₱8M – ₱20M</option>
                <option>₱20M+</option>
              </select>
            </div>
            <div className="f-group">
              <label>Message</label>
              <textarea name="message" placeholder="Tell me about what you&apos;re looking for…" suppressHydrationWarning></textarea>
            </div>
            <button type="submit" className="form-submit" id="submitBtn" disabled={isSubmitting} suppressHydrationWarning>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </ScrollReveal>
      </section>
    </main>
  );
}
