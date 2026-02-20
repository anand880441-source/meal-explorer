import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, X, Search } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STORAGE_KEY = 'mep_meal_plan';

const MealPlanner = () => {
    const [plan, setPlan] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
    });
    const [searchDay, setSearchDay] = useState(null); // which day is being searched
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    }, [plan]);

    const searchMeals = async (q) => {
        if (!q.trim()) { setResults([]); return; }
        setSearching(true);
        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.meals?.slice(0, 6) || []);
        } catch { } finally { setSearching(false); }
    };

    const addMeal = (day, meal) => {
        setPlan(prev => ({ ...prev, [day]: [...(prev[day] || []), { id: meal.idMeal, name: meal.strMeal, thumb: meal.strMealThumb }] }));
        setSearchDay(null); setQuery(''); setResults([]);
    };

    const removeMeal = (day, idx) => {
        setPlan(prev => { const copy = [...(prev[day] || [])]; copy.splice(idx, 1); return { ...prev, [day]: copy }; });
    };

    const clearPlan = () => { if (window.confirm('Clear the entire week plan?')) { setPlan({}); } };

    return (
        <div className="planner-page">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                    <p style={{ color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={13} /> Weekly Schedule
                    </p>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--primary)', fontStyle: 'italic' }}>
                        Meal Planner
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Plan your week. Click + on any day to add a meal.</p>
                </div>
                <button onClick={clearPlan} style={{ padding: '0.7rem 1.5rem', borderRadius: '100px', border: '1.5px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    Clear Week
                </button>
            </div>

            <div className="planner-grid">
                {DAYS.map(day => (
                    <div key={day} className="day-column">
                        <p className="day-label">{day}</p>

                        {(plan[day] || []).map((m, idx) => (
                            <motion.div key={idx} className="planner-meal-slot" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                <button
                                    onClick={() => removeMeal(day, idx)}
                                    style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}
                                >
                                    <X size={11} />
                                </button>
                                <img src={m.thumb} alt={m.name} />
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.3 }}>{m.name.length > 28 ? m.name.slice(0, 28) + '…' : m.name}</p>
                            </motion.div>
                        ))}

                        {searchDay === day ? (
                            <div>
                                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                    <input
                                        autoFocus
                                        value={query}
                                        onChange={e => { setQuery(e.target.value); searchMeals(e.target.value); }}
                                        placeholder="Search…"
                                        style={{ flex: 1, padding: '0.5rem 0.7rem', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8rem', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                                    />
                                    <button onClick={() => { setSearchDay(null); setQuery(''); setResults([]); }}
                                        style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                                {searching && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.25rem 0' }}>Searching…</p>}
                                {results.map(m => (
                                    <button key={m.idMeal} onClick={() => addMeal(day, m)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.4rem 0.5rem', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', fontFamily: 'Inter, sans-serif' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <img src={m.strMealThumb} alt="" style={{ width: 28, height: 28, borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{m.strMeal.length > 24 ? m.strMeal.slice(0, 24) + '…' : m.strMeal}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <button className="planner-add-btn" onClick={() => setSearchDay(day)}>
                                <Plus size={14} style={{ display: 'inline-block', marginRight: '0.25rem', verticalAlign: 'middle' }} /> Add Meal
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealPlanner;
