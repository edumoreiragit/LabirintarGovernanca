
import React, { useRef, useState, useEffect } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { TRACTION_DATA } from '../constants';

const AnimatedCounter: React.FC<{ endValue: number, duration?: number, suffix?: string }> = ({ endValue, duration = 1500, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = endValue;
        if (start === end) return;

        let startTime: number | null = null;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * (end - start) + start));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }, [endValue, duration]);
    
    if(suffix === 'k+'){
        return <>{count}k+</>;
    }

    return <>{count}</>;
};

const TractionSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef, { threshold: 0.5 });

    return (
        <section ref={sectionRef} id="traction" className="min-h-screen py-[8vh] px-[4vw] flex flex-col justify-center items-center">
            <div className={`container text-center transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Nascemos no Chão da Escola.<br />E já estamos <span className="accent-color">crescendo</span>.
                </h2>
                <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                    Nosso modelo foi validado no mundo real, gerando receita, impacto pedagógico e a confiança de nossos primeiros parceiros.
                </p>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {TRACTION_DATA.map(item => (
                        <div key={item.id} className="text-center">
                            <p className="text-5xl font-bold accent-color">
                                {isVisible ? <AnimatedCounter endValue={item.endValue} suffix={item.suffix} /> : 0}
                            </p>
                            <p className="mt-2 text-gray-600">{item.label}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-16 bg-[#aec5e7] p-8 rounded-2xl max-w-4xl mx-auto">
                    <p className="text-xl italic text-gray-700">"Estamos encantados com a proposta da Labirintar, que nos ajuda a 'sair da caixinha', algo que a diretoria enfatiza constantemente. A abordagem de oferecer uma 'degustação' do produto foi crucial para superar nossa insegurança e materializar o valor da inovação."</p>
                    <p className="mt-4 font-semibold text-right text-gray-800">- Adrieli Ferreira, Escola Builders (referência em inovação)</p>
                </div>
            </div>
        </section>
    );
};

export default TractionSection;
