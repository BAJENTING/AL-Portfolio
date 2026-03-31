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

interface Developer {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

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

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [coaching, setCoaching] = useState<Coaching[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [latestAward, setLatestAward] = useState<Award | null>(null);
  
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [currentEduIndex, setCurrentEduIndex] = useState(1);
  const [isEduTransitioning, setIsEduTransitioning] = useState(true);

  const clonedCompanies = companies.length > 0 ? [companies[companies.length - 1], ...companies, companies[0]] : [];
  const clonedCredentials = credentials.length > 0 ? [credentials[credentials.length - 1], ...credentials, credentials[0]] : [];

  const getImgSrc = (src: string | null | undefined) => {
    if (!src) return '';
    let cleanSrc = src.replace(/^\/?components\//, '').replace(/^\/?images\//, '');
    return (cleanSrc.startsWith('http') || cleanSrc.startsWith('/')) ? cleanSrc : `/images/${cleanSrc}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [credRes, compRes, devRes, coachRes, awardRes] = await Promise.all([
        supabase.from('credentials').select('*'),
        supabase.from('companies').select('*'),
        supabase.from('developers').select('*'),
        supabase.from('coaching').select('*').order('id'),
        supabase.from('awards').select('*').order('year', { ascending: false })
      ]);

      if (credRes.data) setCredentials(credRes.data);
      if (compRes.data) setCompanies(compRes.data);
      if (devRes.data) setDevelopers(devRes.data);
      if (coachRes.data) setCoaching(coachRes.data);
      if (awardRes.data) {
        setAwards(awardRes.data);
        setLatestAward(awardRes.data[0]);
      }
    };
    fetchData();
  }, []);

  // Slider Logic for Companies
  const handleCompanyTransitionEnd = () => {
    if (currentCompanyIndex === 0) {
      setIsTransitioning(false);
      setCurrentCompanyIndex(clonedCompanies.length - 2);
    } else if (currentCompanyIndex === clonedCompanies.length - 1) {
      setIsTransitioning(false);
      setCurrentCompanyIndex(1);
    }
  };

  const nextCompany = () => {
    if (clonedCompanies.length <= 1) return;
    setIsTransitioning(true);
    setCurrentCompanyIndex(prev => prev + 1);
  };

  const prevCompany = () => {
    if (clonedCompanies.length <= 1) return;
    setIsTransitioning(true);
    setCurrentCompanyIndex(prev => prev - 1);
  };

  // Slider Logic for Education
  const handleEduTransitionEnd = () => {
    if (currentEduIndex === 0) {
      setIsEduTransitioning(false);
      setCurrentEduIndex(clonedCredentials.length - 2);
    } else if (currentEduIndex === clonedCredentials.length - 1) {
      setIsEduTransitioning(false);
      setCurrentEduIndex(1);
    }
  };

  const nextEdu = () => {
    if (clonedCredentials.length <= 1) return;
    setIsEduTransitioning(true);
    setCurrentEduIndex(prev => prev + 1);
  };

  const prevEdu = () => {
    if (clonedCredentials.length <= 1) return;
    setIsEduTransitioning(true);
    setCurrentEduIndex(prev => prev - 1);
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

  const milestones = [
    { year: '2005', title: 'Real Estate Start', desc: 'Began as a salesperson in Cebu City, establishing a foundation for excellence.' },
    { year: '2008', title: 'Founded Leuterio Realty', desc: 'Launched his own brokerage firm, now a nationwide leader in the Philippines.' },
    { year: '2012', title: 'Launched FilipinoHomes', desc: 'Pioneered digital property listings, connecting OFWs to premium local real estate.' },
    { year: '2016', title: 'Founded Rent.ph', desc: 'Built the nation\'s premier rental ecosystem for property owners and tenants.' },
    { year: '2023', title: 'Broker of the Year', desc: 'Awarded the highest industry honor for decades of visionary market leadership.' },
  ];

  return (
    <main>
      {/* HERO */}
      <section id="hero">
        <div className="hero-right">
          <video className="hero-img" autoPlay loop muted playsInline>
            <source src="/images/hero_vid.mp4" type="video/mp4" />
          </video>
          <div className="hero-card">
            <div className="card-award">
              <span>🏆 Award</span>
              <a href="#awards" className="award-link"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg></a>
            </div>
            <div className="card-title">
              {latestAward ? <>{latestAward.title} <br /><span style={{fontSize:'0.7rem', fontWeight:300}}>{latestAward.organization} · {latestAward.year}</span></> : <>2024 International <br />Realtor of the Year</>}
            </div>
          </div>
        </div>
        <div className="hero-left">
          <div className="hero-eyebrow"><span></span>THE PHILIPPINES&apos; #1 REAL ESTATE VISIONARY</div>
          <h1><span className="name-line">DOMINATE THE</span><span className="name-line" style={{color:'var(--red)'}}>REAL ESTATE</span><span className="name-line">MARKET</span></h1>
          <p className="hero-tagline">Anthony Leuterio is the driving force behind the country&apos;s most successful property ecosystems, empowering 15,000+ professionals to achieve elite-level results.</p>
          <div className="hero-ctas"><a href="#contact" className="btn-red">Hire Me</a></div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={{padding:'80px 0 40px'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div className="about-split" style={{display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'80px', alignItems:'center'}}>
            <ScrollReveal className="about-photo-wrap">
              <div style={{position:'relative'}}>
                <img src="/images/sirton1.102feaa7 (1).jpg" alt="Anthony Leuterio" style={{width:'100%', borderRadius:'24px', boxShadow:'20px 20px 0 var(--red)'}} />
                <div className="red-tag" style={{position:'absolute', bottom:'30px', right:'-20px', background:'var(--red)', color:'white', padding:'15px 30px', borderRadius:'8px', fontWeight:700, fontSize:'0.8rem', boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}}>Broker · Advisor · Leader</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1} className="about-content">
              <div className="section-eyebrow">THE VISIONARY</div>
              <h2 style={{fontSize:'clamp(3rem, 5vw, 4.5rem)', lineHeight:1, marginBottom:'40px'}}>ANTHONY<br /><em style={{color:'var(--red)'}}>LEUTERIO</em></h2>
              <p style={{fontSize:'1.3rem', color:'var(--text-mid)', lineHeight:1.8, marginBottom:'40px'}}>As the founder of Leuterio Realty & Brokerage Group, Anthony redefined property marketing through digital innovation long before it became an industry standard.</p>
              
              <div className="stats-row" style={{display:'flex', gap:'20px', marginTop:'50px'}}>
                <div className="stat-item" style={{flex:1, background:'#1A1A1A', padding:'25px', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.05)', textAlign:'center'}}>
                  <div style={{fontSize:'2.2rem', color:'var(--red)', fontWeight:700, fontFamily:'Oswald'}}>15K+</div>
                  <div style={{fontSize:'0.65rem', textTransform:'uppercase', color:'var(--text-dim)', letterSpacing:'0.1em'}}>Professionals</div>
                </div>
                <div className="stat-item" style={{flex:1, background:'#1A1A1A', padding:'25px', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.05)', textAlign:'center'}}>
                  <div style={{fontSize:'2.2rem', color:'var(--red)', fontWeight:700, fontFamily:'Oswald'}}>20+</div>
                  <div style={{fontSize:'0.65rem', textTransform:'uppercase', color:'var(--text-dim)', letterSpacing:'0.1em'}}>Cities</div>
                </div>
                <div className="stat-item" style={{flex:1, background:'#1A1A1A', padding:'25px', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.05)', textAlign:'center'}}>
                  <div style={{fontSize:'2.2rem', color:'var(--red)', fontWeight:700, fontFamily:'Oswald'}}>1K+</div>
                  <div style={{fontSize:'0.65rem', textTransform:'uppercase', color:'var(--text-dim)', letterSpacing:'0.1em'}}>Awards</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* JOURNEY SECTION */}
      <section id="journey" style={{padding:'40px 0 60px', background:'var(--black)', position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', bottom:'-5%', left:'5%', fontFamily:'Oswald', fontSize:'15vw', color:'rgba(255,255,255,0.02)', fontWeight:900, pointerEvents:'none', textTransform:'uppercase'}}>EVOLUTION</div>

        <div className="container" style={{maxWidth:'1400px'}}>
          <div style={{marginBottom:'60px', display:'flex', flexDirection:'column', alignItems:'flex-start', textAlign:'left'}}>
            <ScrollReveal className="news-header">
              <div className="section-eyebrow">Professional Track</div>
              <h2 style={{fontSize:'clamp(2.5rem, 5vw, 4rem)', lineHeight:1.1}}>CAREER <em>MILESTONES</em></h2>
            </ScrollReveal>
          </div>

          <div className="pipeline-wrapper" style={{position:'relative', padding:'40px 0'}}>
            <div className="pipeline-main-line" style={{
              position:'absolute', 
              top:'72px', 
              left:'0', 
              width:'100%', 
              height:'2px', 
              background:'linear-gradient(90deg, transparent, rgba(210,31,23,0.4) 15%, rgba(210,31,23,0.4) 85%, transparent)',
              zIndex:1
            }}></div>
            
            <div className="pipeline-items-row" style={{display:'flex', justifyContent:'space-between', gap:'30px', position:'relative', zIndex:2}}>
              {milestones.map((m, i) => (
                <ScrollReveal key={m.year} delay={i * 0.2} className="pipeline-milestone" style={{flex:1}}>
                  <div className="m-card-wrap" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <div className="m-node" style={{width:'24px', height:'24px', background:'var(--red)', borderRadius:'50%', position:'relative', marginBottom:'50px', boxShadow:'0 0 25px rgba(210,31,23,0.6)', border:'4px solid var(--black)'}}>
                      <div className="m-pulse" style={{position:'absolute', inset:'-12px', border:'1px solid var(--red)', borderRadius:'50%', opacity:0.4}}></div>
                    </div>
                    
                    <div className="m-content-card" style={{
                      background:'rgba(26, 26, 26, 0.8)', 
                      backdropFilter:'blur(10px)',
                      padding:'35px 25px', 
                      borderRadius:'24px', 
                      border:'1px solid rgba(255,255,255,0.05)', 
                      position:'relative', 
                      width:'100%', 
                      transition:'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                      boxShadow:'0 15px 35px rgba(0,0,0,0.2)'
                    }}>
                      <div style={{position:'absolute', top:'-10px', right:'20px', fontFamily:'Oswald', fontSize:'3.5rem', color:'rgba(210,31,23,0.07)', fontWeight:900, pointerEvents:'none', zIndex:0}}>{m.year}</div>
                      
                      <div style={{position:'relative', zIndex:1}}>
                        <div style={{fontFamily:'Oswald', color:'var(--red)', fontSize:'1.8rem', fontWeight:700, marginBottom:'12px', letterSpacing:'0.02em'}}>{m.year}</div>
                        <h4 style={{fontSize:'1.05rem', color:'white', marginBottom:'15px', textTransform:'uppercase', fontFamily:'Oswald', letterSpacing:'0.05em', lineHeight:1.3}}>{m.title}</h4>
                        <p style={{fontSize:'0.88rem', color:'var(--text-dim)', lineHeight:1.7, fontWeight:300}}>{m.desc}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COACHING SECTION */}
      <section id="coaching" style={{background:'#0F0F0F', padding:'60px 0 80px'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div style={{marginBottom:'60px', display:'flex', flexDirection:'column', alignItems:'flex-start', textAlign:'left'}}>
            <ScrollReveal className="news-header">
              <div className="section-eyebrow">Elite Mentorship</div>
              <h2 style={{fontSize:'clamp(2.5rem, 5vw, 4rem)', lineHeight:1.1}}>EXECUTIVE <em>COACHING</em></h2>
            </ScrollReveal>
          </div>
          
          <div className="coaching-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:'40px'}}>
            {coaching.map((c, i) => (
              <ScrollReveal key={c.id} delay={i % 3} className="coaching-card-alt" style={{background:'#1A1A1A', borderRadius:'24px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.05)', transition:'all 0.4s ease'}}>
                <div style={{height:'250px', position:'relative'}}>
                  <img src={getImgSrc(c.image_url)} alt={c.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  <div style={{position:'absolute', top:'20px', left:'20px', background:'var(--red)', color:'white', padding:'8px 16px', borderRadius:'4px', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase'}}>{c.badge_text}</div>
                </div>
                <div style={{padding:'40px'}}>
                  <h3 style={{fontSize:'1.8rem', marginBottom:'20px', fontFamily:'Oswald'}}>{c.title}</h3>
                  <div style={{width:'40px', height:'3px', background:'var(--red)', marginBottom:'20px'}}></div>
                  <p style={{color:'var(--text-mid)', fontSize:'1rem', lineHeight:1.8}}>{c.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANIES SECTION */}
      <section id="companies" style={{background:'#0F0F0F', padding:'60px 0'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div style={{marginBottom:'60px', display:'flex', flexDirection:'column', alignItems:'flex-start', textAlign:'left'}}>
            <ScrollReveal className="news-header">
              <div className="section-eyebrow">The Leuterio Group</div>
              <h2 style={{fontSize:'clamp(2.5rem, 5vw, 4rem)', lineHeight:1.1}}>PROPERTY <em>ECOSYSTEMS</em></h2>
            </ScrollReveal>
          </div>
          
          <div className="slider-layout-main" style={{display:'flex', alignItems:'center', gap:'40px', marginTop:'40px'}}>
            <button onClick={prevCompany} className="slider-arrow-btn" suppressHydrationWarning>←</button>
            
            <div className="companies-slider-wrapper" style={{overflow:'hidden', flex:1}}>
              <div className="companies-slider" style={{display:'flex', transform: `translateX(-${currentCompanyIndex * 100}%)`, transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1)' : 'none'}} onTransitionEnd={handleCompanyTransitionEnd}>
                {clonedCompanies.map((company, index) => (
                  <div key={`${company.id}-${index}`} style={{minWidth:'100%', padding:'0 10px'}}>
                    <div className="company-card-new" style={{display:'grid', gridTemplateColumns:'1fr 1.5fr', background:'#1A1A1A', borderRadius:'32px', overflow:'hidden', minHeight:'400px', border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{background:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:'60px'}}>
                        <img src={getImgSrc(company.logo_url)} alt={company.name} style={{width:'100%', maxHeight:'180px', objectFit:'contain'}} />
                      </div>
                      <div style={{padding:'60px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <h3 style={{fontSize:'2.5rem', marginBottom:'20px', fontFamily:'Oswald'}}>{company.name}</h3>
                        <p style={{color:'var(--text-mid)', fontSize:'1.1rem', lineHeight:1.8, marginBottom:'40px'}}>{company.description}</p>
                        <a href={company.website_url || '#'} className="btn-red" target="_blank" style={{alignSelf:'flex-start'}}>Visit Website</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={nextCompany} className="slider-arrow-btn" suppressHydrationWarning>→</button>
          </div>
        </div>
      </section>

      {/* DEVELOPERS SECTION */}
      <section id="developers" style={{background:'#0F0F0F', padding:'60px 0'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div style={{marginBottom:'60px', display:'flex', flexDirection:'column', alignItems:'flex-start', textAlign:'left'}}>
            <ScrollReveal className="news-header">
              <div className="section-eyebrow">Partnerships</div>
              <h2 style={{fontSize:'clamp(2.5rem, 5vw, 4rem)', lineHeight:1.1}}>TRUSTED <em>DEVELOPERS</em></h2>
            </ScrollReveal>
          </div>
          <div className="dev-cards-grid" style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'30px', marginTop:'40px'}}>
            {developers.map((dev, i) => (
              <ScrollReveal key={dev.id} delay={i * 0.1} className="dev-card-simple" style={{background:'#1E1E1E', padding:'50px 30px', borderRadius:'24px', textAlign:'center', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
                <div style={{height:'90px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'30px'}}>
                  <img src={getImgSrc(dev.logo_url)} alt={dev.name} style={{maxHeight:'100%', maxWidth:'100%', objectFit:'contain'}} onError={(e) => (e.target as any).src = 'https://placehold.co/200x100?text=Developer'} />
                </div>
                <h4 style={{fontFamily:'Oswald', fontSize:'1.1rem', textTransform:'uppercase', color:'white', letterSpacing:'0.05em'}}>{dev.name}</h4>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section id="education" style={{background:'#0F0F0F', padding:'60px 0'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div style={{marginBottom:'60px', display:'flex', flexDirection:'column', alignItems:'flex-start', textAlign:'left'}}>
            <ScrollReveal className="news-header">
              <div className="section-eyebrow">Professional Status</div>
              <h2 style={{fontSize:'clamp(2.5rem, 5vw, 4rem)', lineHeight:1.1}}>LICENSES & <em>CREDENTIALS</em></h2>
            </ScrollReveal>
          </div>
          
          <div className="slider-layout-main" style={{display:'flex', alignItems:'center', gap:'40px', marginTop:'40px'}}>
            <button onClick={prevEdu} className="slider-arrow-btn" suppressHydrationWarning>←</button>
            
            <div className="edu-slider-wrapper" style={{overflow:'hidden', flex:1}}>
              <div className="edu-slider" style={{display:'flex', transform: `translateX(-${currentEduIndex * 100}%)`, transition: isEduTransitioning ? 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1)' : 'none'}} onTransitionEnd={handleEduTransitionEnd}>
                {clonedCredentials.map((c, index) => {
                  let displayNum = index;
                  if (index === 0) displayNum = credentials.length;
                  else if (index > credentials.length) displayNum = 1;
                  const formattedNum = displayNum < 10 ? `0${displayNum}` : displayNum;

                  return (
                    <div key={`${c.id}-${index}`} style={{minWidth:'100%', padding:'0 10px'}}>
                      <div className="company-card-new" style={{display:'grid', gridTemplateColumns:'1fr 1.5fr', background:'#1A1A1A', borderRadius:'32px', overflow:'hidden', minHeight:'350px', border:'1px solid rgba(255,255,255,0.05)'}}>
                        <div style={{background:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:'60px'}}>
                          <div style={{fontSize:'4rem', color:'var(--red)', fontFamily:'Oswald', fontWeight:900}}>{formattedNum}</div>
                        </div>
                        <div style={{padding:'60px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                          <div className="news-badge" style={{marginBottom:'15px'}}>{c.category}</div>
                          <h3 style={{fontSize:'2.2rem', marginBottom:'20px', fontFamily:'Oswald'}}>{c.title}</h3>
                          <p style={{color:'var(--text-mid)', fontSize:'1.1rem', lineHeight:1.8}}>{c.institution}{c.organization ? ` · ${c.organization}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={nextEdu} className="slider-arrow-btn" suppressHydrationWarning>→</button>
          </div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section id="news" style={{background:'#0F0F0F', padding:'60px 0'}}>
        <NewsSection />
      </section>

      {/* AWARDS SECTION */}
      <section id="awards" style={{background:'#0F0F0F', padding:'60px 0'}}>
        <div className="container" style={{maxWidth:'1400px'}}>
          <div style={{marginBottom:'80px', display:'flex', flexDirection:'column', alignItems:'flex-start', textAlign:'left'}}>
            <ScrollReveal className="news-header">
              <div className="section-eyebrow">Recognition</div>
              <h2 style={{fontSize:'clamp(2.5rem, 5vw, 4rem)', lineHeight:1.1}}>AWARDS & <em>ACCOLADES</em></h2>
            </ScrollReveal>
          </div>
          <div className="awards-cards-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'30px', marginTop:'40px'}}>
            {awards.map((a, i) => (
              <ScrollReveal key={a.id} delay={i % 3} className="award-card-alt" style={{background:'#1A1A1A', borderRadius:'24px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.03)'}}>
                <div style={{height:'200px', display:'flex', alignItems:'center', justifyContent:'center', background:'#222', padding:'40px'}}>
                  <img src={getImgSrc(a.icon) || '/images/2024InternationalRealtorOfTheYear.webp'} alt={a.title} style={{maxHeight:'100%', maxWidth:'100%', objectFit:'contain'}} onError={(e) => (e.target as any).src = '/images/2024InternationalRealtorOfTheYear.webp'} />
                </div>
                <div style={{padding:'30px', textAlign:'center'}}>
                  <div style={{fontFamily:'Oswald', color:'var(--red)', fontSize:'1.2rem', fontWeight:700, marginBottom:'10px'}}>{a.year}</div>
                  <h4 style={{fontSize:'1.1rem', color:'white', marginBottom:'10px', fontFamily:'Oswald', lineHeight:1.3}}>{a.title}</h4>
                  <p style={{fontSize:'0.85rem', color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.05em'}}>{a.organization}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" style={{background:'#0F0F0F', padding:'60px 0 100px'}}>
        <div className="container" style={{maxWidth:'1200px'}}>
          <div className="contact-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px'}}>
            <ScrollReveal>
              <div className="section-eyebrow">Get In Touch</div>
              <h2 style={{fontSize:'3.5rem', marginBottom:'30px'}}>LET&apos;S FIND YOUR <em>PERFECT</em> PROPERTY</h2>
              <div className="contact-info" style={{marginTop:'40px'}}>
                <div style={{marginBottom:'30px'}}>
                  <label style={{display:'block', fontSize:'0.8rem', color:'var(--red)', textTransform:'uppercase', marginBottom:'10px'}}>Email Address</label>
                  <div style={{fontSize:'1.2rem'}}>anthony@leuterioproperties.com</div>
                </div>
                <div style={{marginBottom:'30px'}}>
                  <label style={{display:'block', fontSize:'0.8rem', color:'var(--red)', textTransform:'uppercase', marginBottom:'10px'}}>Office Location</label>
                  <div style={{fontSize:'1.2rem'}}>Cebu City & BGC, Taguig, Philippines</div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <form className="contact-form" onSubmit={handleSubmit} style={{background:'#1A1A1A', padding:'40px', borderRadius:'30px'}}>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px'}}>
                  <input type="text" name="firstName" placeholder="First Name" required style={{background:'#0F0F0F', border:'1px solid rgba(255,255,255,0.1)', padding:'15px', borderRadius:'10px', color:'white'}} suppressHydrationWarning />
                  <input type="text" name="lastName" placeholder="Last Name" required style={{background:'#0F0F0F', border:'1px solid rgba(255,255,255,0.1)', padding:'15px', borderRadius:'10px', color:'white'}} suppressHydrationWarning />
                </div>
                <input type="email" name="email" placeholder="Email Address" required style={{width:'100%', background:'#0F0F0F', border:'1px solid rgba(255,255,255,0.1)', padding:'15px', borderRadius:'10px', color:'white', marginBottom:'20px'}} suppressHydrationWarning />
                <textarea name="message" placeholder="Your Message" style={{width:'100%', background:'#0F0F0F', border:'1px solid rgba(255,255,255,0.1)', padding:'15px', borderRadius:'10px', color:'white', marginBottom:'20px', minHeight:'150px'}} suppressHydrationWarning></textarea>
                <button type="submit" id="submitBtn" className="btn-red" style={{width:'100%', border:'none', cursor:'pointer'}} suppressHydrationWarning>Send Message</button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      <style>{`
        .slider-arrow-btn {
          background: #1A1A1A;
          color: white;
          border: 1px solid rgba(255,255,255,0.1);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .slider-arrow-btn:hover {
          background: var(--red);
          border-color: var(--red);
          transform: scale(1.1);
        }
        .coaching-card-alt:hover, .award-card-alt:hover {
          transform: translateY(-15px);
          border-color: var(--red) !important;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .dev-card-simple:hover {
          transform: translateY(-10px);
          background: #222 !important;
          border-color: var(--red) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .dev-card-simple img {
          transition: all 0.4s ease;
        }
        
        @keyframes mPulse {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        .m-pulse {
          animation: mPulse 2s infinite ease-in-out;
        }
        
        .m-content-card:hover {
          transform: translateY(-15px);
          border-color: var(--red) !important;
          background: #222 !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        section { scroll-margin-top: 80px; }
        
        @media (max-width: 1200px) {
          .pipeline-items-row { flex-direction: column !important; gap: 60px !important; }
          .pipeline-main-line { 
            width: 2px !important; 
            height: calc(100% - 100px) !important; 
            left: 12px !important; 
            top: 52px !important; 
            background: linear-gradient(180deg, rgba(210,31,23,0.4) 0%, rgba(210,31,23,0.4) 100%) !important;
          }
          .m-card-wrap { flex-direction: row !important; gap: 30px; text-align: left; }
          .m-node { margin-bottom: 0 !important; flex-shrink: 0; }
          .m-content-card { padding: 30px !important; }
          .dev-cards-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 900px) {
          .about-split, .contact-grid { grid-template-columns: 1fr !important; gap: 40px; }
          .company-card-new { grid-template-columns: 1fr !important; }
          .company-card-new div:first-child { padding: 40px !important; }
          .company-card-new div:last-child { padding: 40px !important; }
          .slider-layout-main { gap: 15px; }
          .slider-arrow-btn { width: 44px; height: 44px; font-size: 1.2rem; }
          .dev-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
