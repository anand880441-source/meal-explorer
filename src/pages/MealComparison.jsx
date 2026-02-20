import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, SplitSquareVertical } from 'lucide-react';

const MealComparison = () => {
    const [mealA, setMealA] = useState(null);
    const [mealB, setMealB] = useState(null);
    const [queryA, setQueryA] = useState('');
    const [queryB, setQueryB] = useState('');
    const [resultsA, setResultsA] = useState([]);
    const [resultsB, setResultsB] = useState([]);

    const search = async (query, side) => {
        if (!query.trim()) { side === 'A' ? setResultsA([]) : setResultsB([]); return; }
        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
            const data = await res.json();
            side === 'A' ? setResultsA(data.meals?.slice(0, 5) || []) : setResultsB(data.meals?.slice(0, 5) || []);
        } catch { }
    };

    const fetchFull = async (id, side) => {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        const meal = data.meals?.[0];
        if (meal) { side === 'A' ? setMealA(meal) : setMealB(meal); side === 'A' ? setResultsA([]) : setResultsB([]); }
    };

    const getIngredients = (meal) => {
        const list = [];
        for (let i = 1; i <= 20; i++) {
            const name = meal[`strIngredient${i}`]?.trim();
            if (name) list.push({ name, measure: meal[`strMeasure${i}`]?.trim() || '' });
        }
        return list;
    };

    const SearchPanel = ({ side, query, setQuery, results, selected }) => (
        <div>
            {!selected ? (
                <div style={{ background: 'var(--card-bg)', borderRadius: '28px', border: '2px dashed var(--border)', padding: '3rem 2rem', textAlign: 'center' }}>
                    <SplitSquareVertical size={40} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 1.5rem' }} />
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Pick Meal {side}
                    </p>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            value={query} onChange={e => { setQuery(e.target.value); search(e.target.value, side); }}
                            placeholder="Search recipes…"
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: '100px', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                        />
                    </div>
                    {results.length > 0 && (
                        <div style={{ marginTop: '0.75rem', background: 'var(--bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            {results.map(m => (
                                <button key={m.idMeal} onClick={() => fetchFull(m.idMeal, side)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border)', textAlign: 'left', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <img src={m.strMealThumb} alt="" style={{ width: 36, height: 36, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{m.strMeal}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="compare-col">
                    <img src={selected.strMealThumb} alt={selected.strMeal} />
                    <div className="compare-col-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--primary)' }}>{selected.strMeal}</h3>
                            <button onClick={() => side === 'A' ? setMealA(null) : setMealB(null)}
                                style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <X size={13} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                            {selected.strArea && <span className="chip">{selected.strArea}</span>}
                            {selected.strCategory && <span className="chip">{selected.strCategory}</span>}
                        </div>
                        <p style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                            Ingredients ({getIngredients(selected).length})
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {getIngredients(selected).map((ing, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{ing.name}</span>
                                    <span style={{ color: 'var(--secondary)', fontWeight: 800, fontStyle: 'italic' }}>{ing.measure}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="compare-page">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <p style={{ color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                    Side by Side
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--primary)', fontStyle: 'italic' }}>
                    Meal Comparison
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>Pick two recipes and compare them side-by-side.</p>
            </div>

            <div className="compare-grid">
                <SearchPanel side="A" query={queryA} setQuery={setQueryA} results={resultsA} selected={mealA} />
                <div className="compare-vs">vs</div>
                <SearchPanel side="B" query={queryB} setQuery={setQueryB} results={resultsB} selected={mealB} />
            </div>
        </div>
    );
};

export default MealComparison;
