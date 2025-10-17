import React, { useState, useRef, useEffect } from 'react';
import * as geminiService from '../services/geminiService';
import { ChatMessage, AssistantType } from '../types';

interface ChatProps {
    assistantType: AssistantType;
    systemPrompt: string;
}

const LoadingBubble: React.FC = () => (
    <div className="chat-bubble chat-bubble-assistant flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);


const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const bubbleClass = isUser
        ? 'bg-[#aec5e7] text-gray-800 self-end rounded-br-none'
        : 'bg-white text-gray-700 self-start rounded-bl-none';

    return (
        <div className={`py-2 px-4 rounded-2xl max-w-[85%] sm:max-w-[80%] break-words ${bubbleClass}`}>
            <p>{message.text}</p>
        </div>
    );
};


const Chat: React.FC<ChatProps> = ({ assistantType, systemPrompt }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await geminiService.getChatResponse(systemPrompt, input);
            const assistantMessage: ChatMessage = { sender: 'assistant', text: responseText };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'assistant', text: 'Desculpe, ocorreu um erro. Tente novamente.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div ref={chatWindowRef} className="h-72 bg-gray-100 border border-gray-200 rounded-lg p-4 overflow-y-auto flex flex-col gap-3">
                {messages.map((msg, index) => <ChatBubble key={index} message={msg} />)}
                {isLoading && <LoadingBubble />}
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff595a] focus:outline-none transition"
                    placeholder="Digite sua pergunta..."
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#ff595a] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? '...' : 'Enviar'}
                </button>
            </form>
        </div>
    );
};

export default Chat;