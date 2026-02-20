import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Copy, Printer, Trash2 } from 'lucide-react';
import { getLikedMeals } from '../utils/localStorageHelper';

const GroceryList = () => {
    const [ingredients, setIngredients] = useState([]);   // [{name, measure, meal}]
    const [checked, setChecked] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const fetchIngredients = useCallback(async () => {
        setLoading(true);
        try {
            const ids = getLikedMeals();
            if (ids.length === 0) { setIngredients([]); setLoading(false); return; }
            const results = await Promise.all(ids.map(id =>
                fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(r => r.json())
            ));
            const all = [];
            results.forEach(data => {
                const meal = data.meals?.[0];
                if (!meal) return;
                for (let i = 1; i <= 20; i++) {
                    const name = meal[`strIngredient${i}`]?.trim();
                    const measure = meal[`strMeasure${i}`]?.trim();
                    if (name) all.push({ name, measure: measure || '', meal: meal.strMeal, id: meal.idMeal });
                }
            });
            setIngredients(all);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchIngredients(); }, [fetchIngredients]);

    const toggle = (key) => setChecked(prev => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
    });

    const clearChecked = () => setChecked(new Set());

    const copyList = () => {
        const lines = ingredients
            .filter(i => !checked.has(`${i.meal}-${i.name}`))
            .map(i => `• ${i.name}${i.measure ? ` — ${i.measure}` : ''} (${i.meal})`);
        navigator.clipboard.writeText(lines.join('\n'));
    };

    // Group by meal
    const grouped = ingredients.reduce((acc, item) => {
        if (!acc[item.meal]) acc[item.meal] = { id: item.id, items: [] };
        acc[item.meal].items.push(item);
        return acc;
    }, {});

    const total = ingredients.length;
    const done = checked.size;

    return (
        <div className="grocery-page">
            <div style={{ marginBottom: '3rem' }}>
                <p style={{ color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                    <ShoppingCart size={13} style={{ display: 'inline', marginRight: '0.4rem' }} /> Kitchen Supply
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--primary)', fontStyle: 'italic', marginBottom: '1rem' }}>
                    Grocery List
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
                    Aggregated from your {Object.keys(grouped).length} saved recipe{Object.keys(grouped).length !== 1 ? 's' : ''}. {done > 0 && `${done}/${total} items checked.`}
                </p>

                {/* Progress bar */}
                {total > 0 && (
                    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden', marginBottom: '2rem', maxWidth: '400px' }}>
                        <motion.div animate={{ width: `${(done / total) * 100}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '100px', transition: 'width 0.4s' }} />
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={copyList} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', borderRadius: '100px', border: '1.5px solid var(--border)', background: 'transparent', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                        <Copy size={15} /> Copy List
                    </button>
                    <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', borderRadius: '100px', border: '1.5px solid var(--border)', background: 'transparent', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                        <Printer size={15} /> Print
                    </button>
                    {done > 0 && (
                        <button onClick={clearChecked} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', borderRadius: '100px', border: '1.5px solid rgba(239,68,68,0.3)', background: 'transparent', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', color: '#ef4444', fontFamily: 'Inter, sans-serif' }}>
                            <Trash2 size={15} /> Clear Checked
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="spinner-wrap"><div className="spinner" /><p className="spinner-text">Loading pantry…</p></div>
            ) : Object.keys(grouped).length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🛒</div>
                    <h2 className="empty-title">Your list is empty.</h2>
                    <p className="empty-text">Save some recipes first and all their ingredients will appear here automatically.</p>
                    <a href="/" className="cta-btn" style={{ display: 'inline-flex', textDecoration: 'none' }}>Discover Recipes</a>
                </div>
            ) : (
                Object.entries(grouped).map(([mealName, { id, items }]) => (
                    <div key={mealName} className="grocery-group">
                        <h3 className="grocery-group-title">
                            <a href={`/meal/${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{mealName}</a>
                        </h3>
                        {items.map((item) => {
                            const key = `${item.meal}-${item.name}`;
                            const isChecked = checked.has(key);
                            return (
                                <div key={key} className={`grocery-item${isChecked ? ' checked' : ''}`} onClick={() => toggle(key)}>
                                    <div className="grocery-check">
                                        {isChecked && <Check size={13} color="white" strokeWidth={3} />}
                                    </div>
                                    <span style={{ fontWeight: 700, flex: 1 }}>{item.name}</span>
                                    {item.measure && <span style={{ color: 'var(--secondary)', fontWeight: 800, fontStyle: 'italic', fontSize: '0.9rem' }}>{item.measure}</span>}
                                </div>
                            );
                        })}
                    </div>
                ))
            )}
        </div>
    );
};

export default GroceryList;
