
import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';

const SolutionSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    const cards = [
        { title: 'Escolas', text: 'Transformam espaços ociosos em nova receita e inovação pedagógica, com gestão zero.', rotation: '-rotate-6' },
        { title: 'Educadores', text: 'Encontram autonomia, remuneração justa e uma comunidade para empreender e transformar.', rotation: 'rotate-6' },
        { title: 'Famílias', text: 'Acessam experiências de alta qualidade que desenvolvem as competências do futuro.', rotation: 'rotate-3' },
        { title: 'Parceiros', text: 'Conectam suas soluções a uma rede qualificada, acelerando o impacto e o crescimento.', rotation: '-rotate-3' },
    ];

    return (
        <section ref={sectionRef} id="solution" className="min-h-screen py-[8vh] px-[4vw] flex flex-col justify-center items-center bg-[#aec5e7]">
            <div className={`container text-center transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
                    Não vendemos aulas.<br />Orquestramos um <span className="accent-color">Ecossistema Vivo</span>.
                </h2>
                <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto">
                    Conectamos escolas, educadores e famílias em uma plataforma única que transforma o contraturno em um polo de inovação, desenvolvimento e receita.
                </p>
                <div className="mt-12">
                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-[#ffa400] w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl">LAB</div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 md:gap-16">
                            {cards.map((card, index) => (
                                <div key={index} className={`bg-white p-6 rounded-2xl shadow-lg text-left relative transition hover:rotate-0 hover:scale-105 ${card.rotation}`}>
                                    <h3 className="font-bold text-xl">{card.title}</h3>
                                    <p className="text-gray-600 mt-2">{card.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolutionSection;
