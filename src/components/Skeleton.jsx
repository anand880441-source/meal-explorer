import React from 'react';

export const MealCardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton skeleton-img" />
        <div className="skeleton-body">
            <div className="skeleton skeleton-line skeleton-title" />
            <div className="skeleton skeleton-line" style={{ width: '60%' }} />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <div className="skeleton skeleton-line" style={{ height: '36px', flex: 1 }} />
                <div className="skeleton skeleton-line" style={{ height: '36px', flex: 1 }} />
            </div>
        </div>
    </div>
);

export default MealCardSkeleton;
