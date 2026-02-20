import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const pad = (n) => String(n).padStart(2, '0');

const PRESETS = [
    { label: '5 min', seconds: 300 },
    { label: '15 min', seconds: 900 },
    { label: '30 min', seconds: 1800 },
    { label: '45 min', seconds: 2700 },
    { label: '1 hour', seconds: 3600 },
];

const RecipeTimer = () => {
    const [total, setTotal] = useState(900);   // 15 min default
    const [remaining, setRemaining] = useState(900);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setRunning(false);
                        // Browser notification if permission granted
                        try {
                            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                                new Notification('⏰ Timer Done! Your dish is ready!');
                            } else {
                                setTimeout(() => alert('⏰ Timer complete! Your dish is ready!'), 100);
                            }
                        } catch {
                            setTimeout(() => alert('⏰ Timer complete! Your dish is ready!'), 100);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running]);

    const reset = () => { setRunning(false); setRemaining(total); };
    const selectPreset = (s) => { setRunning(false); setTotal(s); setRemaining(s); };

    const pct = ((total - remaining) / total) * 100;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const isUrgent = remaining < 60 && remaining > 0;

    return (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Timer size={18} color="var(--secondary)" />
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Recipe Timer
                </span>
            </div>

            {/* Preset Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {PRESETS.map((p) => (
                    <button
                        key={p.seconds}
                        onClick={() => selectPreset(p.seconds)}
                        style={{
                            padding: '0.35rem 0.8rem',
                            borderRadius: '100px',
                            border: '1.5px solid var(--border)',
                            background: total === p.seconds ? 'var(--primary)' : 'transparent',
                            color: total === p.seconds ? 'white' : 'var(--text-muted)',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'Inter, sans-serif',
                        }}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Progress Arc + Time Display */}
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <div style={{
                    height: '6px',
                    background: 'var(--border)',
                    borderRadius: '100px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: isUrgent ? '#ef4444' : 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        borderRadius: '100px',
                        transition: 'width 1s linear, background 0.3s',
                    }} />
                </div>
            </div>

            {/* Clock Display */}
            <div style={{
                textAlign: 'center',
                fontFamily: "'Playfair Display', serif",
                fontSize: '3rem',
                fontWeight: 900,
                color: isUrgent ? '#ef4444' : 'var(--primary)',
                letterSpacing: '-2px',
                marginBottom: '1.25rem',
                transition: 'color 0.3s',
            }}>
                {pad(mins)}:{pad(secs)}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                    onClick={() => setRunning((p) => !p)}
                    disabled={remaining === 0}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.8rem',
                        borderRadius: '14px',
                        border: 'none',
                        background: running ? '#ef4444' : 'var(--primary)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: remaining === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.25s',
                        fontFamily: 'Inter, sans-serif',
                        opacity: remaining === 0 ? 0.5 : 1,
                    }}
                >
                    {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
                </button>
                <button
                    onClick={reset}
                    style={{
                        padding: '0.8rem 1rem',
                        borderRadius: '14px',
                        border: '1.5px solid var(--border)',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>
    );
};

export default RecipeTimer;
