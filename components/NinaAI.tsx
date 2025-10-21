import React, { useState, useEffect } from 'react';
import * as geminiService from '../services/geminiService';
import { NinaResponse, Source } from '../types';

interface NinaAIProps {
    isOpen: boolean;
    onClose: () => void;
    preloadedContent?: NinaResponse | null;
    isPreloadedLoading?: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-48">
        <div className="border-4 border-gray-200 border-t-[#ff595a] rounded-full w-12 h-12 animate-spin"></div>
    </div>
);

const FormattedContent: React.FC<{ response: NinaResponse }> = ({ response }) => {
    const formatted = response.text.split('\n').map((line, index) => {
        if (line.trim() === '') return null;
        if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
        if (line.startsWith('* ')) return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        return <p key={index} className="my-2" dangerouslySetInnerHTML={{ __html: line }} />;
    }).filter(Boolean);

    return (
        <div>
            {formatted}
            {response.sources && response.sources.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-bold text-gray-600">Fontes:</h4>
                    <ul className="text-xs list-disc pl-5 mt-2 space-y-1">
                        {response.sources.map((source, index) => (
                            <li key={index}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const NinaAI: React.FC<NinaAIProps> = ({ isOpen, onClose, preloadedContent, isPreloadedLoading }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<NinaResponse | null>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);
    
    useEffect(() => {
        if (!isOpen) {
            // Reset state when closed
            setInput('');
            setResponse(null);
            setIsLoading(false);
        } else if (preloadedContent) {
            setResponse(preloadedContent);
        }
    }, [isOpen, preloadedContent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        
        const currentInput = input;
        setInput(''); // Clear the input field immediately
        setIsLoading(true);
        setResponse(null);
        try {
            const result = await geminiService.askNina(currentInput);
            setResponse(result);
        } catch (error) {
            setResponse({ text: "Desculpe, ocorreu um erro. Por favor, tente novamente.", sources: [] });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 sm:p-8 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <img src="https://edumoreiragit.github.io/Imagens/Labirintar/IMG_3281.png" alt="Nina AI Avatar" className="w-12 h-12 object-cover rounded-full" />
                        <h3 className="text-2xl font-bold accent-color">Nina AI</h3>
                    </div>
                    <button onClick={onClose} className="text-3xl font-bold text-gray-400 hover:text-gray-700 transition-colors">&times;</button>
                </div>
                
                <div className="overflow-y-auto flex-grow pr-2">
                    {isLoading || isPreloadedLoading ? (
                        <LoadingSpinner />
                    ) : (
                        response ? (
                            <div className="prose max-w-none text-gray-700">
                                <FormattedContent response={response} />
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-16">
                                <h4 className="text-xl font-semibold text-gray-700">Olá! Sou a Nina, sua assistente estratégica.</h4>
                                <p className="mt-2">Faça uma pergunta sobre o modelo de negócio, mercado, ou projeções da LABirintar.</p>
                            </div>
                        )
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex gap-2 flex-shrink-0">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff595a] focus:outline-none transition"
                        placeholder="Ex: Qual a principal barreira de entrada (moat)?"
                        disabled={isLoading || isPreloadedLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || isPreloadedLoading}
                        className="bg-[#ff595a] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition disabled:bg-opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '...' : 'Perguntar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NinaAI;