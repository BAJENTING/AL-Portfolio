'use client';

import React from 'react';
import ScrollReveal from './ScrollReveal';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  watermark?: string;
  dark?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  watermark,
  dark = false,
}) => {
  const isCentered = align === 'center';
  const isRight = align === 'right';

  return (
    <div 
      className="section-header-wrapper" 
      style={{ 
        position: 'relative', 
        marginBottom: '30px',
        textAlign: align,
        width: '100%',
        zIndex: 10
      }}
    >
      {watermark && (
        <div 
          className="section-watermark"
          style={{
            position: 'absolute',
            top: isCentered ? '50%' : '-20px',
            left: isCentered ? '50%' : isRight ? 'auto' : '-20px',
            right: isRight ? '-20px' : 'auto',
            transform: isCentered ? 'translate(-50%, -50%)' : 'none',
            fontFamily: 'Oswald, sans-serif',
            fontSize: 'clamp(5rem, 12vw, 12rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            opacity: 0.03,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            zIndex: -1,
            lineHeight: 1
          }}
        >
          {watermark}
        </div>
      )}

      <ScrollReveal>
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: isCentered ? 'center' : isRight ? 'flex-end' : 'flex-start' 
          }}
        >
          <div 
            className="section-eyebrow-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '15px'
            }}
          >
            <span 
              style={{ 
                width: '12px', 
                height: '12px', 
                background: 'var(--brand-accent)', 
                display: 'inline-block' 
              }} 
            />
            <span 
              className="section-eyebrow"
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--brand-accent)',
                fontWeight: 600
              }}
            >
              {eyebrow}
            </span>
          </div>

          <h2 
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
              lineHeight: 1.1, 
              color: 'var(--text-primary)',
              maxWidth: isCentered ? '800px' : 'none',
              fontFamily: 'Oswald, sans-serif'
            }}
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <div 
            style={{ 
              width: '80px', 
              height: '3px', 
              background: 'var(--brand-accent)', 
              marginTop: '30px',
              opacity: 0.6
            }} 
          />
        </div>
      </ScrollReveal>
    </div>
  );
};

export default SectionHeader;
