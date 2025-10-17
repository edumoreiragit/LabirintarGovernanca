
export const TRACTION_DATA = [
    { id: 'traction-schools', endValue: 3, label: 'Escolas Atendidas' },
    { id: 'traction-students', endValue: 32, label: 'Alunos Impactados' },
    { id: 'traction-revenue', endValue: 20, label: 'Mil+ em Receita', suffix: 'k+' },
    { id: 'traction-months', endValue: 4, label: 'Meses de Validação' },
];

export const REVENUE_SPLIT_DATA = [
  { name: 'Rede (Educador+Parceiro)', value: 50, fill: '#ffa400' },
  { name: 'LABirintar', value: 30, fill: '#ff595a' },
  { name: 'Escola', value: 20, fill: '#aec5e7' },
];

export const USE_OF_FUNDS_DATA = [
  { name: 'Tecnologia', value: 40, fill: '#ff595a' },
  { name: 'Marketing & Vendas', value: 35, fill: '#ffa400' },
  { name: 'Operações', value: 25, fill: '#e6cbe4' },
];

export const REVENUE_PROJECTION_DATA = [
  { name: 'Ano 1', "Receita Bruta Projetada": 150000 },
  { name: 'Ano 2', "Receita Bruta Projetada": 800000 },
  { name: 'Ano 3', "Receita Bruta Projetada": 3500000 },
  { name: 'Ano 4', "Receita Bruta Projetada": 9000000 },
  { name: 'Ano 5', "Receita Bruta Projetada": 25000000 },
];

