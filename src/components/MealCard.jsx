import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, MapPin, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { isMealLiked, addLikedMeal, removeLikedMeal, getRating, trackView, checkBadges } from '../utils/localStorageHelper';

const MealCard = ({ meal }) => {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        setLiked(isMealLiked(meal.idMeal));
        setRating(getRating(meal.idMeal));
        const sync = () => { setLiked(isMealLiked(meal.idMeal)); setRating(getRating(meal.idMeal)); };
        window.addEventListener('likedMealsChanged', sync);
        window.addEventListener('ratingsChanged', sync);
        return () => { window.removeEventListener('likedMealsChanged', sync); window.removeEventListener('ratingsChanged', sync); };
    }, [meal.idMeal]);

    const handleLike = (e) => {
        e.stopPropagation();
        if (!liked) {
            confetti({
                particleCount: 80, spread: 65,
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
                colors: ['#6B2E3E', '#C96B4A', '#E8A87C'],
            });
            addLikedMeal(meal.idMeal);
        } else {
            removeLikedMeal(meal.idMeal);
        }
        checkBadges();
        setLiked(p => !p);
    };

    const handleClick = () => {
        trackView(meal.idMeal);
        navigate(`/meal/${meal.idMeal}`);
    };

    return (
        <motion.div
            className="meal-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClick}
        >
            <div className="meal-card-img-wrap">
                <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-card-img" />
                <div className="meal-card-overlay" />

                <div className="meal-card-tags">
                    {meal.strCategory && <span className="category-chip">{meal.strCategory}</span>}
                    <button className={`like-btn${liked ? ' liked' : ''}`} onClick={handleLike} aria-label="Like">
                        <Heart size={18} fill={liked ? 'currentColor' : 'none'} color="white" />
                    </button>
                </div>

                {meal.strArea && (
                    <div className="area-float">
                        <MapPin size={11} /> {meal.strArea}
                    </div>
                )}

                {/* Rating badge */}
                {rating > 0 && (
                    <div style={{
                        position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(44,24,16,0.8)', color: 'var(--accent)',
                        padding: '0.2rem 0.7rem', borderRadius: '100px',
                        fontSize: '0.72rem', fontWeight: 900,
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        backdropFilter: 'blur(6px)',
                    }}>
                        <Star size={10} fill="currentColor" /> {rating}/5
                    </div>
                )}
            </div>

            <div className="meal-card-body">
                <h3 className="meal-name">{meal.strMeal}</h3>
                <div className="meal-card-footer">
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} style={{ fontSize: '0.9rem', color: s <= rating ? 'var(--secondary)' : 'var(--border)' }}>★</span>
                        ))}
                    </div>
                    <div className="view-link">
                        Explore <ArrowUpRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MealCard;
