import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBadges, BADGE_DEFS } from '../utils/localStorageHelper';
import { Award } from 'lucide-react';

const BadgeDisplay = ({ compact = false }) => {
    const [earned, setEarned] = useState(() => getBadges());

    useEffect(() => {
        const sync = () => setEarned(getBadges());
        window.addEventListener('badgeUnlocked', sync);
        return () => window.removeEventListener('badgeUnlocked', sync);
    }, []);

    const earnedSet = new Set(earned);

    if (compact) {
        // Just show a count badge for the navbar / header
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={16} color="var(--secondary)" />
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--secondary)' }}>
                    {earned.length}/{BADGE_DEFS.length}
                </span>
            </div>
        );
    }

    return (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            padding: '2rem',
            boxShadow: 'var(--shadow)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                        Chef Badges
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {earned.length} of {BADGE_DEFS.length} earned
                    </p>
                </div>
                <div style={{
                    width: '60px', height: '60px',
                    borderRadius: '50%',
                    background: `conic-gradient(var(--secondary) ${(earned.length / BADGE_DEFS.length) * 360}deg, var(--border) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'var(--card-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', fontWeight: 900,
                    }}>
                        {Math.round((earned.length / BADGE_DEFS.length) * 100)}%
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {BADGE_DEFS.map((badge) => {
                    const isEarned = earnedSet.has(badge.key);
                    return (
                        <motion.div
                            key={badge.key}
                            title={badge.desc}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                gap: '0.4rem', padding: '1rem 0.5rem',
                                borderRadius: '16px',
                                border: '1.5px solid',
                                borderColor: isEarned ? 'var(--secondary)' : 'var(--border)',
                                background: isEarned ? 'rgba(201,107,74,0.07)' : 'transparent',
                                opacity: isEarned ? 1 : 0.45,
                                filter: isEarned ? 'none' : 'grayscale(0.6)',
                                transition: 'all 0.3s',
                                cursor: 'default',
                            }}
                        >
                            <span style={{ fontSize: '2rem', lineHeight: 1 }}>{badge.icon}</span>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 800, textAlign: 'center',
                                color: isEarned ? 'var(--text)' : 'var(--text-muted)',
                                lineHeight: 1.3,
                            }}>
                                {badge.label}
                            </span>
                            {isEarned && (
                                <span style={{
                                    fontSize: '0.6rem', background: 'var(--secondary)', color: 'white',
                                    padding: '0.15rem 0.5rem', borderRadius: '100px', fontWeight: 800,
                                }}>
                                    EARNED
                                </span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Toast-style badge unlock notification — renders at app level
export const BadgeToast = () => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            const badge = BADGE_DEFS.find(b => b.key === e.detail);
            if (badge) {
                setToast(badge);
                setTimeout(() => setToast(null), 4000);
            }
        };
        window.addEventListener('badgeUnlocked', handler);
        return () => window.removeEventListener('badgeUnlocked', handler);
    }, []);

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 80, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.9 }}
                    style={{
                        position: 'fixed', bottom: '7rem', right: '2rem', zIndex: 9998,
                        background: 'var(--primary)', color: 'white',
                        borderRadius: '20px', padding: '1.25rem 1.75rem',
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                        maxWidth: '320px',
                    }}
                >
                    <span style={{ fontSize: '2.5rem' }}>{toast.icon}</span>
                    <div>
                        <p style={{ fontWeight: 900, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
                            Badge Unlocked!
                        </p>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontStyle: 'italic' }}>
                            {toast.label}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>
                            {toast.desc}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BadgeDisplay;
