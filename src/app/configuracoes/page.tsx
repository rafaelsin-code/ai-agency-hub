import { Settings, Shield, DollarSign, Bell, Database } from "lucide-react";

const configSections = [
  {
    title: "Geral",
    icon: Settings,
    items: [
      { label: "Nome do Projeto", value: "AI Agency Hub", type: "text" },
      { label: "Idioma", value: "Português (BR)", type: "select" },
      { label: "Timezone", value: "America/Sao_Paulo", type: "select" },
      { label: "Tema", value: "Dark", type: "select" },
    ],
  },
  {
    title: "Custos & Limites",
    icon: DollarSign,
    items: [
      { label: "Limite Diário (USD)", value: "$10.00", type: "text" },
      { label: "Limite Mensal (USD)", value: "$150.00", type: "text" },
      { label: "Alerta em", value: "80%", type: "text" },
      { label: "Kill Switch Automático", value: "Ativo", type: "toggle" },
    ],
  },
  {
    title: "Notificações",
    icon: Bell,
    items: [
      { label: "Telegram Bot", value: "Conectado", type: "status" },
      { label: "Pipeline Completa", value: "Ativo", type: "toggle" },
      { label: "Erros Críticos", value: "Ativo", type: "toggle" },
      { label: "Relatórios Semanais", value: "Ativo", type: "toggle" },
    ],
  },
  {
    title: "Integrações",
    icon: Database,
    items: [
      { label: "Claude API", value: "Conectado", type: "status" },
      { label: "Notion API", value: "Conectado", type: "status" },
      { label: "Meta Graph API", value: "Desconectado", type: "status" },
      { label: "MinIO Storage", value: "Conectado", type: "status" },
    ],
  },
  {
    title: "Segurança",
    icon: Shield,
    items: [
      { label: "Autenticação", value: "NextAuth.js", type: "text" },
      { label: "Rate Limiting", value: "100 req/min", type: "text" },
      { label: "API Key", value: "••••••••••••", type: "secret" },
      { label: "Whitelist Telegram", value: "1 chat ID", type: "text" },
    ],
  },
];

export default function ConfiguracoesPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-purple)" }}>
          Sistema
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Configurações</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Gerencie integrações, limites de custo e preferências do sistema.
        </p>
      </div>

      <div className="space-y-6">
        {configSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)" }}>
              <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <Icon size={18} style={{ color: "var(--accent-purple)" }} />
                <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>{section.title}</h2>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item.label}</span>
                    {item.type === "status" ? (
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          background: item.value === "Conectado" ? "rgba(34,197,94,0.15)" : "rgba(244,63,94,0.15)",
                          color: item.value === "Conectado" ? "#22C55E" : "#F43F5E",
                        }}
                      >
                        {item.value}
                      </span>
                    ) : item.type === "toggle" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: item.value === "Ativo" ? "#22C55E" : "var(--text-muted)" }}>
                          {item.value}
                        </span>
                        <div
                          className="w-9 h-5 rounded-full relative cursor-pointer"
                          style={{ background: item.value === "Ativo" ? "#22C55E" : "var(--bg-card-hover)" }}
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all"
                            style={{
                              background: "white",
                              left: item.value === "Ativo" ? "18px" : "3px",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-mono" style={{ color: "var(--text-primary)" }}>
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
