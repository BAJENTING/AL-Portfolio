import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  Building2, 
  Trophy, 
  ScrollText, 
  Lightbulb, 
  Code2, 
  Mail,
  PlusCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const [
    { count: companiesCount },
    { count: awardsCount },
    { count: credentialsCount },
    { count: coachingCount },
    { count: developersCount },
    { count: contactsCount }
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('awards').select('*', { count: 'exact', head: true }),
    supabase.from('credentials').select('*', { count: 'exact', head: true }),
    supabase.from('coaching').select('*', { count: 'exact', head: true }),
    supabase.from('developers').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    { label: 'Companies', val: companiesCount ?? 0, href: '/admin/companies', icon: <Building2 size={24} />, color: '#3498db' },
    { label: 'Awards', val: awardsCount ?? 0, href: '/admin/awards', icon: <Trophy size={24} />, color: '#f1c40f' },
    { label: 'Credentials', val: credentialsCount ?? 0, href: '/admin/credentials', icon: <ScrollText size={24} />, color: '#e67e22' },
    { label: 'Coaching', val: coachingCount ?? 0, href: '/admin/coaching', icon: <Lightbulb size={24} />, color: '#9b59b6' },
    { label: 'Developers', val: developersCount ?? 0, href: '/admin/developers', icon: <Code2 size={24} />, color: '#2ecc71' },
    { label: 'Messages', val: contactsCount ?? 0, href: '/admin/contacts', icon: <Mail size={24} />, color: '#e74c3c' },
  ]

  return (
    <div className="dashboard-wrapper">
      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <div className="welcome-text">
          <h1>System <span>Overview</span></h1>
          <p>Welcome back, Administrator. Here&apos;s what&apos;s happening with your portfolio today.</p>
        </div>
        <Link href="/" target="_blank" className="live-site-btn">
          <span>View Live Site</span>
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value-row">
                <span className="stat-value">{stat.val}</span>
                <div className="stat-trend">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
            <div className="card-progress">
              <div className="progress-bar" style={{ width: '100%', backgroundColor: stat.color }}></div>
            </div>
          </Link>
        ))}
      </div>

      {/* QUICK ACTIONS & RECENT ACTIVITY MOCKUP */}
      <div className="dashboard-lower-grid">
        <div className="actions-panel">
          <h3>Quick <span>Actions</span></h3>
          <div className="action-buttons">
            <Link href="/admin/awards" className="action-link">
              <PlusCircle size={18} />
              <span>Add New Award</span>
            </Link>
            <Link href="/admin/credentials" className="action-link">
              <PlusCircle size={18} />
              <span>Update Credentials</span>
            </Link>
            <Link href="/admin/contacts" className="action-link">
              <Mail size={18} />
              <span>Check Messages</span>
            </Link>
          </div>
        </div>

        <div className="status-panel">
          <h3>System <span>Status</span></h3>
          <div className="status-list">
            <div className="status-item">
              <div className="status-dot online"></div>
              <div className="status-info">
                <span className="status-title">Database Connection</span>
                <span className="status-desc">Supabase Cluster - Operational</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-dot online"></div>
              <div className="status-info">
                <span className="status-title">Asset Storage</span>
                <span className="status-desc">Cdn Nodes - Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .welcome-text h1 {
          font-size: 2.2rem;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .welcome-text h1 span { color: var(--red); }
        .welcome-text p { color: var(--text-dim); font-size: 0.95rem; }

        .live-site-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .live-site-btn:hover {
          background: var(--red);
          border-color: var(--red);
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .stat-card {
          background: #1A1A1A;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px;
          border-radius: 16px;
          text-decoration: none;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          background: #222;
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-dim);
          font-weight: 600;
        }

        .stat-value-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-trend {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          transition: all 0.3s;
        }

        .stat-card:hover .stat-trend {
          background: var(--red);
          color: white;
          transform: rotate(-45deg);
        }

        .card-progress {
          height: 4px;
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 5px;
        }

        .progress-bar {
          height: 100%;
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        .stat-card:hover .progress-bar {
          opacity: 1;
        }

        .dashboard-lower-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 24px;
        }

        .actions-panel, .status-panel {
          background: #1A1A1A;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 30px;
          border-radius: 16px;
        }

        h3 {
          font-size: 1.25rem;
          margin-bottom: 25px;
          letter-spacing: -0.01em;
        }

        h3 span { color: var(--red); }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .action-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          color: var(--text-mid);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .action-link:hover {
          background: rgba(210, 31, 23, 0.1);
          color: var(--red);
          border-color: rgba(210, 31, 23, 0.2);
          transform: translateX(5px);
        }

        .status-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.online {
          background: #2ecc71;
          box-shadow: 0 0 10px #2ecc71;
        }

        .status-info {
          display: flex;
          flex-direction: column;
        }

        .status-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
        }

        .status-desc {
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        @media (max-width: 1200px) {
          .dashboard-lower-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .welcome-text h1 { font-size: 1.8rem; }
          .action-buttons { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
