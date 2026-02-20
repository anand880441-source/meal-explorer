// ─────────────────────────────────────────────────────────
//  Meal Explorer Pro — localStorage & sessionStorage helpers
// ─────────────────────────────────────────────────────────

const KEYS = {
    LIKED: 'mep_liked_ids',
    RATINGS: 'mep_ratings',       // { [mealId]: 1-5 }
    NOTES: 'mep_notes',           // { [mealId]: "string" }
    STREAK: 'mep_streak',         // { lastDate: "YYYY-MM-DD", count: N }
    BADGES: 'mep_badges',         // Set as array of badge keys
    TRENDING: 'mep_trending',     // sessionStorage: { [mealId]: count }
};

const notify = () => window.dispatchEvent(new Event('likedMealsChanged'));
const get = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const set = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ── Liked Meals ──────────────────────────────────────────
export const getLikedMeals = () => get(KEYS.LIKED) || [];
export const isMealLiked = (id) => getLikedMeals().includes(id);
export const addLikedMeal = (id) => { const ids = getLikedMeals(); if (!ids.includes(id)) { set(KEYS.LIKED, [...ids, id]); notify(); } };
export const removeLikedMeal = (id) => { set(KEYS.LIKED, getLikedMeals().filter(x => x !== id)); notify(); };
export const clearLikedMeals = () => { localStorage.removeItem(KEYS.LIKED); notify(); };

// ── Star Ratings ─────────────────────────────────────────
export const getRatings = () => get(KEYS.RATINGS) || {};
export const getRating = (id) => getRatings()[id] || 0;
export const setRating = (id, stars) => { set(KEYS.RATINGS, { ...getRatings(), [id]: stars }); window.dispatchEvent(new Event('ratingsChanged')); };

// ── Personal Notes ────────────────────────────────────────
export const getNotes = () => get(KEYS.NOTES) || {};
export const getNote = (id) => getNotes()[id] || '';
export const setNote = (id, text) => { set(KEYS.NOTES, { ...getNotes(), [id]: text }); };
export const clearNote = (id) => { const n = getNotes(); delete n[id]; set(KEYS.NOTES, n); };

// ── Cooking Streak ────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];

export const getStreak = () => get(KEYS.STREAK) || { lastDate: null, count: 0 };

export const updateStreak = () => {
    const streak = getStreak();
    const t = today();
    if (streak.lastDate === t) return streak;            // already marked today
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    const isConsecutive = streak.lastDate === yStr;
    const newStreak = { lastDate: t, count: isConsecutive ? streak.count + 1 : 1 };
    set(KEYS.STREAK, newStreak);
    return newStreak;
};

// ── Chef Badges ───────────────────────────────────────────
export const BADGE_DEFS = [
    { key: 'first_save', label: 'First Save', icon: '❤️', desc: 'Saved your first recipe' },
    { key: 'five_saves', label: 'Collector', icon: '📚', desc: 'Saved 5 recipes' },
    { key: 'ten_saves', label: 'Archivist', icon: '🗄️', desc: 'Saved 10 recipes' },
    { key: 'first_rate', label: 'Critic', icon: '⭐', desc: 'Rated your first recipe' },
    { key: 'five_ratings', label: 'Expert Critic', icon: '🏆', desc: 'Rated 5 recipes' },
    { key: 'first_note', label: 'Annotator', icon: '📝', desc: 'Added your first note' },
    { key: 'three_streak', label: 'Consistent Chef', icon: '🔥', desc: '3-day cooking streak' },
    { key: 'seven_streak', label: 'Iron Chef', icon: '👨‍🍳', desc: '7-day cooking streak' },
    { key: 'globetrotter', label: 'Globetrotter', icon: '🌍', desc: 'Saved meals from 3 cuisines' },
];

export const getBadges = () => get(KEYS.BADGES) || [];
export const hasBadge = (key) => getBadges().includes(key);
export const unlockBadge = (key) => {
    if (hasBadge(key)) return false;
    set(KEYS.BADGES, [...getBadges(), key]);
    window.dispatchEvent(new CustomEvent('badgeUnlocked', { detail: key }));
    return true;
};

// Automatically check and unlock badges based on current state
export const checkBadges = () => {
    const liked = getLikedMeals();
    const ratings = getRatings();
    const notes = getNotes();
    const streak = getStreak();

    if (liked.length >= 1) unlockBadge('first_save');
    if (liked.length >= 5) unlockBadge('five_saves');
    if (liked.length >= 10) unlockBadge('ten_saves');
    if (Object.keys(ratings).length >= 1) unlockBadge('first_rate');
    if (Object.keys(ratings).length >= 5) unlockBadge('five_ratings');
    if (Object.keys(notes).length >= 1) unlockBadge('first_note');
    if (streak.count >= 3) unlockBadge('three_streak');
    if (streak.count >= 7) unlockBadge('seven_streak');
};

// ── Trending (sessionStorage) ─────────────────────────────
export const trackView = (id) => {
    try {
        const raw = sessionStorage.getItem(KEYS.TRENDING);
        const data = raw ? JSON.parse(raw) : {};
        data[id] = (data[id] || 0) + 1;
        sessionStorage.setItem(KEYS.TRENDING, JSON.stringify(data));
    } catch { }
};

export const getTrending = () => {
    try {
        const raw = sessionStorage.getItem(KEYS.TRENDING);
        const data = raw ? JSON.parse(raw) : {};
        return Object.entries(data)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([id]) => id);
    } catch { return []; }
};
