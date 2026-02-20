import React, { useState } from 'react';
import { setRating as saveRating, getRating, checkBadges } from '../utils/localStorageHelper';

const RatingStars = ({ mealId, size = 20, readOnly = false, onChange }) => {
    const [hovered, setHovered] = useState(0);
    const saved = getRating(mealId);
    const display = hovered || saved;

    const handleClick = (star) => {
        if (readOnly) return;
        const newVal = saved === star ? 0 : star; // click same star to clear
        saveRating(mealId, newVal);
        checkBadges();
        onChange?.(newVal);
    };

    return (
        <div
            style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}
            onMouseLeave={() => setHovered(0)}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readOnly && setHovered(star)}
                    aria-label={`Rate ${star} stars`}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: readOnly ? 'default' : 'pointer',
                        padding: '1px',
                        fontSize: size,
                        lineHeight: 1,
                        transition: 'transform 0.15s',
                        transform: hovered === star && !readOnly ? 'scale(1.3)' : 'scale(1)',
                        color: star <= display ? 'var(--secondary)' : 'var(--border)',
                        filter: star <= display ? 'none' : 'grayscale(1)',
                    }}
                >
                    ★
                </button>
            ))}
            {saved > 0 && (
                <span style={{ fontSize: '0.72rem', marginLeft: '4px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {saved}/5
                </span>
            )}
        </div>
    );
};

export default RatingStars;
