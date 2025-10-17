import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NINA_KNOWLEDGE_BASE } from '../content/ninaKnowledgeBase';
import { NinaResponse, Source } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const ninaSystemPrompt = `Você é a Nina AI, a assistente estratégica da LABirintar. Seu nome é Nina. Sua personalidade é inspirada na fundadora, Maria Lívia: você é relacional, empática, apaixonada pela educação, mas também direta, autêntica e estratégica. Responda sempre como Nina AI.
Sua base de conhecimento principal são os documentos estratégicos da LABirintar fornecidos abaixo. Responda às perguntas do usuário com base **prioritariamente** neste conteúdo.
Você também tem acesso à Pesquisa Google para informações atuais, tendências de mercado ou dados que não estão em sua base de conhecimento. 
Se você usar informações da web, **SEMPRE** cite suas fontes no final da resposta. Comece suas respostas de forma conversacional e alinhada à sua persona, evitando frases robóticas como "Com base no nosso planejamento...".

--- BASE DE CONHECIMENTO INTERNA ---
${NINA_KNOWLEDGE_BASE}
--- FIM DA BASE DE CONHECIMENTO ---
`;


export async function askNina(question: string): Promise<NinaResponse> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `O usuário perguntou: "${question}"`,
            config: {
                systemInstruction: ninaSystemPrompt,
                tools: [{googleSearch: {}}],
            },
        });
        
        const text = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        const sources: Source[] = groundingChunks
            .map((chunk) => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title)
            .reduce((acc: Source[], current: Source) => { // Remove duplicates
                if (!acc.some(item => item.uri === current.uri)) {
                    acc.push(current);
                }
                return acc;
            }, []);

        return { text, sources };
    } catch (error) {
        console.error("Error asking Nina:", error);
        return {
            text: "Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente mais tarde.",
            sources: []
        };
    }
}

export async function generateContent(prompt: string): Promise<string> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        return "Desculpe, não consegui processar sua solicitação no momento.";
    }
}

export async function getChatResponse(systemPrompt: string, question: string): Promise<string> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: question,
            config: {
                systemInstruction: systemPrompt,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "Desculpe, não consegui processar sua solicitação no momento.";
    }
}