'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ScrollReveal from './ScrollReveal';
import SectionHeader from './SectionHeader';

interface MediaItem {
  id: string | number;
  title: string;
  image_url: string;
  description?: string;
}

export default function MediaSection() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getImgSrc = (src: string | null | undefined) => {
    if (!src) return '';
    const cleanSrc = src.replace(/^\/?components\//, '').replace(/^\/?images\//, '');
    return (cleanSrc.startsWith('http') || cleanSrc.startsWith('/')) ? cleanSrc : `/images/${cleanSrc}`;
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('media')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          console.error('Error fetching media:', error);
          setMedia([]);
        } else {
          setMedia(data || []);
        }
      } catch (err: unknown) {
        console.error('Media Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) {
    return (
      <section id="media" style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          <SectionHeader eyebrow="Gallery" title="MEDIA <em style='color:var(--brand-accent)'>GALLERY</em>" watermark="Media" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ height: '250px', background: 'var(--surface)', borderRadius: '15px' }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (media.length === 0) {
    return (
        <section id="media" style={{ padding: '80px 0', background: 'var(--bg)' }}>
          <div className="container" style={{ maxWidth: '1400px' }}>
            <SectionHeader eyebrow="Gallery" title="MEDIA <em style='color:var(--brand-accent)'>GALLERY</em>" watermark="Media" />
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
                <p>Capturing the vision through lens. New media coming soon.</p>
            </div>
          </div>
        </section>
    );
  }

  return (
    <section id="media" style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        <SectionHeader 
          eyebrow="Visual Portfolio" 
          title="MEDIA <em style='color:var(--brand-accent)'>GALLERY</em>" 
          watermark="Gallery" 
        />
        
        <ScrollReveal className="media-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', marginTop: '50px' }}>
          {media.map((item) => (
            <div key={item.id} className="media-item" style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', height: '300px', cursor: 'pointer', border: '1px solid var(--border)' }}>
              <img 
                src={getImgSrc(item.image_url)} 
                alt={item.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
              />
              <div className="media-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '25px', opacity: 0, transition: 'opacity 0.3s ease' }}>
                <h3 style={{ color: 'white', fontFamily: 'Oswald', fontSize: '1.4rem', marginBottom: '5px' }}>{item.title}</h3>
                {item.description && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>

      <style>{`
        .media-item:hover img { transform: scale(1.1); }
        .media-item:hover .media-overlay { opacity: 1; }
        .media-grid { width: 100%; }
        @media (max-width: 768px) {
          .media-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
