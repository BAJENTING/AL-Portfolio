'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ScrollReveal from '@/components/ScrollReveal';
import NewsSection from '@/components/NewsSection';
import MediaSection from '@/components/MediaSection';
import EventsSection from '@/components/EventsSection';
import SectionHeader from '@/components/SectionHeader';
import TestimonialSection from '@/components/TestimonialSection';
import { submitContactForm } from './actions';

interface Coaching {
  id: string;
  title: string;
  badge_text: string;
  image_url: string;
  description: string;
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
  icon: string | null;
}

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_image_url: string | null;
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [coaching, setCoaching] = useState<Coaching[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [latestAward, setLatestAward] = useState<Award | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const [currentEduIndex, setCurrentEduIndex] = useState(0);
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [currentAwardIndex, setCurrentAwardIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [coachItemsToShow, setCoachItemsToShow] = useState(3);
  const [awardItemsToShow, setAwardItemsToShow] = useState(4);

  const getImgSrc = (src: string | null | undefined) => {
    if (!src) return '';
    const cleanSrc = src.replace(/^\/?components\//, '').replace(/^\/?images\//, '');
    return (cleanSrc.startsWith('http') || cleanSrc.startsWith('/')) ? cleanSrc : `/images/${cleanSrc}`;
  };

  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      // Coaching slider logic
      if (window.innerWidth < 900) setCoachItemsToShow(1);
      else setCoachItemsToShow(3);

      // Awards slider logic
      if (window.innerWidth < 640) setAwardItemsToShow(1);
      else if (window.innerWidth < 1024) setAwardItemsToShow(2);
      else setAwardItemsToShow(4);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const fetchData = async () => {
      const supabase = createClient();
      const [credRes, coachRes, awardRes, testiRes] = await Promise.all([
        supabase.from('credentials').select('*'),
        supabase.from('coaching').select('*').order('id'),
        supabase.from('awards').select('*').order('year', { ascending: false }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false })
      ]);

      if (credRes.data) setCredentials(credRes.data);
      if (coachRes.data) setCoaching(coachRes.data);
      if (awardRes.data) {
        setAwards(awardRes.data);
        setLatestAward(awardRes.data[0]);
      }
      if (testiRes.data) setTestimonials(testiRes.data);
    };
    fetchData();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextEdu = () => {
    if (credentials.length === 0) return;
    setCurrentEduIndex((prev) => (prev + 1 >= credentials.length ? 0 : prev + 1));
  };

  const prevEdu = () => {
    if (credentials.length === 0) return;
    setCurrentEduIndex((prev) => (prev - 1 < 0 ? credentials.length - 1 : prev - 1));
  };

  const nextCoach = () => {
    if (coaching.length <= coachItemsToShow) return;
    setCurrentCoachIndex((prev) => (prev + 1 > coaching.length - coachItemsToShow ? 0 : prev + 1));
  };

  const prevCoach = () => {
    if (coaching.length <= coachItemsToShow) return;
    setCurrentCoachIndex((prev) => (prev - 1 < 0 ? coaching.length - coachItemsToShow : prev - 1));
  };

  const nextAward = () => {
    if (awards.length <= awardItemsToShow) return;
    setCurrentAwardIndex((prev) => (prev + 1 > awards.length - awardItemsToShow ? 0 : prev + 1));
  };

  const prevAward = () => {
    if (awards.length <= awardItemsToShow) return;
    setCurrentAwardIndex((prev) => (prev - 1 < 0 ? awards.length - awardItemsToShow : prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitContactForm(new FormData(e.currentTarget));
    const btn = document.getElementById('submitBtn');
    if (result.success) {
      if (btn) { btn.textContent = 'Message Sent ✓'; (btn as any).style.background = '#27ae60'; }
      (e.target as any).reset();
    }
    setTimeout(() => { if (btn) { btn.textContent = 'Send Message'; (btn as any).style.background = ''; } setIsSubmitting(false); }, 3000);
  };

  return (
    <main>
      {/* HERO */}
      <section id="hero" style={{ position: 'relative', height: 'calc(100vh - 80px)', overflow: 'hidden', display: 'flex', alignItems: 'center', marginTop: '80px' }}>
        <img 
          src="/images/bossing5.jpg"
          alt="Anthony Leuterio"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 17, 21, 0.8) 20%, rgba(15, 17, 21, 0.2) 60%, rgba(15, 17, 21, 0.5) 100%)', zIndex: 2 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '60px' }}>
          <div style={{ maxWidth: '800px', flex: '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--brand-accent)', fontWeight: 600, letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '15px' }}>
              <span style={{ width: '40px', height: '1px', background: 'var(--brand-accent)' }}></span>
              <span style={{ color: '#FFFFFF' }}>THE PHILIPPINES&apos; #1 REAL ESTATE VISIONARY</span>
            </div>
            <h1 style={{ color: '#FFFFFF', textShadow: '0 10px 30px rgba(0,0,0,0.8)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', letterSpacing: '-0.02em', lineHeight: '1.0', fontWeight: 700, margin: '0 0 25px 0' }}>
              <span style={{ display: 'block' }}>DOMINATE THE</span>
              <span style={{ display: 'block', color: 'var(--brand-accent)' }}>REAL ESTATE</span>
              <span style={{ display: 'block' }}>MARKET</span>
            </h1>
            <p style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontSize: '1.15rem', lineHeight: '1.6', fontWeight: 300, margin: '0 0 35px 0', opacity: 0.9, maxWidth: '600px' }}>
              Anthony Leuterio is the driving force behind the country&apos;s most successful property ecosystems, empowering 15,000+ professionals to achieve elite-level results.
            </p>
            <div className="hero-ctas">
              <a href="#contact" className="btn-red" style={{ padding: '0.9rem 2.2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>HIRE ME</a>
            </div>
          </div>

          <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end' }}>
            <div className="hero-card" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderLeft: '4px solid var(--brand-accent)', padding: '1.8rem', width: '320px', borderRadius: '4px' }}>
              <div className="card-award" style={{ marginBottom: '1.2rem' }}>
                <span style={{ color: 'var(--brand-accent)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.15em' }}>🏆 PRESTIGE AWARD</span>
              </div>
              <div className="card-title" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#FFF', lineHeight: '1.3', fontFamily: 'Oswald' }}>
                {latestAward ? (
                  <>{latestAward.title.toUpperCase()} <br />
                    <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginTop: '10px', display: 'block', textTransform: 'none', fontFamily: 'var(--font-sans)' }}>
                      {latestAward.organization} · {latestAward.year}
                    </span>
                  </>
                ) : (
                  <>2024 INTERNATIONAL <br />REALTOR OF THE YEAR</>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={{padding:'60px 0', background: 'var(--bg)', color: 'var(--text-primary)'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div className="about-split" style={{display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'80px', alignItems:'center'}}>
            <ScrollReveal>
              <div style={{position:'relative'}}>
                <img src="/images/sirton1.102feaa7 (1).jpg" alt="Anthony Leuterio" style={{width:'100%', borderRadius:'24px', boxShadow:'20px 20px 0 var(--brand-accent)'}} />
                <div className="red-tag" style={{position:'absolute', bottom:'30px', right:'-20px', background:'var(--brand-accent)', color:'white', padding:'15px 30px', borderRadius:'8px', fontWeight:700, fontSize:'0.8rem', boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}}>Broker · Advisor · Leader</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <div className="section-eyebrow">THE VISIONARY</div>
              <h2 style={{fontSize:'clamp(3rem, 5vw, 4.5rem)', lineHeight:1, marginBottom:'30px', color: 'var(--text-primary)'}}>ANTHONY<br /><em style={{color:'var(--brand-accent)'}}>LEUTERIO</em></h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '40px', maxWidth: '750px' }}>
                <p style={{ marginBottom: '20px' }}>
                  Anthony Gerard Orais Leuterio has helped make real estate in the Philippines more popular and appealing to buyers. He uses creative ideas and social media to reach more people locally and globally.
                </p>
                <p style={{ marginBottom: '20px' }}>
                  He has received over 500 awards and is the first E-Pro Certified Broker in the Philippines, recognized by the National Association of Realtors.
                </p>
                <p>
                  He has inspired many people and helped improve the lives of real estate brokers and agents. Today, his business provides jobs for nearly 5,000 people across the country.
                </p>
              </div>
              <div style={{display:'flex', gap:'20px', marginTop:'20px'}}>
                {[
                  { val: '15K+', lbl: 'Professionals' },
                  { val: '20+', lbl: 'Cities' },
                  { val: '1K+', lbl: 'Awards' }
                ].map((s, i) => (
                  <div key={i} className="about-stat-card" style={{flex:1, background:'var(--surface)', padding:'25px', borderRadius:'20px', border:'1px solid var(--border)', textAlign:'center'}}>
                    <div style={{fontSize:'2.2rem', color:'var(--brand-accent)', fontWeight:700, fontFamily:'Oswald'}}>{s.val}</div>
                    <div style={{fontSize:'0.65rem', textTransform:'uppercase', color:'var(--text-secondary)', letterSpacing:'0.1em'}}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <EventsSection />

      {/* COACHING SECTION */}
      <section id="coaching" style={{background:'var(--bg)', padding:'60px 0'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
            <SectionHeader eyebrow="Elite Mentorship" title="EXECUTIVE <em style='color:var(--brand-accent)'>COACHING</em>" watermark="Coaching" />
            <div className="slider-controls" style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
              <button onClick={prevCoach} className="slider-arrow-btn" suppressHydrationWarning>←</button>
              <button onClick={nextCoach} className="slider-arrow-btn" suppressHydrationWarning>→</button>
            </div>
          </div>
          <div style={{ overflow: 'hidden', marginTop: '20px', paddingTop: '20px' }}>
            <div style={{ display: 'flex', transition: 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)', transform: `translateX(-${currentCoachIndex * (100 / coachItemsToShow)}%)` }}>
              {coaching.map((c) => (
                <div key={c.id} style={{ flex: `0 0 ${100 / coachItemsToShow}%`, padding: '0 15px', boxSizing: 'border-box' }}>
                  <ScrollReveal className="coaching-card-alt" style={{background:'var(--surface)', borderRadius:'24px', overflow:'hidden', border:'1px solid var(--border)', height: '100%'}}>
                    <div style={{height:'240px', position:'relative'}}>
                      <img src={getImgSrc(c.image_url)} alt={c.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      <div style={{position:'absolute', top:'20px', left:'20px', background:'var(--brand-accent)', color:'white', padding:'8px 16px', borderRadius:'4px', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase'}}>{c.badge_text}</div>
                    </div>
                    <div style={{padding:'30px'}}>
                      <h3 style={{fontSize:'1.6rem', marginBottom:'15px', fontFamily:'Oswald', color: 'var(--text-primary)'}}>{c.title}</h3>
                      <p style={{color:'var(--text-secondary)', fontSize:'0.95rem', lineHeight:1.7}}>{c.description}</p>
                    </div>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection testimonials={testimonials} />

      {/* EDUCATION SECTION */}
      <section id="education" style={{background:'var(--surface)', padding:'60px 0', position: 'relative', overflow: 'hidden'}}>
        <div style={{ position: 'absolute', top: '50%', right: '-5%', transform: 'translateY(-50%)', width: '500px', opacity: 0.03, pointerEvents: 'none' }}>
          <img src="/images/Harvard_University_coat_of_arms.svg.png" alt="Harvard" style={{ width: '100%' }} />
        </div>
        <div className="container" style={{maxWidth:'1400px', position: 'relative', zIndex: 1}}>
          <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
            <div style={{ flex: '0 0 400px' }}>
              <div className="section-eyebrow">Academic Foundation</div>
              <h2 style={{fontSize:'clamp(2.5rem, 5vw, 4rem)', lineHeight:1.1, marginBottom:'30px', color: 'var(--text-primary)'}}>ELITE <br /><em style={{color:'var(--brand-accent)'}}>EDUCATION</em></h2>
              <div className="slider-controls" style={{ display: 'flex', gap: '15px' }}>
                <button onClick={prevEdu} className="slider-arrow-btn" suppressHydrationWarning>←</button>
                <button onClick={nextEdu} className="slider-arrow-btn" suppressHydrationWarning>→</button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', marginTop: '20px', paddingTop: '20px' }}>
              <div style={{ display: 'flex', transition: 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1)', transform: `translateX(-${currentEduIndex * 100}%)` }}>
                {credentials.map((c) => (
                  <div key={c.id} style={{ minWidth: '100%' }}>
                    <div style={{ background: 'var(--bg)', padding: '60px', borderRadius: '40px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '50px' }}>
                      <div style={{ flex: '0 0 140px' }}>
                        <img src="/images/Harvard_University_coat_of_arms.svg.png" alt="Harvard" style={{ width: '100%', filter: 'grayscale(0.5) contrast(1.2)' }} />
                      </div>
                      <div>
                        <div style={{ color: 'var(--brand-accent)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '15px' }}>{c.category}</div>
                        <h3 style={{ fontSize: '2.4rem', fontFamily: 'Oswald', marginBottom: '15px', color: 'var(--text-primary)' }}>{c.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{c.institution}{c.organization ? ` · ${c.organization}` : ''}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AWARDS SECTION */}
      <section id="awards" style={{background:'var(--bg)', padding:'60px 0'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
            <SectionHeader eyebrow="Recognition" title="AWARDS & <em style='color:var(--brand-accent)'>ACCOLADES</em>" watermark="Awards" />
            <div className="slider-controls" style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
              <button onClick={prevAward} className="slider-arrow-btn" suppressHydrationWarning>←</button>
              <button onClick={nextAward} className="slider-arrow-btn" suppressHydrationWarning>→</button>
            </div>
          </div>
          <div style={{ overflow: 'hidden', marginTop: '20px', paddingTop: '20px' }}>
            <div style={{ display: 'flex', transition: 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)', transform: `translateX(-${currentAwardIndex * (100 / awardItemsToShow)}%)` }}>
              {awards.map((a, i) => (
                <div key={a.id} style={{ flex: `0 0 ${100 / awardItemsToShow}%`, padding: '0 15px', boxSizing: 'border-box' }}>
                  <ScrollReveal delay={i % awardItemsToShow} className="award-card-alt" style={{background:'var(--surface)', borderRadius:'24px', overflow:'hidden', border:'1px solid var(--border)', height: '100%'}}>
                    <div style={{height:'200px', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'40px'}}>
                      <img src={getImgSrc(a.icon) || '/images/2024InternationalRealtorOfTheYear.webp'} alt={a.title} style={{maxHeight:'100%', maxWidth:'100%', objectFit:'contain'}} onError={(e) => (e.target as any).src = '/images/2024InternationalRealtorOfTheYear.webp'} />
                    </div>
                    <div style={{padding:'30px', textAlign:'center'}}>
                      <div style={{fontFamily:'Oswald', color:'var(--brand-accent)', fontSize:'1.2rem', fontWeight:700, marginBottom:'10px'}}>{a.year}</div>
                      <h4 style={{fontSize:'1.1rem', color:'var(--text-primary)', marginBottom:'10px', fontFamily:'Oswald', lineHeight:1.3}}>{a.title}</h4>
                      <p style={{fontSize:'0.85rem', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em'}}>{a.organization}</p>
                    </div>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="news" style={{background:'var(--bg)', padding:'100px 0'}}>
        <NewsSection />
      </section>

      <MediaSection />

      {/* CONTACT SECTION */}
      <section id="contact" style={{background:'var(--bg)', padding:'60px 0 80px', display: 'block'}}>
        <div className="container" style={{maxWidth:'1400px', width: '100%'}}>
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <SectionHeader eyebrow="Get In Touch" title="LET&apos;S FIND YOUR <em style='color:var(--brand-accent)'>PERFECT</em> PROPERTY" watermark="Contact" align="center" />
          </div>
          <div style={{display:'flex', gap:'40px', width: '100%', flexWrap: 'wrap', marginTop: '40px'}}>
            <div style={{ flex: '1 1 450px' }}>
              <ScrollReveal style={{background: 'var(--surface)', padding: '60px', borderRadius: '40px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%'}}>
                <h3 style={{fontFamily: 'Oswald', fontSize: '2.2rem', marginBottom: '25px', color: 'var(--text-primary)'}}>CONNECT WITH THE <em style={{color: 'var(--brand-accent)'}}>BEST</em></h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: '50px', fontSize: '1.1rem', lineHeight: 1.7}}>Whether you are looking to invest, sell, or join our elite team of real estate professionals, I am here to guide you.</p>
                {[
                  { icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z', lbl: 'Phone', val: '+63 917 123 4567' },
                  { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6', lbl: 'Email', val: 'anthony@leuterioproperties.com' },
                  { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10 a3 3 0 1 1 0 -0.001', lbl: 'Office', val: 'Cebu City & BGC, Taguig, Philippines' }
                ].map((m, i) => (
                  <div key={i} style={{marginBottom: '35px', display: 'flex', gap: '25px', alignItems: 'center'}}>
                    <div style={{width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(210, 31, 23, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-accent)'}}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={m.icon.split(' ')[0]}></path>{m.icon.split(' ')[1] && <path d={m.icon.split(' ')[1]}></path>}</svg>
                    </div>
                    <div>
                      <div style={{fontSize: '0.8rem', color: 'var(--brand-accent)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em'}}>{m.lbl}</div>
                      <div style={{fontSize: '1.2rem', color: 'var(--text-primary)'}}>{m.val}</div>
                    </div>
                  </div>
                ))}
              </ScrollReveal>
            </div>
            <div style={{ flex: '1.2 1 550px' }}>
              <ScrollReveal delay={1}>
                <form onSubmit={handleSubmit} style={{background:'var(--surface)', padding:'60px', borderRadius:'40px', border: '1px solid var(--border)', height: '100%'}}>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'25px', marginBottom:'25px'}}>
                    <div className="form-group">
                      <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase'}}>First Name</label>
                      <input type="text" name="firstName" placeholder="John" required style={{width: '100%', background:'var(--bg)', border:'1px solid var(--border)', padding:'20px', borderRadius:'15px', color:'var(--text-primary)', outline: 'none'}} suppressHydrationWarning />
                    </div>
                    <div className="form-group">
                      <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase'}}>Last Name</label>
                      <input type="text" name="lastName" placeholder="Doe" required style={{width: '100%', background:'var(--bg)', border:'1px solid var(--border)', padding:'20px', borderRadius:'15px', color:'var(--text-primary)', outline: 'none'}} suppressHydrationWarning />
                    </div>
                  </div>
                  <div style={{marginBottom: '25px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase'}}>Email Address</label>
                    <input type="email" name="email" placeholder="john@example.com" required style={{width:'100%', background:'var(--bg)', border:'1px solid var(--border)', padding:'20px', borderRadius:'15px', color:'var(--text-primary)', outline: 'none'}} suppressHydrationWarning />
                  </div>
                  <div style={{marginBottom: '40px'}}>
                    <label style={{display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase'}}>Your Message</label>
                    <textarea name="message" placeholder="How can we help you?" style={{width:'100%', background:'var(--bg)', border:'1px solid var(--border)', padding:'20px', borderRadius:'15px', color:'var(--text-primary)', minHeight:'200px', outline: 'none'}} suppressHydrationWarning></textarea>
                  </div>
                  <button type="submit" id="submitBtn" className="btn-red" style={{width:'100%', border:'none', cursor:'pointer', padding: '22px', fontSize: '1.1rem', fontWeight: 700, borderRadius: '15px'}} suppressHydrationWarning>Send Your Inquiry</button>
                </form>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        .slider-arrow-btn { background: var(--surface); color: var(--text-primary); border: 1px solid var(--border); width: 60px; height: 60px; border-radius: 50%; cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s; flex-shrink: 0; }
        .slider-arrow-btn:hover { background: var(--brand-accent); border-color: var(--brand-accent); color: white; transform: scale(1.1); }
        
        .coaching-card-alt { transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }
        [data-theme="light"] .coaching-card-alt { box-shadow: 10px 10px 20px rgba(0,0,0,0.05); }
        .coaching-card-alt:hover { transform: translateY(-15px); border-color: var(--brand-accent) !important; box-shadow: none !important; }
        
        .award-card-alt { transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }
        [data-theme="light"] .award-card-alt { box-shadow: 10px 10px 20px rgba(0,0,0,0.05); }
        .award-card-alt:hover { transform: translateY(-15px); border-color: var(--brand-accent) !important; box-shadow: none !important; }

        .about-stat-card { transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; border: 1px solid var(--border) !important; }
        [data-theme="light"] .about-stat-card { box-shadow: 10px 10px 20px rgba(0,0,0,0.05); }

        .form-group input:focus, textarea:focus { border-color: var(--brand-accent) !important; }
        section { scroll-margin-top: 80px; }
        @media (max-width: 1024px) {
          .about-split { grid-template-columns: 1fr !important; gap: 40px; }
          .slider-arrow-btn { width: 44px; height: 44px; font-size: 1.2rem; }
        }
      `}</style>
    </main>
  );
}
