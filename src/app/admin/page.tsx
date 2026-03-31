'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logout } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Trophy, 
  GraduationCap, 
  Target, 
  Users,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  { id: 'coaching', label: 'Coaching Grid', icon: <Target size={24} />, table: 'coaching' },
  { id: 'my-companies', label: 'My Companies', icon: <Building2 size={24} />, table: 'companies' },
  { id: 'partner-companies', label: 'Partner Companies', icon: <Users size={24} />, table: 'developers' },
  { id: 'education', label: 'Education', icon: <GraduationCap size={24} />, table: 'credentials' },
  { id: 'awards', label: 'Awards', icon: <Trophy size={24} />, table: 'awards' },
];

const TABLE_SCHEMAS: Record<string, string[]> = {
  coaching: ['title', 'badge_text', 'image_url', 'description'],
  companies: ['name', 'logo_url', 'website_url', 'description'],
  developers: ['name', 'logo_url', 'website_url', 'sort_order'],
  credentials: ['title', 'institution', 'organization', 'category'],
  awards: ['title', 'organization', 'year', 'icon'],
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: records, error } = await supabase
      .from(activeSection.table)
      .select('*');
    
    if (error) {
      console.error(`Error fetching ${activeSection.table}:`, error);
      alert(`Error: ${error.message}`);
    } else {
      setData(records || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const { error } = await supabase.from(activeSection.table).delete().eq('id', id);
    if (!error) fetchData();
    else alert(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates: any = {};
    formData.forEach((value, key) => {
      if (key === 'sort_order' || key === 'year') {
        updates[key] = parseInt(value as string) || 0;
      } else {
        updates[key] = value;
      }
    });

    let res;
    if (currentItem?.id) {
      res = await supabase.from(activeSection.table).update(updates).eq('id', currentItem.id);
    } else {
      res = await supabase.from(activeSection.table).insert([updates]);
    }

    if (res.error) alert(res.error.message);
    else {
      setIsEditing(false);
      setCurrentItem(null);
      fetchData();
    }
  };

  const renderCell = (item: any, field: string) => {
    const value = item[field];
    if (!value) return '-';

    // Handle Website URLs as text links
    if (field === 'website_url') {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-url">
          {value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      );
    }

    const isImagePath = typeof value === 'string' && (
      field === 'image_url' || 
      field === 'logo_url' ||
      field === 'icon' || 
      value.match(/\.(jpeg|jpg|gif|png|webp|svg|jfif)$/i)
    );

    if (isImagePath) {
      const src = (value.startsWith('http') || value.startsWith('/')) 
        ? value 
        : `/images/${value}`;
        
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="table-img-link">
          <img src={src} alt="" className="table-img" onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Broken';
          }} />
        </a>
      );
    }

    return <span className="truncate">{value.toString() || '-'}</span>;
  };

  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <span className="breadcrumb">Control Panel</span>
          <ChevronRight size={16} className="separator" />
          <span className="current">Dashboard</span>
        </div>
        <div className="header-right">
          <span className="user-email">admin@leuterio.com</span>
          <button onClick={handleLogout} className="disconnect-btn">
            Disconnect <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* NAVIGATION CARDS */}
        <div className="nav-grid">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section);
                setIsEditing(false);
                setCurrentItem(null);
              }}
              className={`nav-card ${activeSection.id === section.id ? 'active' : ''}`}
            >
              <div className="card-icon">{section.icon}</div>
              <span className="card-label">{section.label}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE SECTION AREA */}
        <div className="section-area">
          <div className="section-header">
            <h2>{activeSection.label} <span>Management</span></h2>
            {!isEditing && (
              <button onClick={() => { setIsEditing(true); setCurrentItem({}); }} className="add-btn">
                <Plus size={18} /> Add New
              </button>
            )}
          </div>

          {/* FORM AREA */}
          {isEditing && (
            <div className="form-container">
              <h3>{currentItem?.id ? 'Edit' : 'Create New'} {activeSection.label}</h3>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                  {TABLE_SCHEMAS[activeSection.table].map((field) => (
                    <div key={field} className="form-group">
                      <label>{field.replace('_', ' ')}</label>
                      {field === 'description' ? (
                        <textarea
                          name={field}
                          defaultValue={currentItem?.[field] || ''}
                          rows={3}
                          required
                        />
                      ) : (
                        <input
                          type={field === 'sort_order' || field === 'year' ? 'number' : 'text'}
                          name={field}
                          defaultValue={currentItem?.[field] || ''}
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Entry</button>
                  <button type="button" onClick={() => { setIsEditing(false); setCurrentItem(null); }} className="cancel-btn">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* LIST AREA */}
          <div className="list-container">
            {loading ? (
              <div className="loading">Loading items...</div>
            ) : data.length === 0 ? (
              <div className="empty">No items found. Click &quot;Add New&quot; to get started.</div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {TABLE_SCHEMAS[activeSection.table].map(field => (
                        <th key={field}>{field.replace('_', ' ')}</th>
                      ))}
                      <th className="actions-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id}>
                        {TABLE_SCHEMAS[activeSection.table].map(field => (
                          <td key={field}>
                            {renderCell(item, field)}
                          </td>
                        ))}
                        <td className="actions-cell">
                          <button onClick={() => { setCurrentItem(item); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="edit-btn"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} className="delete-btn"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .admin-container {
          padding: 0;
          color: white;
          font-family: 'DM Sans', sans-serif;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: #1A1A1A;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .breadcrumb { color: var(--text-dim); font-size: 0.9rem; }
        .separator { color: rgba(255, 255, 255, 0.2); }
        .current { color: var(--red); font-size: 0.9rem; font-weight: 700; }

        .header-right {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .user-email {
          color: var(--text-mid);
          font-size: 0.9rem;
        }

        .disconnect-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.3s;
        }

        .disconnect-btn:hover {
          background: var(--red);
          border-color: var(--red);
        }

        .admin-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .nav-card {
          background: #1A1A1A;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 30px 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        }

        .nav-card:hover {
          transform: translateY(-5px);
          border-color: rgba(210, 31, 23, 0.3);
          background: #222;
        }

        .nav-card.active {
          border-color: var(--red);
          background: rgba(210, 31, 23, 0.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .card-icon {
          color: var(--text-dim);
          transition: color 0.3s;
        }

        .nav-card.active .card-icon {
          color: var(--red);
        }

        .card-label {
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
          font-size: 0.9rem;
        }

        .section-area {
          background: #1A1A1A;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .section-header h2 {
          font-family: 'Oswald', sans-serif;
          font-size: 1.8rem;
          text-transform: uppercase;
        }

        .section-header h2 span { color: var(--red); }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--red);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .add-btn:hover { background: var(--red-light); transform: translateY(-2px); }

        .form-container {
          background: #0F0F0F;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 40px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .form-container h3 {
          margin-bottom: 25px;
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          font-size: 1.2rem;
          color: var(--red);
        }

        .admin-form { display: flex; flex-direction: column; gap: 20px; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group { display: flex; flex-direction: column; gap: 8px; }

        .form-group label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-dim);
        }

        .form-group input, .form-group textarea {
          background: #1A1A1A;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 6px;
          color: white;
          font-family: inherit;
          outline: none;
        }

        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--red);
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .save-btn {
          background: var(--red);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-btn {
          background: transparent;
          color: var(--text-dim);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 30px;
          border-radius: 6px;
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
        }

        .data-table-wrapper {
          overflow-x: auto;
          margin-top: 20px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          padding: 15px;
          background: rgba(255, 255, 255, 0.02);
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .data-table td {
          padding: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.9rem;
          color: var(--text-mid);
        }

        .table-img {
          height: 50px;
          width: 80px;
          object-fit: contain;
          border-radius: 4px;
          display: block;
        }

        .table-img-link {
          display: inline-block;
          background: transparent;
        }

        .text-url {
          color: #3498db;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s;
        }

        .text-url:hover {
          color: #5dade2;
          text-decoration: underline;
        }

        .truncate {
          display: block;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .actions-cell {
          text-align: right;
          width: 100px;
        }

        .edit-btn, .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          transition: all 0.3s;
        }

        .edit-btn { color: #3498db; }
        .edit-btn:hover { color: #5dade2; transform: scale(1.1); }

        .delete-btn { color: var(--red); }
        .delete-btn:hover { color: var(--red-light); transform: scale(1.1); }

        .loading, .empty {
          padding: 60px;
          text-align: center;
          color: var(--text-dim);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .admin-header { padding: 15px 20px; }
          .admin-content { padding: 20px; }
          .nav-grid { grid-template-columns: 1fr 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .header-right .user-email { display: none; }
        }
      `}</style>
    </div>
  );
}
