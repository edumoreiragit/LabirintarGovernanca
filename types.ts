import { ReactNode } from 'react';

export type Audience = 'investor' | 'school' | 'educator' | 'partner';

export type AssistantType = Audience;

export type TrackId = 'common' | Audience;

export type ChatMessage = {
    sender: 'user' | 'assistant';
    text: string;
};

export type Source = {
    uri: string;
    title: string;
};

export type NinaResponse = {
    text: string;
    sources: Source[];
};

export type TableRow = (string | boolean)[];

export type FinancialModel = {
    name: string;
    title: string;
    description: string;
    revenueShare: string;
    revenueShareDetails?: ReactNode;
    fee?: string;
};

export type Slide = {
    id: string;
    layout: 'cover' | 'problem' | 'solution' | 'how-it-works' | 'traction' | 'bifurcation' | 'generic' | 'financial' | 'team' | 'ai-interaction' | 'ecosystem' | 'social-proof' | 'comparison-table' | 'roadmap' | 'investment-ask' | 'contact' | 'financial-models' | 'checklist';
    title?: ReactNode;
    subtitle?: ReactNode;
    mainMessage?: ReactNode;
    backgroundImage?: string;
    stats?: { value: number; text: string; prefix?: string; suffix?: string; source?: string }[];
    highlightCard?: { text: string; };
    cards?: { title: ReactNode; text: ReactNode; icon?: string, rotation?: string, carouselImages?: string[] }[];
    carouselImages?: { component: string; url: string; }[];
    quote?: { text: string; author: string };
    bifurcationOptions?: { audience: Audience; icon: string; title: string; description: string; subtext: string; }[];
    columns?: {
        icon?: string;
        title?: ReactNode;
        text?: ReactNode;
        checklist?: string[];
        checklistColor?: string;
        chart?: 'revenue_split' | 'use_of_funds' | 'projections' | 'captable' | 'use_of_funds_investor';
        list?: { highlight: string; text: string; colorClass: string; }[]
    }[];
    aiInteraction?: {
        audience: Audience;
        title: string;
        description: string;
        inputLabel: string;
        placeholder?: string;
        buttonText: string;
        options?: string[];
        promptGenerator: (input: string) => string;
    };
    teamMembers?: { name: string; role: string; description?: ReactNode; photoKey: string }[];
    logos?: string[];
    fullWidthContent?: ReactNode;
    tableData?: {
        headers: string[];
        rows: TableRow[];
    };
    roadmapData?: {
        title: string;
        items: { year: string; text: string; subtext?: string }[];
    };
    investmentData?: {
      captable: any;
      useOfFunds: any;
    };
    contactInfo?: {
        name: string;
        title: string;
        phone: string;
        email: string;
        website: string;
    };
    financialModels?: {
        models: FinancialModel[];
        breakevenText?: string;
        showBreakevenChart?: boolean;
    };
};

export type PitchDeckData = {
    [key in TrackId]: Slide[];
};