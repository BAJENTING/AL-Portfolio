'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';

const TABLE_SCHEMAS: Record<string, string[]> = {
  companies: ['id', 'name', 'logo_url', 'website_url', 'description'],
  awards: ['id', 'title', 'organization', 'year', 'icon'],
  credentials: ['id', 'title', 'institution', 'organization', 'category'],
  coaching: ['id', 'title', 'badge_text', 'image_url', 'description'],
  developers: ['id', 'name', 'logo_url', 'website_url', 'sort_order'],
  contacts: ['first_name', 'last_name', 'email', 'phone', 'looking_to', 'budget_range', 'message'],
};

export default function TableManager() {
  const { table } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const fetchData = async () => {
    if (!table) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from(table as string).select('*');
      if (error) {
        setError(error.message);
        setData([]);
      } else {
        setData(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table]);

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const supabase = createClient();
    const { error } = await supabase.from(table as string).delete().eq('id', id);
    if (error) alert(error.message);
    else fetchData();
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setCurrentItem({});
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates: any = {};
    formData.forEach((value, key) => {
      if (key === 'sort_order') {
        updates[key] = parseInt(value as string) || 0;
      } else {
        updates[key] = value;
      }
    });

    const supabase = createClient();
    let res;
    if (currentItem?.id && data.some(d => d.id === currentItem.id)) {
        res = await supabase.from(table as string).update(updates).eq('id', currentItem.id);
    } else {
        res = await supabase.from(table as string).insert([updates]);
    }

    if (res.error) {
      alert(res.error.message);
    } else {
      setIsEditing(false);
      fetchData();
    }
  };

  if (loading) return <div style={{ color: 'var(--text-mid)', padding: '20px' }}>Loading data...</div>;

  // Infer columns: Use the schema if defined, otherwise infer from data
  let columns = TABLE_SCHEMAS[table as string] || (data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'created_at') : []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', textTransform: 'capitalize' }}>{table as string}</h1>
        <button onClick={handleAdd} className="btn-red" style={{ padding: '10px 20px', border: 'none', cursor: 'pointer' }}>+ Add New</button>
      </div>

      {error && (
        <div style={{ 
          background: 'rgba(210, 31, 23, 0.1)', 
          border: '1px solid var(--red)', 
          padding: '15px', 
          borderRadius: '4px', 
          color: 'var(--red)', 
          marginBottom: '20px' 
        }}>
          <strong>Database Error:</strong> {error}
        </div>
      )}

      <div style={{ background: 'var(--charcoal)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
                {columns.map(col => (
                  <th key={col} style={{ padding: '15px', textTransform: 'capitalize', fontSize: '0.9rem' }}>{col.replace('_', ' ')}</th>
                ))}
                <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  {columns.map(col => (
                    <td key={col} style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--text-mid)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {typeof item[col] === 'string' && (item[col].startsWith('http') || item[col].startsWith('/')) && (item[col].match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null || col.includes('url') || col.includes('icon')) ? (
                        <img src={item[col]} alt="" style={{ height: '35px', maxWidth: '80px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }} />
                      ) : (
                        item[col]?.toString() || '-'
                      )}
                    </td>
                  ))}
                  <td style={{ padding: '15px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length === 0 && !error && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No records found in &apos;{table}&apos;. Click &quot;Add New&quot; to create one.</div>}
      </div>

      {isEditing && (
        <div 
          onClick={() => setIsEditing(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--charcoal)', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 style={{ marginBottom: '20px' }}>{currentItem?.id ? 'Edit' : 'Add New'} {table as string}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {columns.map(col => (
                <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>{col.replace('_', ' ')}</label>
                  {col.includes('description') ? (
                    <textarea 
                      name={col}
                      defaultValue={currentItem?.[col] || ''}
                      rows={4}
                      style={{ background: 'var(--black)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: 'white', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  ) : (
                    <input 
                      name={col}
                      type={col === 'sort_order' ? 'number' : 'text'}
                      defaultValue={currentItem?.[col] || ''}
                      disabled={col === 'id' && currentItem?.id} // Disable ID field when editing an existing record
                      style={{ background: 'var(--black)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: 'white', borderRadius: '4px', opacity: (col === 'id' && currentItem?.id) ? 0.5 : 1 }}
                    />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn-red" style={{ flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
