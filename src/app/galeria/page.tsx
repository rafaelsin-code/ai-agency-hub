"use client";

import { Star, FileText, Image, Video, Mail } from "lucide-react";

const deliverables = [
  { id: "1", type: "copy", title: "Post Instagram — 5 Erros de Copywriting", agent: "COPY", date: "17/03/2026", score: 94, status: "approved" },
  { id: "2", type: "roteiro", title: "Reels — Hook Magnético: Como vender sem parecer vendedor", agent: "STORYTELLER", date: "17/03/2026", score: 91, status: "approved" },
  { id: "3", type: "criativo", title: "Carrossel — Funil de Vendas em 5 Steps", agent: "ARTURO", date: "16/03/2026", score: 88, status: "review" },
  { id: "4", type: "email", title: "Welcome Sequence — Email 1: Bem-vindo ao programa", agent: "MAILER", date: "16/03/2026", score: 92, status: "approved" },
  { id: "5", type: "pagina", title: "Landing Page — Masterclass Gratuita", agent: "BUILDER", date: "15/03/2026", score: 96, status: "approved" },
  { id: "6", type: "copy", title: "Copy Ads — Campanha de Lançamento v2", agent: "COPY", date: "15/03/2026", score: 89, status: "approved" },
  { id: "7", type: "roteiro", title: "YouTube Script — O Método dos 3 Pilares", agent: "STORYTELLER", date: "14/03/2026", score: 93, status: "approved" },
  { id: "8", type: "criativo", title: "Static Ad — Oferta Irresistível", agent: "ARTURO", date: "14/03/2026", score: 85, status: "review" },
];

const typeConfig: Record<string, { icon: typeof Star; color: string; label: string }> = {
  copy: { icon: FileText, color: "#F97316", label: "Copy" },
  roteiro: { icon: Video, color: "#8B5CF6", label: "Roteiro" },
  criativo: { icon: Image, color: "#EAB308", label: "Criativo" },
  email: { icon: Mail, color: "#06B6D4", label: "Email" },
  pagina: { icon: Star, color: "#22C55E", label: "Página" },
};

export default function GaleriaPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-purple)" }}>
          Produção
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Galeria</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Todos os materiais produzidos pelos agentes. Filtráveis por tipo, agente e status.
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["Todos", "Copy", "Roteiro", "Criativo", "Email", "Página"].map((filter) => (
          <button
            key={filter}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: filter === "Todos" ? "var(--accent-purple)" : "var(--bg-card)",
              color: filter === "Todos" ? "white" : "var(--text-muted)",
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliverables.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          return (
            <div
              key={item.id}
              className="rounded-xl p-5 transition-colors cursor-pointer"
              style={{ background: "var(--bg-card)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${config.color}20` }}>
                    <Icon size={18} style={{ color: config.color }} />
                  </div>
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${config.color}20`, color: config.color }}>
                      {config.label}
                    </span>
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: item.status === "approved" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                    color: item.status === "approved" ? "#22C55E" : "#F59E0B",
                  }}
                >
                  {item.status === "approved" ? "APROVADO" : "REVISÃO"}
                </span>
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>
                {item.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>por</span>
                  <span className="text-xs font-semibold" style={{ color: config.color }}>{item.agent}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.date}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: item.score >= 90 ? "#22C55E" : "#F59E0B" }}>
                    {item.score}/100
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
