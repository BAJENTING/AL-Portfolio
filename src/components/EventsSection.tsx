'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import ScrollReveal from './ScrollReveal';
import SectionHeader from './SectionHeader';

interface Event {
  id: string | number;
  title: string;
  description: string;
  event_date: string;
  image_url: string | null;
  created_at: string;
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const getImgSrc = (src: string | null | undefined) => {
    if (!src) return '/images/bossing1.jpg'; // Fallback
    let cleanSrc = src.replace(/^\/?components\//, '').replace(/^\/?images\//, '');
    return (cleanSrc.startsWith('http') || cleanSrc.startsWith('/')) ? cleanSrc : `/images/${cleanSrc}`;
  };

  useEffect(() => {
    setMounted(true);
    const fetchEvents = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const nextSlide = () => {
    if (events.length <= 2) return;
    setCurrentIndex((prev) => (prev + 1 >= events.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (events.length <= 2) return;
    setCurrentIndex((prev) => (prev - 1 < 0 ? events.length - 2 : prev - 1));
  };

  if (loading) {
    return (
      <section id="events" style={{ padding: '60px 0 80px', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          <div className="section-eyebrow">Global Reach</div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-primary)' }}>UPCOMING EVENTS</h2>
          <div style={{ display: 'flex', gap: '30px', marginTop: '40px' }}>
            <div className="skeleton" style={{ flex: 1, height: '300px', background: 'var(--surface)', borderRadius: '32px' }}></div>
            <div className="skeleton" style={{ flex: 1, height: '300px', background: 'var(--surface)', borderRadius: '32px' }}></div>
          </div>
        </div>
      </section>
    );
  }

  // Calculate items to show based on window width, but only after mounting
  const itemsToShow = !mounted ? 2 : (window.innerWidth < 1024 ? 1 : 2);

  return (
    <section id="events" style={{ padding: '60px 0', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '-5%', left: '5%', fontFamily: 'Oswald', fontSize: '15vw', color: 'var(--text-primary)', opacity: 0.02, fontWeight: 900, pointerEvents: 'none', textTransform: 'uppercase' }}>SUMMITS</div>

      <div className="container" style={{ maxWidth: '1400px' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <SectionHeader 
              eyebrow="Global Reach"
              title="UPCOMING <em style='color:var(--brand-accent)'>SUMMITS & EVENTS</em>"
              watermark="Summits"
            />
          </div>

          <div className="slider-controls" style={{ display: 'flex', gap: '15px', marginBottom: '60px' }}>
            <button onClick={prevSlide} className="slider-arrow-btn" aria-label="Previous event">←</button>
            <button onClick={nextSlide} className="slider-arrow-btn" aria-label="Next event">→</button>
          </div>
        </div>

        <div className="events-slider-container" style={{ overflow: 'hidden', marginTop: '20px', paddingTop: '20px' }}>
          <div 
            className="events-slider-track" 
            style={{ 
              display: 'flex', 
              transition: 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)',
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              gap: '0'
            }}
          >
            {events.map((event) => (
              <div 
                key={event.id} 
                className="event-slide-item" 
                style={{ 
                  flex: '0 0 50%', 
                  padding: '0 15px',
                  boxSizing: 'border-box'
                }}
              >
                <div className="event-card-luxury" style={{ 
                  background: 'var(--surface)', 
                  borderRadius: '32px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border)', 
                  display: 'flex', 
                  minHeight: '320px',
                  height: '100%',
                  transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease'
                }}>
                  <div style={{ flex: '0 0 40%', position: 'relative' }}>
                    <img 
                      src={getImgSrc(event.image_url)} 
                      alt={event.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: 'var(--brand-accent)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {event.event_date.split('|')[0]}
                    </div>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', fontFamily: 'Oswald', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {event.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span>{event.event_date.split('|')[1] || 'TBA'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        [data-theme="light"] .event-card-luxury {
          box-shadow: 10px 10px 20px rgba(0,0,0,0.05);
        }
        @media (max-width: 1024px) {
          .event-slide-item {
            flex: 0 0 100% !important;
          }
        }
        @media (max-width: 768px) {
          .event-card-luxury {
            flex-direction: column !important;
          }
          .event-card-luxury > div:first-child {
            flex: 0 0 200px !important;
          }
        }
      `}</style>
    </section>
  );
}
