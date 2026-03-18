"use client";

import { useState, useRef, useEffect } from "react";
import AgentAvatar from "@/components/AgentAvatar";
import { agents, getSquadGroups, SQUAD_COLORS, Agent, SquadName } from "@/data/agents";

// ── Tabs ──
const TABS = ["Chat", "Overview", "Prompt", "History", "Output", "Logs"] as const;
type Tab = (typeof TABS)[number];

// ── Message type with orchestration support ──
interface Message {
  role: "user" | "agent";
  content: string;
  orchestration?: {
    steps: Array<{
      agentId: string;
      agentName: string;
      status: string;
      output?: string;
      durationMs?: number;
      costUsd?: number;
    }>;
    totalCost: number;
    totalDuration: number;
  };
  meta?: { model: string; cost: number; duration: number };
}

// ── Orchestration Step Component ──
function OrchestrationTimeline({
  orchestration,
}: {
  orchestration: NonNullable<Message["orchestration"]>;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="text-[#00E676] text-sm flex items-center justify-center w-5 h-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        );
      case "running":
        return (
          <span className="text-[#FFB300] text-sm flex items-center justify-center w-5 h-5 animate-spin">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
        );
      case "failed":
        return (
          <span className="text-[#FF5252] text-sm flex items-center justify-center w-5 h-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        );
      default:
        return (
          <span className="text-[#3A5068] text-sm flex items-center justify-center w-5 h-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="3" />
            </svg>
          </span>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#00E676";
      case "running": return "#FFB300";
      case "failed": return "#FF5252";
      default: return "#3A5068";
    }
  };

  return (
    <div className="max-w-[92%] rounded-xl overflow-hidden" style={{
      background: "rgba(8, 16, 32, 0.7)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(45, 122, 255, 0.12)",
    }}>
      {/* Pipeline header */}
      <div className="px-4 py-3 flex items-center gap-2" style={{
        borderBottom: "1px solid rgba(45, 122, 255, 0.08)",
        background: "rgba(45, 122, 255, 0.04)",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B9AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" style={{ animationDuration: "3s" }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="text-xs font-bold text-[#5B9AFF] uppercase tracking-wider">Pipeline de Execucao</span>
      </div>

      {/* Steps */}
      <div className="px-4 py-3 space-y-2.5">
        {orchestration.steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            {getStatusIcon(step.status)}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold" style={{ color: getStatusColor(step.status) }}>
                {step.agentName}
              </span>
              {step.output && (
                <p className="text-[11px] text-[#5E7A9A] truncate mt-0.5 leading-tight">
                  &ldquo;{step.output}&rdquo;
                </p>
              )}
              {step.status === "pending" && (
                <p className="text-[11px] text-[#3A5068] mt-0.5">Aguardando...</p>
              )}
              {step.status === "running" && (
                <p className="text-[11px] text-[#FFB300] mt-0.5 flex items-center gap-1">
                  Processando
                  <span className="flex gap-0.5">
                    <span className="typing-dot w-1 h-1 rounded-full bg-[#FFB300]" />
                    <span className="typing-dot w-1 h-1 rounded-full bg-[#FFB300]" />
                    <span className="typing-dot w-1 h-1 rounded-full bg-[#FFB300]" />
                  </span>
                </p>
              )}
            </div>
            {step.durationMs && step.status === "completed" && (
              <span className="text-[9px] text-[#3A5068] font-mono shrink-0">
                {(step.durationMs / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer with totals */}
      <div className="px-4 py-2.5 flex items-center gap-4" style={{
        borderTop: "1px solid rgba(45, 122, 255, 0.08)",
        background: "rgba(45, 122, 255, 0.02)",
      }}>
        <span className="text-[10px] text-[#5E7A9A] font-mono">
          Custo: <span className="text-[#5B9AFF]">${orchestration.totalCost.toFixed(4)}</span>
        </span>
        <span className="text-[10px] text-[#5E7A9A] font-mono">
          Tempo: <span className="text-[#5B9AFF]">{(orchestration.totalDuration / 1000).toFixed(1)}s</span>
        </span>
        <span className="text-[10px] text-[#5E7A9A] font-mono">
          Agentes: <span className="text-[#5B9AFF]">{orchestration.steps.length}</span>
        </span>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function EscritorioPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Chat");
  const [isTyping, setIsTyping] = useState(false);
  const [workingAgents, setWorkingAgents] = useState<Record<string, string>>({});
  const [filterSquad, setFilterSquad] = useState<string>("todos");
  const [promptContent, setPromptContent] = useState<string | null>(null);
  const [promptLoading, setPromptLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const squadGroups = getSquadGroups();
  const filteredGroups =
    filterSquad === "todos"
      ? squadGroups
      : squadGroups.filter((g) => g.squad === filterSquad);
  const activeCount = Object.keys(workingAgents).length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedAgent) {
      inputRef.current?.focus();
    }
  }, [selectedAgent]);

  // Load prompt when Prompt tab is active
  useEffect(() => {
    if (activeTab === "Prompt" && selectedAgent && promptContent === null && !promptLoading) {
      setPromptLoading(true);
      fetch(`/api/agents/${selectedAgent.id}/prompt`)
        .then((res) => (res.ok ? res.text() : Promise.reject()))
        .then((text) => setPromptContent(text))
        .catch(() => setPromptContent("Prompt nao disponivel no momento."))
        .finally(() => setPromptLoading(false));
    }
  }, [activeTab, selectedAgent, promptContent, promptLoading]);

  function openDrawer(agent: Agent) {
    setSelectedAgent(agent);
    setMessages([]);
    setInputValue("");
    setActiveTab("Chat");
    setIsTyping(false);
    setPromptContent(null);
  }

  function closeDrawer() {
    setSelectedAgent(null);
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    setPromptContent(null);
  }

  async function sendMessage() {
    if (!inputValue.trim() || !selectedAgent || isTyping) return;
    const userText = inputValue.trim();
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInputValue("");
    setIsTyping(true);
    setWorkingAgents((prev) => ({ ...prev, [selectedAgent.id]: userText }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          message: userText,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: `Erro: ${data.error}` },
        ]);
      } else if (data.orchestrated && data.steps) {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: data.response,
            orchestration: {
              steps: data.steps,
              totalCost: data.totalCost,
              totalDuration: data.totalDuration,
            },
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: data.response,
            meta: {
              model: data.model,
              cost: data.costUsd,
              duration: data.durationMs,
            },
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Erro de conexao." },
      ]);
    } finally {
      setIsTyping(false);
      setWorkingAgents((prev) => {
        const next = { ...prev };
        if (selectedAgent) delete next[selectedAgent.id];
        return next;
      });
    }
  }

  return (
    <div className="relative min-h-0 h-full overflow-y-auto" style={{ background: "#000" }}>
      {/* Animated grid background */}
      <div className="grid-bg absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

      {/* Ambient glow — blue top-right */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 10%, rgba(45,122,255,0.12), transparent 65%)",
        }}
      />
      {/* Ambient glow — purple bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 90%, rgba(139,92,246,0.06), transparent 65%)",
        }}
      />

      <div className="relative z-10 px-8 py-10 max-w-[1600px] mx-auto">
        {/* ── Page Header ── */}
        <div className="mb-12">
          <h1
            className="text-3xl font-extrabold tracking-tight glow-text-blue"
            style={{ color: "#fff" }}
          >
            Escritorio Virtual
          </h1>
          <p className="text-sm text-[#5E7A9A] mt-2 max-w-md">
            Seus agentes de IA organizados por squad. Clique em qualquer agente para interagir em tempo real.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#2D7AFF]/10 text-[#5B9AFF] border border-[#2D7AFF]/15 backdrop-blur-sm">
              {agents.length} agentes
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border backdrop-blur-sm flex items-center gap-1.5 ${
                activeCount > 0
                  ? "bg-[#00E676]/10 text-[#00E676] border-[#00E676]/15"
                  : "bg-white/5 text-[#5E7A9A] border-white/10"
              }`}
            >
              {activeCount > 0 && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]" />
                </span>
              )}
              {activeCount} ativos
            </span>
          </div>
        </div>

        {/* ── Squad Filter ── */}
        <div className="flex items-center gap-2 mb-10 flex-wrap">
          <button
            onClick={() => setFilterSquad("todos")}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              filterSquad === "todos"
                ? "bg-[#2D7AFF] text-white shadow-[0_0_20px_rgba(45,122,255,0.3)]"
                : "text-[#5E7A9A] border border-white/8 hover:border-[rgba(45,122,255,0.3)] hover:text-white"
            }`}
            style={{
              background: filterSquad === "todos" ? undefined : "rgba(10, 22, 40, 0.5)",
            }}
          >
            Todos
          </button>
          {squadGroups.map((group) => (
            <button
              key={group.squad}
              onClick={() => setFilterSquad(group.squad)}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                filterSquad === group.squad
                  ? "text-white"
                  : "text-[#5E7A9A] border border-white/8 hover:text-white"
              }`}
              style={{
                background:
                  filterSquad === group.squad
                    ? SQUAD_COLORS[group.squad as SquadName]
                    : "rgba(10, 22, 40, 0.5)",
                borderColor:
                  filterSquad === group.squad
                    ? SQUAD_COLORS[group.squad as SquadName]
                    : undefined,
                boxShadow:
                  filterSquad === group.squad
                    ? `0 0 20px ${SQUAD_COLORS[group.squad as SquadName]}40`
                    : undefined,
              }}
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* ── Squads ── */}
        <div className="space-y-14">
          {filteredGroups.map((group) => {
            const squadColor = SQUAD_COLORS[group.squad as SquadName];
            return (
              <section key={group.squad}>
                {/* Squad header bar */}
                <div
                  className="flex items-center justify-between mb-6 pb-4"
                  style={{ borderBottom: `1px solid ${squadColor}15` }}
                >
                  <div className="flex items-center gap-3">
                    {/* 3px accent line */}
                    <div
                      className="w-[3px] h-8 rounded-full"
                      style={{ background: squadColor }}
                    />
                    <div>
                      <h2
                        className="text-sm font-bold uppercase tracking-[0.2em]"
                        style={{ color: squadColor }}
                      >
                        {group.label}
                      </h2>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{
                      background: `${squadColor}10`,
                      color: squadColor,
                      border: `1px solid ${squadColor}20`,
                    }}
                  >
                    {group.agents.length} agentes
                  </span>
                </div>

                {/* Horizontal scrollable row (Netflix-style) */}
                <div className="relative group/scroll">
                  <div
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: `${squadColor}30 transparent`,
                    }}
                  >
                    {group.agents.map((agent) => {
                      const isWorking = workingAgents[agent.id];
                      const isAutonomo = agent.status === "autonomo";
                      return (
                        <div
                          key={agent.id}
                          className="relative shrink-0"
                          style={{ width: 220 }}
                        >
                          {/* Speech bubble floating above */}
                          {isWorking && (
                            <div className="speech-bubble absolute -top-16 left-1/2 -translate-x-1/2 z-20 w-[200px]">
                              <div
                                className="glass-card rounded-lg px-3 py-2.5 text-[10px] text-[#5B9AFF] leading-tight"
                                style={{
                                  background: "rgba(10, 22, 40, 0.8)",
                                  backdropFilter: "blur(16px)",
                                  border: "1px solid rgba(45, 122, 255, 0.2)",
                                  boxShadow: "0 4px 24px rgba(45, 122, 255, 0.1)",
                                }}
                              >
                                <div className="truncate">{isWorking}</div>
                                <div className="flex gap-0.5 mt-1.5">
                                  <span className="typing-dot w-1 h-1 rounded-full bg-[#5B9AFF]" />
                                  <span className="typing-dot w-1 h-1 rounded-full bg-[#5B9AFF]" />
                                  <span className="typing-dot w-1 h-1 rounded-full bg-[#5B9AFF]" />
                                </div>
                              </div>
                              {/* Caret */}
                              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[rgba(45,122,255,0.2)]" />
                            </div>
                          )}

                          {/* Agent Card — glass morphism premium */}
                          <button
                            onClick={() => openDrawer(agent)}
                            className={`
                              glass-card w-full rounded-2xl p-5 cursor-pointer
                              transition-all duration-300 ease-out
                              border relative overflow-hidden
                              group/card
                              ${isWorking ? "agent-working" : ""}
                            `}
                            style={{
                              background: "rgba(10, 22, 40, 0.4)",
                              backdropFilter: "blur(16px)",
                              borderColor: "rgba(45, 122, 255, 0.06)",
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = "rgba(45, 122, 255, 0.25)";
                              el.style.transform = "translateY(-4px)";
                              el.style.boxShadow =
                                "0 8px 32px rgba(45, 122, 255, 0.12), 0 0 0 1px rgba(45, 122, 255, 0.08)";
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = "rgba(45, 122, 255, 0.06)";
                              el.style.transform = "translateY(0)";
                              el.style.boxShadow = "none";
                            }}
                          >
                            {/* Subtle gradient overlay on card bottom */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                              style={{
                                background: `linear-gradient(to top, ${squadColor}08, transparent)`,
                              }}
                            />

                            <div className="flex flex-col items-center text-center relative z-10">
                              {/* Avatar with ring effect */}
                              <div
                                className="rounded-xl p-[2px] mb-3"
                                style={{
                                  background: `linear-gradient(135deg, ${squadColor}4D, transparent 60%)`,
                                }}
                              >
                                <AgentAvatar
                                  agentId={agent.id}
                                  name={agent.name}
                                  color={agent.color}
                                  size={80}
                                />
                              </div>

                              <p className="text-base font-bold text-white truncate w-full">
                                {agent.name}
                              </p>
                              {agent.aka && (
                                <p className="text-[10px] text-[#3A5068] font-mono truncate w-full mt-0.5">
                                  {agent.aka}
                                </p>
                              )}
                              <p className="text-xs text-[#5E7A9A] mt-1 truncate w-full">
                                {agent.role}
                              </p>

                              {/* Status pill */}
                              <div className="flex items-center gap-1.5 mt-3">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isAutonomo ? "status-online" : "status-busy"
                                  }`}
                                />
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                    isAutonomo
                                      ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/15"
                                      : "bg-[#2D7AFF]/10 text-[#5B9AFF] border border-[#2D7AFF]/15"
                                  }`}
                                  style={{
                                    boxShadow: isAutonomo
                                      ? "0 0 12px rgba(0, 230, 118, 0.1)"
                                      : "0 0 12px rgba(45, 122, 255, 0.1)",
                                  }}
                                >
                                  {isAutonomo ? "AUTONOMO" : "OPERADOR"}
                                </span>
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {/* Fade edges */}
                  <div
                    className="absolute top-0 right-0 w-16 h-full pointer-events-none z-10"
                    style={{
                      background: "linear-gradient(to left, #000, transparent)",
                    }}
                  />
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ── Drawer Overlay ── */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={closeDrawer}>
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
          />

          {/* Drawer */}
          <div
            className="drawer-enter relative w-full max-w-[480px] h-full flex flex-col"
            style={{
              background: "linear-gradient(180deg, #040810 0%, #050A18 100%)",
              borderLeft: "1px solid rgba(45, 122, 255, 0.12)",
              boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Drawer Header ── */}
            <div
              className="p-5"
              style={{
                borderBottom: "1px solid rgba(45, 122, 255, 0.08)",
                background: "rgba(45, 122, 255, 0.02)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="rounded-xl p-[2px] shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${SQUAD_COLORS[selectedAgent.squad]}4D, transparent 60%)`,
                  }}
                >
                  <AgentAvatar
                    agentId={selectedAgent.id}
                    name={selectedAgent.name}
                    color={selectedAgent.color}
                    size={64}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {selectedAgent.name}
                  </h2>
                  <p className="text-xs text-[#5E7A9A] mt-0.5">{selectedAgent.role}</p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        background: `${SQUAD_COLORS[selectedAgent.squad]}12`,
                        color: SQUAD_COLORS[selectedAgent.squad],
                        border: `1px solid ${SQUAD_COLORS[selectedAgent.squad]}25`,
                      }}
                    >
                      {squadGroups.find((g) => g.squad === selectedAgent.squad)?.label}
                    </span>
                    <span
                      className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        color: "#5E7A9A",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      {selectedAgent.model}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeDrawer}
                  className="text-[#3A5068] hover:text-white transition-colors duration-200 p-1.5 rounded-lg hover:bg-white/5"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div
              className="flex px-5"
              style={{ borderBottom: "1px solid rgba(45, 122, 255, 0.06)" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    text-[10px] uppercase tracking-[0.15em] font-semibold px-3 py-3.5
                    transition-all duration-200 relative
                    ${
                      activeTab === tab
                        ? "text-white"
                        : "text-[#3A5068] hover:text-[#5E7A9A]"
                    }
                  `}
                >
                  {tab}
                  {activeTab === tab && (
                    <span
                      className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #2D7AFF, #5B9AFF)",
                        boxShadow: "0 0 8px rgba(45, 122, 255, 0.4)",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ── Tab Content ── */}
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
              {activeTab === "Prompt" && (
                <PromptTab content={promptContent} loading={promptLoading} />
              )}
              {activeTab === "History" && <PlaceholderTab text="Historico de conversas em breve" />}
              {activeTab === "Output" && <PlaceholderTab text="Outputs salvos em breve" />}
              {activeTab === "Logs" && <PlaceholderTab text="Logs de execucao em breve" />}
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
            <div
              className="rounded-xl p-[2px] mb-4"
              style={{
                background: `linear-gradient(135deg, ${agent.color}40, transparent 60%)`,
              }}
            >
              <AgentAvatar
                agentId={agent.id}
                name={agent.name}
                color={agent.color}
                size={88}
              />
            </div>
            <p className="text-sm font-semibold glow-text-blue mt-2">
              Fale diretamente com {agent.name}
            </p>
            <p className="text-xs text-[#5E7A9A] mt-2.5 max-w-[300px] leading-relaxed">
              {agent.description}
            </p>
            {agent.cloneDeGenio && (
              <p className="text-[10px] text-[#3A5068] mt-4 italic max-w-[260px]">
                &ldquo;{agent.cloneDeGenio.quote}&rdquo;
                <span className="block mt-1 text-[#2D7AFF] not-italic font-medium">
                  — {agent.cloneDeGenio.name}
                </span>
              </p>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {/* User message */}
            {msg.role === "user" && (
              <div className="flex justify-end">
                <div
                  className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed rounded-br-sm"
                  style={{
                    background: "linear-gradient(135deg, #2D7AFF, #1a5fd4)",
                    color: "#fff",
                    boxShadow: "0 2px 12px rgba(45, 122, 255, 0.2)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            )}

            {/* Agent message */}
            {msg.role === "agent" && (
              <div className="space-y-3">
                {/* Orchestration timeline if present */}
                {msg.orchestration && (
                  <div className="flex justify-start">
                    <OrchestrationTimeline orchestration={msg.orchestration} />
                  </div>
                )}

                {/* Agent text response */}
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed rounded-bl-sm"
                    style={{
                      background: "rgba(10, 22, 40, 0.6)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(45, 122, 255, 0.08)",
                      color: "#C8D6E5",
                    }}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Meta info for non-orchestrated */}
                    {msg.meta && (
                      <div className="flex items-center gap-3 mt-2.5 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <span className="text-[9px] text-[#3A5068] font-mono">
                          {msg.meta.model}
                        </span>
                        {msg.meta.cost > 0 && (
                          <span className="text-[9px] text-[#3A5068] font-mono">
                            ${msg.meta.cost.toFixed(4)}
                          </span>
                        )}
                        {msg.meta.duration > 0 && (
                          <span className="text-[9px] text-[#3A5068] font-mono">
                            {(msg.meta.duration / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="rounded-xl px-4 py-3 rounded-bl-sm flex items-center gap-1.5"
              style={{
                background: "rgba(10, 22, 40, 0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(45, 122, 255, 0.08)",
              }}
            >
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#5B9AFF]" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#5B9AFF]" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#5B9AFF]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(45, 122, 255, 0.06)" }}>
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-2.5"
          style={{
            background: "rgba(10, 22, 40, 0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(45, 122, 255, 0.08)",
          }}
        >
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
            className="p-2 rounded-lg transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: inputValue.trim()
                ? "linear-gradient(135deg, #2D7AFF, #1a5fd4)"
                : "rgba(45, 122, 255, 0.1)",
              boxShadow: inputValue.trim()
                ? "0 2px 12px rgba(45, 122, 255, 0.3)"
                : "none",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {/* Stats */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
          Estatisticas
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Tarefas", value: agent.stats.tasksCompleted.toLocaleString(), icon: "tasks" },
            { label: "Sucesso", value: `${agent.stats.successRate}%`, icon: "success" },
            { label: "Tempo medio", value: agent.stats.avgDuration, icon: "time" },
            { label: "Custo total", value: `$${agent.stats.totalCost}`, icon: "cost" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3.5"
              style={{
                background: "rgba(10, 22, 40, 0.4)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(45, 122, 255, 0.06)",
              }}
            >
              <p className="text-[10px] text-[#5E7A9A]">{s.label}</p>
              <p className="text-sm font-bold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills with progress bars */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
          Skills
        </p>
        <div className="space-y-3">
          {agent.skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#C8D6E5]">{skill.name}</span>
                <span className="text-[#5B9AFF] font-mono font-bold">{skill.score}</span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255, 255, 255, 0.04)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${skill.score}%`,
                    background: `linear-gradient(90deg, #2D7AFF, ${agent.color})`,
                    boxShadow: "0 0 8px rgba(45, 122, 255, 0.3)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
          Especialidades
        </p>
        <div className="flex flex-wrap gap-1.5">
          {agent.specialties.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                color: "#C8D6E5",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
          Ferramentas
        </p>
        <div className="flex flex-wrap gap-1.5">
          {agent.tools.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(45, 122, 255, 0.08)",
                color: "#5B9AFF",
                border: "1px solid rgba(45, 122, 255, 0.15)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Genius Clone */}
      {agent.cloneDeGenio && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
            Clone de Genio
          </p>
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(10, 22, 40, 0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(45, 122, 255, 0.06)",
            }}
          >
            <p className="text-xs text-white font-semibold">{agent.cloneDeGenio.name}</p>
            <p className="text-[11px] text-[#5E7A9A] mt-1.5 italic leading-relaxed">
              &ldquo;{agent.cloneDeGenio.quote}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Prompt Tab ──
function PromptTab({ content, loading }: { content: string | null; loading: boolean }) {
  return (
    <div className="flex-1 overflow-y-auto p-5">
      {loading && (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div className="w-5 h-5 border-2 border-[#2D7AFF]/30 border-t-[#2D7AFF] rounded-full animate-spin" />
          <p className="text-xs text-[#5E7A9A]">Carregando prompt...</p>
        </div>
      )}
      {!loading && content && (
        <div
          className="rounded-xl p-4 text-xs text-[#C8D6E5] leading-relaxed font-mono whitespace-pre-wrap"
          style={{
            background: "rgba(10, 22, 40, 0.4)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(45, 122, 255, 0.06)",
          }}
        >
          {content}
        </div>
      )}
      {!loading && content === null && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-[#3A5068]">Selecione a aba para carregar o prompt</p>
        </div>
      )}
    </div>
  );
}

// ── Placeholder Tab ──
function PlaceholderTab({ text }: { text: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: "rgba(45, 122, 255, 0.06)",
          border: "1px solid rgba(45, 122, 255, 0.08)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3A5068"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <p className="text-sm text-[#3A5068]">{text}</p>
    </div>
  );
}
