"use client";

import { useState } from "react";
import { BookOpen, ChevronRight, Check } from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import { agents } from "@/data/agents";

interface BriefingData {
  id: string;
  nome: string;
  cliente: string;
  objetivo: string;
  publicoAlvo: string;
  tomDeVoz: string;
  referencias: string;
  instrucoesEspeciais: string;
  status: "ativo" | "inativo";
  criadoEm: string;
}

const mockBriefings: BriefingData[] = [
  {
    id: "1",
    nome: "Lancamento Modulo 5",
    cliente: "Babilonia Digital",
    objetivo:
      "Lancar o modulo 5 do curso com faturamento minimo de R$200k. Campanha de 14 dias com pre-lancamento, abertura e carrinho.",
    publicoAlvo:
      "Empreendedores digitais, 25-45 anos, que ja compraram modulos anteriores ou estao na lista de espera.",
    tomDeVoz: "Autoritario mas acessivel. Direto, sem enrolacao.",
    referencias:
      "Lancamentos anteriores do Leandro Ladeira, Icaro de Carvalho. Estilo dark premium.",
    instrucoesEspeciais:
      "Priorizar urgencia e escassez. Usar depoimentos dos modulos 1-4. Bater na dor de quem ainda nao comecou.",
    status: "ativo",
    criadoEm: "2026-03-15",
  },
  {
    id: "2",
    nome: "Campanha Black Friday",
    cliente: "Babilonia Digital",
    objetivo:
      "Campanha de Black Friday com 40% de desconto em todos os produtos digitais.",
    publicoAlvo: "Base inteira + leads frios reaquecidos.",
    tomDeVoz: "Urgente, escasso, premium.",
    referencias: "Black Fridays anteriores, Hotmart, Kiwify.",
    instrucoesEspeciais: "Countdown timer em todas as paginas. Email bombing nos ultimos 3 dias.",
    status: "inativo",
    criadoEm: "2026-03-10",
  },
  {
    id: "3",
    nome: "Conteudo Semanal #12",
    cliente: "Babilonia Digital",
    objetivo: "Producao de conteudo semanal: 5 posts feed, 15 stories, 3 reels, 2 carrosseis.",
    publicoAlvo: "Seguidores atuais + alcance organico para novos.",
    tomDeVoz: "Educativo e inspirador. Leve mas com autoridade.",
    referencias: "Thiago Nigro, Primo Rico, Pablo Marcal.",
    instrucoesEspeciais: "Foco no pilar educativo esta semana. 60% educativo, 20% autoridade, 20% conexao.",
    status: "inativo",
    criadoEm: "2026-03-12",
  },
];

const emptyForm: BriefingData = {
  id: "",
  nome: "",
  cliente: "",
  objetivo: "",
  publicoAlvo: "",
  tomDeVoz: "",
  referencias: "",
  instrucoesEspeciais: "",
  status: "inativo",
  criadoEm: new Date().toISOString().split("T")[0],
};

// Agents for the distribution flow
const orion = agents.find((a) => a.id === "orion")!;
const conselheiros = agents.filter((a) => a.squad === "conselheiros");
const heads = agents.filter(
  (a) =>
    a.id.startsWith("head-") &&
    a.squad !== "comando" &&
    a.squad !== "conselheiros"
);
const squadAgents = agents.filter(
  (a) =>
    a.tier === "execucao" &&
    a.squad !== "comando" &&
    a.squad !== "qualidade"
);

export default function BriefingPage() {
  const [selectedId, setSelectedId] = useState<string>("1");
  const [formData, setFormData] = useState<BriefingData>(mockBriefings[0]);
  const [showToast, setShowToast] = useState(false);

  const handleSelectBriefing = (briefing: BriefingData) => {
    setSelectedId(briefing.id);
    setFormData({ ...briefing });
  };

  const handleChange = (
    field: keyof BriefingData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const inputClass =
    "w-full bg-[#0A1628] border border-[rgba(45,122,255,0.15)] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#3A5068] focus:outline-none focus:border-[#2D7AFF] focus:ring-1 focus:ring-[#2D7AFF]/20 transition-colors";
  const labelClass =
    "block text-xs uppercase tracking-wider text-[#5E7A9A] mb-1.5";

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-[rgba(45,122,255,0.08)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[#2D7AFF]/10 flex items-center justify-center">
            <BookOpen size={20} className="text-[#2D7AFF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Briefing</h1>
            <p className="text-sm text-[#5E7A9A]">
              O cerebro da operacao. Defina o contexto e todos os agentes
              trabalham em cima disso.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar - Briefing list */}
        <div
          className="w-[300px] shrink-0 border-r border-[rgba(45,122,255,0.08)] overflow-y-auto"
          style={{
            background: "linear-gradient(180deg, #020818 0%, #050A18 100%)",
          }}
        >
          <div className="p-4">
            <button
              onClick={() => {
                setSelectedId("");
                setFormData({ ...emptyForm, id: String(Date.now()) });
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2D7AFF] text-white text-sm font-medium hover:bg-[#2D7AFF]/90 transition-colors"
            >
              Novo Briefing +
            </button>
          </div>

          <div className="flex flex-col gap-1 px-3 pb-4">
            {mockBriefings.map((briefing) => (
              <button
                key={briefing.id}
                onClick={() => handleSelectBriefing(briefing)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-150 ${
                  selectedId === briefing.id
                    ? "bg-[rgba(45,122,255,0.1)] border border-[rgba(45,122,255,0.3)]"
                    : "bg-transparent border border-transparent hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      selectedId === briefing.id
                        ? "text-white"
                        : "text-[#C8D6E5]"
                    }`}
                  >
                    {briefing.nome}
                  </span>
                  {briefing.status === "ativo" && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20">
                      ATIVO
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#3A5068]">
                  {briefing.criadoEm}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-8">
            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Nome do Projeto</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Ex: Lancamento Modulo 5"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Cliente</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Nome do cliente"
                  value={formData.cliente}
                  onChange={(e) => handleChange("cliente", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Objetivo</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  placeholder="Qual o objetivo principal deste briefing?"
                  value={formData.objetivo}
                  onChange={(e) => handleChange("objetivo", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Publico-alvo</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="Descreva o publico-alvo"
                  value={formData.publicoAlvo}
                  onChange={(e) => handleChange("publicoAlvo", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Tom de voz</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Ex: Profissional, acessivel, direto"
                  value={formData.tomDeVoz}
                  onChange={(e) => handleChange("tomDeVoz", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Referencias</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="Marcas, pessoas ou estilos de referencia"
                  value={formData.referencias}
                  onChange={(e) => handleChange("referencias", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Instrucoes especiais</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  placeholder="Instrucoes adicionais para os agentes"
                  value={formData.instrucoesEspeciais}
                  onChange={(e) =>
                    handleChange("instrucoesEspeciais", e.target.value)
                  }
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 rounded-lg bg-[#2D7AFF] text-white font-medium text-sm hover:bg-[#2D7AFF]/90 transition-colors glow-blue"
              >
                Salvar Briefing
              </button>
            </div>

            {/* Distribution section */}
            <div className="mt-12 mb-8">
              <h2 className="text-lg font-semibold text-white mb-1">
                Distribuicao
              </h2>
              <p className="text-sm text-[#5E7A9A] mb-6">
                Fluxo de distribuicao do briefing para os agentes
              </p>

              <div className="flex items-center gap-4 overflow-x-auto pb-4">
                {/* ORION */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <AgentAvatar
                    agentId={orion.id}
                    name={orion.name}
                    color={orion.color}
                    size={48}
                    className="ring-2 ring-[#8B5CF6]/30"
                  />
                  <span className="text-xs font-medium text-white">
                    ORION
                  </span>
                  <span className="text-[10px] text-[#5E7A9A]">CEO</span>
                </div>

                <ChevronRight size={20} className="text-[#2D7AFF] shrink-0" />

                {/* Conselheiros */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="flex -space-x-2">
                    {conselheiros.slice(0, 3).map((agent) => (
                      <AgentAvatar
                        key={agent.id}
                        agentId={agent.id}
                        name={agent.name}
                        color={agent.color}
                        size={36}
                        className="ring-2 ring-[#050A18]"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white">
                    Conselheiros
                  </span>
                  <span className="text-[10px] text-[#5E7A9A]">
                    {conselheiros.length} agentes
                  </span>
                </div>

                <ChevronRight size={20} className="text-[#2D7AFF] shrink-0" />

                {/* Heads */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="flex -space-x-2">
                    {heads.slice(0, 5).map((agent) => (
                      <AgentAvatar
                        key={agent.id}
                        agentId={agent.id}
                        name={agent.name}
                        color={agent.color}
                        size={36}
                        className="ring-2 ring-[#050A18]"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white">
                    Heads
                  </span>
                  <span className="text-[10px] text-[#5E7A9A]">
                    {heads.length} diretores
                  </span>
                </div>

                <ChevronRight size={20} className="text-[#2D7AFF] shrink-0" />

                {/* Squads */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="flex -space-x-2">
                    {squadAgents.slice(0, 6).map((agent) => (
                      <AgentAvatar
                        key={agent.id}
                        agentId={agent.id}
                        name={agent.name}
                        color={agent.color}
                        size={36}
                        className="ring-2 ring-[#050A18]"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white">
                    Squads
                  </span>
                  <span className="text-[10px] text-[#5E7A9A]">
                    {squadAgents.length} agentes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#0A1628] border border-[#00E676]/30 text-[#00E676] px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4">
          <Check size={16} />
          Briefing salvo com sucesso
        </div>
      )}
    </div>
  );
}
