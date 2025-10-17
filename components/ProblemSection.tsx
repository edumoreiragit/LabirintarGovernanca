
import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';

const ProblemSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    const stats = [
        { value: '70%', text: 'das famílias buscam ativamente escolas que desenvolvam habilidades socioemocionais.' },
        { value: '65%', text: 'das crianças de hoje trabalharão em profissões que ainda não existem.' },
        { value: 'Lei 14.640', text: 'A maioria das escolas está despreparada para a nova legislação do tempo integral.' },
    ];

    return (
        <section ref={sectionRef} id="problem" className="min-h-screen py-[8vh] px-[4vw] flex flex-col justify-center items-center">
            <div className={`container text-center transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    O Tempo Integral é Lei.<br />A Qualidade é <span className="accent-color">Desafio</span>.
                </h2>
                <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                    A simples extensão da carga horária, sem uma revolução pedagógica, cria um problema triplo: escolas sobrecarregadas, famílias insatisfeitas e crianças despreparadas para o futuro.
                </p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-6 bg-white rounded-2xl shadow-sm">
                            <p className="text-4xl font-bold accent-color">{stat.value}</p>
                            <p className="mt-2 text-gray-600">{stat.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
