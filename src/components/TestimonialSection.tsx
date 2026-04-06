'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';
import SectionHeader from './SectionHeader';

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_image_url: string | null;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

const TestimonialSection = ({ testimonials }: TestimonialSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getImgSrc = (src: string | null | undefined) => {
    if (!src) return '/images/bossing1.jpg'; // Fallback
    let cleanSrc = src.replace(/^\/?components\//, '').replace(/^\/?images\//, '');
    return (cleanSrc.startsWith('http') || cleanSrc.startsWith('/')) ? cleanSrc : `/images/${cleanSrc}`;
  };

  const nextSlide = () => {
    if (testimonials.length <= itemsToShow) return;
    setCurrentIndex((prev) => (prev + 1 > testimonials.length - itemsToShow ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (testimonials.length <= itemsToShow) return;
    setCurrentIndex((prev) => (prev - 1 < 0 ? testimonials.length - itemsToShow : prev - 1));
  };

  return (
    <section id="testimonials" style={{ background: 'var(--bg)', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div style={{ flex: 1 }}>
            <SectionHeader 
              eyebrow="Success Stories"
              title="VOICES OF <em style='color:var(--brand-accent)'>EXCELLENCE</em>"
              watermark="Results"
            />
          </div>
          
          <div className="slider-controls" style={{ display: 'flex', gap: '15px', marginBottom: '60px' }}>
            <button onClick={prevSlide} className="slider-arrow-btn" suppressHydrationWarning>←</button>
            <button onClick={nextSlide} className="slider-arrow-btn" suppressHydrationWarning>→</button>
          </div>
        </div>
        
        <div className="testi-slider-container" style={{ overflow: 'hidden', marginTop: '20px', paddingTop: '20px' }}>
          <div 
            className="testi-slider-track" 
            style={{ 
              display: 'flex', 
              transition: 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)',
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              gap: '0'
            }}
          >
            {testimonials.map((t) => (
              <div 
                key={t.id} 
                style={{ 
                  flex: `0 0 ${100 / itemsToShow}%`, 
                  padding: '0 15px',
                  boxSizing: 'border-box'
                }}
              >
                <div className="testi-card" style={{ height: '100%', margin: 0 }}>
                  <div className="testi-stars">★★★★★</div>
                  <div className="quote-mark">“</div>
                  <p className="testi-text" style={{ fontSize: '0.95rem' }}>{t.quote}</p>
                  <div className="testi-author">
                    <div className="testi-avatar" style={{ overflow: 'hidden' }}>
                      <img 
                        src={getImgSrc(t.author_image_url)} 
                        alt={t.author_name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => (e.target as any).src = '/images/bossing1.jpg'}
                      />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--text-primary)', marginBottom: '5px', fontFamily: 'Oswald' }}>{t.author_name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{t.author_role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .testi-card {
          transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 0.4s ease, box-shadow 0.4s ease;
        }
        [data-theme="light"] .testi-card {
          box-shadow: 10px 10px 20px rgba(0,0,0,0.05);
        }
        .testi-card:hover {
          transform: translateY(-15px);
          border-color: var(--brand-accent);
          box-shadow: none !important;
        }
        @media (max-width: 1024px) {
          .testi-slider-track > div {
            flex: 0 0 50% !important;
          }
        }
        @media (max-width: 768px) {
          .testi-slider-track > div {
            flex: 0 0 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;
