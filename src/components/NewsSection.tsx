'use client';

import { useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface Article {
  id: number | string;
  title: string;
  excerpt?: string;
  summary?: string;
  featured_image?: string;
  image?: string;
  created_at: string;
  date?: string;
  category?: string | {
    name: string;
  };
  slug: string;
}

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const result = await response.json();
        
        // Based on the working v1 API: result.data.data is the array
        // Also handling other potential structures for robustness
        let fetchedArticles = [];
        
        if (result.data && Array.isArray(result.data.data)) {
          fetchedArticles = result.data.data;
        } else if (result.data && Array.isArray(result.data)) {
          fetchedArticles = result.data;
        } else if (Array.isArray(result.data)) {
          fetchedArticles = result.data;
        } else if (Array.isArray(result)) {
          fetchedArticles = result;
        }
        
        if (fetchedArticles.length > 0) {
          setArticles(fetchedArticles.slice(0, 3));
        } else if (result.articles && Array.isArray(result.articles)) {
          // Fallback for different API structure
          setArticles(result.articles.slice(0, 3));
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('News Fetch Error:', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section id="events">
        <div className="news-header">
          <div>
            <div className="section-eyebrow">Stay Connected</div>
            <h2>Latest <em>News</em></h2>
          </div>
        </div>
        <div className="news-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="news-card skeleton" style={{ minHeight: '300px', background: '#f0f0f0' }}>
              <div style={{ height: '200px', background: '#e0e0e0' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ height: '20px', background: '#e0e0e0', marginBottom: '10px' }} />
                <div style={{ height: '40px', background: '#e0e0e0' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="events">
      <ScrollReveal className="news-header">
        <div>
          <div className="section-eyebrow">Stay Connected</div>
          <h2>Latest <em>News</em></h2>
        </div>
        <a href="https://homesph.com/news" target="_blank" rel="noopener noreferrer" className="see-all">
          View All News 
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L17 6M17 6L12 11M17 6H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </ScrollReveal>

      {articles.length > 0 ? (
        <ScrollReveal className="news-grid">
          {articles.map((article) => (
            <a 
              key={article.id} 
              href={`https://homesph.com/news/${article.slug}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="news-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img 
                src={article.featured_image || article.image || 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80'} 
                alt={article.title} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80';
                }}
              />
              <div className="news-info">
                <div className="news-badge">
                  {typeof article.category === 'string' ? article.category : article.category?.name || 'News'}
                </div>
                <div className="news-title">{article.title}</div>
                <div className="news-meta">
                  {new Date(article.date || article.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </a>
          ))}
        </ScrollReveal>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
          {error ? `Error: ${error}` : 'No news articles available at the moment.'}
        </div>
      )}
    </section>
  );
}
