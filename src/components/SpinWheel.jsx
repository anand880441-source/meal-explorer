import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CUISINES = [
    { label: 'Italian 🍝', area: 'Italian' },
    { label: 'Japanese 🍜', area: 'Japanese' },
    { label: 'Mexican 🌮', area: 'Mexican' },
    { label: 'Indian 🍛', area: 'Indian' },
    { label: 'Chinese 🥡', area: 'Chinese' },
    { label: 'French 🥐', area: 'French' },
    { label: 'Thai 🍲', area: 'Thai' },
    { label: 'American 🍔', area: 'American' },
    { label: 'Greek 🫒', area: 'Greek' },
    { label: 'Turkish 🥙', area: 'Turkish' },
];

const SpinWheel = ({ open, onClose }) => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [rotation, setRotation] = useState(0);
    const navigate = useNavigate();

    const spin = () => {
        if (spinning) return;
        setResult(null);
        setSpinning(true);
        const winner = Math.floor(Math.random() * CUISINES.length);
        const extraSpins = 5 + Math.random() * 5;
        const deg = rotation + extraSpins * 360 + (winner / CUISINES.length) * 360;
        setRotation(deg);
        setTimeout(() => {
            setSpinning(false);
            setResult(CUISINES[winner]);
        }, 3500);
    };

    const handleExplore = async () => {
        if (!result) return;
        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${result.area}`);
            const data = await res.json();
            const meals = data.meals || [];
            const pick = meals[Math.floor(Math.random() * meals.length)];
            if (pick) { onClose(); navigate(`/meal/${pick.idMeal}`); }
        } catch { }
    };

    const segmentAngle = 360 / CUISINES.length;
    const r = 130; // radius
    const cx = 150, cy = 150;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(44,24,16,0.7)',
                        backdropFilter: 'blur(8px)', zIndex: 2000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--card-bg)', borderRadius: '40px',
                            padding: '3rem 2.5rem', width: '90vw', maxWidth: '480px',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                            textAlign: 'center', position: 'relative',
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: '1.25rem', right: '1.25rem',
                                background: 'none', border: '1.5px solid var(--border)',
                                borderRadius: '50%', width: '36px', height: '36px',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <X size={16} />
                        </button>

                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontStyle: 'italic', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                            Spin the Wheel
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', fontWeight: 500 }}>
                            Let fate pick your next culinary adventure
                        </p>

                        {/* Wheel */}
                        <div style={{ position: 'relative', width: '300px', margin: '0 auto 2rem' }}>
                            {/* Pointer */}
                            <div style={{
                                position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                                width: 0, height: 0,
                                borderLeft: '12px solid transparent',
                                borderRight: '12px solid transparent',
                                borderTop: '24px solid var(--primary)',
                                zIndex: 2,
                            }} />
                            <motion.svg
                                width="300" height="300" viewBox="0 0 300 300"
                                animate={{ rotate: rotation }}
                                transition={{ duration: 3.5, ease: [0.17, 0.67, 0.25, 1] }}
                            >
                                {CUISINES.map((c, i) => {
                                    const start = (i * segmentAngle - 90) * (Math.PI / 180);
                                    const end = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
                                    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
                                    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
                                    const mid = (start + end) / 2;
                                    const tx = cx + (r * 0.65) * Math.cos(mid);
                                    const ty = cy + (r * 0.65) * Math.sin(mid);
                                    const hue = (i / CUISINES.length) * 360;
                                    const fill = `oklch(55% 0.13 ${hue + 15})`;
                                    return (
                                        <g key={c.area}>
                                            <path
                                                d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                                                fill={fill} stroke="white" strokeWidth="2"
                                            />
                                            <text
                                                x={tx} y={ty}
                                                textAnchor="middle" dominantBaseline="middle"
                                                fontSize="11" fill="white" fontWeight="700"
                                                transform={`rotate(${i * segmentAngle + segmentAngle / 2}, ${tx}, ${ty})`}
                                            >
                                                {c.label.split(' ')[0]}
                                            </text>
                                        </g>
                                    );
                                })}
                                <circle cx={cx} cy={cy} r="22" fill="white" stroke="var(--primary)" strokeWidth="3" />
                            </motion.svg>
                        </div>

                        {result && !spinning ? (
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{result.label.split(' ')[1]}</p>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--primary)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                                    {result.label.split(' ')[0]} Cuisine!
                                </h3>
                                <button
                                    onClick={handleExplore}
                                    style={{
                                        background: 'var(--primary)', color: 'white',
                                        border: 'none', borderRadius: '100px',
                                        padding: '0.9rem 2.5rem', fontWeight: 800,
                                        fontSize: '1rem', cursor: 'pointer',
                                        fontFamily: 'Inter, sans-serif',
                                        boxShadow: '0 4px 15px rgba(107,46,62,0.35)',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto',
                                    }}
                                >
                                    <Zap size={18} /> Explore Now
                                </button>
                            </motion.div>
                        ) : (
                            <button
                                onClick={spin}
                                disabled={spinning}
                                style={{
                                    background: spinning ? 'var(--text-muted)' : 'var(--primary)',
                                    color: 'white', border: 'none', borderRadius: '100px',
                                    padding: '1rem 3rem', fontWeight: 800, fontSize: '1.1rem',
                                    cursor: spinning ? 'not-allowed' : 'pointer',
                                    fontFamily: 'Inter, sans-serif',
                                    transition: 'all 0.3s',
                                    boxShadow: spinning ? 'none' : '0 4px 15px rgba(107,46,62,0.35)',
                                }}
                            >
                                {spinning ? 'Spinning…' : '🎡 Spin!'}
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SpinWheel;
