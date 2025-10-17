
import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';

const HeroSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    return (
        <section ref={sectionRef} id="hero" className="min-h-screen py-[8vh] px-[4vw] flex flex-col justify-center items-center bg-[#aec5e7]">
            <div className={`container text-center transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-800">LABIRINTAR</h1>
                <p className="mt-6 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                    Somos a inteligência em rede por trás da construção da Escola em Tempo Integral.
                </p>
            </div>
        </section>
    );
};

export default HeroSection;
