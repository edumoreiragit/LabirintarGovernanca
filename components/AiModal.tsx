
import React, { useEffect } from 'react';

interface AiModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    content: string;
}

const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, isLoading, content }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const formattedContent = content.split('\n').map((line, index) => {
        // Basic markdown to HTML conversion
        if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
        if (line.startsWith('* ')) return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        return <p key={index} className="my-2" dangerouslySetInnerHTML={{ __html: line }} />;
    });

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 sm:p-8 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto transform transition-transform duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold accent-color">✨ Resposta da IA</h3>
                    <button onClick={onClose} className="text-3xl font-bold text-gray-400 hover:text-gray-700 transition-colors">&times;</button>
                </div>
                <div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="border-4 border-gray-200 border-t-[#ff595a] rounded-full w-12 h-12 animate-spin"></div>
                        </div>
                    ) : (
                        <div className="prose max-w-none text-gray-700">
                             {formattedContent}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiModal;
