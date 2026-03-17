export type AgentTier = "estrategico" | "operacional" | "execucao";
export type AgentStatus = "autonomo" | "operador" | "em-breve";
export type SquadName =
  | "comando"
  | "conselheiros"
  | "heads"
  | "vendas"
  | "marketing-conteudo"
  | "marketing-social"
  | "marketing-ads"
  | "tecnologia"
  | "operacoes"
  | "qualidade"
  | "financeiro";

export interface AgentSkill {
  name: string;
  score: number;
}

export interface Agent {
  id: string;
  number: number;
  name: string;
  aka?: string;
  role: string;
  squad: SquadName;
  status: AgentStatus;
  tier: AgentTier;
  model: string;
  description: string;
  personality?: string;
  cloneDeGenio?: { name: string; quote: string };
  skills: AgentSkill[];
  specialties: string[];
  tools: string[];
  outputFormat?: string;
  reportsTo?: string;
  directReports?: string[];
  color: string;
  stats: {
    tasksCompleted: number;
    successRate: number;
    avgDuration: string;
    totalCost: number;
  };
}

export const SQUAD_LABELS: Record<SquadName, string> = {
  comando: "Comando Central",
  conselheiros: "Conselheiros",
  heads: "Diretores",
  vendas: "Squad Vendas",
  "marketing-conteudo": "Squad Marketing — Conteúdo",
  "marketing-social": "Squad Marketing — Social & Ads",
  "marketing-ads": "Squad Marketing — Ads",
  tecnologia: "Squad Tecnologia",
  operacoes: "Squad Operações",
  qualidade: "Squad Qualidade",
  financeiro: "Financeiro",
};

export const SQUAD_COLORS: Record<SquadName, string> = {
  comando: "#8B5CF6",
  conselheiros: "#3B82F6",
  heads: "#A855F7",
  vendas: "#EF4444",
  "marketing-conteudo": "#F97316",
  "marketing-social": "#EC4899",
  "marketing-ads": "#EAB308",
  tecnologia: "#06B6D4",
  operacoes: "#22C55E",
  qualidade: "#CBD5E1",
  financeiro: "#F59E0B",
};

