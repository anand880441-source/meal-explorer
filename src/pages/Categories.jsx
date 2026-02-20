import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, ArrowRight } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    if (loading) return (
        <div className="spinner-wrap">
            <div className="spinner" />
            <p className="spinner-text">Organizing the pantry…</p>
        </div>
    );

    return (
        <div className="categories-page">
            <div className="page-header">
                <p className="page-eyebrow">Taxonomy of Flavors</p>
                <h1 className="page-title">Explore by Essence</h1>
                <p className="page-subtitle">Journey through our meticulously organized collections to find exactly what speaks to your palate.</p>
            </div>

            <div className="categories-grid">
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.idCategory}
                        className="category-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        onClick={() => navigate(`/?category=${cat.strCategory}`)}
                    >
                        <img src={cat.strCategoryThumb} alt={cat.strCategory} />
                        <div className="category-overlay">
                            <p className="category-series">Signature Series</p>
                            <h3 className="category-name">{cat.strCategory}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {cat.strCategoryDescription}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
