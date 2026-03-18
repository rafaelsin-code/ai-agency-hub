"use client";

import { useState, useRef, useEffect } from "react";
import AgentAvatar from "@/components/AgentAvatar";
import { agents, getSquadGroups, SQUAD_COLORS, Agent, SquadName } from "@/data/agents";

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
  const [workingAgents, setWorkingAgents] = useState<Record<string, string>>({});
  const [filterSquad, setFilterSquad] = useState<string>("todos");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const squadGroups = getSquadGroups();
  const filteredGroups = filterSquad === "todos"
    ? squadGroups
    : squadGroups.filter(g => g.squad === filterSquad);
  const activeCount = Object.keys(workingAgents).length;

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

  async function sendMessage() {
    if (!inputValue.trim() || !selectedAgent || isTyping) return;
    const userText = inputValue.trim();
    const userMsg: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Set agent as working
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
          { role: "agent", content: `Erro: ${data.error || "Falha ao processar"}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: data.response },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Erro de conexão. Tente novamente." },
      ]);
    } finally {
      setIsTyping(false);
      setWorkingAgents((prev) => {
        const next = { ...prev };
        delete next[selectedAgent.id];
        return next;
      });
    }
  }

  return (
    <div className="relative min-h-0 h-full overflow-y-auto grid-bg">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none ambient-glow"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(45,122,255,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 px-8 py-8 max-w-[1600px] mx-auto">
        {/* ── Page Header ── */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white">Escritório Virtual</h1>
          <p className="text-sm text-[#5E7A9A] mt-1">
            Seus agentes de IA organizados por squad. Clique para interagir.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#2D7AFF]/15 text-[#5B9AFF] border border-[#2D7AFF]/20">
              {agents.length} agentes
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                activeCount > 0
                  ? "bg-[#00E676]/15 text-[#00E676] border-[#00E676]/20"
                  : "bg-white/5 text-[#5E7A9A] border-white/10"
              }`}
            >
              {activeCount} ativos
            </span>
          </div>
        </div>

        {/* Squad Filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilterSquad("todos")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              filterSquad === "todos"
                ? "bg-[#2D7AFF] text-white"
                : "bg-[#0A1628] text-[#5E7A9A] border border-[rgba(45,122,255,0.1)] hover:border-[rgba(45,122,255,0.3)] hover:text-white"
            }`}
          >
            Todos
          </button>
          {squadGroups.map((group) => (
            <button
              key={group.squad}
              onClick={() => setFilterSquad(group.squad)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                filterSquad === group.squad
                  ? "text-white"
                  : "text-[#5E7A9A] border border-[rgba(45,122,255,0.1)] hover:text-white"
              }`}
              style={{
                background: filterSquad === group.squad ? SQUAD_COLORS[group.squad] : "#0A1628",
                borderColor: filterSquad === group.squad ? SQUAD_COLORS[group.squad] : undefined,
              }}
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* ── Squads ── */}
        <div>
          {filteredGroups.map((group, groupIdx) => {
            const squadColor = SQUAD_COLORS[group.squad];
            return (
              <div key={group.squad} className={groupIdx > 0 ? "mt-10" : ""}>
                {/* Squad header */}
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: squadColor }}
                      />
                      <span
                        className="text-sm font-bold uppercase tracking-[0.15em]"
                        style={{ color: squadColor }}
                      >
                        {group.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5E7A9A] font-mono">
                      {group.agents.length} agentes
                    </span>
                  </div>
                  <div
                    className="mt-2 rounded-full"
                    style={{
                      width: 60,
                      height: 2,
                      backgroundColor: squadColor,
                    }}
                  />
                </div>

                {/* Agent grid — bigger cards, fewer columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.agents.map((agent) => {
                    const isWorking = workingAgents[agent.id];
                    const isAutonomo = agent.status === "autonomo";
                    return (
                      <div key={agent.id} className="relative">
                        {/* Speech bubble */}
                        {isWorking && (
                          <div className="speech-bubble absolute -top-14 left-1/2 -translate-x-1/2 z-20 max-w-[220px]">
                            <div className="bg-[#0A1628] border border-[#2D7AFF]/20 rounded-lg px-3 py-2 text-[10px] text-[#5B9AFF] leading-tight truncate">
                              {isWorking}
                            </div>
                            {/* Caret */}
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#2D7AFF]/20" />
                          </div>
                        )}

                        {/* Card — VERTICAL layout, bigger */}
                        <button
                          onClick={() => openDrawer(agent)}
                          className={`
                            w-full rounded-2xl p-5 cursor-pointer
                            transition-all duration-200
                            border
                            hover:-translate-y-[1px]
                            ${isWorking ? "agent-working" : ""}
                          `}
                          style={{
                            background: "rgba(10,22,40,0.5)",
                            borderColor: "rgba(45,122,255,0.06)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor =
                              "rgba(45,122,255,0.2)";
                            (e.currentTarget as HTMLElement).style.boxShadow =
                              "0 4px 20px rgba(45,122,255,0.06)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor =
                              "rgba(45,122,255,0.06)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "none";
                          }}
                        >
                          {/* Vertical layout: avatar centered on top */}
                          <div className="flex flex-col items-center text-center">
                            <AgentAvatar
                              agentId={agent.id}
                              name={agent.name}
                              color={agent.color}
                              size={72}
                            />
                            <p className="text-sm font-bold text-white mt-3 truncate w-full">
                              {agent.name}
                            </p>
                            {agent.aka && (
                              <p className="text-[10px] text-[#3A5068] font-mono truncate w-full">
                                {agent.aka}
                              </p>
                            )}
                            <p className="text-xs text-[#5E7A9A] mt-1 truncate w-full">
                              {agent.role}
                            </p>
                            <div className="flex items-center gap-1.5 mt-3">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isAutonomo ? "status-online" : "status-busy"
                                }`}
                              />
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isAutonomo
                                    ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20"
                                    : "bg-[#2D7AFF]/10 text-[#5B9AFF] border border-[#2D7AFF]/20"
                                }`}
                              >
                                {isAutonomo ? "AUTÔNOMO" : "OPERADOR"}
                              </span>
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
                  <svg
                    width="20"
                    height="20"
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
              {activeTab === "Prompt" && (
                <PlaceholderTab text="Prompt do agente será carregado da API" />
              )}
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
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
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Stats */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
          Stats
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Tarefas", value: agent.stats.tasksCompleted.toLocaleString() },
            { label: "Sucesso", value: `${agent.stats.successRate}%` },
            { label: "Tempo médio", value: agent.stats.avgDuration },
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
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
          Skills
        </p>
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
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
          Especialidades
        </p>
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
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5E7A9A] mb-3">
          Ferramentas
        </p>
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
