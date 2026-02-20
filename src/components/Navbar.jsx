import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, Heart, Shuffle, UtensilsCrossed, ShoppingCart, CalendarDays, SplitSquareVertical, Award, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const NAV_ITEMS = [
    { to: '/', label: 'Discover', icon: Search, end: true },
    { to: '/categories', label: 'Categories', icon: Grid },
    { to: '/liked', label: 'Collection', icon: Heart },
    { to: '/grocery', label: 'Grocery', icon: ShoppingCart },
    { to: '/planner', label: 'Planner', icon: CalendarDays },
    { to: '/compare', label: 'Compare', icon: SplitSquareVertical },
    { to: '/achievements', label: 'Badges', icon: Award },
];

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSurprise = async () => {
        try {
            const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await res.json();
            if (data.meals?.[0]) {
                addToast(`🍽️ Surprise! Trying ${data.meals[0].strMeal}`, 'success');
                navigate(`/meal/${data.meals[0].idMeal}`);
            }
        } catch { addToast('Could not load a surprise meal.', 'error'); }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* Brand */}
                    <Link to="/" className="nav-brand">
                        <div className="brand-icon"><UtensilsCrossed size={20} /></div>
                        Meal<span className="accent">Pro</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="nav-links" style={{ gap: '0.15rem' }}>
                        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                            <NavLink
                                key={to} to={to} end={end}
                                className={({ isActive }) => isActive ? 'active' : ''}
                                style={{ fontSize: '0.82rem' }}
                            >
                                <Icon size={14} /> {label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="nav-actions">
                        <motion.button
                            onClick={handleSurprise}
                            whileTap={{ scale: 0.92 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.55rem 1.1rem', borderRadius: '100px',
                                background: 'var(--secondary)', color: 'white',
                                border: 'none', fontWeight: 800, fontSize: '0.8rem',
                                cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            <Shuffle size={14} /> Surprise
                        </motion.button>

                        <motion.button
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.55rem 1rem', borderRadius: '100px',
                                border: '1.5px solid var(--border)',
                                background: isDarkMode ? 'var(--primary)' : 'transparent',
                                color: isDarkMode ? 'white' : 'var(--text-muted)',
                                fontWeight: 800, fontSize: '0.8rem',
                                cursor: 'pointer', transition: 'all 0.4s',
                                fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                            }}
                        >
                            {isDarkMode ? '🌞 Light' : '🌙 Dark'}
                        </motion.button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(p => !p)}
                            style={{ display: 'none', background: 'none', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                            className="hamburger-btn"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', zIndex: 999, position: 'relative' }}
                    >
                        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                                <NavLink
                                    key={to} to={to} end={end}
                                    onClick={() => setMobileOpen(false)}
                                    style={({ isActive }) => ({
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.75rem 1rem', borderRadius: '12px',
                                        fontWeight: 700, fontSize: '0.9rem',
                                        background: isActive ? 'var(--primary)' : 'transparent',
                                        color: isActive ? 'white' : 'var(--text-muted)',
                                        textDecoration: 'none', transition: 'all 0.2s',
                                    })}
                                >
                                    <Icon size={16} /> {label}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
        </>
    );
};

export default Navbar;
