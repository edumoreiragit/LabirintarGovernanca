import React, { useState, useCallback, Suspense, lazy } from 'react';

const SpecialistNetworkGraph = lazy(() => import('./NetworkGraph'));

interface NetworkLightboxProps {
    onClose: () => void;
}

const FichaRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Split content into lines and prepare for rendering
    const elements = content.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
            return <br key={index} />;
        }
        // Heuristic for main titles (usually uppercase and short)
        if (index < 3 && trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 2) {
            return <h2 key={index} className="text-3xl font-bold text-center my-4 text-[#ff595a]">{trimmedLine}</h2>;
        }
        // Heuristic for section headers (ending with a colon)
        if (trimmedLine.startsWith('CAMADA PEDAGÓGICA:') || trimmedLine.startsWith('CAMADA PRÁTICA:') || trimmedLine.startsWith('CAMADA ESTÉTICA:')) {
            return <h3 key={index} className="text-2xl font-bold mt-8 mb-3 text-[#ffa400] border-b-2 border-[#ffa400]/50 pb-2">{trimmedLine}</h3>;
        }
        // Heuristic for list items
        if (trimmedLine.startsWith('•')) {
            return <li key={index} className="ml-6 text-gray-300">{trimmedLine.substring(1).trim()}</li>;
        }
         // Heuristic for sub-items
        if (trimmedLine.startsWith('-')) {
            return <li key={index} className="ml-10 text-gray-400 list-['-_']">{trimmedLine.substring(1).trim()}</li>;
        }
        return <p key={index} className="text-gray-300 my-1 leading-relaxed">{trimmedLine}</p>;
    });

    return <div className="prose prose-invert max-w-none p-6">{elements}</div>;
};


const NetworkLightbox: React.FC<NetworkLightboxProps> = ({ onClose }) => {
    const [view, setView] = useState<'graph' | 'content'>('graph');
    const [content, setContent] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSpecialtyClick = useCallback((newContent: string) => {
        setContent(newContent);
        setView('content');
    }, []);

    const handleBackToGraph = () => {
        setView('graph');
        setContent(null);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <button aria-label="Fechar" onClick={onClose} className="absolute top-2 right-4 text-white text-5xl font-bold hover:text-gray-300 transition-colors z-30">&times;</button>
                
                {view === 'graph' && (
                    <>
                        <div className="absolute top-4 left-4 text-white p-2 bg-black/30 rounded-lg z-10 pointer-events-none max-w-xs">
                            <h3 className="font-bold text-lg">Rede de Especialistas</h3>
                            <p className="text-sm">Clique em uma especialidade para ver os detalhes ou pesquise abaixo.</p>
                        </div>
                         <input
                            type="text"
                            placeholder="Pesquisar Experiência..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm p-2 rounded-full bg-black/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff595a] text-center placeholder-gray-400"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Carregando visualização...</div>}>
                            <SpecialistNetworkGraph onSpecialtyClick={handleSpecialtyClick} searchQuery={searchQuery} />
                        </Suspense>
                    </>
                )}

                {view === 'content' && content && (
                    <div className="w-full h-full flex flex-col overflow-y-auto">
                         <button onClick={handleBackToGraph} className="sticky top-4 left-4 self-start z-20 bg-black/50 text-white py-2 px-4 rounded-full hover:bg-black/80 transition-colors m-4">
                            &larr; Voltar para a Rede
                        </button>
                        <div className="px-4 pb-8">
                           <FichaRenderer content={content} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkLightbox;