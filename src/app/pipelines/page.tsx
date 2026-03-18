"use client";

import { useState } from "react";
import { agents, SQUAD_COLORS, SQUAD_LABELS, type SquadName } from "@/data/agents";
import AgentAvatar from "@/components/AgentAvatar";

interface PipelineStep {
  agentId: string;
  action: string;
}

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: "ativo" | "inativo";
  squad: SquadName;
  estimatedCost: string;
  steps: PipelineStep[];
}

const pipelines: Pipeline[] = [
  {
    id: "reels-semana",
    name: "Reels da Semana",
    description:
      "Produz 7 roteiros de Reels com hooks, desenvolvimento e CTA. Entrega no Notion.",
    status: "inativo",
    squad: "marketing-conteudo",
    estimatedCost: "$1.20",
    steps: [
      { agentId: "orion", action: "Recebe briefing e distribui" },
      { agentId: "head-conteudo", action: "Planeja 7 temas da semana" },
      { agentId: "spark", action: "Gera ideias e hooks para cada tema" },
      { agentId: "copy", action: "Escreve legendas e CTAs" },
      { agentId: "storyteller", action: "Monta roteiro completo de cada Reel" },
      { agentId: "eagle", action: "Review de qualidade (score 0-100)" },
      { agentId: "integrator", action: "Sobe no Notion e notifica" },
    ],
  },
  {
    id: "youtube-semanal",
    name: "YouTube Semanal",
    description:
      "Pesquisa profunda + 2 roteiros completos para YouTube. Inclui títulos, thumbnails e descrição.",
    status: "inativo",
    squad: "marketing-conteudo",
    estimatedCost: "$2.80",
    steps: [
      { agentId: "orion", action: "Analisa briefing e tendências" },
      { agentId: "hormozi", action: "Define ângulo de oferta" },
      { agentId: "brunson", action: "Estrutura funil do vídeo" },
      { agentId: "spark", action: "Pesquisa profunda + ideias" },
      { agentId: "icaro", action: "Define narrativa emocional" },
      { agentId: "storyteller", action: "Roteiro completo com timestamps" },
      { agentId: "copy", action: "Título, thumbnail text, descrição" },
      { agentId: "eagle", action: "Review de qualidade" },
      { agentId: "integrator", action: "Entrega no Notion" },
    ],
  },
  {
    id: "campanha-ads",
    name: "Campanha de Ads",
    description:
      "Criativos estáticos + copy de ads + configuração de campanha. Pronto para subir na Meta.",
    status: "inativo",
    squad: "marketing-ads",
    estimatedCost: "$1.80",
    steps: [
      { agentId: "orion", action: "Distribui briefing" },
      { agentId: "hormozi", action: "Define oferta irresistível" },
      { agentId: "head-ads", action: "Planeja campanha" },
      { agentId: "criacao-ads", action: "Cria 5 variações de criativos" },
      { agentId: "copy", action: "Copy de ads (3 ângulos)" },
      { agentId: "scale", action: "Configura budget e targeting" },
      { agentId: "eagle", action: "Review final" },
    ],
  },
  {
    id: "email-sequence",
    name: "Email Sequence",
    description:
      "Sequência completa de emails: welcome, nurturing, conversão. A/B testing incluído.",
    status: "inativo",
    squad: "tecnologia",
    estimatedCost: "$0.90",
    steps: [
      { agentId: "orion", action: "Analisa objetivo" },
      { agentId: "icaro", action: "Define tom e narrativa" },
      { agentId: "copy", action: "Escreve sequência (5-8 emails)" },
      { agentId: "mirror", action: "Gera variações A/B" },
      { agentId: "mailer", action: "Configura e testa" },
      { agentId: "eagle", action: "Review de compliance" },
    ],
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description:
      "Página de alta conversão: copy, design, formulário. Otimizada para captura > 25%.",
    status: "inativo",
    squad: "tecnologia",
    estimatedCost: "$1.50",
    steps: [
      { agentId: "orion", action: "Briefing e estratégia" },
      { agentId: "brunson", action: "Estrutura de funil" },
      { agentId: "copy", action: "Copy da página completa" },
      { agentId: "builder", action: "Implementa HTML/CSS" },
      { agentId: "eagle", action: "Review e score" },
      { agentId: "integrator", action: "Deploy e notificação" },
    ],
  },
  {
    id: "conteudo-semanal",
    name: "Conteúdo Semanal Completo",
    description:
      "Pacote completo: 7 posts, 3 carrosséis, roteiros, legendas, hashtags. Tudo para a semana.",
    status: "ativo",
    squad: "marketing-conteudo",
    estimatedCost: "$3.50",
    steps: [
      { agentId: "orion", action: "Compila briefing semanal" },
      { agentId: "hormozi", action: "Valida ofertas da semana" },
      { agentId: "head-conteudo", action: "Calendário editorial" },
      { agentId: "spark", action: "20+ ideias por pilar" },
      { agentId: "copy", action: "Todas as copies" },
      { agentId: "storyteller", action: "Roteiros de vídeo" },
      { agentId: "criacao-ads", action: "Direção de criativos" },
      { agentId: "clock", action: "Agenda publicações" },
      { agentId: "eagle", action: "QA completo" },
      { agentId: "integrator", action: "Notion + Telegram" },
    ],
  },
];

