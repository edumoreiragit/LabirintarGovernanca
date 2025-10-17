import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { Audience } from '../types';
import { REVENUE_SPLIT_DATA, USE_OF_FUNDS_DATA, REVENUE_PROJECTION_DATA } from '../constants';

interface AudienceSectionsProps {
    activeAudience: Audience;
    onGenerateActivity: (themes: string) => void;
    onGetAssistance: (challenge: string) => void;
    onSimulateSynergy: (partnerType: string) => void;
}

const SectionWrapper: React.FC<{ children: React.ReactNode; title: React.ReactNode; subtitle: string; }> = ({ children, title, subtitle }) => (
    <div className="py-20 px-4 md:px-0 border-t border-gray-200">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">{title}</h2>
            <p className="text-xl text-gray-600 mt-4">{subtitle}</p>
        </div>
        <div className="space-y-24 max-w-6xl mx-auto">{children}</div>
    </div>
);

const DoughnutChart: React.FC<{ data: { name: string; value: number; fill: string }[] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height={400}>
        <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} innerRadius={80} outerRadius={120} fill="#8884d8" dataKey="value" nameKey="name">
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
);

const ProjectionsChart: React.FC = () => (
    <ResponsiveContainer width="100%" height={400}>
        <LineChart data={REVENUE_PROJECTION_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value: number) => `R$${value/1000}k`} />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
            <Legend />
            <Line type="monotone" dataKey="Receita Bruta Projetada" stroke="#ff595a" strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
    </ResponsiveContainer>
);


