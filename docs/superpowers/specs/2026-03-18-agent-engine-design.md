# AI Agency Hub — Agent Engine Design Spec

**Data**: 2026-03-18
**Status**: Aprovado
**Autor**: Rafael Pinheiro + Claude (Arquiteto)

## Visão Geral

Transformar o AI Agency Hub de protótipo visual em motor de agentes funcional. 32 agentes com prompts POEMA, orquestração real via BullMQ, Gemini API como cérebro, PostgreSQL para persistência, Notion para entregas, Telegram para notificações.

## Arquitetura

```
Frontend (Next.js App Router)
    ↕ API Routes + SSE
Backend (Orchestrator + Agent Runner + BullMQ/Redis)
    ↕
Infra (PostgreSQL + Redis + Gemini API + Notion + Telegram)
```

### Componentes Core

| Componente | Arquivo(s) | Responsabilidade |
|---|---|---|
| Agent Runner | `src/engine/runner.ts` | Executa 1 agente: carrega prompt, chama Gemini, valida output com Zod |
| Orchestrator | `src/engine/orchestrator.ts` | Gerencia pipeline: define ordem, handoff, parallelismo |
| Queue | `src/engine/queue.ts` | BullMQ: enfileira jobs, retry, backoff, prioridade |
| Handoff | `src/engine/handoff.ts` | Passagem de bastão: output A → input B, validação |
| Circuit Breaker | `src/engine/circuit-breaker.ts` | 3 falhas → para agente, notifica |
| Logger | `src/engine/logger.ts` | Log de cada execução no PostgreSQL |
| Cost Guard | `src/engine/cost-guard.ts` | Limite diário/mensal, kill switch |
| SSE Manager | `src/engine/sse.ts` | Server-Sent Events para frontend real-time |

### Agent Prompts

32 pastas em `src/agents/`:

```
src/agents/
├── 01-orion/
│   ├── prompt.md          → Prompt POEMA completo
│   ├── config.ts          → Modelo, temperatura, max_tokens, retry
│   └── schema.ts          → Schema Zod do output
├── 02-hormozi/
│   ├── prompt.md
│   ├── config.ts
│   └── schema.ts
└── ... (32 agentes)
```

## Estrutura de Prompt POEMA

Cada agente tem um prompt profundo com estas seções:

```markdown
# [NOME] — [ROLE]

## IDENTIDADE
Quem é, qual seu papel, personalidade core.

## CLONE DE GÊNIO
Referência humana. Como pensa, como age, frases marcantes.

## EXPERTISE
Conhecimento profundo na área. Frameworks, metodologias, técnicas.

## REGRAS DE OPERAÇÃO
- O que SEMPRE fazer
- O que NUNCA fazer
- Padrões de qualidade
- Formato de output obrigatório

## CONTEXTO DE EXECUÇÃO
Como receber input, como processar, como entregar output.
Schema JSON esperado.

## TOM DE VOZ
Como se comunica. Exemplos de como fala.

## INTERAÇÃO COM OUTROS AGENTES
Com quem se comunica, o que espera receber, o que deve entregar.
```

## Banco de Dados (PostgreSQL)

### Tabelas

```sql
-- Briefings
briefings (id, name, client, objective, target_audience, tone, references, instructions, status, created_at, updated_at)

-- Pipeline templates
pipeline_templates (id, name, description, squad, estimated_cost, steps_json, created_at)

-- Pipeline executions
pipeline_runs (id, template_id, briefing_id, status, current_step, total_steps, total_cost, started_at, completed_at, error)

-- Cada step de uma pipeline
pipeline_steps (id, run_id, step_number, agent_id, status, input_json, output_json, tokens_in, tokens_out, cost_usd, duration_ms, retries, started_at, completed_at, error)

-- Chat messages
chat_messages (id, agent_id, role, content, pipeline_run_id, created_at)

-- Deliverables
deliverables (id, pipeline_run_id, agent_id, type, title, content, score_qa, status, notion_url, created_at)

-- Agent execution logs
agent_logs (id, agent_id, pipeline_run_id, level, message, tokens_in, tokens_out, cost_usd, duration_ms, created_at)
```

## API Routes

```
POST /api/chat                    → Chat direto com agente (tarefa individual)
POST /api/pipeline/start          → Inicia uma pipeline
GET  /api/pipeline/[id]/status    → Status de uma pipeline
GET  /api/events                  → SSE stream de eventos real-time
GET  /api/agents/[id]/prompt      → Prompt do agente
GET  /api/agents/[id]/history     → Histórico de execuções
GET  /api/agents/[id]/output      → Último output
POST /api/briefing                → Criar/atualizar briefing
GET  /api/briefing/[id]           → Buscar briefing
GET  /api/deliverables            → Listar entregas
POST /api/notion/sync             → Sincronizar com Notion
```

## Fluxo de Execução

