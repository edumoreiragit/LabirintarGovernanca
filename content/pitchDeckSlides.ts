import React from 'react';
import { PitchDeckData, Slide } from '../types';
import { SOFTWARE_IMAGES } from './assets';
import NetworkGraph from '../components/NetworkGraph';

const ctaSlide: Slide = {
    id: 'cta-final',
    layout: 'contact',
    title: 'Plug and Play.',
    mainMessage: 'Cuidemos da LABirintar para que ela cuide da transformação da Educação Integral no Brasil que é urgente e mandatória. Faça parte da origem histórica dessa transformação.',
    backgroundImage: 'https://raw.githubusercontent.com/clubesa/governanca/main/pitchDeck/image/5ea2fa8b-95f5-46c3-92b9-73dbb70d8a66.jpeg',
    contactInfo: {
        name: 'Maria Lívia',
        title: 'CEO and Founder',
        phone: '(11) 982153004',
        email: 'marialivia@labirintar.com.br',
        website: 'www.labirintar.com.br'
    }
};

export const PITCH_DECK_DATA: PitchDeckData = {
    common: [
        {
            id: 'cover',
            layout: 'cover',
            backgroundImage: 'https://clubesa.github.io/governanca/pitchDeck/image/IMG_0461.jpeg',
            subtitle: React.createElement('b', null, 'Somos a inteligência em rede por trás da construção da Escola em Tempo Integral.'),
            mainMessage: React.createElement(
                'div',
                { className: 'bg-white/80 p-6 rounded-2xl shadow-md !text-gray-800' },
                'A LABirintar conecta escolas, educadores e famílias em um ecossistema vivo de experiências educativas, combinando curadoria pedagógica, rede de educadores empreendedores e tecnologia automatizada.'
            ),
        },
        {
            id: 'problem',
            layout: 'problem',
            backgroundImage: 'https://clubesa.github.io/governanca/pitchDeck/image/IMG_4999.gif',
            title: React.createElement(React.Fragment, null, 'O Tempo Integral é Lei.', React.createElement('br'), 'A Qualidade é ', React.createElement('span', { className: 'accent-color' }, 'Desafio.')),
            mainMessage: 'A simples extensão da carga horária para 97.3 milhões de alunos, sem uma revolução pedagógica, cria um problema triplo: escolas sobrecarregadas, famílias insatisfeitas e crianças despreparadas para o futuro.',
            stats: [
                { value: 70, suffix: '%', text: 'das famílias buscam ativamente escolas que desenvolvam habilidades socioemocionais.' },
                { value: 65, suffix: '%', text: 'das crianças de hoje trabalharão em profissões que ainda não existem.' },
                { value: 235, suffix: ' Mil', text: 'é o déficit de mão de obra para 2035 com a expansão em 1,3 MI de novas vagas, conforme Lei 14.640/2023.' },
            ],
            highlightCard: {
                text: 'Escola para quê?'
            }
        },
        {
            id: 'solution',
            layout: 'solution',
            title: React.createElement(React.Fragment, null, 'Não vendemos aulas.', React.createElement('br'), 'Orquestramos um ', React.createElement('span', { className: 'accent-color' }, 'Ecossistema Vivo.')),
            mainMessage: 'Plataforma Multilateral que transforma o contraturno em um centro de inovação, desenvolvimento e lucro.',
            cards: [
                { title: 'Escolas', text: 'Transformam o contraturno em um centro de inovação e receita, com gestão automatizada.', rotation: '-rotate-6' },
                { title: 'Educadores', text: 'Encontram autonomia, remuneração justa e uma comunidade para empreender e transformar.', rotation: 'rotate-6' },
                { title: 'Famílias', text: 'Acessam experiências de alta qualidade que desenvolvem as competências do futuro.', rotation: 'rotate-3' },
                { title: 'Provedores', text: 'Conectam suas soluções a uma rede qualificada, acelerando o impacto e o crescimento.', rotation: '-rotate-3' },
            ],
            carouselImages: [
                // Ateliê
                { component: 'Ateliê', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/atelie/CrioLivros1.jpg' },
                { component: 'Ateliê', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/atelie/CrioLivros2.jpg' },
                { component: 'Ateliê', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/atelie/CrioLivros3.jpg' },
                { component: 'Ateliê', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/atelie/CrioLivros4.jpg' },
                { component: 'Ateliê', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/atelie/CrioLivros5.jpg' },
                { component: 'Ateliê', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/atelie/IMG_1820.jpeg' },
                { component: 'Ateliê', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/atelie/IMG_1861.jpeg' },
                { component: 'Ateliê', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/atelie/IMG_1862.jpeg' },
                // Brincar Livre
                { component: 'Brincar Livre', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/brincarlivre/IMG_1801.jpeg' },
                { component: 'Brincar Livre', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/brincarlivre/IMG_1804.jpeg' },
                { component: 'Brincar Livre', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/brincarlivre/IMG_1811.jpeg' },
                { component: 'Brincar Livre', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/brincarlivre/IMG_1830.jpeg' },
                { component: 'Brincar Livre', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/brincarlivre/IMG_1831.jpeg' },
                { component: 'Brincar Livre', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/brincarlivre/IMG_1832.jpeg' },
                { component: 'Brincar Livre', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/brincarlivre/IMG_1979.jpeg' },
                // Cidade Vamos
                { component: 'Cidade Vamos', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/cidadevamos/IMG_1912.jpeg' },
                { component: 'Cidade Vamos', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/cidadevamos/IMG_1913.jpeg' },
                { component: 'Cidade Vamos', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/cidadevamos/IMG_1914.jpeg' },
                { component: 'Cidade Vamos', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/cidadevamos/IMG_1915.jpeg' },
                { component: 'Cidade Vamos', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/cidadevamos/IMG_1916.jpeg' },
                { component: 'Cidade Vamos', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/cidadevamos/IMG_1917.jpeg' },
                { component: 'Cidade Vamos', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/cidadevamos/IMG_1926.jpeg' },
                 // Circo
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/IMG_1813.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/IMG_1839.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/IMG_1840.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/IMG_1841.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/IMG_1842.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/IMG_1843.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/IMG_1844.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/bc110c9c-a8e1-452a-94b7-5a0c6ce0d3b8.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/e3b3b2a3-a15e-4e24-be2f-b529a24e3a60.jpeg' },
                { component: 'Circo', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/circo/f80d9019-6851-4b2f-af19-5a8dd0edcaf7.jpeg' },
                // Fazeres Manuais
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/82d08da1-ed2c-4bfd-908a-4b6e75999604.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1822.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1846.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1847.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1848.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1849.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1850.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1851.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1852.jpeg' },
                { component: 'Fazeres Manuais', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/fazeresmanuais/IMG_1853.jpeg' },
                // Infância Sem Excesso
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1927.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1928.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1929.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1930.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1931.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1932.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1933.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1934.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1935.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1936.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1937.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1938.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1939.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1940.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1941.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1942.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1944.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1945.jpeg' },
                { component: 'Infância Sem Excesso', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/infanciasemexcesso/IMG_1946.jpeg' },
                // Marcenaria
                { component: 'Marcenaria', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/marcenaria/IMG_1809.jpeg' },
                { component: 'Marcenaria', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/marcenaria/IMG_1810.jpeg' },
                { component: 'Marcenaria', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/marcenaria/IMG_1835.jpeg' },
                { component: 'Marcenaria', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/marcenaria/IMG_1836.jpeg' },
                { component: 'Marcenaria', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/marcenaria/IMG_1837.jpeg' },
                // Mindfulness
                { component: 'Mindfulness', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/mindfulness/4f98ae78-9869-4179-95df-93919ee1616f.jpeg' },
                { component: 'Mindfulness', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/mindfulness/87b6d7f1-94a9-4b8e-adfd-5b0bda9ff2e0.jpeg' },
                { component: 'Mindfulness', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/mindfulness/IMG_1812.jpeg' },
                { component: 'Mindfulness', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/mindfulness/IMG_1854.jpeg' },
                { component: 'Mindfulness', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/mindfulness/IMG_1855.jpeg' },
                { component: 'Mindfulness', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/mindfulness/IMG_1857.jpeg' },
                // Prática Esportiva
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1907.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1908.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1910.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1911.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1969.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1970.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1971.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1972.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1973.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1974.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1975.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1976.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1977.jpeg' },
                { component: 'Prática Esportiva', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/praticaesportiva/IMG_1978.jpeg' },
                // Tecnologia
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1807.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1808.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1894.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1895.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1896.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1897.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1898.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1899.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1900.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1901.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1902.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1903.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1904.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1905.jpeg' },
                { component: 'Tecnologia', url: 'https://raw.githubusercontent.com/LABirintar/comercial/main/diagnostico/tecnologia/IMG_1906.jpeg' },
            ]
        },
        {
            id: 'how-it-works',
            layout: 'how-it-works',
            title: React.createElement('span', { className: 'accent-color' }, 'Curadoria, Rede e Tecnologia.'),
            mainMessage: 'Nossa solução se baseia em três pilares integrados: curadoria pedagógica de ponta, uma rede autogerida de educadores-empreendedores e uma plataforma tecnológica que automatiza toda a operação.',
             cards: [
                { 
                    title: 'Curadoria Pedagógica', 
                    text: React.createElement('div', { className: 'text-sm text-left' },
                        React.createElement('strong', { className: 'font-bold text-gray-800 block mb-1' }, 'Nosso jeito de fazer'),
                        React.createElement('ul', { className: 'list-disc list-inside text-gray-600 mb-3' },
                            React.createElement('li', null, 'Aula como experiência', React.createElement('p', { className: 'italic text-xs pl-5' }, 'Por que eu quero viver isso?')),
                            React.createElement('li', null, 'Aprendizado por Projeto', React.createElement('p', { className: 'italic text-xs pl-5' }, 'Onde eu quero chegar?')),
                            React.createElement('li', null, 'Pesquisa Etnográfica', React.createElement('p', { className: 'italic text-xs pl-5' }, 'Onde podemos inovar?')),
                        ),
                        React.createElement('strong', { className: 'font-bold text-gray-800 block mb-1' }, 'Rotina estruturante'),
                        React.createElement('ul', { className: 'list-disc list-inside text-gray-600 text-xs' },
                            React.createElement('li', null, 'Intencionalidade'),
                            React.createElement('li', null, 'Autonomia'),
                            React.createElement('li', null, 'Presença'),
                            React.createElement('li', null, 'Problematização/ Aproximação'),
                            React.createElement('li', null, 'Ação/ Cooperação'),
                            React.createElement('li', null, 'Contemplação'),
                            React.createElement('li', null, 'Documentação'),
                        )
                    )
                },
                { 
                    title: 'Rede Autogerida', 
                    text: React.createElement('div', { className: 'flex-grow flex flex-col' },
                        React.createElement('p', { className: 'mb-2 text-gray-600' }, 'Nossa rede se expande organicamente, conectando talentos e oportunidades. Cada novo nó fortalece o todo, criando um ecossistema vivo e dinâmico.'),
                        React.createElement(NetworkGraph)
                    )
                },
                { 
                    title: 'Plataforma de Gestão', 
                    text: 'Automatizamos matrículas, pagamentos e comunicação, liberando a escola da carga operacional.',
                    carouselImages: SOFTWARE_IMAGES,
                },
            ]
        },
        {
            id: 'traction',
            layout: 'traction',
            title: React.createElement(React.Fragment, null, 'Nascemos no Chão da Escola.', React.createElement('br'), 'E já estamos ', React.createElement('span', { className: 'accent-color' }, 'tracionando.')),
            mainMessage: 'Nosso modelo foi validado no mundo real, gerando receita, impacto pedagógico e a confiança de nossos primeiros parceiros.',
            stats: [
                 { value: 4, text: 'Meses de validação' },
                 { value: 3, text: 'Escolas atendidas' },
                 { value: 32, text: 'Alunos impactados' },
                 { value: 20, prefix: 'R$', suffix: 'Mil+', text: 'em Receita' },
            ],
        },
        {
            id: 'team',
            layout: 'team',
            title: 'Paixão de Educador com Visão de Negócio',
            subtitle: 'A equipe fundadora une a profundidade pedagógica com a experiência em estratégia e sistemas.',
            teamMembers: [
                { 
                    name: 'Maria Lívia', 
                    role: 'Fundadora', 
                    photoKey: 'maria',
                    description: React.createElement('div', null, 
                        React.createElement('p', { className: 'mb-2 font-semibold' }, 'Educação, Produto e Visão Pedagógica'), 
                        React.createElement('p', { className: 'mb-2' }, 'Pedagoga. Especialista em Antropologia da Educação. Pesquisadora das Infâncias. Formadora de educadores.'), 
                        React.createElement('p', null, 'No chão da escola trabalhou junto a mais de 600 crianças e suas famílias.')
                    )
                },
                { 
                    name: 'Edu Moreira', 
                    role: 'Co-fundador', 
                    photoKey: 'edu',
                    description: React.createElement('div', null, 
                        React.createElement('p', { className: 'mb-2 font-semibold' }, 'Estratégia, Sistemas e Captação'),
                        React.createElement('p', { className: 'mb-2' }, 'Administrador e contador, com especialização em Finanças, Sistemas de Informação e certificação em Neurociências.'), 
                        React.createElement('p', null, 'Atuou no SEBRAE com planos de negócios e viabilidade, desenvolveu sistemas de gestão com metodologias contemporâneas e atua como advisor em redes como Anjos do Brasil e BNI, conectando inovação e captação de recursos.')
                    )
                },
                { 
                    name: 'Rian Polonini', 
                    role: 'Gestor de Tecnologia', 
                    photoKey: 'rian',
                    description: React.createElement('div', null, 
                        React.createElement('p', { className: 'mb-2 font-semibold' }, 'Tecnologia e liderança'),
                        React.createElement('p', { className: 'mb-2' }, 'Engenheiro de Software com experiência full-stack, atuando no desenvolvimento de produtos escaláveis e performáticos.'), 
                        React.createElement('p', null, 'Participação ativa no Movimento Empresa Júnior, com atuação em cargos de diretoria e conselho.')
                    )
                },
            ]
        },
        {
            id: 'bifurcation',
            layout: 'bifurcation',
            title: 'Nosso ecossistema atende ao propósito de cada parceiro.',
            subtitle: 'Quem é você nesta jornada?',
            bifurcationOptions: [
                { audience: 'investor', icon: 'https://clubesa.github.io/governanca/pitchDeck/image/investidor.jpeg', title: 'Investidor', description: 'Busco o futuro da educação e um modelo de alto impacto.', subtext: 'Descubra nosso Moat' },
                { audience: 'school', icon: 'https://clubesa.github.io/governanca/pitchDeck/image/escola.jpeg', title: 'Escola', description: 'Quero inovar, gerar receita e encantar famílias.', subtext: 'Resolva sua dor' },
                { audience: 'educator', icon: 'https://clubesa.github.io/governanca/pitchDeck/image/educador.jpeg', title: 'Educador', description: 'Quero empreender, transformar e ser valorizado.', subtext: 'Seja protagonista' },
                { audience: 'partner', icon: 'https://clubesa.github.io/governanca/pitchDeck/image/provedor.jpeg', title: 'Provedor', description: 'Acredito no poder das conexões para escalar.', subtext: 'Explore sinergias' },
            ],
        },
    ],
    investor: [
        {
            id: 'investor_opportunity',
            layout: 'financial',
            title: 'Um Mercado de R$ 100 Bilhões em Transformação',
            subtitle: 'O mercado de atividades extracurriculares (nosso SOM) é de R$ 40 bilhões e a nova Lei do Tempo Integral acelera a demanda.',
            columns: [
                 { 
                    title: 'Posicionamento Estratégico',
                    text: 'A LABirintar atua na intersecção de EdTech e Creator Economy, capturando valor de um mercado massivo e fragmentado. Nossa plataforma é o sistema operacional para o contraturno, um nicho de alto crescimento impulsionado por legislação e demanda familiar.'
                },
                 { 
                    title: 'Mercado Endereçável (SOM)',
                    text: React.createElement('div', null, 
                        React.createElement('p', {className: "text-5xl font-bold accent-color mb-2"}, 'R$ 40 Bi'),
                        React.createElement('p', {className: 'text-gray-600'}, 'Nosso mercado endereçável (Serviceable Obtainable Market) apenas no Brasil, pronto para ser consolidado por uma solução integrada e escalável.'),
                    )
                },
            ]
        },
        {
            id: 'investor_model',
            layout: 'financial',
            title: 'Receita Recorrente com Efeito de Rede',
            subtitle: 'Nosso modelo de Revenue Share alinha interesses e cria um flywheel de crescimento sustentável.',
            columns: [
                { chart: 'revenue_split' },
                { 
                    title: 'Unit Economics Saudável',
                    text: 'O modelo de rede mantém o Custo de Aquisição (CAC) baixo, pois a própria rede de educadores e escolas gera indicações qualificadas. ',
                    list: [
                        { highlight: '50% Rede', text: 'Atrai e retém os melhores talentos (35% Educador, 15% Parceiro).', colorClass: 'text-[#ffa400]' },
                        { highlight: '30% LABirintar', text: 'Margem para reinvestir em tecnologia e crescimento.', colorClass: 'text-[#ff595a]' },
                        { highlight: '20% Escola', text: 'Gera receita passiva e incentiva a parceria.', colorClass: 'text-amber-800' },
                        { highlight: 'LTV/CAC > 3x', text: 'Já na fase piloto, demonstramos um retorno sobre o investimento em aquisição de clientes altamente eficiente.', colorClass: 'accent-color' },
                    ],
                },
            ]
        },
         {
            id: 'investor_projections',
            layout: 'financial',
            title: 'O Caminho para 1.200 Escolas',
            subtitle: 'Nossas projeções são ambiciosas, mas ancoradas em uma estratégia de aquisição faseada e replicável.',
            columns: [
                 { 
                    title: 'Estratégia de Crescimento',
                    text: 'O investimento será o motor para escalar nossa força de vendas e marketing, saindo do modelo de indicações para um funil de aquisição previsível. A meta é atingir 1.200 escolas em 8 anos, resultando em uma receita mensal de mais de R$ 25 milhões.',
                },
                { chart: 'projections' },
            ]
        },
        {
            id: 'investor_ask',
            layout: 'financial',
            title: 'Buscamos R$ 2M para Construir o Motor de Escala',
            subtitle: 'Valuation pré-money de R$ 4,2 milhões. O capital será alocado para remover gargalos e acelerar a tração.',
             columns: [
                { chart: 'use_of_funds' },
                { 
                    title: 'Alocação Estratégica',
                    text: 'Cada real investido tem um destino claro para destravar o próximo nível de crescimento da LABirintar.',
                    list: [
                        { highlight: '35% Mkt & Vendas', text: 'Estruturação da máquina de vendas.', colorClass: 'text-[#ff595a]' },
                        { highlight: '25% Operação', text: 'Expansão do time de curadoria e suporte.', colorClass: 'text-[#ffa400]' },
                        { highlight: '20% Tecnologia', text: 'Evolução da plataforma e IA.', colorClass: 'text-amber-800' },
                        { highlight: '10% Consultorias', text: 'Assessorias estratégicas (Ex: M&A, Jurídico).', colorClass: 'text-gray-500' },
                        { highlight: '10% Dev. Institucional', text: 'Fortalecimento da governança e conselho.', colorClass: 'text-gray-600' },
                    ],
                },
            ]
        },
        {
            id: 'investor_exit',
            layout: 'generic',
            title: 'Um Setor Aquecido com Saídas Relevantes',
            subtitle: 'O mercado de EdTech demonstra liquidez e interesse estratégico por modelos inovadores como o nosso.',
            columns: [
                {
                    title: 'Cenário de M&A',
                    text: 'Grandes grupos educacionais e empresas de tecnologia buscam ativamente soluções que resolvam a dor do contraturno e ofereçam modelos de negócio escaláveis. O setor viu um salto de 400% em operações de M&A no segundo trimestre de 2024, com exits relevantes como o da Procare Solutions por US$ 1.75 bi, validando o potencial de nichos resilientes.'
                },
                {
                    title: 'Estratégia de Saída',
                    text: 'Nossa estratégia de saída primária é a aquisição (M&A) por um player estratégico que busque consolidar o mercado de educação integral. Um IPO em longo prazo também é uma possibilidade, à medida que nos tornamos a plataforma líder no setor.'
                }
            ]
        },
        ctaSlide
    ],
    school: [
       {
            id: 'school_pain',
            layout: 'generic',
            title: React.createElement(React.Fragment, null, 'Entendemos a sua Dor: Contraturno é ', React.createElement('span', { className: 'accent-color' }, 'Complexo.')),
            mainMessage: 'Sabemos que a gestão de múltiplos parceiros, a pressão por novas receitas e o desafio de inovar pedagogicamente consomem tempo e recursos preciosos da sua equipe.',
            columns: [
                {
                    title: 'Gestão Descentralizada e Sobrecarga Operacional', 
                    checklist: [
                        'Gestão de múltiplos fornecedores, cada um com seus próprios contratos e sistemas de pagamento.',
                        'Enorme sobrecarga administrativa e pedagógica.',
                        'Desvio do foco da sua equipe do acompanhamento dos alunos para apagar incêndios operacionais.'
                    ]
                },
                {
                    title: 'Pressão Financeira e Receita Ociosa', 
                    checklist: [
                        'Pressão contínua para monetizar espaços ociosos e criar novas fontes de receita sem grandes investimentos.',
                        'Dificuldade em atrair e reter alunos com propostas de valor claras.',
                        'Impacto direto na saúde financeira da instituição.'
                    ]
                },
                {
                    title: 'Qualidade Pedagógica e Inovação', 
                    checklist: [
                        'Desafio constante em encontrar e validar atividades extracurriculares genuinamente inovadoras.',
                        'Dificuldade em encontrar educadores qualificados que engajem os alunos e se conectem ao projeto pedagógico.',
                        'Essa dificuldade é acentuada em áreas como tecnologia e artes.'
                    ]
                },
            ]
       },
       {
            id: 'school_solution',
            layout: 'generic',
            title: React.createElement(React.Fragment, null, 'A Solução Completa:', React.createElement('br'), 'De uma gestão "Apagar Incêndio" a um Centro de ', React.createElement('span', { className: 'accent-color' }, 'Inovação e Lucro')),
            mainMessage: 'Nossa plataforma automatiza a operação, nosso modelo gera novas receitas e nossa curadoria garante a excelência pedagógica, transformando seu contraturno em uma vantagem competitiva.',
            columns: [
                { 
                    title: 'Gestão Automatizada', 
                    checklist: [
                        'Automatizamos matrículas, pagamentos, frequência e comunicação em um único software.',
                        'Reduzimos a burocracia, disponibilizando mais tempo para o core do negócio: educação.'
                    ],
                    checklistColor: 'text-blue-500'
                },
                { 
                    title: 'Lucro', 
                    checklist: [
                        'Transformamos seus espaços ociosos em uma nova fonte de receita recorrente.',
                        'Implementamos sem custos e investimentos.',
                        'Reduzimos seus custos operacionais e sua carga de trabalho.'
                    ],
                    checklistColor: 'text-blue-500'
                },
                { 
                    title: 'Inovação', 
                    checklist: [
                        'Entregamos produtos educacionais inovadores em excelência pedagógica.',
                        'Investimos na cultura da inovação e transformação digital em toda a organização.'
                    ],
                    checklistColor: 'text-blue-500'
                },
            ]
       },
       {
            id: 'school_financial',
            layout: 'financial-models',
            title: 'Uma Parceria Financeira Flexível e Vantajosa',
            financialModels: {
                showBreakevenChart: true,
                models: [
                    { 
                        name: 'Entrada',
                        title: 'Modelo de Entrada',
                        description: 'Ideal para começar. Você cede o espaço, nós cuidamos de tudo, e sua escola participa da receita sem nenhum custo fixo.',
                        revenueShare: '20%',
                        revenueShareDetails: React.createElement('div', { className: 'text-xs text-gray-600 mt-2 space-y-1' },
                            React.createElement('p', null, '35% para Educadores'),
                            React.createElement('p', null, '15% para provedores'),
                            React.createElement('p', null, '30% para a LABirintar')
                        )
                    },
                    { 
                        name: 'Escala',
                        title: 'Modelo de Escala',
                        description: 'Investimos conjuntamente em esforço comercial para conversão de matrícula acima de 50% e a escola é recompensada com maior participação na receita e economia de escala.',
                        revenueShare: '30%',
                        fee: 'Assinatura mensal de R$ 2.000',
                        revenueShareDetails: React.createElement('div', { className: 'text-xs text-gray-600 mt-2 space-y-1' },
                            React.createElement('p', null, '35% para Educadores'),
                            React.createElement('p', null, '15% para provedores'),
                            React.createElement('p', null, '20% para a LABirintar')
                        )
                    }
                ],
                breakevenText: 'O modelo Escala se torna mais vantajoso a partir de 68 matrículas (considerando um ticket médio de R$ 298).'
            }
       },
       {
           id: 'school_onboarding',
           layout: 'how-it-works',
           title: React.createElement(React.Fragment, null, 'Implementação Líquida em ', React.createElement('span', { className: 'accent-color' }, '3 Movimentos')),
           mainMessage: 'Nosso processo de onboarding é desenhado para ser rápido, eficiente e sem custos para a escola.',
            cards: [
                { icon: '🔬', title: '1º Movimento: Diagnóstico', text: 'Realizamos um diagnóstico científico-pedagógico gratuito para entender os interesses dos alunos e as potencialidades do seu espaço.' },
                { icon: '🗺️', title: '2º Movimento: Plano Personalizado', text: 'Apresentamos um plano de atividades e uma projeção de receita customizada para sua realidade.' },
                { icon: '✅', title: '3º Movimento: Lançamento e Gestão', text: 'Cuidamos de todo o lançamento, comunicação com as famílias e gestão contínua. Sua escola acompanha tudo em tempo real.' },
            ]
       },
        ctaSlide
    ],
    educator: [
        {
            id: 'educator_intro',
            layout: 'cover',
            title: React.createElement(React.Fragment, null, 'Você é mais que um professor.', React.createElement('br'), 'É um ', React.createElement('span', { className: 'accent-color' }, 'Empreendedor da Educação.')),
            subtitle: 'Valorizamos sua autoria, sua paixão e seu desejo de transformar. Na LABirintar, você encontra o ecossistema para prosperar.',
        },
        {
            id: 'educator_value',
            layout: 'generic',
            title: React.createElement(React.Fragment, null, 'Um Modelo de Ganhos ', React.createElement('span', { className: 'accent-color' }, 'Superior e Justo')),
            mainMessage: 'Oferecemos um modelo de parceria que reconhece seu valor e potencial.',
            columns: [
                { icon: '💰', title: 'Remuneração Atrativa', text: 'Receba 35% do faturamento das suas turmas, um valor acima da média do mercado, que recompensa diretamente seu talento e dedicação.' },
                { icon: '📈', title: 'Potencial de Sociedade', text: 'Nosso programa de partnership (stock options) te dá a chance de se tornar sócio do negócio, participando do sucesso que você ajuda a construir.' },
            ]
        },
        {
            id: 'educator_support',
            layout: 'generic',
            title: React.createElement(React.Fragment, null, 'Foque no que você ama.', React.createElement('br'), 'Nós ', React.createElement('span', { className: 'accent-color' }, 'cuidamos do resto.')),
            mainMessage: 'Nossa plataforma e nossa rede existem para te dar suporte e remover as barreiras burocráticas.',
            columns: [
                { icon: '🤖', title: 'Menos Burocracia', text: 'Nossa plataforma automatiza matrículas, pagamentos e comunicação com as famílias, liberando seu tempo para a prática pedagógica.' },
                { icon: '🤝', title: 'Acesso a Escolas', text: 'Fazemos a ponte com nossa rede de escolas parceiras, abrindo portas para que seus projetos alcancem mais alunos.' },
            ]
        },
        {
            id: 'educator_community',
            layout: 'cover',
            title: React.createElement(React.Fragment, null, 'Cresça com uma ', React.createElement('span', { className: 'accent-color' }, 'Comunidade de Pares')),
            subtitle: 'Você não está sozinho. Participe de formações semanais, trocas de experiências e uma comunidade de educadores inovadores que, como você, querem revolucionar a educação.',
        },
        {
            id: 'educator_cta',
            layout: 'ai-interaction',
            aiInteraction: {
                audience: 'educator',
                title: 'Faça Parte da Revolução',
                description: 'Queremos conhecer seu talento. Descreva seu projeto ou área de atuação e nossa IA te mostrará como você pode se encaixar em nosso ecossistema.',
                inputLabel: 'Descreva seu projeto ou sua especialidade',
                placeholder: 'Ex: Oficina de robótica com sucata para crianças de 8 a 10 anos...',
                buttonText: 'Quero ser um LABirintar',
                promptGenerator: (input) => `Sou um educador e meu projeto/especialidade é: "${input}". Como a LABirintar pode potencializar meu trabalho e quais seriam os próximos passos para me juntar à rede?`
            }
        },
        ctaSlide
    ],
    partner: [
        {
            id: 'partner_intro',
            layout: 'generic',
            title: React.createElement(React.Fragment, null, 'O Poder do Ecossistema:', React.createElement('br'), 'Somos uma rede ', React.createElement('span', { className: 'accent-color' }, 'resiliente e generativa.')),
            mainMessage: 'Acreditamos que a colaboração é a chave para a transformação. Nossa plataforma é um hub que conecta as melhores soluções educacionais a uma rede qualificada de escolas e educadores.',
            columns: [
                {
                    icon: '🤝',
                    title: 'Prospecção Conjunta',
                    text: 'Trocamos leads e abrimos portas, reduzindo o Custo de Aquisição de Clientes (CAC) para todos no ecossistema.'
                },
                {
                    icon: '🔗',
                    title: 'Integração de Valor',
                    text: 'Embarque sua solução em nossa plataforma, alcançando instantaneamente nossa base de escolas e alunos através de um modelo de Revenue Share.'
                },
                {
                    icon: '💡',
                    title: 'Spinoff e Incubação',
                    text: 'Para parceiros com alto alinhamento estratégico, atuamos como incubadora, oferecendo suporte de gestão, técnico e acesso a canais comerciais.'
                }
            ]
        },
        {
            id: 'partner_synergy',
            layout: 'ai-interaction',
            aiInteraction: {
                audience: 'partner',
                title: 'Simulador de Sinergia com IA',
                description: 'Como sua empresa pode se conectar ao nosso ecossistema? Selecione seu setor e veja os potenciais de parceria que nossa IA identifica para vocês.',
                inputLabel: 'Qual o seu tipo de negócio?',
                options: [
                    'Content Provider (Conteúdo Pedagógico)',
                    'Fintech (Soluções Financeiras)',
                    'Hardware Provider (Kits de Robótica/Maker)',
                    'Agência de Marketing Educacional',
                    'Consultoria Pedagógica',
                ],
                buttonText: 'Simular Sinergia',
                promptGenerator: (input) => `Sou um parceiro em potencial do setor de "${input}". Descreva 3 potenciais sinergias estratégicas entre minha empresa e o ecossistema da LABirintar, focando em como podemos criar valor conjunto para as escolas e educadores.`
            }
        },
        {
            id: 'partner_proof',
            layout: 'social-proof',
            title: 'Parceiros que Crescem Conosco',
            mainMessage: 'Construímos relações de confiança e valor mútuo. Nossos parceiros validam a força do nosso ecossistema.',
            logos: ['idb', 'frella', 'bits8', 'didatech', 'festpay', 'codifica', 'vter', 'semente', 'rentapro', 'scaffold', 'porto', 'oficina']
        },
        {
            id: 'partner_cta',
            layout: 'cover',
            title: 'Vamos Construir Juntos?',
            subtitle: 'Acreditamos que a colaboração é o futuro da educação. Se sua empresa compartilha dessa visão, vamos conversar.',
            mainMessage: React.createElement(
                'button',
                {
                    className: 'mt-8 bg-[#ff595a] text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition',
                    onClick: () => window.open('mailto:contato@labirintar.com.br?subject=Proposta de Parceria', '_blank')
                },
                'Agende uma Conversa de Parceria'
            ),
        },
        ctaSlide
    ],
};