function getAgent(id: string) {
  return agents.find((a) => a.id === id);
}

const squadFilters: (SquadName | "todos")[] = [
  "todos",
  "marketing-conteudo",
  "marketing-ads",
  "tecnologia",
];

export default function PipelinesPage() {
  const [selectedSquad, setSelectedSquad] = useState<SquadName | "todos">("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pipelineStates, setPipelineStates] = useState<Record<string, "ativo" | "inativo">>(() => {
    const initial: Record<string, "ativo" | "inativo"> = {};
    pipelines.forEach((p) => {
      initial[p.id] = p.status;
    });
    return initial;
  });
  const [toast, setToast] = useState<string | null>(null);

  const filtered =
    selectedSquad === "todos"
      ? pipelines
      : pipelines.filter((p) => p.squad === selectedSquad);

  function togglePipeline(id: string) {
    setPipelineStates((prev) => {
      const current = prev[id];
      const next = current === "ativo" ? "inativo" : "ativo";
      if (next === "ativo") {
        showToast("Pipeline ativada! Os agentes vão começar a trabalhar.");
      } else {
        showToast("Pipeline pausada.");
      }
      return { ...prev, [id]: next };
    });
  }

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen bg-[#050e1a] text-white px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipelines</h1>
          <p className="text-sm text-[#5E7A9A] mt-1">
            Crie e ative fluxos automatizados. Os agentes executam em cadeia.
          </p>
        </div>
        <button className="bg-[#2D7AFF] hover:bg-[#2568d9] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          + Nova Pipeline
        </button>
      </div>

      {/* Squad Filter Pills */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {squadFilters.map((squad) => {
          const isActive = selectedSquad === squad;
          const color = squad === "todos" ? "#2D7AFF" : SQUAD_COLORS[squad];
          const label = squad === "todos" ? "Todos" : SQUAD_LABELS[squad];
          return (
            <button
              key={squad}
              onClick={() => setSelectedSquad(squad)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: isActive ? `${color}30` : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? color : "rgba(255,255,255,0.08)"}`,
                color: isActive ? color : "#5E7A9A",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Pipeline Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((pipeline) => {
          const status = pipelineStates[pipeline.id];
          const isExpanded = expandedId === pipeline.id;
          const squadColor = SQUAD_COLORS[pipeline.squad];

          return (
            <div key={pipeline.id} className="flex flex-col">
              {/* Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : pipeline.id)}
                className="rounded-2xl p-6 cursor-pointer transition-all"
                style={{
                  background: "#0A1628",
                  border: `1px solid ${isExpanded ? "rgba(45,122,255,0.3)" : "rgba(45,122,255,0.08)"}`,
                  borderLeft: status === "ativo" ? "3px solid #22C55E" : undefined,
                }}
              >
                {/* Top row: name + status */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-lg">{pipeline.name}</h3>
                  <span
                    className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase"
                    style={{
                      background: status === "ativo" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
                      color: status === "ativo" ? "#22C55E" : "#5E7A9A",
                    }}
                  >
                    {status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#5E7A9A] mb-4 leading-relaxed">
                  {pipeline.description}
                </p>

                {/* Squad tag + Cost */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
                    style={{
                      background: `${squadColor}18`,
                      color: squadColor,
                    }}
                  >
                    {SQUAD_LABELS[pipeline.squad]}
                  </span>
                  <span className="text-[11px] text-[#5E7A9A] bg-white/[0.04] px-2.5 py-1 rounded-md">
                    Est. {pipeline.estimatedCost}
                  </span>
                </div>

                {/* Steps preview: agent avatars in sequence */}
                <div className="flex items-center gap-1 mb-4 flex-wrap">
                  {pipeline.steps.map((step, i) => {
                    const agent = getAgent(step.agentId);
                    if (!agent) return null;
                    return (
                      <div key={i} className="flex items-center">
                        <AgentAvatar
                          agentId={agent.id}
                          name={agent.name}
                          color={agent.color}
                          size={28}
                          className="ring-1 ring-[#0A1628]"
                        />
                        {i < pipeline.steps.length - 1 && (
                          <svg
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            fill="none"
                            className="mx-0.5 shrink-0 text-[#2D7AFF] opacity-40"
                          >
                            <path
                              d="M1 4H10M10 4L7 1M10 4L7 7"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePipeline(pipeline.id);
                  }}
                  className="text-sm font-semibold px-5 py-2 rounded-xl transition-all"
                  style={{
                    background: status === "ativo" ? "transparent" : "transparent",
                    border: `1px solid ${status === "ativo" ? "#5E7A9A" : "#2D7AFF"}`,
                    color: status === "ativo" ? "#5E7A9A" : "#2D7AFF",
                  }}
                >
                  {status === "ativo" ? "Pausar" : "Ativar"}
                </button>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div
                  className="rounded-b-2xl px-6 py-5 -mt-px"
                  style={{
                    background: "#0D1B2E",
                    border: "1px solid rgba(45,122,255,0.15)",
                    borderTop: "none",
                  }}
                >
                  <h4 className="text-sm font-bold text-white mb-4 tracking-wide">
                    FLUXO DE EXECUÇÃO
                  </h4>

                  {/* Vertical timeline */}
                  <div className="space-y-0">
                    {pipeline.steps.map((step, i) => {
                      const agent = getAgent(step.agentId);
                      if (!agent) return null;
                      const isLast = i === pipeline.steps.length - 1;

                      return (
                        <div key={i} className="flex gap-4">
                          {/* Timeline line + dot */}
                          <div className="flex flex-col items-center">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                              style={{
                                background: "rgba(45,122,255,0.15)",
                                color: "#2D7AFF",
                              }}
                            >
                              {i + 1}
                            </div>
                            {!isLast && (
                              <div
                                className="w-px flex-1 min-h-[24px]"
                                style={{ background: "rgba(45,122,255,0.15)" }}
                              />
                            )}
                          </div>

                          {/* Step content */}
                          <div className={`flex items-center gap-3 ${isLast ? "pb-0" : "pb-5"}`}>
                            <AgentAvatar
                              agentId={agent.id}
                              name={agent.name}
                              color={agent.color}
                              size={32}
                            />
                            <div>
                              <p className="text-white text-sm font-semibold leading-tight">
                                {agent.name}
                              </p>
                              <p className="text-[#5E7A9A] text-xs mt-0.5">
                                {step.action}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Activate button */}
                  <button
                    onClick={() => togglePipeline(pipeline.id)}
                    className="w-full mt-6 py-3 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background:
                        pipelineStates[pipeline.id] === "ativo"
                          ? "rgba(255,255,255,0.06)"
                          : "#2D7AFF",
                      color:
                        pipelineStates[pipeline.id] === "ativo"
                          ? "#5E7A9A"
                          : "white",
                    }}
                  >
                    {pipelineStates[pipeline.id] === "ativo"
                      ? "Pausar Pipeline"
                      : "Ativar Pipeline"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-medium shadow-2xl animate-fade-in"
          style={{
            background: "#0A1628",
            border: "1px solid rgba(45,122,255,0.3)",
            color: "#fff",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
