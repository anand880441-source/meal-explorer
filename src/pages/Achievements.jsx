import React from 'react';
import BadgeDisplay from '../components/BadgeDisplay';
import { getStreak } from '../utils/localStorageHelper';

const Achievements = () => {
    const streak = getStreak();

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <p style={{ color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                    Your Journey
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--primary)', fontStyle: 'italic' }}>
                    Achievements
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                    Track your culinary milestones and cooking streak.
                </p>
            </div>

            {/* Streak card */}
            <div style={{
                background: streak.count >= 3 ? 'var(--primary)' : 'var(--card-bg)',
                color: streak.count >= 3 ? 'white' : 'var(--text)',
                borderRadius: '28px',
                padding: '2.5rem',
                marginBottom: '2rem',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
            }}>
                <div style={{ fontSize: '4rem', lineHeight: 1 }}>
                    {streak.count === 0 ? '🍳' : streak.count < 3 ? '🔥' : streak.count < 7 ? '🔥🔥' : '👨‍🍳'}
                </div>
                <div>
                    <p style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.7, marginBottom: '0.4rem' }}>
                        Cooking Streak
                    </p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>
                        {streak.count} <span style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                            {streak.count === 1 ? 'day' : 'days'}
                        </span>
                    </p>
                    <p style={{ marginTop: '0.5rem', opacity: 0.75, fontSize: '0.9rem', fontWeight: 500 }}>
                        {streak.count === 0
                            ? 'Visit a recipe today to start your streak!'
                            : streak.count < 3
                                ? `Keep going — ${3 - streak.count} more day${3 - streak.count !== 1 ? 's' : ''} to earn "Consistent Chef"!`
                                : streak.count < 7
                                    ? `Amazing dedication! ${7 - streak.count} days to "Iron Chef"!`
                                    : '🏆 You\'ve earned Iron Chef status!'}
                    </p>
                </div>
            </div>

            {/* Badges */}
            <BadgeDisplay />
        </div>
    );
};

export default Achievements;
