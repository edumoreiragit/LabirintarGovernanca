import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ReferenceLine, Label,
} from 'recharts';
import { PITCH_DECK_DATA } from '../content/pitchDeckSlides';
import { REVENUE_SPLIT_DATA, USE_OF_FUNDS_INVESTOR_DATA, REVENUE_PROJECTION_DATA, TEAM_PHOTOS, LOGOS } from '../content/assets';
import { Slide, Audience, TrackId, NinaResponse } from '../types';
import NinaAI from './NinaAI';
import * as geminiService from '../services/geminiService';
import NetworkLightbox from './NetworkLightbox';

const SpecialistNetworkGraph = lazy(() => import('./NetworkGraph'));


const DoughnutChart: React.FC<{ data: { name: string; value: number; fill: string }[]; showLegend?: boolean }> = ({ data, showLegend = true }) => (
    <ResponsiveContainer width="100%" height={350}>
        <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} innerRadius={80} outerRadius={120} fill="#8884d8" dataKey="value" nameKey="name">
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
            {showLegend && <Legend wrapperStyle={{fontSize: '0.8rem'}}/>}
        </PieChart>
    </ResponsiveContainer>
);

const ProjectionsChart: React.FC = () => (
    <ResponsiveContainer width="100%" height={350}>
        <LineChart data={REVENUE_PROJECTION_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value: number) => `R$${value/1000000}M`} />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value)} />
            <Legend wrapperStyle={{fontSize: '0.8rem'}}/>
            <Line type="monotone" dataKey="Receita (R$)" stroke="#ff595a" strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
    </ResponsiveContainer>
);

const BreakevenChart: React.FC = () => {
    const ticketMedio = 298;
    const taxaFixaEscala = 2000;
    const chartData = Array.from({ length: 16 }, (_, i) => i * 10).map(matriculas => { // up to 150 matriculas
        const receitaEntrada = 0.20 * matriculas * ticketMedio;
        const receitaEscala = (0.30 * matriculas * ticketMedio) - taxaFixaEscala;
        return {
            matriculas,
            'Modelo Entrada': receitaEntrada < 0 && matriculas > 0 ? 0 : receitaEntrada,
            'Modelo Escala': receitaEscala,
        };
    });

    return (
        <div className="mt-4">
            <h4 className="text-lg font-bold text-center mb-2 text-gray-700">Simulação de Lucro para a Escola</h4>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 25, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="matriculas" name="Nº de Matrículas" unit="" label={{ value: 'Nº de Matrículas', position: 'insideBottom', offset: -15 }} />
                    <YAxis 
                        tickFormatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits:0 }).format(value)} 
                        label={{ value: 'Lucro (R$)', angle: -90, position: 'insideLeft', offset: -20 }} 
                    />
                    <Tooltip 
                        formatter={(value: number, name: string) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), name]} 
                        labelFormatter={(label) => `Matrículas: ${label}`}
                    />
                    <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '10px'}}/>
                    <Line type="monotone" dataKey="Modelo Entrada" stroke="#ff595a" strokeWidth={2} activeDot={{ r: 6 }} dot={{r: 3}} />
                    <Line type="monotone" dataKey="Modelo Escala" stroke="#ffa400" strokeWidth={2} activeDot={{ r: 6 }} dot={{r: 3}}/>
                    <ReferenceLine x={68} stroke="#10B981" strokeDasharray="4 4">
                        <Label value="Ponto de Equilíbrio" position="insideTopLeft" fill="#10B981" fontSize="12" dy={-10} />
                    </ReferenceLine>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const Lightbox: React.FC<{ images: string[]; startIndex: number; onClose: () => void }> = ({ images, startIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4" onClick={onClose} role="dialog" aria-modal="true">
            <button aria-label="Fechar" onClick={onClose} className="absolute top-4 right-4 text-white text-5xl font-bold hover:text-gray-300 transition-colors z-10">&times;</button>
            
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
                 <button aria-label="Anterior" onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="text-white/70 hover:text-white text-6xl p-4 transition-colors">‹</button>
            </div>
           
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img src={images[currentIndex]} alt={`Visualização ampliada ${currentIndex + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" />
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <button aria-label="Próximo" onClick={(e) => { e.stopPropagation(); handleNext(); }} className="text-white/70 hover:text-white text-6xl p-4 transition-colors">›</button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

const CardCarousel: React.FC<{ images: string[]; onImageClick: (index: number) => void }> = ({ images, onImageClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative h-40 w-full mt-4 cursor-pointer overflow-hidden rounded-lg group flex-grow" onClick={() => onImageClick(0)}>
            {images.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt={`Demonstração da plataforma ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                />
            ))}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg font-bold">Ampliar</span>
            </div>
        </div>
    );
};

