
import React, { useState, useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { QA_ASSISTANTS } from '../constants';
import Chat from './Chat';
import { AssistantType } from '../types';

interface FaqItemProps {
    question: string;
    answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-[#e6cbe4]/50 py-4 last:border-b-0">
            <button
                className="w-full text-left font-semibold flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{question}</span>
                <span className={`transition-transform duration-300 text-[#ff595a] ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] pt-4' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <p className="text-gray-600 leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
};

interface AccordionItemProps {
    assistant: typeof QA_ASSISTANTS[0];
}

const AccordionItem: React.FC<AccordionItemProps> = ({ assistant }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white p-4 sm:p-6 flex items-center text-left shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
            >
                <span className="text-2xl mr-4">{assistant.icon}</span>
                <span className="font-bold text-xl">{assistant.title}</span>
            </button>
            <div className={`grid transition-all duration-700 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="bg-white/70 backdrop-blur-sm rounded-b-2xl p-6 -mt-2">
                        <h3 className="font-bold mb-4 text-lg text-gray-800">Perguntas Frequentes</h3>
                        {assistant.faqs.map((faq, index) => (
                            <FaqItem key={index} question={faq.q} answer={faq.a} />
                        ))}
                         <h3 className="font-bold mt-8 mb-4 text-lg text-gray-800">Converse com o {assistant.title.split(' ')[0]}</h3>
                        <Chat assistantType={assistant.type as AssistantType} systemPrompt={assistant.systemPrompt} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const QaSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    return (
        <section ref={sectionRef} id="qa-assistants" className="min-h-screen py-24 px-4 bg-[#e6cbe4]">
            <div className={`container mx-auto text-center transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">Ainda tem dúvidas?</h2>
                <p className="mt-6 text-xl text-gray-700">Nossos assistentes de IA estão prontos para conversar.</p>
                <div className="mt-12 text-left max-w-4xl mx-auto space-y-6">
                    {QA_ASSISTANTS.map((assistant) => (
                        <AccordionItem key={assistant.type} assistant={assistant} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QaSection;