const InvestorSection: React.FC = () => (
    <SectionWrapper title={<>Para <span className="accent-color">Investidores</span></>} subtitle="Escala, Retorno e um Moat Inegável.">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h3 className="text-3xl font-bold mb-4">Um Mercado de R$ 40 Bilhões em Transformação</h3>
                <p className="text-gray-600">O mercado de atividades extracurriculares no Brasil é massivo e fragmentado. A nova lei do tempo integral atua como um catalisador, criando uma demanda urgente por soluções integradas e de qualidade. A LABirintar está posicionada de forma única para capturar essa oportunidade, atuando como o sistema operacional para o contraturno escolar.</p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center">
                 <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-3xl font-bold accent-color">R$ 100 Bi</p><p className="mt-1 text-gray-500">Mercado EdTech Brasil</p></div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-3xl font-bold accent-color">R$ 40 Bi</p><p className="mt-1 text-gray-500">Mercado Extracurricular</p></div>
            </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center bg-[#aec5e7] p-8 rounded-2xl">
             <DoughnutChart data={REVENUE_SPLIT_DATA} />
             <div>
                <h3 className="text-3xl font-bold mb-4">Modelo de Negócio: Revenue Share Alinhado</h3>
                <p className="text-gray-700 mb-4">Nosso modelo B2B2C é projetado para o alinhamento de interesses e escalabilidade. A receita de cada matrícula é dividida entre todos os stakeholders, criando um ecossistema onde todos ganham com o crescimento.</p>
                <ul className="space-y-2 text-gray-700">
                    <li><span className="font-bold accent-color">30% LABirintar:</span> Margem para reinvestir em tecnologia, curadoria e crescimento.</li>
                    <li><span className="font-bold text-[#ffa400]">50% Rede:</span> 35% para o Educador e 15% para o parceiro de conteúdo, atraindo e retendo os melhores talentos.</li>
                    <li><span className="font-bold text-[#e6cbe4]">20% Escola:</span> Gera receita passiva, incentivando a parceria e a cessão de espaço.</li>
                </ul>
                <p className="mt-4 text-gray-700">Com um <strong className="accent-color">LTV/CAC de 3.2x</strong> já na fase inicial, nosso modelo de rede prova sua eficiência na aquisição de clientes.</p>
            </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h3 className="text-3xl font-bold mb-4">O Caminho para 1.200 Escolas</h3>
                <p className="text-gray-600">Nossas projeções são baseadas em uma estratégia de aquisição faseada, impulsionada pelo capital solicitado. O investimento inicial nos permitirá construir um motor de vendas replicável, levando a um crescimento exponencial da receita nos próximos 5 anos.</p>
            </div>
            <ProjectionsChart />
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center bg-[#aec5e7] p-8 rounded-2xl">
            <DoughnutChart data={USE_OF_FUNDS_DATA} />
            <div>
                <h3 className="text-3xl font-bold mb-4">O Investimento: R$ 2 Milhões para Escalar</h3>
                <p className="text-gray-700 mb-4">Buscamos um aporte de R$ 2 milhões em troca de equity, com um valuation pré-money de R$ 4,2 milhões. Os recursos serão alocados estrategicamente para remover os gargalos atuais e construir o motor de escala.</p>
                 <ul className="space-y-2 text-gray-700">
                    <li><span className="font-bold accent-color">40% Tecnologia:</span> Evolução da plataforma e desenvolvimento de IA.</li>
                    <li><span className="font-bold text-[#ffa400]">35% Marketing & Vendas:</span> Estruturação do funil de vendas e aquisição de clientes.</li>
                    <li><span className="font-bold text-[#e6cbe4]">25% Operações:</span> Expansão da equipe de curadoria e suporte.</li>
                </ul>
            </div>
        </div>
    </SectionWrapper>
);

const SchoolSection: React.FC<{onGenerateActivity: (themes: string) => void;}> = ({onGenerateActivity}) => {
    const [themes, setThemes] = useState('');
    const [model, setModel] = useState<'standard' | 'protagonist'>('standard');
    
    const handleSubmit = () => {
        if(!themes.trim()) {
            alert('Por favor, insira os temas e a faixa etária.');
            return;
        }
        onGenerateActivity(themes);
    }
    
    return (
        <SectionWrapper title={<>Para <span className="accent-color">Escolas</span></>} subtitle="Inovação, Receita e a Solução para o seu Contraturno.">
            <div>
                <h3 className="text-3xl font-bold text-center mb-8">De um "BO" a um Centro de Lucro e Inovação</h3>
                <div className="grid md:grid-cols-3 gap-8">
                     <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Gestão Simplificada</h4>
                        <p className="text-gray-600 mt-2">Centralizamos matrículas, pagamentos e comunicação em uma única plataforma. Acabe com a complexidade de gerenciar múltiplos parceiros.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Curadoria de Qualidade</h4>
                        <p className="text-gray-600 mt-2">Oferecemos um portfólio de experiências únicas e educadores qualificados, alinhados à BNCC e aos interesses dos alunos.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Nova Fonte de Receita</h4>
                        <p className="text-gray-600 mt-2">Monetize seus espaços ociosos e aumente o faturamento sem custo de implementação ou aumento da carga operacional.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold text-center mb-2">Co-crie seu Contraturno com IA</h3>
                <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">Sem ideias para inovar? Descreva os temas de interesse e a faixa etária dos seus alunos e deixe nossa IA criar propostas de atividades incríveis para você.</p>
                <div className="max-w-xl mx-auto">
                    <label htmlFor="activity-themes" className="block text-sm font-medium text-gray-700 mb-1">Temas (ex: tecnologia, arte, sustentabilidade)</label>
                    <input type="text" id="activity-themes" value={themes} onChange={(e) => setThemes(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="sustentabilidade, arte, 10-12 anos" />
                    <button onClick={handleSubmit} className="w-full bg-[#ff595a] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition flex items-center justify-center">
                        <span className="mr-2">✨</span> Gerar Ideias de Atividades
                    </button>
                </div>
            </div>
            
            <div className="bg-[#aec5e7] p-8 md:p-12 rounded-2xl">
                <h3 className="text-3xl font-bold text-center mb-8">Uma Parceria Financeira Flexível e Vantajosa</h3>
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-2 rounded-full flex space-x-2">
                        <button onClick={() => setModel('standard')} className={`py-2 px-5 rounded-full font-medium text-sm transition-colors ${model === 'standard' ? 'bg-[#ff595a] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Modelo Padrão</button>
                        <button onClick={() => setModel('protagonist')} className={`py-2 px-5 rounded-full font-medium text-sm transition-colors ${model === 'protagonist' ? 'bg-[#ff595a] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Protagonista</button>
                    </div>
                </div>
                {model === 'standard' ? (
                    <div className="text-center max-w-3xl mx-auto">
                        <h4 className="text-2xl font-bold">Modelo 1: Parceria Padrão (Risco Zero)</h4>
                        <p className="text-gray-700 mt-2">Ideal para começar. Você cede o espaço e nós cuidamos de tudo. Sua escola recebe uma fatia da receita sem nenhum custo fixo.</p>
                        <div className="mt-6 text-2xl font-semibold"><span className="accent-color">20%</span> do faturamento para sua escola.</div>
                    </div>
                ) : (
                    <div className="text-center max-w-3xl mx-auto">
                        <h4 className="text-2xl font-bold">Modelo 2: Protagonismo Comercial</h4>
                        <p className="text-gray-700 mt-2">Sua escola lidera o esforço comercial e é recompensada com uma participação maior na receita. Ideal para escolas com alto potencial de matrículas.</p>
                        <div className="mt-6 text-2xl font-semibold"><span className="accent-color">30%</span> do faturamento para sua escola.</div>
                        <div className="mt-2 text-gray-500">(+ taxa de assinatura de R$ 2.000/mês)</div>
                        <div className="mt-4 bg-white/70 p-4 rounded-lg text-sm">
                            <strong>Ponto de Equilíbrio:</strong> Este modelo se torna mais vantajoso que o Padrão a partir de <strong>68 matrículas</strong> (considerando um ticket médio de R$ 298).
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-bold text-center mb-8">A transformação do seu contraturno começa agora.</h3>
                 <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl mb-2">1. Diagnóstico Gratuito</h4>
                        <p className="text-gray-600">Realizamos um diagnóstico científico-pedagógico para entender os interesses de seus alunos e as potencialidades do seu espaço.</p>
                    </div>
                     <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl mb-2">2. Plano Personalizado</h4>
                        <p className="text-gray-600">Apresentamos um plano de atividades e uma projeção de receita customizada para sua realidade.</p>
                    </div>
                     <div className="bg-white p-8 rounded-2xl shadow-sm md:col-span-2">
                        <h4 className="font-bold text-xl mb-2">3. Lançamento e Gestão</h4>
                        <p className="text-gray-600">Cuidamos de todo o lançamento, comunicação e gestão contínua, para que você foque no que mais importa: a educação.</p>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

const EducatorSection: React.FC<{onGetAssistance: (challenge: string) => void;}> = ({onGetAssistance}) => {
    const [challenge, setChallenge] = useState('');
    
    const handleSubmit = () => {
        if(!challenge.trim()) {
            alert('Por favor, descreva seu desafio.');
            return;
        }
        onGetAssistance(challenge);
    }
    
    return (
        <SectionWrapper title={<>Para <span className="accent-color">Educadores</span></>} subtitle="Empreenda, Transforme e seja Protagonista.">
            <div>
                <h3 className="text-3xl font-bold text-center mb-8">Sua Paixão, Nosso Impulso.</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Autonomia e Autoria</h4>
                        <p className="text-gray-600 mt-2">Valorizamos sua criatividade. Tenha liberdade para criar e aplicar seus projetos pedagógicos autorais.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Remuneração Justa</h4>
                        <p className="text-gray-600 mt-2">Receba 35% do faturamento das suas turmas, um modelo de ganhos superior à média do mercado, e participe do nosso programa de partnership.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Foco na Pedagogia</h4>
                        <p className="text-gray-600 mt-2">Nossa plataforma automatiza a burocracia (matrículas, pagamentos, frequência) para que você se dedique ao que faz de melhor: educar.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold text-center mb-2">Seu Assistente Pedagógico Pessoal</h3>
                <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">Enfrentando um desafio em sala de aula? Descreva seu problema e nossa IA fornecerá sugestões práticas e criativas para apoiar seu planejamento.</p>
                <div className="max-w-xl mx-auto">
                    <label htmlFor="educator-challenge" className="block text-sm font-medium text-gray-700 mb-1">Descreva seu desafio pedagógico</label>
                    <textarea id="educator-challenge" value={challenge} onChange={e => setChallenge(e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Ex: Meus alunos adolescentes estão desengajados nas aulas de programação..."></textarea>
                    <button onClick={handleSubmit} className="w-full bg-[#ff595a] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition flex items-center justify-center">
                       <span className="mr-2">✨</span> Pedir Ajuda à IA
                    </button>
                </div>
            </div>

            <div className="bg-[#aec5e7] p-8 md:p-12 rounded-2xl text-center">
                <h3 className="text-3xl font-bold mb-4">Cresça em uma Comunidade de Pares</h3>
                <p className="text-gray-700 max-w-3xl mx-auto">Participe de formações continuadas, encontros semanais e uma comunidade ativa de troca e cocriação. Na LABirintar, você não está sozinho na sua jornada empreendedora.</p>
                <button className="mt-8 bg-[#ff595a] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition">Faça Parte da Revolução</button>
            </div>
        </SectionWrapper>
    );
};

const PartnerSection: React.FC<{ onSimulateSynergy: (partnerType: string) => void; }> = ({ onSimulateSynergy }) => {
    const [partnerType, setPartnerType] = useState('Fintech (Soluções Financeiras)');

    const handleSubmit = () => {
        onSimulateSynergy(partnerType);
    };

    return (
        <SectionWrapper title={<>Para <span className="accent-color">Parceiros Estratégicos</span></>} subtitle="Sinergia para Transformar o Ecossistema Educacional.">
            <div className="text-center">
                <h3 className="text-3xl font-bold">Somos rede resiliente e generativa.</h3>
                <p className="text-gray-600 max-w-3xl mx-auto mt-4">Acreditamos que a colaboração é a chave para a transformação. Nossa plataforma é um hub que conecta as melhores soluções educacionais a uma rede qualificada de escolas e educadores.</p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold text-center mb-2">Simulador de Sinergia com IA</h3>
                <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">Como sua empresa pode se conectar ao nosso ecossistema? Selecione seu setor e veja os potenciais de parceria que nossa IA identifica para vocês.</p>
                <div className="max-w-xl mx-auto">
                    <label htmlFor="partner-type" className="block text-sm font-medium text-gray-700 mb-1">Qual o seu tipo de negócio?</label>
                    <select id="partner-type" value={partnerType} onChange={e => setPartnerType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white">
                        <option>Fintech (Soluções Financeiras)</option>
                        <option>Content Provider (Conteúdo Pedagógico)</option>
                        <option>Marketing Agency (Agência de Marketing)</option>
                        <option>Hardware Provider (Kits de Robótica/Maker)</option>
                    </select>
                    <button onClick={handleSubmit} className="w-full bg-[#ff595a] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition flex items-center justify-center">
                       <span className="mr-2">✨</span> Simular Sinergia
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-bold text-center mb-8">Modelos de Colaboração e Valor Compartilhado</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Prospecção Conjunta</h4>
                        <p className="text-gray-600 mt-2">Trocamos leads e abrimos portas, reduzindo o Custo de Aquisição de Clientes (CAC) para todos no ecossistema.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Integração de Valor</h4>
                        <p className="text-gray-600 mt-2">Embarque sua solução em nossa plataforma, alcançando instantaneamente nossa base de escolas e alunos através de um modelo SaaS.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xl">Spinoff e Incubação</h4>
                        <p className="text-gray-600 mt-2">Para parceiros com alto alinhamento, atuamos como incubadora, oferecendo suporte de gestão, técnico e canais comerciais.</p>
                    </div>
                </div>
            </div>
             <div className="bg-[#aec5e7] p-8 md:p-12 rounded-2xl text-center">
                <h3 className="text-3xl font-bold mb-4">Nossos Parceiros Atuais Validam o Modelo</h3>
                <div className="mt-8 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-70">
                    <span className="font-semibold text-lg">IDB</span>
                    <span className="font-semibold text-lg">Frella</span>
                    <span className="font-semibold text-lg">8bits</span>
                    <span className="font-semibold text-lg">Didatech</span>
                    <span className="font-semibold text-lg">FestPay</span>
                </div>
                <button className="mt-10 bg-[#ff595a] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition">Agende uma Conversa de Parceria</button>
            </div>
        </SectionWrapper>
    );
};


const AudienceSections: React.FC<AudienceSectionsProps> = ({ activeAudience, onGenerateActivity, onGetAssistance, onSimulateSynergy }) => {
    return (
        <div className="container mx-auto">
            {activeAudience === 'investor' && <InvestorSection />}
            {activeAudience === 'school' && <SchoolSection onGenerateActivity={onGenerateActivity} />}
            {activeAudience === 'educator' && <EducatorSection onGetAssistance={onGetAssistance} />}
            {activeAudience === 'partner' && <PartnerSection onSimulateSynergy={onSimulateSynergy} />}
        </div>
    );
};

export default AudienceSections;