const useOnScreen = (ref: React.RefObject<HTMLElement>) => {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);

    return isIntersecting;
};

const AnimatedCounter: React.FC<{ stat: { value: number; text: string; prefix?: string; suffix?: string } }> = ({ stat }) => {
    const [count, setCount] = useState(0);
    const ref = React.useRef<HTMLSpanElement>(null);
    const isVisible = useOnScreen(ref);

    useEffect(() => {
        if (isVisible) {
            let start = 0;
            const end = stat.value;
            if (start === end) {
                setCount(end);
                return;
            }

            let startTime: number | null = null;
            const duration = 1500;

            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * (end - start) + start));
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    setCount(end);
                }
            };
            requestAnimationFrame(step);
        }
    }, [isVisible, stat.value]);

    return (
        <span ref={ref}>
            {stat.prefix || ''}{count}{stat.suffix || ''}
        </span>
    );
};


const SlideRenderer: React.FC<{ slide: Slide, onSelectAudience: (audience: Audience) => void, onAiInteraction: (prompt: string) => void, onImageClick: (images: string[], startIndex: number) => void, onOpenNetworkGraph: () => void }> = ({ slide, onSelectAudience, onAiInteraction, onImageClick, onOpenNetworkGraph }) => {
    const renderLayout = () => {
        switch (slide.layout) {
            case 'cover': {
                const hasBg = !!slide.backgroundImage;
                const titleColorClass = hasBg ? 'text-white drop-shadow-lg' : 'text-gray-800';
                const subtitleColorClass = hasBg ? 'text-white drop-shadow-lg' : 'text-gray-700';
                const mainMessageContainerClass = hasBg ? '' : 'text-gray-600';

                return (
                    <div className="h-full flex flex-col justify-start -mt-8">
                        <div className="text-center">
                            {slide.title && <h1 className={`text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-up ${titleColorClass}`} style={{ animationDelay: '100ms' }}>{slide.title}</h1>}
                            <p className={`text-2xl md:text-3xl max-w-3xl mx-auto animate-fade-in-up ${subtitleColorClass} ${slide.title ? 'mt-6' : ''}`} style={{ animationDelay: '300ms' }}>{slide.subtitle}</p>
                            {slide.mainMessage && <div className={`mt-2 text-xl ${mainMessageContainerClass} max-w-4xl mx-auto animate-fade-in-up`} style={{ animationDelay: '500ms' }}>{slide.mainMessage}</div>}
                        </div>
                    </div>
                );
            }
            case 'problem': {
                const hasBg = !!slide.backgroundImage;
                const titleColorClass = hasBg ? 'text-white drop-shadow-lg' : '';
                const mainMessageColorClass = 'text-white text-2xl drop-shadow-md';
                
                return (
                    <div className="text-center h-full flex flex-col justify-center">
                        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight leading-tight ${titleColorClass}`}>{slide.title}</h2>
                            <p className={`mt-6 max-w-4xl mx-auto ${mainMessageColorClass}`}>{slide.mainMessage}</p>
                        </div>
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            {slide.stats?.map((stat, index) => (
                                <div key={index} className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg animate-fade-in-up" style={{ animationDelay: `${300 + index * 200}ms` }}>
                                    <p className="text-3xl font-bold accent-color">{stat.prefix || ''}{stat.value}{stat.suffix || ''}</p>
                                    <p className="mt-2 text-gray-800 font-medium">{stat.text}</p>
                                </div>
                            ))}
                        </div>
                        {slide.highlightCard && (
                            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: `${300 + (slide.stats?.length || 0) * 200}ms` }}>
                                <div className="inline-block bg-[#ff595a] text-white py-3 px-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                    <p className="text-3xl font-bold tracking-tight">{slide.highlightCard.text}</p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
             case 'solution': {
                const [carouselIndex, setCarouselIndex] = useState(0);
            
                useEffect(() => {
                    if (!slide.carouselImages || slide.carouselImages.length === 0) return;
            
                    const timer = setInterval(() => {
                        setCarouselIndex(prevIndex => (prevIndex + 1) % (slide.carouselImages?.length || 1));
                    }, 1750); // Change image every 1.75 seconds
            
                    return () => clearInterval(timer);
                }, [slide.carouselImages]);
            
                if (!slide.carouselImages) return <div>Missing Carousel Images</div>;
            
                return (
                    <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                        {/* Left Column */}
                        <div className="flex flex-col justify-center h-full">
                            <div className="text-center">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{slide.title}</h2>
                                <p className="mt-4 text-md text-gray-700 max-w-md mx-auto">{slide.mainMessage}</p>
                            </div>
                            <div className="mt-6 relative max-w-sm mx-auto">
                                <div className="absolute inset-0 flex items-center justify-center">
                                     <img src="https://edumoreiragit.github.io/Imagens/Labirintar/IMG_3281.png" alt="Nina AI" className="w-24 h-24 object-cover rounded-full shadow-lg"/>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    {slide.cards?.map((card, index) => (
                                        <div key={index} className={`bg-[#ffe9c9]/60 p-5 rounded-2xl shadow-lg text-left relative transition hover:!rotate-0 hover:scale-105 ${card.rotation}`}>
                                            <h3 className="font-bold text-md">{card.title}</h3>
                                            <p className="text-gray-600 mt-1 text-xs">{card.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
            
                        {/* Right Column - Carousel */}
                        <div className="flex flex-col justify-center h-full">
                            <h3 className="text-xl font-bold text-center mb-4 text-gray-700">Componentes Extracurriculares</h3>
                            <div className="relative flex-grow w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
                               {slide.carouselImages.map((image, index) => (
                                    <div
                                        key={image.url}
                                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === carouselIndex ? 'opacity-100' : 'opacity-0'}`}
                                        aria-hidden={index !== carouselIndex}
                                    >
                                        <img src={image.url} alt={image.component} className="w-full h-full object-cover" loading="lazy" />
                                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                                            <h4 className="text-white font-bold text-lg drop-shadow-md">{image.component}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }
            case 'how-it-works':
                return (
                     <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{slide.title}</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{slide.mainMessage}</p>
                        {slide.cards && (
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                {slide.cards.map((card, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-6 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col ${card.action === 'openNetworkGraph' ? 'cursor-pointer group' : ''}`}
                                        onClick={card.action === 'openNetworkGraph' ? onOpenNetworkGraph : undefined}
                                        role={card.action === 'openNetworkGraph' ? 'button' : undefined}
                                        aria-label={card.action === 'openNetworkGraph' ? `Abrir visualização da ${card.title}` : undefined}
                                    >
                                        <h3 className="text-xl font-bold text-center">{card.title}</h3>
                                        <div className={`text-gray-600 text-sm mt-2 ${!card.carouselImages && card.action !== 'openNetworkGraph' ? 'flex-grow' : ''}`}>
                                          {card.text}
                                        </div>
                                        {card.carouselImages && (
                                            <CardCarousel 
                                                images={card.carouselImages} 
                                                onImageClick={(imageIndex) => onImageClick(card.carouselImages || [], imageIndex)}
                                            />
                                        )}
                                        {card.action === 'openNetworkGraph' && (
                                            <div className="relative h-40 w-full mt-4 rounded-lg flex-grow overflow-hidden bg-gray-100 border">
                                                <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>}>
                                                    <SpecialistNetworkGraph isPreview onSpecialtyClick={() => {}} />
                                                </Suspense>
                                                 <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                     <span className="text-white text-lg font-bold drop-shadow-md">Explorar Rede</span>
                                                 </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'traction': {
                const hasBg = !!slide.backgroundImage;
                const titleColorClass = hasBg ? 'text-white drop-shadow-lg' : 'text-gray-800';
                const mainMessageColorClass = hasBg ? 'text-gray-200 drop-shadow-md' : 'text-gray-600';
                const statTextColorClass = hasBg ? 'text-gray-200 drop-shadow-sm' : 'text-gray-600';
                const quoteBgClass = hasBg ? 'bg-black/30 backdrop-blur-sm' : 'bg-[#ffe9c9]/60';
                const quoteTextColorClass = hasBg ? 'text-white' : 'text-gray-700';
                const quoteAuthorColorClass = hasBg ? 'text-gray-200' : 'text-gray-800';

                return (
                     <div className="text-center flex flex-col justify-center h-full py-2">
                        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${titleColorClass}`}>{slide.title}</h2>
                            <p className={`mt-4 text-lg max-w-3xl mx-auto ${mainMessageColorClass}`}>{slide.mainMessage}</p>
                        </div>
                        {slide.stats && (
                             <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                                {slide.stats.map((item, index) => (
                                    <div key={item.text} className="text-center animate-fade-in-up" style={{ animationDelay: `${300 + index * 150}ms` }}>
                                        <p className="text-5xl font-bold accent-color">
                                            <AnimatedCounter stat={item} />
                                        </p>
                                        <p className={`mt-2 ${statTextColorClass}`}>{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {slide.quote && (
                            <div className={`mt-6 p-4 rounded-2xl max-w-4xl mx-auto animate-fade-in-up text-left ${quoteBgClass}`} style={{ animationDelay: `${300 + (slide.stats?.length || 0) * 150}ms` }}>
                                <div className={`text-sm leading-snug ${quoteTextColorClass}`}>{slide.quote.text}</div>
                                <p className={`mt-2 text-sm font-semibold text-right ${quoteAuthorColorClass}`}>- {slide.quote.author}</p>
                            </div>
                        )}
                    </div>
                );
            }
            case 'ecosystem':
                return (
                     <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{slide.title}</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{slide.mainMessage}</p>
                        {slide.cards && (
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                {slide.cards.map((card, index) => (
                                    <div key={index} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                                        <h3 className="text-xl font-bold text-center">{card.title}</h3>
                                        <div className={`text-gray-600 text-sm mt-2 ${!card.carouselImages ? 'flex-grow' : ''}`}>
                                          {card.text}
                                        </div>
                                        {card.carouselImages && (
                                            <CardCarousel 
                                                images={card.carouselImages} 
                                                onImageClick={(imageIndex) => onImageClick(card.carouselImages || [], imageIndex)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'social-proof':
                 return (
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{slide.title}</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{slide.mainMessage}</p>
                        {slide.fullWidthContent}
                        {slide.logos && (
                             <div className="mt-12 flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70">
                                 {slide.logos.map(logoKey => (
                                     <img key={logoKey} src={LOGOS[logoKey]} alt={`${logoKey} Logo`} className="h-10" />
                                 ))}
                            </div>
                        )}
                    </div>
                 );
            case 'bifurcation':
                 return (
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{slide.title}</h2>
                        <p className="mt-6 text-2xl text-gray-600">{slide.subtitle}</p>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {slide.bifurcationOptions?.map(profile => (
                                <div key={profile.audience} onClick={() => onSelectAudience(profile.audience)} className="group bg-white border border-gray-200 rounded-3xl transition duration-300 ease-in-out cursor-pointer hover:-translate-y-2 hover:shadow-2xl flex flex-col overflow-hidden">
                                    <div className="relative h-48 w-full">
                                        {profile.icon.startsWith('http') ? (
                                            <img src={profile.icon} alt={profile.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <span className="text-4xl">{profile.icon}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 text-center flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold">{profile.title}</h3>
                                        <p className="mt-2 text-gray-600 text-sm flex-grow">{profile.description}</p>
                                        <div className="mt-4 text-xs bg-[#ffe9c9]/80 rounded-full px-3 py-1 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{profile.subtext}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'generic':
                return(
                    <div className="h-full flex flex-col">
                        <div className="text-center mb-10">
                             <h2 className="text-3xl font-bold tracking-tight">{slide.title}</h2>
                             <p className="mt-3 text-lg text-gray-500">{slide.mainMessage || slide.subtitle}</p>
                        </div>
                        <div className={`flex-grow grid md:grid-cols-${slide.columns?.length || 1} gap-8 items-stretch`}>
                           {slide.columns?.map((col, index) => (
                               <div key={index} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                                   {col.icon && <div className="text-3xl mb-3 text-center">{col.icon}</div>}
                                   {col.title && <h3 className="text-xl font-bold mb-4 text-center">{col.title}</h3>}
                                   {col.text && <div className="text-gray-600 text-sm text-left flex-grow">{col.text}</div>}
                                   {col.checklist && (
                                        <ul className="text-left space-y-3 text-gray-600 text-sm flex-grow">
                                            {col.checklist.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <svg className={`w-5 h-5 mr-3 ${col.checklistColor || 'text-[#ff595a]'} flex-shrink-0 mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                               </div>
                           ))}
                        </div>
                    </div>
                );
            case 'financial':
                return(
                    <div className="h-full flex flex-col">
                        <div className="text-center mb-10">
                             <h2 className="text-3xl font-bold tracking-tight">{slide.title}</h2>
                             <p className="mt-3 text-lg text-gray-500">{slide.subtitle}</p>
                        </div>
                        <div className={`flex-grow grid md:grid-cols-${slide.columns?.length || 1} gap-12 items-center`}>
                           {slide.columns?.map((col, index) => (
                               <div key={index}>
                                   {col.title && <h3 className="text-2xl font-bold mb-4">{col.title}</h3>}
                                   {col.text && <div className="text-gray-600 space-y-3">{col.text}</div>}
                                   {col.list && (
                                       <ul className="mt-4 space-y-3">
                                           {col.list.map(item => (
                                               <li key={item.highlight}><span className={`font-bold ${item.colorClass}`}>{item.highlight}:</span> {item.text}</li>
                                           ))}
                                       </ul>
                                   )}
                                   {col.chart === 'revenue_split' && <DoughnutChart data={REVENUE_SPLIT_DATA} />}
                                   {col.chart === 'use_of_funds' && <DoughnutChart data={USE_OF_FUNDS_INVESTOR_DATA} showLegend={false} />}
                                   {col.chart === 'projections' && <ProjectionsChart />}
                               </div>
                           ))}
                        </div>
                    </div>
                );
             case 'financial-models': {
                const [model, setModel] = useState(slide.financialModels?.models[0].name || '');
                if (!slide.financialModels) return null;

                const selectedModel = slide.financialModels.models.find(m => m.name === model);
                const showChart = slide.financialModels.showBreakevenChart;

                return (
                    <div className="h-full flex flex-col">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold tracking-tight">{slide.title}</h2>
                            {slide.subtitle && <p className="mt-3 text-lg text-gray-500">{slide.subtitle}</p>}
                        </div>

                        <div className={`flex-grow grid ${showChart ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8 items-center`}>
                            {/* Left Column or Full Width Column */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-gray-100 p-1.5 rounded-full flex space-x-2 shadow-inner">
                                        {slide.financialModels.models.map(m => (
                                            <button
                                                key={m.name}
                                                onClick={() => setModel(m.name)}
                                                className={`py-2 px-6 rounded-full font-semibold text-sm transition-colors duration-300 ${model === m.name ? 'bg-[#ff595a] text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center w-full max-w-md p-6 bg-white/70 rounded-2xl shadow-md border">
                                    {selectedModel && (
                                        <div>
                                            <h4 className="text-2xl font-bold">{selectedModel.title}</h4>
                                            <p className="text-gray-700 mt-2 text-sm">{selectedModel.description}</p>
                                            <div className="mt-4 text-2xl font-bold">
                                                <p>
                                                    <span className="accent-color">{selectedModel.revenueShare}</span>
                                                    <span className="text-xl font-normal text-gray-800"> do faturamento para a escola</span>
                                                </p>
                                                {selectedModel.fee && (
                                                    <p className="text-base font-semibold text-gray-600 mt-1">{selectedModel.fee}</p>
                                                )}
                                            </div>
                                            {selectedModel.revenueShareDetails}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column (Chart) */}
                            {showChart && (
                                <div className="flex flex-col justify-center">
                                    <BreakevenChart />
                                    {slide.financialModels.breakevenText && (
                                        <div className="mt-4 bg-[#ffe9c9]/60 p-3 rounded-lg text-sm text-center max-w-lg mx-auto">
                                            <strong className="font-semibold">Ponto de Equilíbrio:</strong> {slide.financialModels.breakevenText}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Breakeven text for non-chart layout */}
                            {!showChart && slide.financialModels.breakevenText && (
                                <div className="mt-6 bg-[#ffe9c9]/60 p-4 rounded-lg text-sm text-center max-w-xl mx-auto">
                                    <strong className="font-semibold">Ponto de Equilíbrio:</strong> {slide.financialModels.breakevenText}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
            case 'team':
                return (
                     <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{slide.title}</h2>
                        <p className="mt-3 text-lg text-gray-500">{slide.subtitle}</p>
                         <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start max-w-7xl mx-auto justify-center">
                           {slide.teamMembers?.map(member => (
                               <div key={member.name} className="flex flex-col items-center">
                                   <img src={TEAM_PHOTOS[member.photoKey]} alt={member.name} className="w-40 h-40 rounded-full mx-auto shadow-lg object-cover mb-4 bg-gray-200" />
                                   <h3 className="text-2xl font-bold">{member.name}</h3>
                                   <p className="accent-color font-semibold">{member.role}</p>
                                   {member.description && <div className="mt-4 text-sm text-gray-600 text-left max-w-xs">{member.description}</div>}
                               </div>
                           ))}
                        </div>
                    </div>
                );
             case 'ai-interaction':
                const [input, setInput] = useState('');
                const [selectValue, setSelectValue] = useState(slide.aiInteraction?.options?.[0] || '');

                const handleSubmit = () => {
                    if (slide.aiInteraction) {
                        const finalInput = slide.aiInteraction.options ? selectValue : input;
                        if (!finalInput.trim()) {
                            alert('Por favor, preencha o campo.');
                            return;
                        }
                        const prompt = slide.aiInteraction.promptGenerator(finalInput);
                        onAiInteraction(prompt);
                    }
                };
                
                return (
                    <div className="bg-white/60 p-8 md:p-12 rounded-2xl shadow-lg h-full flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-center mb-2">{slide.aiInteraction?.title}</h3>
                        <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto">{slide.aiInteraction?.description}</p>
                        <div className="max-w-xl mx-auto w-full">
                             <label htmlFor="ai-input" className="block text-sm font-medium text-gray-700 mb-1">{slide.aiInteraction?.inputLabel}</label>
                            {slide.aiInteraction?.options ? (
                                <select id="ai-input" value={selectValue} onChange={e => setSelectValue(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white">
                                    {slide.aiInteraction.options.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input type="text" id="ai-input" value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder={slide.aiInteraction?.placeholder} />
                            )}
                            <button onClick={handleSubmit} className="w-full bg-[#ff595a] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition flex items-center justify-center">
                                <span className="mr-2">✨</span> {slide.aiInteraction?.buttonText}
                            </button>
                        </div>
                    </div>
                )
            case 'checklist':
                return (
                    <div className="h-full flex flex-col justify-center">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold tracking-tight">{slide.title}</h2>
                            <p className="mt-3 text-lg text-gray-500">{slide.mainMessage || slide.subtitle}</p>
                        </div>
                        <div className="max-w-3xl mx-auto w-full space-y-5">
                            {slide.columns?.map((item, index) => (
                                <div key={index} className="flex items-start animate-fade-in-up" style={{ animationDelay: `${100 + index * 150}ms` }}>
                                    <div className="flex-shrink-0 text-green-500 mr-4 pt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-grow bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md flex items-center">
                                        {item.icon && <div className="text-3xl mr-4">{item.icon}</div>}
                                        <div className="flex-grow text-left">
                                            <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                                            {item.text && <p className="text-gray-600 mt-1 text-base leading-relaxed">{item.text}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div className="h-full flex flex-col justify-center items-center text-center relative">
                        {/* Main Content Area */}
                        <div className="flex-grow flex flex-col justify-center items-center text-white px-4">
                            {slide.title && <h2 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg animate-fade-in-up">{slide.title}</h2>}
                            {slide.mainMessage && <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>{slide.mainMessage}</p>}
                        </div>
        
                        {/* Footer with Contact Info */}
                        {slide.contactInfo && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/60 to-transparent animate-fade-in-up text-center" style={{ animationDelay: '400ms' }}>
                                <h4 className="font-bold text-lg mb-2">Contato</h4>
                                <p className="font-semibold">{slide.contactInfo.name} - {slide.contactInfo.title}</p>
                                <div className="flex justify-center items-center gap-x-6 gap-y-1 mt-2 flex-wrap text-sm">
                                   <a href={`tel:${slide.contactInfo.phone.replace(/\D/g,'')}`} className="hover:underline">{slide.contactInfo.phone}</a>
                                   <a href={`mailto:${slide.contactInfo.email}`} className="hover:underline">{slide.contactInfo.email}</a>
                                   <a href={`https://${slide.contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{slide.contactInfo.website}</a>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return <div>Layout not found for {slide.layout}</div>;
        }
    };

    return <div className="slide-content w-full h-full">{renderLayout()}</div>;
};


const Presentation: React.FC = () => {
    const [trackId, setTrackId] = useState<TrackId>('common');
    const [slideIndex, setSlideIndex] = useState(0);
    const [isNinaOpen, setIsNinaOpen] = useState(false);
    const [aiInteractionResult, setAiInteractionResult] = useState<NinaResponse | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [lightboxConfig, setLightboxConfig] = useState<{ images: string[]; startIndex: number } | null>(null);
    const [isNetworkLightboxOpen, setIsNetworkLightboxOpen] = useState(false);

    const currentSlides = useMemo(() => PITCH_DECK_DATA[trackId] || PITCH_DECK_DATA.common, [trackId]);
    const currentSlide = useMemo(() => {
        if (!currentSlides) return null;
        return currentSlides[slideIndex];
    }, [currentSlides, slideIndex]);
    
    const totalSlidesInTrack = currentSlides.length;
    const progress = ((slideIndex + 1) / totalSlidesInTrack) * 100;

    const slideContainerStyle = useMemo(() => {
        if (currentSlide && currentSlide.backgroundImage) {
            return {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentSlide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
        }
        return {};
    }, [currentSlide]);
    
    const handleNext = useCallback(() => {
        if (slideIndex < totalSlidesInTrack - 1) {
            setSlideIndex(prev => prev + 1);
        }
    }, [slideIndex, totalSlidesInTrack]);
    
    const handlePrev = useCallback(() => {
        if (slideIndex > 0) {
            setSlideIndex(prev => prev - 1);
        }
    }, [slideIndex]);
    
    const handleHome = () => {
        setTrackId('common');
        const bifurcationIndex = PITCH_DECK_DATA.common.findIndex(s => s.layout === 'bifurcation');
        setSlideIndex(bifurcationIndex > -1 ? bifurcationIndex : 0);
    };
    
    const handleSelectAudience = (audience: Audience) => {
        setTrackId(audience);
        setSlideIndex(0);
    };

    const handleAiInteraction = useCallback(async (prompt: string) => {
        setIsNinaOpen(true);
        setIsAiLoading(true);
        setAiInteractionResult(null);
        try {
            const result = await geminiService.generateContent(prompt);
            setAiInteractionResult({ text: result, sources: [] });
        } catch(e) {
            setAiInteractionResult({ text: "Ocorreu um erro. Tente novamente.", sources: [] })
        } finally {
            setIsAiLoading(false);
        }
    }, [])

    const handleCloseNina = useCallback(() => {
        setIsNinaOpen(false);
        setAiInteractionResult(null);
    }, [])

    const handleOpenLightbox = useCallback((images: string[], startIndex: number) => {
        setLightboxConfig({ images, startIndex });
    }, []);

    const handleCloseLightbox = useCallback(() => {
        setLightboxConfig(null);
    }, []);

    const handleOpenNetworkGraph = useCallback(() => {
        setIsNetworkLightboxOpen(true);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
             if (lightboxConfig || isNetworkLightboxOpen) return;
            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, lightboxConfig, isNetworkLightboxOpen]);


    if (!currentSlide) {
        return (
            <div className="presentation-wrapper">
                <div className="slide-container flex items-center justify-center">
                    <div>Carregando apresentação...</div>
                </div>
            </div>
        );
    }


    return (
        <div className="presentation-wrapper">
            <div className="slide-container" style={slideContainerStyle}>
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                <SlideRenderer 
                  key={`${trackId}-${slideIndex}`} 
                  slide={currentSlide} 
                  onSelectAudience={handleSelectAudience} 
                  onAiInteraction={handleAiInteraction} 
                  onImageClick={handleOpenLightbox}
                  onOpenNetworkGraph={handleOpenNetworkGraph}
                />
            </div>

            <div className="presentation-nav">
                {trackId !== 'common' && (
                    <button onClick={handleHome} title="Voltar à Seleção" className="nav-button home-button">⌂</button>
                )}
                <button onClick={handlePrev} disabled={slideIndex === 0} className="nav-button">‹</button>
                <span className="text-gray-600 text-sm self-center px-2">{slideIndex + 1} / {totalSlidesInTrack}</span>
                <button onClick={handleNext} disabled={slideIndex === totalSlidesInTrack - 1} className="nav-button">›</button>
            </div>
            
            <button onClick={() => setIsNinaOpen(true)} className="nina-fab" title="Converse com a Nina AI">
                <img src="https://edumoreiragit.github.io/Imagens/Labirintar/IMG_3281.png" alt="Nina AI Avatar" className="w-full h-full object-cover rounded-full" />
            </button>

            <NinaAI 
                isOpen={isNinaOpen} 
                onClose={handleCloseNina} 
                preloadedContent={aiInteractionResult}
                isPreloadedLoading={isAiLoading}
            />

            {lightboxConfig && (
                <Lightbox
                    images={lightboxConfig.images}
                    startIndex={lightboxConfig.startIndex}
                    onClose={handleCloseLightbox}
                />
            )}
             {isNetworkLightboxOpen && (
                <NetworkLightbox onClose={() => setIsNetworkLightboxOpen(false)} />
            )}
        </div>
    );
};

export default Presentation;