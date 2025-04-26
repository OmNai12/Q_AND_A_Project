// pages/LandingPage.jsx
// import { useState } from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow">
                <HeroSection />
                <FeatureSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;