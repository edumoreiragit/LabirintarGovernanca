import { FICHAS_CONTENT } from './fichasPedagogicas';

export interface Specialist {
    id: string;
    name: string;
}

export interface Specialty {
    id: string;
    name: string;
    content: string;
    specialists: Specialist[];
}

const specialistsPool = [
    "Ana Silva", "Bruno Costa", "Carla Dias", "Daniel Alves", "Elisa Ferreira",
    "Fábio Martins", "Gabriela Lima", "Hugo Pereira", "Isabela Rocha", "João Santos",
    "Lívia Andrade", "Marcos Oliveira", "Natália Souza", "Otávio Ribeiro", "Patrícia Gomes",
    "Rafael Barbosa", "Sofia Castro", "Thiago Nogueira", "Úrsula Mendes", "Victor Almeida",
    "Alice Braga", "Bernardo Cruz", "Clara Matos", "Davi Sampaio", "Esther Moura"
];

const generateSpecialists = (specialtyId: string): Specialist[] => {
    const count = Math.floor(Math.random() * (12 - 6 + 1)) + 6; // Random number between 6 and 12
    const usedNames = new Set<string>();
    const specialists: Specialist[] = [];
    let attempts = 0;
    while (specialists.length < count && attempts < specialistsPool.length * 3) {
        const specialistName = specialistsPool[Math.floor(Math.random() * specialistsPool.length)];
        if (!usedNames.has(specialistName)) {
            usedNames.add(specialistName);
            specialists.push({
                id: `${specialtyId}-specialist-${specialists.length}`,
                name: specialistName,
            });
        }
        attempts++;
    }
    return specialists;
};

const allSpecialties: {id: string; name: string}[] = [
    { id: 'quintal-vivo', name: 'Quintal Vivo' },
    { id: 'circuito-acrobatico-circense', name: 'Circuito Acrobático Circense' },
    { id: 'teatro', name: 'Teatro' },
    { id: 'danca-e-percussao', name: 'Dança e Percussão' },
    { id: 'brincadeiras-musicais', name: 'Brincadeiras Musicais' },
    { id: 'improvisacao', name: 'Improvisação' },
    { id: 'projeto-crio-livros', name: 'Projeto Crio Livros' },
    { id: 'fotografia', name: 'Fotografia' },
    { id: 'parkour-brasil', name: 'Parkour Brasil' },
    { id: 'esportes-urbanos', name: 'Esportes Urbanos' },
    { id: 'marcenaria-criativa', name: 'Marcenaria Criativa' },
    { id: 'origami', name: 'Origami' },
    { id: 'modelagem-3d', name: 'Modelagem 3D' },
    { id: 'paes-artesanais', name: 'Pães Artesanais' },
    { id: 'jogos-de-tabuleiro', name: 'Criação de Jogos de Tabuleiro' },
    { id: 'jogos-digitais', name: 'Criação de Jogos Digitais' },
    { id: 'rpg-narrativas-coletivas', name: 'RPG e Narrativas Coletivas' },
    { id: 'xadrez-para-a-vida', name: 'Xadrez para a Vida' },
    { id: 'robotica-sustentavel', name: 'Robótica Sustentável' },
    { id: 'drone-educativo', name: 'Drone Educativo' },
    { id: 'maker-verde', name: 'Maker Verde' },
    { id: 'projeto-cidade-vamos', name: 'Projeto Cidade Vamos' },
    { id: 'cozinhas-e-infancias', name: 'Cozinhas e Infâncias' },
    { id: 'arte-de-rua', name: 'Arte de Rua na Minha Escola' },
    { id: 'empreender-sonhos', name: 'Empreender Sonhos' },
    { id: 'educacao-financeira', name: 'Educação Financeira' },
    { id: 'mindfulness', name: 'Mindfulness e Bem-Estar' },
];


export const SPECIALTY_DATA: Specialty[] = allSpecialties.map(spec => ({
    ...spec,
    content: FICHAS_CONTENT[spec.id],
    specialists: generateSpecialists(spec.id),
}));
