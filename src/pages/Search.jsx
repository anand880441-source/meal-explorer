import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Sparkles, ArrowDown, Filter, TrendingUp } from 'lucide-react';
import MealCard from '../components/MealCard';
import { MealCardSkeleton } from '../components/Skeleton';
import SpinWheel from '../components/SpinWheel';
import { getTrending } from '../utils/localStorageHelper';

const SUGGESTIONS = ['Pasta', 'Chicken', 'Sushi', 'Tacos', 'Curry', 'Pizza', 'Soup', 'Salad'];
const AREAS = ['', 'American', 'British', 'Chinese', 'French', 'Greek', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Thai', 'Turkish'];
const CATEGORIES = ['', 'Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 'Vegan', 'Vegetarian'];

const Search = () => {
    const [meals, setMeals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [areaFilter, setAreaFilter] = useState('');
    const [spinOpen, setSpinOpen] = useState(false);
    const [trending, setTrending] = useState([]);
    const [trendingMeals, setTrendingMeals] = useState([]);

    const fetchMeals = useCallback(async (query = '', firstLoad = false) => {
        setLoading(true); setError(null);
        try {
            let data;
            if (categoryFilter && !query) {
                const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryFilter}`);
                data = await res.json();
            } else if (areaFilter && !query) {
                const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaFilter}`);
                data = await res.json();
            } else {
                const url = firstLoad && !query
                    ? 'https://www.themealdb.com/api/json/v1/1/search.php?f=b'
                    : `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
                const res = await fetch(url);
                data = await res.json();
            }
            setMeals(data.meals || []);
        } catch { setError('Network error — please try again.'); }
        finally { setLoading(false); }
    }, [categoryFilter, areaFilter]);

    useEffect(() => { fetchMeals('', true); }, [categoryFilter, areaFilter]);

    useEffect(() => {
        const ids = getTrending();
        setTrending(ids);
        if (ids.length === 0) return;
        Promise.all(ids.slice(0, 5).map(id => fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(r => r.json())))
            .then(results => setTrendingMeals(results.map(d => d.meals?.[0]).filter(Boolean)))
            .catch(() => { });
    }, []);

    const handleSearch = (e) => { e.preventDefault(); if (searchTerm.trim()) fetchMeals(searchTerm); };

    const clearFilters = () => { setCategoryFilter(''); setAreaFilter(''); setSearchTerm(''); fetchMeals('', true); };
    const hasFilter = categoryFilter || areaFilter;

    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-overlay" />
                <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="hero-badge"><Sparkles size={14} /> The Ultimate Culinary Experience</div>
                    <h1 className="hero-title">Discover <span className="highlight">Art</span><br />on Your Plate</h1>
                    <p className="hero-subtitle">Thousands of meticulously curated recipes. Your next masterpiece starts here.</p>

                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-icon-wrap"><SearchIcon size={22} /></div>
                        <input type="text" className="search-input" placeholder="Search any recipe…"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="submit" className="search-btn">Discover</button>
                    </form>

                    {/* Suggestions + Spin */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
                        {SUGGESTIONS.map((s) => (
                            <button key={s} onClick={() => { setSearchTerm(s); fetchMeals(s); }}
                                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.35rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                {s}
                            </button>
                        ))}
                        <button onClick={() => setSpinOpen(true)}
                            style={{ background: 'rgba(201,107,74,0.35)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '0.35rem 1.1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                            🎡 Spin
                        </button>
                    </div>
                </motion.div>
                <div style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.5)' }}><ArrowDown size={28} /></div>
            </section>

            {/* Trending Strip */}
            {trendingMeals.length > 0 && (
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                    <div className="container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, color: 'var(--secondary)', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                <TrendingUp size={14} /> Trending
                            </div>
                            <div className="trending-strip">
                                {trendingMeals.map(m => (
                                    <a key={m.idMeal} href={`/meal/${m.idMeal}`} className="trending-pill">
                                        <img src={m.strMealThumb} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                                        {m.strMeal.length > 20 ? m.strMeal.slice(0, 20) + '…' : m.strMeal}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            <section style={{ padding: '4rem 0 6rem', background: 'var(--bg)' }}>
                <div className="container">
                    {/* Filter bar */}
                    <div className="filter-bar">
                        <select className={`filter-select${categoryFilter ? ' filter-active' : ''}`}
                            value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setAreaFilter(''); }}>
                            <option value="">All Categories</option>
                            {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select className={`filter-select${areaFilter ? ' filter-active' : ''}`}
                            value={areaFilter} onChange={e => { setAreaFilter(e.target.value); setCategoryFilter(''); }}>
                            <option value="">All Cuisines</option>
                            {AREAS.filter(Boolean).map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        {hasFilter && (
                            <button onClick={clearFilters} style={{ padding: '0.6rem 1.2rem', borderRadius: '100px', border: '1.5px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                ✕ Clear
                            </button>
                        )}
                        <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                            {!loading && `${meals.length} results`}
                        </div>
                    </div>

                    <div className="section-header">
                        <div>
                            <p className="section-label">Collection</p>
                            <h2 className="section-title">
                                {categoryFilter ? `${categoryFilter} Dishes` : areaFilter ? `${areaFilter} Cuisine` : 'Featured Masterpieces'}
                            </h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid-meals">{[...Array(8)].map((_, i) => <MealCardSkeleton key={i} />)}</div>
                    ) : error ? (
                        <div className="error-box">
                            <h3>{error}</h3>
                            <button className="cta-btn" onClick={() => fetchMeals('', true)}>Retry</button>
                        </div>
                    ) : meals.length === 0 ? (
                        <div className="error-box">
                            <h3>No results found.</h3>
                            <button className="cta-btn" onClick={clearFilters}>Browse All</button>
                        </div>
                    ) : (
                        <div className="grid-meals">
                            {meals.map((meal) => <MealCard key={meal.idMeal} meal={meal} />)}
                        </div>
                    )}
                </div>
            </section>

            <SpinWheel open={spinOpen} onClose={() => setSpinOpen(false)} />
        </div>
    );
};

export default Search;
