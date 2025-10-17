import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { Audience } from '../types';

interface BifurcationSectionProps {
    onSelectAudience: (audience: Audience) => void;
}

const BifurcationSection: React.FC<BifurcationSectionProps> = ({ onSelectAudience }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    const profiles: { audience: Audience; icon: string; title: string; description: string; }[] = [
        { audience: 'investor', icon: '📈', title: 'Investidor(a)', description: 'Busco o futuro da educação e um modelo de alto impacto.' },
        { audience: 'school', icon: '🏫', title: 'Escola', description: 'Quero inovar, gerar receita e encantar famílias.' },
        { audience: 'educator', icon: '💡', title: 'Educador(a)', description: 'Quero empreender, transformar e ser valorizado.' },
        { audience: 'partner', icon: '🤝', title: 'Parceiro(a)', description: 'Acredito no poder das conexões para escalar.' },
    ];

    return (
        <section ref={sectionRef} id="bifurcation" className="min-h-screen py-[8vh] px-[4vw] flex flex-col justify-center items-center">
            <div className={`container text-center transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">A LABirintar é um ecossistema com um propósito para cada parceiro.</h2>
                <p className="mt-6 text-2xl text-gray-600">Quem é você nesta jornada?</p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {profiles.map(profile => (
                        <div key={profile.audience} onClick={() => onSelectAudience(profile.audience)} className="bg-white border border-gray-200 rounded-3xl p-8 transition duration-300 ease-in-out cursor-pointer hover:-translate-y-2.5 hover:shadow-2xl">
                            <div className="text-4xl mb-4">{profile.icon}</div>
                            <h3 className="text-2xl font-bold">{profile.title}</h3>
                            <p className="mt-2 text-gray-600">{profile.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BifurcationSection;