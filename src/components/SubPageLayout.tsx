'use client';

import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
}

interface SubPageLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  leadTitle: string;
  leadDesc: string;
  features: Feature[];
  heroImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

const SubPageLayout = ({
  eyebrow,
  title,
  subtitle,
  leadTitle,
  leadDesc,
  features,
  heroImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80',
  ctaText = 'Apply Now',
  ctaLink = '/#contact'
}: SubPageLayoutProps) => {
  return (
    <main>
      <header 
        className="sub-hero" 
        style={{ backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.8), rgba(15, 15, 15, 0.8)), url('${heroImage}')` }}
      >
        <ScrollReveal>
          <div className="section-eyebrow" style={{ color: 'var(--brand-accent)' }}>{eyebrow}</div>
          <h1 style={{ fontSize: '4rem' }}>{title}</h1>
          <p className="hero-tagline" style={{ margin: '1.5rem auto' }}>{subtitle}</p>
          <Link href={ctaLink} className="btn-red">{ctaText}</Link>
        </ScrollReveal>
      </header>

      <section className="sub-content">
        <ScrollReveal>
          <div className="section-eyebrow">Strategic Growth</div>
          <h2>{leadTitle}</h2>
          <p style={{ color: 'var(--text-mid)', maxWidth: '800px', marginTop: '2rem', fontSize: '1.1rem' }}>
            {leadDesc}
          </p>
        </ScrollReveal>

        <div className="sub-grid">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i % 3} className="feature-card">
              <div className="eco-num">0{i + 1}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SubPageLayout;