export const QA_ASSISTANTS = [
    {
        type: 'investor',
        icon: '🔮',
        title: 'Oráculo do Investidor',
        systemPrompt: "Você é o 'Oráculo do Investidor', um assistente de IA especialista em finanças e startups do setor EdTech, respondendo a perguntas sobre a LABirintar. Responda de forma concisa e direta à seguinte pergunta de um investidor em potencial.",
        faqs: [
            {
                q: "Como pretendem escalar o processo de vendas?",
                a: "O investimento de R$ 2 milhões é precisamente para isso. 35% dos recursos serão alocados para construir um 'motor de vendas' previsível e escalável, profissionalizando o processo com a contratação de um time comercial, implementação de CRM e estratégias de marketing digital para sair da dependência de indicações."
            },
            {
                q: "Qual a projeção de CAC para canais pagos?",
                a: "Projetamos um CAC inicial em canais pagos (Google/Meta Ads) em torno de R$ 1.200, com base em benchmarks do setor EdTech. Com a otimização das campanhas e o fortalecimento da marca, nossa meta é reduzir o CAC para R$ 800 em 18 meses, mantendo a relação LTV/CAC acima de 3x, o que é saudável para um modelo SaaS B2B."
            },
            {
                q: "Qual a principal barreira de entrada (moat)?",
                a: "Nossa principal barreira é o **efeito de rede** do nosso ecossistema. A plataforma tecnológica pode ser copiada, mas a nossa rede viva e engajada de Educadores Empreendedores, cultivada com propósito, formação e incentivos, é um ativo intangível e dificilmente replicável. Quanto mais escolas e educadores de qualidade temos, mais forte se torna a nossa rede, criando um ciclo virtuoso que nos protege da concorrência."
            }
        ]
    },
    {
        type: 'school',
        icon: '🏛️',
        title: 'Arquiteto Escolar',
        systemPrompt: "Você é o 'Arquiteto Escolar', um assistente de IA especialista em gestão educacional e inovação pedagógica, respondendo a perguntas sobre a LABirintar. Responda de forma prática e focada nos benefícios para a escola à seguinte pergunta.",
        faqs: [
             {
                q: "Como garantem a segurança e qualidade dos educadores?",
                a: "Temos um rigoroso processo de qualificação (vetting) que inclui análise de currículo, checagem de antecedentes, entrevistas por competências e avaliação de uma aula-teste. Além disso, oferecemos formação continuada e monitoramos o desempenho através do 'Score do EE' e feedbacks constantes da comunidade escolar."
            },
            {
                q: "Isso não vai sobrecarregar minha equipe de coordenação?",
                a: "Pelo contrário. Nossa plataforma foi desenhada para **reduzir** a carga operacional. Automatizamos matrículas, pagamentos, controle de frequência e comunicação, centralizando a gestão. Sua equipe se livra da burocracia e ganha tempo para focar na estratégia pedagógica."
            },
            {
                q: "Como as atividades se alinham ao meu projeto pedagógico?",
                a: "Nosso primeiro passo é sempre um 'diagnóstico científico-pedagógico gratuito'. Nele, entendemos a cultura e as necessidades da sua escola. A partir daí, co-criamos um portfólio de atividades que complementa e enriquece seu projeto existente, sempre alinhado à BNCC."
            }
        ]
    },
     {
        type: 'educator',
        icon: '💡',
        title: 'Mentor Criativo',
        systemPrompt: "Você é o 'Mentor Criativo', um assistente de IA que apoia educadores em sua jornada empreendedora com a LABirintar. Responda de forma empática e encorajadora à seguinte pergunta de um educador.",
        faqs: [
            {
                q: "Este modelo não precariza meu trabalho?",
                a: "Nossa visão é de empoderamento, não precarização. Oferecemos uma remuneração (35% do faturamento) superior à média de mercado, autonomia para criar, formação contínua e um programa de partnership (stock options) que o torna sócio do negócio, participando diretamente do sucesso que você ajuda a construir."
            },
            {
                q: "Quem é o dono da propriedade intelectual dos meus projetos?",
                a: "Valorizamos a sua autoria. Os projetos que você desenvolve são seus. O que fazemos é criar um ambiente para que eles floresçam e alcancem mais alunos, com a plataforma e a rede servindo como um catalisador para o seu talento, não como um detentor dele."
            },
             {
                q: "Tenho garantia de renda?",
                a: "Como em qualquer jornada empreendedora, a renda é variável. No entanto, nosso papel é criar as melhores condições para o seu sucesso. Investimos em marketing para gerar demanda nas escolas, oferecemos um playbook de vendas e te conectamos a uma rede de oportunidades, aumentando exponencialmente seu potencial de ganhos em comparação a atuar sozinho."
            }
        ]
    },
     {
        type: 'partner',
        icon: '🤝',
        title: 'Conector de Sinergias',
        systemPrompt: "Você é o 'Conector de Sinergias', um assistente de IA focado em parcerias estratégicas para o ecossistema LABirintar. Responda de forma estratégica e colaborativa à seguinte pergunta de um parceiro em potencial.",
        faqs: [
             {
                q: "Como garantimos que a parceria não vai canibalizar minhas vendas?",
                a: "Atuamos como um canal de vendas incremental, não substituto. A LABirintar abre portas em escolas que talvez você não alcançaria sozinho, integrando sua solução a um ecossistema completo. O objetivo é expandir o mercado para ambos, gerando novas receitas que não existiriam de outra forma."
            },
            {
                q: "Qual o custo e esforço para integrar com a plataforma?",
                a: "Nossa plataforma foi construída com flexibilidade em mente. Dependendo do modelo de parceria, a integração pode ser tão simples quanto um acordo de prospecção conjunta ou envolver APIs para uma integração mais profunda. O investimento é discutido caso a caso para garantir o benefício mútuo, mas nosso objetivo é sempre reduzir atritos."
            },
             {
                q: "Como os dados são tratados na parceria (LGPD)?",
                a: "A conformidade com a LGPD é inegociável. Todas as parcerias são formalizadas com contratos que especificam claramente o tratamento, a propriedade e a segurança dos dados. Priorizamos o uso de dados anonimizados para insights estratégicos, sempre com a máxima transparência e ética."
            }
        ]
    }
];
