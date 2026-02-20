import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Share2, Printer, CheckCircle2, Youtube } from 'lucide-react';
import { isMealLiked, addLikedMeal, removeLikedMeal, trackView, updateStreak, checkBadges } from '../utils/localStorageHelper';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';
import RatingStars from '../components/RatingStars';
import RecipeTimer from '../components/RecipeTimer';
import NoteEditor from '../components/NoteEditor';

const MealDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [doneSteps, setDoneSteps] = useState([]);

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await res.json();
            setMeal(data.meals?.[0] || null);
        } catch { addToast('Failed to load recipe.', 'error'); }
        finally { setLoading(false); }
    }, [id, addToast]);

    useEffect(() => {
        fetchDetails();
        setLiked(isMealLiked(id));
        trackView(id);
        const s = updateStreak();
        checkBadges();
        if (s.count >= 3) addToast('🔥 3-day streak! You\'re on fire!', 'success');
    }, [id, fetchDetails]);

    const handleLike = (e) => {
        if (!liked) {
            confetti({ particleCount: 120, spread: 90, origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }, colors: ['#6B2E3E', '#C96B4A', '#E8A87C'] });
            addLikedMeal(id);
            addToast('Added to your collection! ❤️', 'success');
        } else { removeLikedMeal(id); addToast('Removed from collection.', 'success'); }
        checkBadges();
        setLiked(p => !p);
    };

    if (loading) return <div className="spinner-wrap"><div className="spinner" /><p className="spinner-text">Preparing masterpiece…</p></div>;
    if (!meal) return <div style={{ textAlign: 'center', padding: '6rem 2rem' }}><h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--primary)', fontSize: '2rem', fontStyle: 'italic' }}>Recipe not found.</h2></div>;

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]?.trim()) ingredients.push({ name: meal[`strIngredient${i}`], measure: meal[`strMeasure${i}`] });
    }
    const difficulty = ingredients.length > 12 ? 'Executive Chef' : ingredients.length > 7 ? 'Sous Chef' : 'Commis Chef';
    const steps = meal.strInstructions.split(/\r\n|\n/).filter(s => s.trim().length > 10);

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            <div className="details-page">
                <motion.button className="back-btn" onClick={() => navigate(-1)} whileHover={{ x: -5 }}>
                    <ArrowLeft size={16} /> Back
                </motion.button>

                <div className="details-grid">
                    {/* Left */}
                    <div className="details-image-col">
                        <img className="details-img" src={meal.strMealThumb} alt={meal.strMeal} />
                        <div className="details-action-bar">
                            <button className={`action-btn${liked ? ' liked' : ''}`} onClick={handleLike}>
                                <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {liked ? 'Saved' : 'Save'}
                            </button>
                            <button className="action-btn" onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Link copied!', 'success'); }}>
                                <Share2 size={18} /> Share
                            </button>
                            <button className="action-btn" onClick={() => window.print()}>
                                <Printer size={18} /> Print
                            </button>
                        </div>

                        {/* Rating */}
                        <div style={{ marginTop: '1.25rem', background: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border)', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Your Rating</p>
                            <RatingStars mealId={id} size={28} onChange={(v) => { if (v > 0) addToast(`Rated ${v} stars! ⭐`, 'success'); }} />
                        </div>

                        {/* Timer */}
                        <div style={{ marginTop: '1rem' }}>
                            <RecipeTimer />
                        </div>
                    </div>

                    {/* Right */}
                    <div className="details-info-col">
                        <div className="details-chips">
                            {meal.strArea && <span className="chip">{meal.strArea}</span>}
                            {meal.strCategory && <span className="chip">{meal.strCategory}</span>}
                            <span className="chip">{difficulty}</span>
                        </div>
                        <h1 className="details-title">{meal.strMeal}</h1>

                        <div className="stats-row">
                            <div className="stat-box"><p className="stat-label">Prep Time</p><p className="stat-value">~45 min</p></div>
                            <div className="stat-box"><p className="stat-label">Serves</p><p className="stat-value">4 people</p></div>
                            <div className="stat-box"><p className="stat-label">Origin</p><p className="stat-value">{meal.strArea}</p></div>
                        </div>

                        {/* Ingredients */}
                        <div className="section-divider"><h2>Ingredients</h2></div>
                        <div className="ingredient-list">
                            {ingredients.map((ing, i) => (
                                <div key={i} className="ingredient-row">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className="ing-dot" />
                                        <span className="ing-name">{ing.name}</span>
                                    </div>
                                    <span className="ing-measure">{ing.measure}</span>
                                </div>
                            ))}
                        </div>

                        {/* Notes */}
                        <div style={{ marginBottom: '2rem' }}>
                            <NoteEditor mealId={id} />
                        </div>

                        {/* Instructions */}
                        <div className="section-divider"><h2>Instructions</h2></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex', gap: '1.5rem', cursor: 'pointer', padding: '1rem',
                                        borderRadius: '16px', transition: 'all 0.3s',
                                        background: doneSteps.includes(idx) ? 'rgba(107,46,62,0.04)' : 'transparent',
                                        opacity: doneSteps.includes(idx) ? 0.4 : 1,
                                    }}
                                    onClick={() => setDoneSteps(p => p.includes(idx) ? p.filter(x => x !== idx) : [...p, idx])}
                                >
                                    <div style={{
                                        minWidth: '40px', height: '40px', borderRadius: '50%',
                                        border: '2px solid var(--border)', background: doneSteps.includes(idx) ? 'var(--primary)' : 'white',
                                        color: doneSteps.includes(idx) ? 'white' : 'var(--primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                                    }}>
                                        {doneSteps.includes(idx) ? <CheckCircle2 size={18} /> : idx + 1}
                                    </div>
                                    <p className="instructions-text" style={{ paddingTop: '0.4rem' }}>{step.trim()}</p>
                                </div>
                            ))}
                        </div>

                        {meal.strYoutube && (
                            <a href={meal.strYoutube} target="_blank" rel="noreferrer" className="yt-btn">
                                <Youtube size={24} /> Watch Tutorial
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating bar */}
            <nav className="floating-toolbar">
                <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? 'var(--primary)' : 'var(--text)', transition: 'all 0.3s' }}>
                    <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Link copied!', 'success'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', transition: 'all 0.3s' }}>
                    <Share2 size={22} />
                </button>
                <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
                <button onClick={() => window.print()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', transition: 'all 0.3s' }}>
                    <Printer size={22} />
                </button>
            </nav>
        </div>
    );
};

export default MealDetails;
