"use client";

import { useState, useRef, useEffect } from "react";
import AgentAvatar from "@/components/AgentAvatar";
import { agents, getSquadGroups, SQUAD_COLORS, Agent, SquadName } from "@/data/agents";

// ── Mock working agents ──
const WORKING_AGENTS: Record<string, string> = {
  copy: "Gerando 5 variações de copy...",
  spark: "Brainstorming ideias da semana...",
  orion: "Distribuindo tarefas para squads...",
  eagle: "Revisando entregáveis pendentes...",
};

// ── Mock agent responses by role keywords ──
function getMockResponse(agent: Agent): string {
  const name = agent.name;
  const responses: Record<string, string[]> = {
    copy: [
      "Preparei 3 variações de headline usando AIDA. Quer que eu aplique PAS também?",
      "Analisei o briefing. Sugiro um ângulo emocional com prova social. Posso detalhar?",
    ],
    vendas: [
      "Pipeline atualizado. Temos 12 leads quentes prontos para follow-up.",
      "Sequência de outreach criada com 5 mensagens. Taxa esperada: 15% de resposta.",
    ],
    marketing: [
      "Calendário editorial da semana montado. 7 posts, 3 stories/dia, 2 reels.",
      "Métricas do mês: engajamento subiu 23%. Reels performando 3x mais que carrossel.",
    ],
    tecnologia: [
      "Landing page pronta. Lighthouse score: 98. Tempo de carregamento: 1.2s.",
      "Integração com Meta API funcionando. Webhooks configurados e testados.",
    ],
    default: [
      `Tarefa recebida e processada. Relatório disponível em breve.`,
      `Análise concluída. Posso gerar um relatório detalhado se precisar.`,
      `Entendido. Já estou trabalhando nisso. Previsão: 2 minutos.`,
    ],
  };

  const squad = agent.squad;
  let pool = responses.default;
  if (squad.includes("marketing")) pool = responses.marketing;
  else if (squad === "vendas") pool = responses.vendas;
  else if (squad === "tecnologia") pool = responses.tecnologia;
  else if (agent.id === "copy" || agent.role.toLowerCase().includes("copy")) pool = responses.copy;

  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Tabs ──
const TABS = ["Chat", "Overview", "Prompt", "History", "Output", "Logs"] as const;
type Tab = (typeof TABS)[number];

// ── Message type ──
interface Message {
  role: "user" | "agent";
  content: string;
}

export default function EscritorioPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Chat");
  const [isTyping, setIsTyping] = useState(false);
  const [workingAgents] = useState<Record<string, string>>(WORKING_AGENTS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const squadGroups = getSquadGroups();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedAgent) {
      inputRef.current?.focus();
    }
  }, [selectedAgent]);

  function openDrawer(agent: Agent) {
    setSelectedAgent(agent);
    setMessages([]);
    setInputValue("");
    setActiveTab("Chat");
    setIsTyping(false);
  }

  function closeDrawer() {
    setSelectedAgent(null);
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
  }

  function sendMessage() {
    if (!inputValue.trim() || !selectedAgent) return;
    const userMsg: Message = { role: "user", content: inputValue.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const agentMsg: Message = {
        role: "agent",
        content: getMockResponse(selectedAgent),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <div className="relative h-full overflow-y-auto grid-bg">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none ambient-glow"
        style={{
          background: "radial-gradient(circle at top right, rgba(45,122,255,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 px-6 py-6 max-w-[1600px] mx-auto">
        {/* ── Page Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-lg font-semibold text-white">Escritorio Virtual</h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2D7AFF]/15 text-[#5B9AFF] border border-[#2D7AFF]/20">
            {agents.length} agentes
          </span>
        </div>

        {/* ── Squads ── */}
        <div className="space-y-8">
          {squadGroups.map((group) => {
            const squadColor = SQUAD_COLORS[group.squad];
            return (
              <div key={group.squad}>
                {/* Squad header */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
                    style={{ color: squadColor }}
                  >
                    {group.label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: `${squadColor}25` }} />
                </div>

                {/* Agent grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {group.agents.map((agent) => {
                    const isWorking = workingAgents[agent.id];
                    const isAutonomo = agent.status === "autonomo";
                    return (
                      <div key={agent.id} className="relative">
                        {/* Speech bubble */}
                        {isWorking && (
                          <div className="speech-bubble absolute -top-14 left-1/2 -translate-x-1/2 z-20 max-w-[200px]">
                            <div className="bg-[#0A1628] border border-[#2D7AFF]/20 rounded-lg px-3 py-2 text-[10px] text-[#5B9AFF] leading-tight whitespace-nowrap">
                              {isWorking}
                            </div>
                            {/* Caret */}
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#2D7AFF]/20" />
                          </div>
                        )}

                        {/* Card */}
                        <button
                          onClick={() => openDrawer(agent)}
                          className={`
                            w-full text-left rounded-xl p-4 cursor-pointer
                            transition-all duration-200
                            border
                            hover:-translate-y-0.5
                            ${isWorking ? "agent-working" : ""}
                          `}
                          style={{
                            background: "rgba(10,22,40,0.6)",
                            borderColor: "rgba(45,122,255,0.08)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,122,255,0.25)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,122,255,0.08)";
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <AgentAvatar agentId={agent.id} name={agent.name} color={agent.color} size={56} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white truncate">{agent.name}</p>
                              <p className="text-xs text-[#5E7A9A] truncate mt-0.5">{agent.role}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isAutonomo ? "status-online" : "status-busy"
                                  }`}
                                />
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                                    isAutonomo
                                      ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20"
                                      : "bg-[#2D7AFF]/10 text-[#5B9AFF] border border-[#2D7AFF]/20"
                                  }`}
                                >
                                  {isAutonomo ? "AUTONOMO" : "OPERADOR"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Drawer Overlay ── */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={closeDrawer}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Drawer */}
          <div
            className="drawer-enter relative w-full max-w-[480px] h-full flex flex-col"
            style={{
              background: "#050A18",
              borderLeft: "1px solid rgba(45,122,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-start gap-4">
                <AgentAvatar
                  agentId={selectedAgent.id}
                  name={selectedAgent.name}
                  color={selectedAgent.color}
                  size={64}
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-white">{selectedAgent.name}</h2>
                  <p className="text-xs text-[#5E7A9A] mt-0.5">{selectedAgent.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${SQUAD_COLORS[selectedAgent.squad]}15`,
                        color: SQUAD_COLORS[selectedAgent.squad],
                        border: `1px solid ${SQUAD_COLORS[selectedAgent.squad]}30`,
                      }}
                    >
                      {squadGroups.find((g) => g.squad === selectedAgent.squad)?.label}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-[#5E7A9A] border border-white/10">
                      {selectedAgent.model}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeDrawer}
                  className="text-[#5E7A9A] hover:text-white transition-colors p-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 px-5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    text-[10px] uppercase tracking-[0.15em] font-semibold px-3 py-3
                    transition-colors relative
                    ${activeTab === tab ? "text-white" : "text-[#3A5068] hover:text-[#5E7A9A]"}
                  `}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2D7AFF]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {activeTab === "Chat" && (
                <ChatTab
                  agent={selectedAgent}
                  messages={messages}
                  inputValue={inputValue}
                  isTyping={isTyping}
                  messagesEndRef={messagesEndRef}
                  inputRef={inputRef}
                  onInputChange={setInputValue}
                  onSend={sendMessage}
                />
              )}
              {activeTab === "Overview" && <OverviewTab agent={selectedAgent} />}
              {activeTab === "Prompt" && <PlaceholderTab text="Prompt do agente sera carregado da API" />}
              {activeTab === "History" && <PlaceholderTab text="Em breve" />}
              {activeTab === "Output" && <PlaceholderTab text="Em breve" />}
              {activeTab === "Logs" && <PlaceholderTab text="Em breve" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Chat Tab ──
function ChatTab({
  agent,
  messages,
  inputValue,
  isTyping,
  messagesEndRef,
  inputRef,
  onInputChange,
  onSend,
}: {
  agent: Agent;
  messages: Message[];
  inputValue: string;
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <AgentAvatar agentId={agent.id} name={agent.name} color={agent.color} size={80} />
            <p className="text-sm text-[#2D7AFF] font-semibold mt-4">
              Fale diretamente com {agent.name}
            </p>
            <p className="text-xs text-[#5E7A9A] mt-2 max-w-[280px] leading-relaxed">
              {agent.description}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#2D7AFF] text-white rounded-br-sm"
                  : "bg-[#0A1628] border border-white/5 text-[#C8D6E5] rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#0A1628] border border-white/5 rounded-xl px-4 py-3 rounded-bl-sm flex items-center gap-1">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#5B9AFF]" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#5B9AFF]" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#5B9AFF]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 bg-[#0A1628] border border-white/5 rounded-xl px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
            placeholder={`Fale com ${agent.name}...`}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#3A5068] outline-none"
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim()}
            className="p-1.5 rounded-lg bg-[#2D7AFF] text-white hover:bg-[#2D7AFF]/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ── Overview Tab ──
function OverviewTab({ agent }: { agent: Agent }) {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Stats */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">Stats</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Tarefas", value: agent.stats.tasksCompleted.toLocaleString() },
            { label: "Sucesso", value: `${agent.stats.successRate}%` },
            { label: "Tempo medio", value: agent.stats.avgDuration },
            { label: "Custo total", value: `$${agent.stats.totalCost}` },
          ].map((s) => (
            <div key={s.label} className="bg-[#0A1628] border border-white/5 rounded-lg p-3">
              <p className="text-[10px] text-[#5E7A9A]">{s.label}</p>
              <p className="text-sm font-bold text-white mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">Skills</p>
        <div className="space-y-2">
          {agent.skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#C8D6E5]">{skill.name}</span>
                <span className="text-[#5B9AFF] font-mono">{skill.score}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#2D7AFF]"
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">Especialidades</p>
        <div className="flex flex-wrap gap-1.5">
          {agent.specialties.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-[#C8D6E5] border border-white/5"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">Ferramentas</p>
        <div className="flex flex-wrap gap-1.5">
          {agent.tools.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-1 rounded-full bg-[#2D7AFF]/10 text-[#5B9AFF] border border-[#2D7AFF]/20"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Placeholder Tab ──
function PlaceholderTab({ text }: { text: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-sm text-[#3A5068]">{text}</p>
    </div>
  );
}
