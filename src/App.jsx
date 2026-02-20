import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Search from './pages/Search';
import MealDetails from './pages/MealDetails';
import Categories from './pages/Categories';
import LikedMeals from './pages/LikedMeals';
import GroceryList from './pages/GroceryList';
import MealPlanner from './pages/MealPlanner';
import MealComparison from './pages/MealComparison';
import Achievements from './pages/Achievements';
import ErrorBoundary from './components/ErrorBoundary';
import { BadgeToast } from './components/BadgeDisplay';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

function App() {
    const location = useLocation();

    return (
        <ThemeProvider>
            <ToastProvider>
                <ErrorBoundary>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <Routes location={location}>
                                    <Route path="/" element={<Search />} />
                                    <Route path="/meal/:id" element={<MealDetails />} />
                                    <Route path="/categories" element={<Categories />} />
                                    <Route path="/liked" element={<LikedMeals />} />
                                    <Route path="/grocery" element={<GroceryList />} />
                                    <Route path="/planner" element={<MealPlanner />} />
                                    <Route path="/compare" element={<MealComparison />} />
                                    <Route path="/achievements" element={<Achievements />} />
                                </Routes>
                            </motion.div>
                        </AnimatePresence>
                    </main>
                    {/* Global badge pop-up */}
                    <BadgeToast />
                </ErrorBoundary>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
