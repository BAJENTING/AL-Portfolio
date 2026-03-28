'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ScrollReveal from '@/components/ScrollReveal';

export default function About() {
  const [awards, setAwards] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const milestones = [
    { year: '2005', title: 'Started in Real Estate', desc: 'Began his career as a real estate salesperson in Cebu City, quickly rising through the ranks with his innovative marketing approach.' },
    { year: '2008', title: 'Founded Leuterio Realty & Brokerage', desc: 'Established his own real estate brokerage firm, which would grow into one of the fastest-growing brands in Philippine real estate.' },
    { year: '2012', title: 'Launched FilipinoHomes.com', desc: 'Pioneered online property listings in the Philippines, making real estate accessible to OFWs and Filipinos worldwide through digital innovation.' },
    { year: '2016', title: 'Founded Rent.ph', desc: 'Launched a dedicated nationwide rental property platform, serving renters, property managers, and real estate owners across the Philippines.' },
    { year: '2020', title: 'ASEAN Real Estate Expansion', desc: 'Expanded his influence across Southeast Asia, representing Philippine real estate at international summits and PropTech conferences.' },
    { year: '2023', title: 'Most Outstanding Real Estate Broker', desc: 'Recognized as the Most Outstanding Real Estate Broker of the Year at the Philippine Real Estate Awards — the pinnacle of a two-decade career.' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const [awardsRes, credentialsRes] = await Promise.all([
        supabase.from('awards').select('*').order('year', { ascending: false }),
        supabase.from('credentials').select('*')
      ]);

      if (awardsRes.data) setAwards(awardsRes.data);
      if (credentialsRes.data) setCredentials(credentialsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main>
      <div style={{ height: '60px', background: 'var(--black)' }}></div>
      <section id="about">
        <ScrollReveal className="about-photo">
          <img src="/images/sirton1.102feaa7 (1).jpg" alt="Anthony Leuterio" />
          <div className="photo-accent"></div>
          <div className="red-tag">Broker · Advisor · Leader</div>
        </ScrollReveal>

        <ScrollReveal delay={1} className="about-body">
          <div className="section-eyebrow">Who I Am</div>
          <span className="red-divider"></span>
        
          <div className="bio-grid">
            <div className="bio-block">
              <h3>The Visionary</h3>
              <p>As the founder of Leuterio Realty & Brokerage Group, Anthony redefined property marketing. His out-of-the-box strategies have reached a global spectrum of buyers by masterfully utilizing social media and online channels long before they became industry standards.</p>
            </div>
            
            <div className="bio-block">
              <h3>National Impact</h3>
              <p>What started in a small Cebu office has expanded to over 20 cities nationwide. Today, his &quot;brokerage empire&quot; provides livelihoods to nearly 15,000 people, empowering brokers and agents to change their lives through real estate excellence.</p>
            </div>

            <div className="bio-block">
              <h3>Digital Pioneer</h3>
              <p>Innovation is at his core. He established <strong>Rent.ph</strong>, the country&apos;s premier rental platform, and is the first <strong>E-pro Certified Broker</strong> in the Philippines, certified by the National Association of Realtors.</p>
            </div>
          </div>
          
          <div className="credentials">
            {credentials.length > 0 ? credentials.map((c, i) => (
              <div key={c.id || i} className="credential">
                <div className="cred-val">{c.value}</div>
                <div className="cred-lbl">{c.label}</div>
              </div>
            )) : (
              <>
                <div className="credential">
                  <div className="cred-val">1,000+</div>
                  <div className="cred-lbl">Awards & Accolades</div>
                </div>
                <div className="credential">
                  <div className="cred-val">15,000</div>
                  <div className="cred-lbl">People Employed</div>
                </div>
                <div className="credential">
                  <div className="cred-val">20+</div>
                  <div className="cred-lbl">Cities Nationwide</div>
                </div>
              </>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal className="about-journey">
          <div className="section-eyebrow">Journey</div>
          <h2>Career <em>Milestones</em></h2>
          
          <div className="milestones-grid">
            {milestones.map((m, i) => (
              <div key={i} className="milestone-card" data-year={m.year}>
                <div className="m-year">{m.year}</div>
                <div className="m-info">
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div id="awards" className="about-awards">
          <ScrollReveal>
            <div className="section-eyebrow">Recognition</div>
            <h2>Awards & <em>Accolades</em></h2>
          </ScrollReveal>
          
          <div className="awards-grid">
            {awards.length > 0 ? awards.map((a, i) => (
              <ScrollReveal key={a.id || i} delay={i % 3} className="award-item">
                <div className="award-img-wrapper">
                  {/* Use icon if it exists, otherwise organization logo or placeholder */}
                  <img src={a.icon || '/images/2024InternationalRealtorOfTheYear.webp'} alt={a.title} />
                </div>
                <div className="award-info">
                  <h3>{a.title}</h3>
                  <p>{a.organization} · {a.year}</p>
                </div>
              </ScrollReveal>
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                {loading ? 'Loading awards...' : 'No awards currently listed.'}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