### Chat Individual (tarefa avulsa)
```
User → "Faça 10 emails de welcome" → COPY
1. API recebe mensagem
2. Carrega prompt.md do COPY
3. Monta context: briefing ativo + mensagem do user
4. Chama Gemini API
5. Valida output contra schema Zod
6. Se inválido: retry com feedback (max 2x)
7. Salva no PostgreSQL
8. Retorna resposta via SSE
9. Se deliverable: EAGLE faz QA → INTEGRATOR sobe Notion
```

### Pipeline Completa (ex: Reels da Semana)
```
1. User ativa pipeline "Reels da Semana"
2. Orchestrator cria PipelineRun no DB
3. Step 1: ORION recebe briefing
   → Enfileira job no BullMQ
   → Worker executa: carrega prompt, chama Gemini
   → Output: distribuição de tarefas
4. Step 2-3: Conselheiros (paralelo)
   → HORMOZI, BRUNSON, ICARO executam ao mesmo tempo
   → Outputs acumulam no context
5. Step 4: ORION compila estratégia
   → Recebe outputs dos conselheiros
   → Monta estratégia compilada
6. Step 5: HEAD CONTEÚDO planeja
   → Recebe estratégia
   → Define 7 temas + distribuição
7. Step 6-8: Squad executa (paralelo)
   → SPARK: ideias/hooks
   → COPY: legendas/CTAs
   → STORYTELLER: roteiros
8. Step 9: EAGLE faz QA
   → Score 0-100 em cada entregável
   → Se < 70: devolve pro agente
9. Step 10: INTEGRATOR entrega
   → Cria páginas no Notion
   → Notifica via Telegram
10. Frontend mostra tudo em tempo real via SSE
```

### Context Object (acumulativo)
```typescript
interface PipelineContext {
  briefing: Briefing;
  strategy?: {
    hormozi?: object;
    brunson?: object;
    icaro?: object;
    compiled?: object;
  };
  outputs: Record<string, object>;  // agentId → output
  metadata: {
    pipelineId: string;
    currentStep: number;
    totalSteps: number;
    startedAt: Date;
    costs: { tokensIn: number; tokensOut: number; usd: number };
  };
}
```

## Gemini API Integration

```typescript
// src/integrations/gemini.ts
interface GeminiCall {
  model: string;           // gemini-2.5-pro, gemini-2.5-flash, etc.
  systemPrompt: string;    // prompt.md do agente
  userMessage: string;     // input (briefing + context)
  temperature: number;     // do config.ts do agente
  maxTokens: number;       // do config.ts do agente
  responseFormat?: 'json'; // força JSON output
}
```

### Distribuição de Modelos
| Tier | Agentes | Modelo Gemini |
|---|---|---|
| Estratégico | HORMOZI, BRUNSON, ICARO, COPY, STORYTELLER | gemini-2.5-pro |
| Operacional | ORION, Heads, SPARK, EAGLE, ARTURO, BUILDER, SCALE | gemini-2.5-flash |
| Execução | CLOCK, LENS, PM, CLOSER, etc. | gemini-2.0-flash-lite |
| Imagens | ARTURO (criativos) | nano-banana-pro-preview |

## Integrações

### Notion API
- Cria database por tipo (Roteiros, Copies, Criativos, Emails, Páginas)
- Cada deliverable → página no Notion com conteúdo completo
- Status sincronizado: draft → reviewed → approved → published

### Telegram Bot
- Notifica pipeline completa
- Notifica erros críticos
- Envia resumo de entregas

## Retry & Circuit Breaker

1. **Runner retry**: output inválido → retry 2x com feedback do erro
2. **BullMQ retry**: falha de rede/timeout → 3x com backoff (2s, 8s, 32s)
3. **Circuit breaker**: 3 falhas consecutivas do mesmo agente → para e notifica

## Cost Guard

- Limite diário: $10 USD
- Limite mensal: $150 USD
- Alerta em 80%
- Kill switch automático quando atinge limite

## Fases de Implementação

### Fase 1: Fundação (AGORA)
- [ ] Instalar dependências (bullmq, ioredis, pg/prisma, zod, @google/generative-ai)
- [ ] Criar schema PostgreSQL (Prisma)
- [ ] Escrever os 32 prompts POEMA
- [ ] Implementar Agent Runner (Gemini integration)
- [ ] Implementar chat individual funcional (user → agente → resposta real)

### Fase 2: Orquestração
- [ ] Implementar Orchestrator
- [ ] Implementar BullMQ queue
- [ ] Implementar Handoff
- [ ] Pipeline execution funcional
- [ ] SSE para updates real-time no frontend

### Fase 3: Qualidade & Entrega
- [ ] Circuit Breaker
- [ ] Cost Guard
- [ ] EAGLE QA automático
- [ ] Notion integration
- [ ] Telegram notifications

### Fase 4: Polish
- [ ] Histórico de chat persistente
- [ ] Galeria de deliverables funcional
- [ ] Logs reais
- [ ] Dashboard com dados reais
