import React, { useState, useEffect } from 'react';
import { getNote, setNote, clearNote, checkBadges } from '../utils/localStorageHelper';
import { Pencil, Save, Trash2, StickyNote } from 'lucide-react';

const NoteEditor = ({ mealId }) => {
    const [text, setText] = useState(() => getNote(mealId));
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => { setText(getNote(mealId)); }, [mealId]);

    const handleSave = () => {
        setNote(mealId, text.trim());
        checkBadges();
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDelete = () => {
        clearNote(mealId);
        setText('');
        setEditing(false);
    };

    return (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <StickyNote size={18} color="var(--secondary)" />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Chef's Notes
                    </span>
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: 'none', border: '1.5px solid var(--border)',
                            borderRadius: '100px', padding: '0.35rem 0.9rem',
                            cursor: 'pointer', color: 'var(--text-muted)',
                            fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Inter, sans-serif',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Pencil size={13} /> {text ? 'Edit' : 'Add Note'}
                    </button>
                )}
            </div>

            {editing ? (
                <>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Your thoughts, substitutions, tips…"
                        rows={4}
                        style={{
                            width: '100%',
                            background: 'var(--bg)',
                            border: '1.5px solid var(--border)',
                            borderRadius: '14px',
                            padding: '0.9rem 1rem',
                            fontSize: '0.95rem',
                            color: 'var(--text)',
                            fontFamily: 'Inter, sans-serif',
                            resize: 'vertical',
                            outline: 'none',
                            lineHeight: 1.7,
                            boxSizing: 'border-box',
                        }}
                        autoFocus
                    />
                    <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
                        <button
                            onClick={handleSave}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                background: 'var(--primary)', color: 'white',
                                border: 'none', borderRadius: '100px',
                                padding: '0.55rem 1.2rem', fontWeight: 800,
                                fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            <Save size={14} /> Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            style={{
                                background: 'none', border: '1.5px solid var(--border)',
                                borderRadius: '100px', padding: '0.55rem 1.2rem',
                                cursor: 'pointer', color: 'var(--text-muted)',
                                fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            Cancel
                        </button>
                        {text && (
                            <button
                                onClick={handleDelete}
                                style={{
                                    marginLeft: 'auto',
                                    background: 'none', border: '1.5px solid rgba(239,68,68,0.3)',
                                    borderRadius: '100px', padding: '0.55rem 1rem',
                                    cursor: 'pointer', color: '#ef4444',
                                    fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            >
                                <Trash2 size={13} /> Delete
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p style={{
                    color: text ? 'var(--text)' : 'var(--text-muted)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    fontStyle: text ? 'normal' : 'italic',
                    minHeight: '2.5rem',
                }}>
                    {saved ? '✅ Note saved!' : (text || 'No notes yet. Click "Add Note" to jot down your thoughts.')}
                </p>
            )}
        </div>
    );
};

export default NoteEditor;