export const agents: Agent[] = [
  // ─── COMANDO CENTRAL ───
  {
    id: "orion",
    number: 1,
    name: "ORION",
    aka: "The Brain",
    role: "CEO — Orquestrador Geral",
    squad: "comando",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Recebe briefing → Consulta conselheiros (Hormozi, Brunson, Icaro) → Distribui tarefas para squads → Monitora entregas → Reporta ao CEO",
    personality:
      "Lider calmo, estrategico. Pensa antes de agir. Distribui com precisao. Nunca executa — delega.",
    cloneDeGenio: {
      name: "Steve Jobs",
      quote: "Stay hungry. Stay foolish.",
    },
    skills: [
      { name: "Orquestração", score: 98 },
      { name: "Delegação", score: 96 },
      { name: "Visão Estratégica", score: 95 },
      { name: "Síntese", score: 94 },
      { name: "Tomada de Decisão", score: 93 },
    ],
    specialties: [
      "Pipeline orchestration",
      "Briefing analysis",
      "Team coordination",
      "Strategy compilation",
    ],
    tools: ["Claude Sonnet", "Pipeline Engine", "Telegram"],
    outputFormat: "JSON com: strategy, assignments[], priorities[], timeline",
    reportsTo: "Rafael (Dono)",
    directReports: [
      "hormozi",
      "brunson",
      "icaro",
      "atlas",
      "head-vendas",
      "head-conteudo",
      "head-social",
      "head-ads",
      "head-tecnologia",
      "head-financeiro",
      "head-operacoes",
    ],
    color: "#8B5CF6",
    stats: {
      tasksCompleted: 847,
      successRate: 99,
      avgDuration: "3.1s",
      totalCost: 12.4,
    },
  },

  // ─── CONSELHEIROS ───
  {
    id: "hormozi",
    number: 2,
    name: "HORMOZI",
    aka: "The Offer King",
    role: "Conselheiro de Ofertas",
    squad: "conselheiros",
    status: "autonomo",
    tier: "estrategico",
    model: "Claude Opus",
    description:
      "Estratégia de oferta irresistível. Aplica frameworks $100M Offers. Value equation. Grand slam offer.",
    personality:
      "Direto. Obsessivo com valor. Cada oferta precisa ser tão boa que o cliente se sinta burro dizendo não.",
    cloneDeGenio: {
      name: "Alex Hormozi",
      quote:
        "Make people an offer so good they would feel stupid saying no.",
    },
    skills: [
      { name: "Criação de Ofertas", score: 99 },
      { name: "Value Equation", score: 97 },
      { name: "Pricing Strategy", score: 96 },
      { name: "Market Analysis", score: 94 },
      { name: "Revenue Modeling", score: 92 },
    ],
    specialties: [
      "$100M Offers framework",
      "Grand Slam Offer",
      "Value stacking",
      "Guarantee engineering",
    ],
    tools: ["Claude Opus"],
    outputFormat: "JSON com: offer, value_equation, pricing, guarantees[]",
    reportsTo: "orion",
    color: "#3B82F6",
    stats: {
      tasksCompleted: 234,
      successRate: 97,
      avgDuration: "4.2s",
      totalCost: 45.8,
    },
  },
  {
    id: "brunson",
    number: 3,
    name: "BRUNSON",
    aka: "The Funnel Architect",
    role: "Conselheiro de Funis",
    squad: "conselheiros",
    status: "autonomo",
    tier: "estrategico",
    model: "Claude Opus",
    description:
      "Arquiteto de funis de venda. Expert Secrets, DotCom Secrets. Estrutura toda a jornada de conversão.",
    personality:
      "Metódico. Pensa em funis para tudo. Cada página, cada email, cada anúncio é um step no funil.",
    cloneDeGenio: {
      name: "Russell Brunson",
      quote: "You're one funnel away.",
    },
    skills: [
      { name: "Funnel Architecture", score: 98 },
      { name: "Conversion Strategy", score: 96 },
      { name: "Storytelling", score: 95 },
      { name: "Upsell Design", score: 93 },
      { name: "Lead Magnets", score: 91 },
    ],
    specialties: [
      "DotCom Secrets",
      "Expert Secrets",
      "Traffic Secrets",
      "Value Ladder",
    ],
    tools: ["Claude Opus"],
    outputFormat: "JSON com: funnel_steps[], ctas[], upsells[], downsells[]",
    reportsTo: "orion",
    color: "#3B82F6",
    stats: {
      tasksCompleted: 198,
      successRate: 96,
      avgDuration: "3.8s",
      totalCost: 38.2,
    },
  },
  {
    id: "icaro",
    number: 4,
    name: "ICARO",
    aka: "O Narrador",
    role: "Conselheiro de Copywriting BR",
    squad: "conselheiros",
    status: "autonomo",
    tier: "estrategico",
    model: "Claude Opus",
    description:
      "Mestre do copywriting brasileiro. Narrativa, conexão emocional, storytelling que vende. Referência Ícaro de Carvalho.",
    personality:
      "Apaixonado por palavras. Cada frase precisa ter peso. Conecta emoção com conversão.",
    cloneDeGenio: {
      name: "Ícaro de Carvalho",
      quote: "Quem não é visto, não é lembrado. Quem não é lembrado, não é desejado.",
    },
    skills: [
      { name: "Copywriting BR", score: 98 },
      { name: "Storytelling", score: 97 },
      { name: "Emotional Hook", score: 96 },
      { name: "Persuasão", score: 95 },
      { name: "Narrativa", score: 94 },
    ],
    specialties: [
      "Copy brasileira",
      "Narrativa emocional",
      "Headlines magnéticas",
      "Conexão com audiência BR",
    ],
    tools: ["Claude Opus"],
    outputFormat: "JSON com: narratives[], hooks[], angles[], ctas[]",
    reportsTo: "orion",
    color: "#3B82F6",
    stats: {
      tasksCompleted: 312,
      successRate: 98,
      avgDuration: "4.5s",
      totalCost: 52.1,
    },
  },

  // ─── BI ───
  {
    id: "atlas",
    number: 5,
    name: "ATLAS",
    aka: "The Analyst",
    role: "Business Intelligence",
    squad: "comando",
    status: "autonomo",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Analisa dados, KPIs, métricas de performance. Gera relatórios consolidados. Alimenta decisões do ORION.",
    skills: [
      { name: "Data Analysis", score: 95 },
      { name: "KPI Tracking", score: 93 },
      { name: "Report Generation", score: 92 },
      { name: "Trend Detection", score: 90 },
      { name: "Dashboard Design", score: 88 },
    ],
    specialties: ["KPI dashboards", "Performance reports", "Trend analysis"],
    tools: ["Claude Haiku", "Analytics Engine"],
    reportsTo: "orion",
    color: "#8B5CF6",
    stats: {
      tasksCompleted: 156,
      successRate: 94,
      avgDuration: "1.4s",
      totalCost: 2.1,
    },
  },

  // ─── HEADS ───
  {
    id: "head-vendas",
    number: 6,
    name: "HEAD VENDAS",
    aka: "The Closer",
    role: "Diretor de Vendas",
    squad: "vendas",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Comanda toda a operação de vendas. Define metas, estratégias de prospecção e processos de fechamento. Gerencia Outbound, Inbound e Closer.",
    cloneDeGenio: {
      name: "Grant Cardone",
      quote: "Success is your duty, obligation, and responsibility.",
    },
    skills: [
      { name: "Gestão de Pipeline", score: 95 },
      { name: "Sales Strategy", score: 94 },
      { name: "Team Coordination", score: 92 },
      { name: "Revenue Forecasting", score: 90 },
      { name: "Deal Velocity", score: 93 },
    ],
    specialties: [
      "Pipeline management",
      "Sales playbooks",
      "Quota setting",
      "Win-loss analysis",
      "Sales enablement",
    ],
    tools: ["Claude Sonnet", "CRM Integration", "Sales Metrics"],
    reportsTo: "orion",
    directReports: ["outbound", "inbound", "closer"],
    color: "#EF4444",
    stats: {
      tasksCompleted: 423,
      successRate: 91,
      avgDuration: "2.8s",
      totalCost: 8.9,
    },
  },
  {
    id: "head-conteudo",
    number: 7,
    name: "HEAD CONTEÚDO",
    aka: "The Editor",
    role: "Diretor de Conteúdo",
    squad: "marketing-conteudo",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Planeja calendário editorial. Define pilares de conteúdo. Coordena SPARK, COPY e STORYTELLER. 20+ ideias/semana.",
    skills: [
      { name: "Content Strategy", score: 96 },
      { name: "Editorial Planning", score: 95 },
      { name: "Pillar Mapping", score: 93 },
      { name: "Team Coordination", score: 91 },
      { name: "Trend Spotting", score: 90 },
    ],
    specialties: [
      "Content calendar",
      "Pillar strategy",
      "Editorial guidelines",
      "Content audit",
    ],
    tools: ["Claude Sonnet", "Notion"],
    reportsTo: "orion",
    directReports: ["spark", "copy", "storyteller"],
    color: "#F97316",
    stats: {
      tasksCompleted: 567,
      successRate: 95,
      avgDuration: "2.6s",
      totalCost: 11.2,
    },
  },
  {
    id: "head-social",
    number: 8,
    name: "HEAD SOCIAL",
    aka: "The Scheduler",
    role: "Diretor de Social Media",
    squad: "marketing-social",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Gerencia presença social. Coordena CLOCK e LENS. Define horários, frequência e estratégia de engajamento.",
    skills: [
      { name: "Social Strategy", score: 94 },
      { name: "Platform Knowledge", score: 93 },
      { name: "Engagement Tactics", score: 91 },
      { name: "Community Building", score: 90 },
      { name: "Crisis Management", score: 88 },
    ],
    specialties: [
      "Social media strategy",
      "Engagement optimization",
      "Platform algorithms",
    ],
    tools: ["Claude Sonnet", "Meta Graph API"],
    reportsTo: "orion",
    directReports: ["clock", "lens"],
    color: "#EC4899",
    stats: {
      tasksCompleted: 289,
      successRate: 93,
      avgDuration: "1.6s",
      totalCost: 5.4,
    },
  },
  {
    id: "head-ads",
    number: 9,
    name: "HEAD ADS",
    aka: "The Spender",
    role: "Diretor de Ads & Tráfego",
    squad: "marketing-ads",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Comanda toda a operação de tráfego pago. Criativos, copy de ads, escala, SEO e tráfego orgânico.",
    skills: [
      { name: "Media Buying", score: 95 },
      { name: "Campaign Strategy", score: 94 },
      { name: "Budget Allocation", score: 92 },
      { name: "A/B Testing", score: 91 },
      { name: "ROAS Optimization", score: 93 },
    ],
    specialties: [
      "Meta Ads",
      "Google Ads",
      "Campaign architecture",
      "Audience segmentation",
    ],
    tools: ["Claude Sonnet", "Meta Marketing API"],
    reportsTo: "orion",
    directReports: ["criacao-ads", "scale", "seo", "traffic-engine"],
    color: "#EAB308",
    stats: {
      tasksCompleted: 345,
      successRate: 90,
      avgDuration: "2.3s",
      totalCost: 7.1,
    },
  },
  {
    id: "head-tecnologia",
    number: 10,
    name: "HEAD TECH",
    aka: "The Architect",
    role: "Diretor de Tecnologia",
    squad: "tecnologia",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Gerencia stack técnica. Coordena BUILDER, MAILER e INTEGRATOR. Garante que tudo funciona e integra.",
    skills: [
      { name: "Tech Architecture", score: 96 },
      { name: "System Design", score: 95 },
      { name: "Integration Planning", score: 93 },
      { name: "Performance Tuning", score: 91 },
      { name: "Security", score: 90 },
    ],
    specialties: [
      "System architecture",
      "API design",
      "Infrastructure",
      "DevOps",
    ],
    tools: ["Claude Sonnet", "Docker", "Nginx"],
    reportsTo: "orion",
    directReports: ["builder", "mailer", "integrator"],
    color: "#06B6D4",
    stats: {
      tasksCompleted: 412,
      successRate: 97,
      avgDuration: "2.1s",
      totalCost: 8.3,
    },
  },
  {
    id: "head-financeiro",
    number: 11,
    name: "HEAD FINANCEIRO",
    aka: "The Accountant",
    role: "Diretor Financeiro",
    squad: "financeiro",
    status: "autonomo",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Monitora P&L. Controla custos de API. Gera relatórios financeiros. Alerta sobre gastos excessivos.",
    skills: [
      { name: "Cost Control", score: 95 },
      { name: "P&L Analysis", score: 93 },
      { name: "Budget Planning", score: 92 },
      { name: "Financial Reporting", score: 91 },
      { name: "ROI Calculation", score: 90 },
    ],
    specialties: [
      "Cost optimization",
      "Financial reporting",
      "Budget tracking",
    ],
    tools: ["Claude Haiku", "Cost Guard"],
    reportsTo: "orion",
    color: "#F59E0B",
    stats: {
      tasksCompleted: 178,
      successRate: 96,
      avgDuration: "1.2s",
      totalCost: 1.8,
    },
  },
  {
    id: "head-operacoes",
    number: 12,
    name: "HEAD OPS",
    aka: "The Manager",
    role: "Diretor de Operações",
    squad: "operacoes",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Gerencia processos operacionais. Coordena PM e Client Success. Garante que entregas chegam no prazo.",
    skills: [
      { name: "Process Management", score: 94 },
      { name: "Team Coordination", score: 93 },
      { name: "Workflow Design", score: 92 },
      { name: "SLA Monitoring", score: 90 },
      { name: "Resource Allocation", score: 89 },
    ],
    specialties: [
      "Operations management",
      "Process optimization",
      "SLA tracking",
    ],
    tools: ["Claude Sonnet", "Notion"],
    reportsTo: "orion",
    directReports: ["project-manager", "client-success"],
    color: "#22C55E",
    stats: {
      tasksCompleted: 301,
      successRate: 94,
      avgDuration: "1.4s",
      totalCost: 5.6,
    },
  },

  // ─── SQUAD VENDAS ───
  {
    id: "outbound",
    number: 13,
    name: "OUTBOUND",
    aka: "The Hunter",
    role: "Prospecção Ativa",
    squad: "vendas",
    status: "autonomo",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Gera leads qualificados, cria DM sequences (3-5 msgs), cold email (4-6). LinkedIn. Lead scoring Hot/Warm/Cold.",
    skills: [
      { name: "Lead Generation", score: 93 },
      { name: "Cold Outreach", score: 92 },
      { name: "DM Sequences", score: 91 },
      { name: "Lead Scoring", score: 90 },
      { name: "LinkedIn Prospecting", score: 89 },
    ],
    specialties: [
      "Cold email",
      "DM sequences",
      "LinkedIn outreach",
      "Lead qualification",
    ],
    tools: ["Claude Haiku", "Email"],
    reportsTo: "head-vendas",
    color: "#EF4444",
    stats: {
      tasksCompleted: 567,
      successRate: 88,
      avgDuration: "1.7s",
      totalCost: 3.2,
    },
  },
  {
    id: "inbound",
    number: 14,
    name: "INBOUND",
    aka: "The Magnet",
    role: "Atração de Leads",
    squad: "vendas",
    status: "autonomo",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Recebe leads, nurturing sequences, recuperação abandono. Scoring: open +1, click +3, DM +5, preço +10.",
    skills: [
      { name: "Lead Nurturing", score: 92 },
      { name: "Email Sequences", score: 91 },
      { name: "Scoring Models", score: 90 },
      { name: "Abandonment Recovery", score: 89 },
      { name: "Segmentation", score: 88 },
    ],
    specialties: [
      "Nurturing sequences",
      "Lead scoring",
      "Abandonment recovery",
      "Segmentation",
    ],
    tools: ["Claude Haiku", "Email", "WhatsApp"],
    reportsTo: "head-vendas",
    color: "#EF4444",
    stats: {
      tasksCompleted: 445,
      successRate: 89,
      avgDuration: "2.6s",
      totalCost: 2.8,
    },
  },
  {
    id: "closer",
    number: 15,
    name: "CLOSER",
    aka: "The Deal Maker",
    role: "Fechamento",
    squad: "vendas",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Mel Converter. Especialista em fechamento. Scripts de objeção. Follow-up agressivo. Converte leads quentes em vendas.",
    skills: [
      { name: "Closing Techniques", score: 94 },
      { name: "Objection Handling", score: 93 },
      { name: "Follow-up Strategy", score: 91 },
      { name: "Urgency Creation", score: 90 },
      { name: "Script Writing", score: 89 },
    ],
    specialties: [
      "Closing scripts",
      "Objection handling",
      "Follow-up sequences",
      "Conversion optimization",
    ],
    tools: ["Claude Haiku", "WhatsApp", "Email"],
    reportsTo: "head-vendas",
    color: "#EF4444",
    stats: {
      tasksCompleted: 234,
      successRate: 85,
      avgDuration: "1.9s",
      totalCost: 1.9,
    },
  },

  // ─── SQUAD MARKETING — CONTEÚDO ───
  {
    id: "spark",
    number: 16,
    name: "SPARK",
    aka: "Lumi Nessuna",
    role: "Ideação de Conteúdo",
    squad: "marketing-conteudo",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "20+ ideias/semana por pilar. Educativo 40%, Autoridade 20%, Conexão 20%, Venda 20%. Briefs completos.",
    skills: [
      { name: "Ideation", score: 97 },
      { name: "Content Pillars", score: 95 },
      { name: "Trend Analysis", score: 93 },
      { name: "Brief Writing", score: 92 },
      { name: "Creative Thinking", score: 96 },
    ],
    specialties: [
      "Content ideation",
      "Pillar strategy",
      "Brief creation",
      "Trend spotting",
    ],
    tools: ["Claude Sonnet", "Notion"],
    reportsTo: "head-conteudo",
    color: "#F97316",
    stats: {
      tasksCompleted: 890,
      successRate: 96,
      avgDuration: "2.0s",
      totalCost: 15.4,
    },
  },
  {
    id: "copy",
    number: 17,
    name: "COPY",
    aka: "Quill Binary",
    role: "Copywriter",
    squad: "marketing-conteudo",
    status: "autonomo",
    tier: "estrategico",
    model: "Claude Opus",
    description:
      "TODA copy: posts, emails, ads, roteiros, páginas. Frameworks: AIDA, PAS, BAB, Hormozi, Icaro, Brunson. Min 2 variações.",
    skills: [
      { name: "Copywriting", score: 98 },
      { name: "Framework Mastery", score: 97 },
      { name: "Headline Writing", score: 96 },
      { name: "CTA Design", score: 95 },
      { name: "A/B Copy", score: 94 },
    ],
    specialties: [
      "AIDA framework",
      "PAS framework",
      "BAB framework",
      "Emotional hooks",
      "Headlines",
    ],
    tools: ["Claude Opus"],
    reportsTo: "head-conteudo",
    color: "#F97316",
    stats: {
      tasksCompleted: 1234,
      successRate: 97,
      avgDuration: "3.5s",
      totalCost: 89.3,
    },
  },
  {
    id: "storyteller",
    number: 18,
    name: "STORYTELLER",
    aka: "The Narrator",
    role: "Roteirista",
    squad: "marketing-conteudo",
    status: "autonomo",
    tier: "estrategico",
    model: "Claude Opus",
    description:
      "Roteiros para vídeo: Reels, Stories, YouTube. Estrutura: hook → desenvolvimento → CTA. Ganchos magnéticos.",
    skills: [
      { name: "Script Writing", score: 97 },
      { name: "Story Structure", score: 96 },
      { name: "Hook Creation", score: 95 },
      { name: "Video Pacing", score: 93 },
      { name: "CTA Integration", score: 92 },
    ],
    specialties: [
      "Video scripts",
      "Reels hooks",
      "Story arcs",
      "YouTube structure",
    ],
    tools: ["Claude Opus"],
    reportsTo: "head-conteudo",
    color: "#F97316",
    stats: {
      tasksCompleted: 678,
      successRate: 95,
      avgDuration: "4.1s",
      totalCost: 67.8,
    },
  },

  // ─── SQUAD MARKETING — SOCIAL ───
  {
    id: "clock",
    number: 19,
    name: "CLOCK",
    aka: "Tika Scheduler",
    role: "Agendamento",
    squad: "marketing-social",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Agenda 7 dias. Melhores horários: 7-9h, 12-13h, 19-21h. Min 1 post/dia + 3 stories.",
    skills: [
      { name: "Scheduling", score: 94 },
      { name: "Time Optimization", score: 93 },
      { name: "Calendar Management", score: 92 },
      { name: "Consistency", score: 95 },
      { name: "Platform Timing", score: 91 },
    ],
    specialties: [
      "Post scheduling",
      "Optimal timing",
      "Calendar management",
      "Frequency optimization",
    ],
    tools: ["Claude Haiku", "Meta Graph API"],
    reportsTo: "head-social",
    color: "#EC4899",
    stats: {
      tasksCompleted: 1456,
      successRate: 99,
      avgDuration: "0.8s",
      totalCost: 1.2,
    },
  },
  {
    id: "lens",
    number: 20,
    name: "LENS",
    aka: "Nova Datavis",
    role: "Analytics",
    squad: "marketing-social",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Relatório semanal toda segunda. Top 3, Bottom 3. KPIs: alcance, engajamento, seguidores, clicks, DMs.",
    skills: [
      { name: "Social Analytics", score: 95 },
      { name: "Report Generation", score: 94 },
      { name: "KPI Tracking", score: 93 },
      { name: "Trend Detection", score: 91 },
      { name: "Competitive Analysis", score: 89 },
    ],
    specialties: [
      "Social media analytics",
      "KPI dashboards",
      "Weekly reports",
      "Performance tracking",
    ],
    tools: ["Claude Haiku", "Meta Graph API"],
    reportsTo: "head-social",
    color: "#EC4899",
    stats: {
      tasksCompleted: 234,
      successRate: 96,
      avgDuration: "3.1s",
      totalCost: 1.8,
    },
  },

  // ─── SQUAD MARKETING — ADS ───
  {
    id: "criacao-ads",
    number: 21,
    name: "ARTURO",
    aka: "Arturo Renderex",
    role: "Criativos & Ads",
    squad: "marketing-ads",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Cria criativos estáticos + copy de ads. 3-5 variações. 8 ângulos. Headlines max 40 chars. Nano Banana Pro.",
    skills: [
      { name: "Ad Creative", score: 96 },
      { name: "Visual Direction", score: 94 },
      { name: "Copy Variation", score: 93 },
      { name: "A/B Angles", score: 92 },
      { name: "Platform Specs", score: 91 },
    ],
    specialties: [
      "Ad creatives",
      "Static ads",
      "Carousel ads",
      "Headline optimization",
    ],
    tools: ["Claude Sonnet", "Gemini API"],
    reportsTo: "head-ads",
    color: "#EAB308",
    stats: {
      tasksCompleted: 567,
      successRate: 92,
      avgDuration: "2.8s",
      totalCost: 11.4,
    },
  },
  {
    id: "scale",
    number: 22,
    name: "SCALE",
    aka: "Turbo Adsworth",
    role: "Escalador de Ads",
    squad: "marketing-ads",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Escala campanhas. Budget allocation. ROAS tracking. Kill underperformers. Scale winners.",
    skills: [
      { name: "Campaign Scaling", score: 95 },
      { name: "Budget Management", score: 94 },
      { name: "ROAS Optimization", score: 93 },
      { name: "Audience Expansion", score: 91 },
      { name: "Performance Analysis", score: 90 },
    ],
    specialties: [
      "Campaign scaling",
      "Budget allocation",
      "ROAS tracking",
      "Audience expansion",
    ],
    tools: ["Claude Sonnet", "Meta Marketing API"],
    reportsTo: "head-ads",
    color: "#EAB308",
    stats: {
      tasksCompleted: 345,
      successRate: 88,
      avgDuration: "2.1s",
      totalCost: 6.7,
    },
  },
  {
    id: "seo",
    number: 23,
    name: "SEO",
    aka: "The Crawler",
    role: "SEO & Orgânico",
    squad: "marketing-ads",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Otimização para busca. Keywords, meta tags, link building strategy. SEO on-page e off-page.",
    skills: [
      { name: "Keyword Research", score: 94 },
      { name: "On-Page SEO", score: 93 },
      { name: "Technical SEO", score: 91 },
      { name: "Content SEO", score: 92 },
      { name: "Link Building", score: 89 },
    ],
    specialties: [
      "Keyword research",
      "On-page optimization",
      "Technical SEO",
      "Content optimization",
    ],
    tools: ["Claude Haiku"],
    reportsTo: "head-ads",
    color: "#EAB308",
    stats: {
      tasksCompleted: 189,
      successRate: 91,
      avgDuration: "1.5s",
      totalCost: 1.4,
    },
  },
  {
    id: "traffic-engine",
    number: 24,
    name: "TRAFFIC ENGINE",
    aka: "The Router",
    role: "Motor de Tráfego",
    squad: "marketing-ads",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Distribui tráfego entre canais. Otimiza rotas de aquisição. Multi-channel attribution.",
    skills: [
      { name: "Traffic Distribution", score: 93 },
      { name: "Channel Optimization", score: 92 },
      { name: "Attribution Modeling", score: 91 },
      { name: "Multi-Channel Strategy", score: 90 },
      { name: "Conversion Tracking", score: 89 },
    ],
    specialties: [
      "Traffic distribution",
      "Multi-channel",
      "Attribution",
      "Conversion optimization",
    ],
    tools: ["Claude Haiku", "Meta Marketing API"],
    reportsTo: "head-ads",
    color: "#EAB308",
    stats: {
      tasksCompleted: 234,
      successRate: 87,
      avgDuration: "1.3s",
      totalCost: 1.6,
    },
  },

  // ─── SQUAD TECNOLOGIA ───
  {
    id: "builder",
    number: 25,
    name: "BUILDER",
    aka: "Pixel Blackson",
    role: "Criador de Páginas",
    squad: "tecnologia",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Páginas HTML single-file de alta conversão. Dark theme, glass morphism, scroll reveal, CTA glow. Captura >25%, Vendas >2%.",
    skills: [
      { name: "HTML/CSS", score: 97 },
      { name: "Landing Pages", score: 96 },
      { name: "Conversion Design", score: 94 },
      { name: "Responsive", score: 93 },
      { name: "Performance", score: 92 },
    ],
    specialties: [
      "Landing pages",
      "Conversion optimization",
      "Glass morphism",
      "Dark themes",
    ],
    tools: ["Claude Sonnet", "MinIO"],
    reportsTo: "head-tecnologia",
    color: "#06B6D4",
    stats: {
      tasksCompleted: 89,
      successRate: 94,
      avgDuration: "8.2s",
      totalCost: 18.9,
    },
  },
  {
    id: "mailer",
    number: 26,
    name: "MAILER",
    aka: "Zippy Mailbot",
    role: "Email Marketing",
    squad: "tecnologia",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Welcome (3-5), Lançamento (8-12), Abandono (3-4), Pós-venda (3-5). Open >25%, Click >3%. Sempre A/B.",
    skills: [
      { name: "Email Templates", score: 94 },
      { name: "Sequence Design", score: 93 },
      { name: "A/B Testing", score: 92 },
      { name: "Deliverability", score: 91 },
      { name: "Segmentation", score: 90 },
    ],
    specialties: [
      "Email sequences",
      "Welcome series",
      "Launch sequences",
      "Abandonment recovery",
    ],
    tools: ["Claude Haiku", "SMTP", "Email"],
    reportsTo: "head-tecnologia",
    color: "#06B6D4",
    stats: {
      tasksCompleted: 345,
      successRate: 93,
      avgDuration: "1.8s",
      totalCost: 2.4,
    },
  },
  {
    id: "integrator",
    number: 27,
    name: "INTEGRATOR",
    aka: "The Connector",
    role: "Integrador de Sistemas",
    squad: "tecnologia",
    status: "autonomo",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Conecta tudo: Notion, Telegram, Meta, MinIO. Garante que outputs chegam nos destinos certos.",
    skills: [
      { name: "API Integration", score: 95 },
      { name: "Data Mapping", score: 93 },
      { name: "Error Handling", score: 92 },
      { name: "Webhook Management", score: 91 },
      { name: "Data Validation", score: 90 },
    ],
    specialties: [
      "API integration",
      "Webhook management",
      "Data sync",
      "Error recovery",
    ],
    tools: ["Claude Haiku", "Notion API", "Telegram API"],
    reportsTo: "head-tecnologia",
    color: "#06B6D4",
    stats: {
      tasksCompleted: 678,
      successRate: 96,
      avgDuration: "1.2s",
      totalCost: 3.1,
    },
  },

  // ─── SQUAD OPERAÇÕES ───
  {
    id: "project-manager",
    number: 28,
    name: "PM",
    aka: "The Tracker",
    role: "Gerente de Projetos",
    squad: "operacoes",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Acompanha prazos, dependências e entregas. Mantém timeline atualizada. Alerta sobre atrasos.",
    skills: [
      { name: "Project Tracking", score: 94 },
      { name: "Timeline Management", score: 93 },
      { name: "Dependency Mapping", score: 91 },
      { name: "Risk Assessment", score: 90 },
      { name: "Stakeholder Updates", score: 89 },
    ],
    specialties: [
      "Project management",
      "Timeline tracking",
      "Risk management",
      "Status reports",
    ],
    tools: ["Claude Haiku", "Notion"],
    reportsTo: "head-operacoes",
    color: "#22C55E",
    stats: {
      tasksCompleted: 456,
      successRate: 92,
      avgDuration: "1.1s",
      totalCost: 2.2,
    },
  },
  {
    id: "client-success",
    number: 29,
    name: "CLIENT SUCCESS",
    aka: "The Advocate",
    role: "Sucesso do Cliente",
    squad: "operacoes",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Monitora satisfação do cliente. Onboarding. Feedback loop. Garante que entregas atendem expectativas.",
    skills: [
      { name: "Client Relations", score: 93 },
      { name: "Onboarding", score: 92 },
      { name: "Feedback Collection", score: 91 },
      { name: "Satisfaction Tracking", score: 90 },
      { name: "Retention Strategy", score: 89 },
    ],
    specialties: [
      "Client onboarding",
      "Satisfaction monitoring",
      "Feedback loops",
      "Retention strategy",
    ],
    tools: ["Claude Haiku", "Telegram"],
    reportsTo: "head-operacoes",
    color: "#22C55E",
    stats: {
      tasksCompleted: 234,
      successRate: 94,
      avgDuration: "1.3s",
      totalCost: 1.5,
    },
  },

  // ─── SQUAD QUALIDADE ───
  {
    id: "eagle",
    number: 30,
    name: "EAGLE",
    aka: "The Auditor",
    role: "QA — Quality Assurance",
    squad: "qualidade",
    status: "autonomo",
    tier: "operacional",
    model: "Claude Sonnet",
    description:
      "Score 0-100 em cada entregável. Checa gramática, tom, precisão, CTA, formatação. Reprova < 70.",
    skills: [
      { name: "Quality Analysis", score: 97 },
      { name: "Grammar Check", score: 96 },
      { name: "Tone Verification", score: 94 },
      { name: "Scoring System", score: 95 },
      { name: "Feedback Writing", score: 93 },
    ],
    specialties: [
      "Quality scoring",
      "Content review",
      "Grammar analysis",
      "Tone consistency",
    ],
    tools: ["Claude Sonnet"],
    reportsTo: "orion",
    color: "#CBD5E1",
    stats: {
      tasksCompleted: 1567,
      successRate: 99,
      avgDuration: "2.4s",
      totalCost: 22.3,
    },
  },
  {
    id: "sentinel",
    number: 31,
    name: "SENTINEL",
    aka: "The Guardian",
    role: "Compliance",
    squad: "qualidade",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Verifica compliance legal. Termos proibidos, claims, LGPD, direitos autorais. Bloqueia conteúdo irregular.",
    skills: [
      { name: "Compliance Check", score: 95 },
      { name: "Legal Review", score: 93 },
      { name: "LGPD Knowledge", score: 92 },
      { name: "Risk Detection", score: 91 },
      { name: "Policy Enforcement", score: 90 },
    ],
    specialties: [
      "Legal compliance",
      "LGPD",
      "Copyright verification",
      "Prohibited terms",
    ],
    tools: ["Claude Haiku"],
    reportsTo: "orion",
    color: "#CBD5E1",
    stats: {
      tasksCompleted: 1234,
      successRate: 98,
      avgDuration: "0.9s",
      totalCost: 3.4,
    },
  },
  {
    id: "mirror",
    number: 32,
    name: "MIRROR",
    aka: "The Tester",
    role: "Testes A/B",
    squad: "qualidade",
    status: "operador",
    tier: "execucao",
    model: "Claude Haiku",
    description:
      "Gera variações A/B de qualquer entregável. Headlines, CTAs, ângulos, layouts. Documenta hipóteses.",
    skills: [
      { name: "A/B Testing", score: 95 },
      { name: "Variation Design", score: 94 },
      { name: "Hypothesis Writing", score: 92 },
      { name: "Statistical Thinking", score: 91 },
      { name: "Test Documentation", score: 90 },
    ],
    specialties: [
      "A/B test design",
      "Variation creation",
      "Hypothesis documentation",
      "Test analysis",
    ],
    tools: ["Claude Haiku"],
    reportsTo: "orion",
    color: "#CBD5E1",
    stats: {
      tasksCompleted: 567,
      successRate: 93,
      avgDuration: "1.5s",
      totalCost: 2.8,
    },
  },
];

export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function getAgentsBySquad(squad: SquadName): Agent[] {
  return agents.filter((a) => a.squad === squad);
}

export function getSquadGroups(): { squad: SquadName; label: string; agents: Agent[] }[] {
  const order: SquadName[] = [
    "comando",
    "conselheiros",
    "vendas",
    "marketing-conteudo",
    "marketing-social",
    "marketing-ads",
    "tecnologia",
    "operacoes",
    "qualidade",
    "financeiro",
  ];
  return order
    .map((squad) => ({
      squad,
      label: SQUAD_LABELS[squad],
      agents: getAgentsBySquad(squad),
    }))
    .filter((g) => g.agents.length > 0);
}
