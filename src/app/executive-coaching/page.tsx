'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

interface CoachingProgram {
  id: string;
  title: string;
  badge_text: string;
  image_url: string;
  description: string;
}

export default function ExecutiveCoaching() {
  const [programs, setPrograms] = useState<CoachingProgram[]>([]);

  const localImages = [
    '/images/bossing1.jpg',
    '/images/bossing2.jpg',
    '/images/bossing3.jpg',
    '/images/bossing4.jpg',
    '/images/bossing5.jpg',
    '/images/bossing6.jpg',
    '/images/0.2694635063923617.jpg'
  ];

  useEffect(() => {
    const fetchPrograms = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('coaching').select('*');
      if (data) setPrograms(data);
    };
    fetchPrograms();
  }, []);

  return (
    <main className="coaching-page">
      <header 
        className="sub-hero" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.85), rgba(15, 15, 15, 0.85)), url('/images/0.2694635063923617.jpg')`,
          height: '70vh'
        }}
      >
        <ScrollReveal>
          <div className="section-eyebrow" style={{ color: 'var(--red)' }}>Elite Mentorship</div>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>Executive <em>Coaching</em></h1>
          <p className="hero-tagline" style={{ margin: '1.5rem auto', maxWidth: '700px' }}>
            Transforming real estate practitioners into industry titans through 1-on-1 strategic guidance and high-level ecosystem design.
          </p>
          <Link href="/#contact" className="btn-red">Request a Consultation</Link>
        </ScrollReveal>
      </header>

      <section className="programs-section">
        <div className="container">
          <ScrollReveal className="section-header center">
            <div className="section-eyebrow">COACHING TRACKS</div>
            <h2>DESIGNED FOR <em>DOMINANCE</em></h2>
          </ScrollReveal>

          <div className="programs-list">
            {programs.map((program, index) => (
              <ScrollReveal 
                key={program.id} 
                delay={index % 3}
                className={`program-row ${index % 2 === 1 ? 'reverse' : ''}`}
              >
                <div className="program-image-area">
                  <div className="program-image-container">
                    <img 
                      src={localImages[index % localImages.length] || program.image_url} 
                      alt={program.title} 
                      className="program-img"
                    />
                    <div className="program-badge">{program.badge_text}</div>
                  </div>
                </div>
                
                <div className="program-content-area">
                  <div className="program-num">0{index + 1}</div>
                  <h3>{program.title}</h3>
                  <div className="red-divider"></div>
                  <p>{program.description}</p>
                  <Link href="/#contact" className="program-cta">
                    Inquire for Details ➜
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

