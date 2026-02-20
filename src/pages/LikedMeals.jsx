import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartOff, Trash2, Bookmark, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLikedMeals, clearLikedMeals } from '../utils/localStorageHelper';
import MealCard from '../components/MealCard';
import { MealCardSkeleton } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';

const LikedMeals = () => {
    const [likedMeals, setLikedMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const fetchLikedMeals = useCallback(async () => {
        const ids = getLikedMeals();
        if (ids.length === 0) { setLikedMeals([]); setLoading(false); return; }
        setLoading(true);
        try {
            const results = await Promise.all(
                ids.map(async (id) => {
                    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                    const data = await res.json();
                    return data.meals?.[0] || null;
                })
            );
            setLikedMeals(results.filter(Boolean));
        } catch {
            setLikedMeals([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLikedMeals();
        const sync = () => fetchLikedMeals();
        window.addEventListener('likedMealsChanged', sync);
        return () => window.removeEventListener('likedMealsChanged', sync);
    }, [fetchLikedMeals]);

    const handleClearAll = () => {
        if (window.confirm('Clear your entire masterpiece collection?')) {
            clearLikedMeals();
            addToast('Collection cleared.', 'success');
        }
    };

    return (
        <div className="liked-page">
            <div className="liked-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '1rem' }}>
                        <Bookmark size={14} /> Private Archives
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--primary)', fontStyle: 'italic', lineHeight: 1 }}>
                        The Chef's Collection
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>
                        {likedMeals.length} masterpiece{likedMeals.length !== 1 ? 's' : ''} saved
                    </p>
                </div>
                {likedMeals.length > 0 && (
                    <motion.button className="clear-btn" onClick={handleClearAll} whileTap={{ scale: 0.95 }}>
                        <Trash2 size={16} /> Clear All
                    </motion.button>
                )}
            </div>

            {loading ? (
                <div className="grid-meals">
                    {[...Array(4)].map((_, i) => <MealCardSkeleton key={i} />)}
                </div>
            ) : likedMeals.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">❤️</div>
                    <h2 className="empty-title">Your gallery awaits inspiration.</h2>
                    <p className="empty-text">
                        Hand-pick your favorites from our discovery hub and they'll appear here as your private culinary anthology.
                    </p>
                    <button className="cta-btn" onClick={() => navigate('/')}>
                        <Book size={18} /> Begin Discovery
                    </button>
                </div>
            ) : (
                <motion.div className="grid-meals" layout>
                    <AnimatePresence mode="popLayout">
                        {likedMeals.map(meal => (
                            <MealCard key={meal.idMeal} meal={meal} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Teaser Banner */}
            <div style={{
                marginTop: '5rem',
                background: 'var(--primary)',
                borderRadius: '32px',
                padding: '3rem 2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                flexWrap: 'wrap',
                color: 'white',
            }}>
                <div style={{ maxWidth: '500px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontStyle: 'italic', marginBottom: '0.75rem' }}>Culinary Annotations</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                        Soon you'll be able to attach private notes, chef's tips, and modifications to every masterpiece in your collection.
                    </p>
                </div>
                <div style={{
                    padding: '0.5rem 1.5rem',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    backdropFilter: 'blur(8px)',
                    flexShrink: 0,
                }}>
                    COMING SOON
                </div>
            </div>
        </div>
    );
};

export default LikedMeals;
