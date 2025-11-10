import { FICHAS_CONTENT } from './fichasPedagogicas';
import { EDUCATORS_CSV_DATA } from './educatorsData';

export interface Specialist {
    id: string;
    name: string;
    indicatedBy?: string;
    isExternal?: boolean;
}

export interface Specialty {
    id: string;
    name: string;
    content: string;
    specialists: Specialist[];
}


const toId = (name: string) => name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

// Maps CSV entries to the canonical, full specialty name for clustering
const specialtyNameMapping: Record<string, string> = {
    'Marcenaria': 'Marcenaria Criativa',
    'Drone Educativo': 'Drone Educativo',
    'Meditação e Mindfullness': 'Mindfulness e Bem-Estar',
    'Circo': 'Circuito Acrobático Circense',
    'Parkour': 'Parkour Brasil',
    'Empreendedorismo': 'Empreender Sonhos',
    'Criação de Jogos Digitais': 'Criação de Jogos Digitais',
    'Panificação': 'Pães Artesanais',
    'Xadrez': 'Xadrez para a Vida',
    'Criação de Jogos de Tabuleiro': 'Criação de Jogos de Tabuleiro',
    'Jogos de tabuleiro': 'Criação de Jogos de Tabuleiro', // Grouping
    'Arte de rua': 'Arte de Rua na Minha Escola',
    'Improvisação': 'Improvisação',
    'Cidade Educadora': 'Projeto Cidade Vamos',
    'Fotografia': 'Fotografia',
    'Teatro': 'Teatro',
    'Tecnologias': 'Tecnologia',
    'Cultura das Infâncias': 'Cultura das Infâncias',
    'Contação de Histórias': 'Contação de Histórias',
    'Educação Alimentar': 'Educação Alimentar',
    'Corpo e Movimento': 'Corpo e Movimento',
    'Práticas Inclusivas': 'Práticas Inclusivas',
    'Costura': 'Costura',
    'Dança': 'Dança e Percussão',
    'Cerâmica': 'Cerâmica',
    'Tapeçaria': 'Tapeçaria',
    'Literatura': 'Literatura',
    'Sustentabilidade': 'Sustentabilidade',
    'Joalheria': 'Joalheria',
    'Arquitetura': 'Arquitetura',
    'Sociologia': 'Sociologia',
    'Casa Cultural': 'Casa Cultural',
};

// This is the canonical list of specialties with associated content fichas
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

const specialtyMap = new Map<string, Specialty>();

// 1. Initialize existing specialties from the canonical list
allSpecialties.forEach(spec => {
    specialtyMap.set(spec.name, {
        ...spec,
        content: FICHAS_CONTENT[spec.id] || `Conteúdo para ${spec.name} em breve.`,
        specialists: [],
    });
});

// 2. Find external indicators
const educatorNames = new Set(EDUCATORS_CSV_DATA.map(e => e.nome?.trim()).filter(Boolean) as string[]);
const indicatorNames = new Set(EDUCATORS_CSV_DATA.map(e => e.indicou?.trim()).filter(Boolean) as string[]);
const externalIndicators = new Set<string>();
indicatorNames.forEach(name => {
    if (!educatorNames.has(name)) {
        externalIndicators.add(name);
    }
});


// 3. Process educators from CSV
EDUCATORS_CSV_DATA.forEach(educator => {
    const rawSpecialty = educator.especialidade?.trim();
    const rawName = educator.nome?.trim();

    if (!rawName) return; // Skip if no name

    const specialist: Specialist = {
        id: toId(rawName),
        name: rawName,
        indicatedBy: educator.indicou?.trim() || undefined,
    };

    if (!rawSpecialty) {
        // Educators without a specialty are part of the network but don't belong to a skill cluster.
        // We'll skip adding them to a specialty to avoid a 'null' cluster.
        return;
    }

    const mappedSpecialtyName = specialtyNameMapping[rawSpecialty] || rawSpecialty;
    
    let specialty = specialtyMap.get(mappedSpecialtyName);

    if (!specialty) {
        const specialtyId = toId(mappedSpecialtyName);
        specialty = {
            id: specialtyId,
            name: mappedSpecialtyName,
            content: FICHAS_CONTENT[specialtyId] || `A ${mappedSpecialtyName} é uma área de grande potencial na LABirintar, conectando educadores talentosos a escolas que buscam inovação. Em breve, teremos mais detalhes sobre esta ficha pedagógica.`,
            specialists: [],
        };
        specialtyMap.set(mappedSpecialtyName, specialty);
    }
    
    // Avoid adding duplicate specialists by name
    if (!specialty.specialists.some(s => s.name.toLowerCase() === specialist.name.toLowerCase())) {
        specialty.specialists.push(specialist);
    }
});

// 4. Add external indicators to their own specialty group
if (externalIndicators.size > 0) {
    const externalSpecialty: Specialty = {
        id: 'rede-externa',
        name: 'Rede Externa',
        content: 'Pessoas que indicaram talentos para a LABirintar mas não são educadores formais da rede. Eles representam a força e o alcance da nossa comunidade.',
        specialists: []
    };
    externalIndicators.forEach(name => {
        // Ensure they are not already added as a specialist somewhere else
        const alreadyExists = Array.from(specialtyMap.values()).some(s => s.specialists.some(sp => sp.name === name));
        if (!alreadyExists) {
             externalSpecialty.specialists.push({
                id: toId(name),
                name: name,
                isExternal: true
            });
        }
    });
    if (externalSpecialty.specialists.length > 0) {
        specialtyMap.set(externalSpecialty.name, externalSpecialty);
    }
}


export const SPECIALTY_DATA: Specialty[] = Array.from(specialtyMap.values()).filter(s => s.specialists.length > 0);
