import { PITCH_DECK_STRATEGY_DOC } from './knowledge-base/pitchDeckStrategy';
import { CHALLENGES_DOC } from './knowledge-base/challenges';
import { EDUCATOR_PAINS_DOC } from './knowledge-base/educatorPains';
import { GOVERNANCE_DOC } from './knowledge-base/governance';
import { MARKET_PAINS_DOC } from './knowledge-base/marketPains';
import { PERSONA_DOC } from './knowledge-base/persona';
import { SOCIAL_PROOF_DOC } from './knowledge-base/socialProof';
import { PITCH_DECK_2025_DOC } from './knowledge-base/pitchDeck2025';
import { VALUATION_2025_DOC } from './knowledge-base/valuation2025';

// This file provides the single source of truth for Nina AI's knowledge base.
// It combines all strategic documents into one context.
export const NINA_KNOWLEDGE_BASE = `
--- DOCUMENTO: PITCH DECK ESTRATÉGICO (VERSÃO INICIAL) ---
${PITCH_DECK_STRATEGY_DOC}

--- DOCUMENTO: PITCH DECK ESTRATÉGICO (VERSÃO 2025) ---
${PITCH_DECK_2025_DOC}

--- DOCUMENTO: VALUATION 2025 (BALANÇO, DRE, FLUXO DE CAIXA) ---
${VALUATION_2025_DOC}

--- DOCUMENTO: PERSONA NINA AI (MARIA LÍVIA) ---
${PERSONA_DOC}

--- DOCUMENTO: DOSSIÊ DE PROVAS SOCIAIS ---
${SOCIAL_PROOF_DOC}

--- DOCUMENTO: DORES DO MERCADO DE EDUCAÇÃO BÁSICA ---
${MARKET_PAINS_DOC}

--- DOCUMENTO: DORES DOS EDUCADORES EMPREENDEDORES ---
${EDUCATOR_PAINS_DOC}

--- DOCUMENTO: MANUAL DE GOVERNANÇA CORPORATIVA ---
${GOVERNANCE_DOC}

--- DOCUMENTO: MAIORES DESAFIOS DA LABIRINTAR ---
${CHALLENGES_DOC}
`;