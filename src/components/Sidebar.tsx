"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Users, Star, Activity, Settings } from "lucide-react";
import { clients } from "@/data/clients";
import { useState } from "react";

const navSections = [
  {
    label: "PRINCIPAL",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Escritório Virtual", href: "/escritorio", icon: Building2 },
      { name: "Agentes", href: "/agentes", icon: Users, badge: "32" },
    ],
  },
  {
    label: "PRODUÇÃO",
    items: [
      { name: "Galeria", href: "/galeria", icon: Star },
      { name: "Atividade", href: "/atividade", icon: Activity },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { name: "Configurações", href: "/configuracoes", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [activeClient, setActiveClient] = useState<string>("super-aprendizagem");

  const activeClientData = clients.find((c) => c.id === activeClient);

  return (
    <aside
      className="flex flex-col shrink-0 h-screen sticky top-0 border-r border-white/5"
      style={{ width: 240, background: "var(--bg-surface)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div
          className="flex items-center justify-center rounded-lg font-bold text-sm text-white"
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
          }}
        >
          MC
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Mission Control
          </span>
          <span className="text-[10px] tracking-widest font-medium" style={{ color: "var(--text-dimmed)" }}>
            AI AGENCY HUB
          </span>
        </div>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
        {/* Clientes */}
        <div>
          <h3
            className="text-[11px] font-semibold tracking-wider uppercase mb-2 px-3"
            style={{ color: "var(--text-muted)" }}
          >
            Clientes
          </h3>
          <ul className="flex flex-col gap-0.5">
            {clients.map((client) => {
              const isActive = activeClient === client.id;
              return (
                <li key={client.id}>
                  <button
                    onClick={() => setActiveClient(client.id)}
                    className={`flex items-center gap-3 w-full text-sm rounded-lg px-3 py-2 transition-colors cursor-pointer ${
                      isActive
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                    }`}
                    style={
                      isActive
                        ? { background: "rgba(139, 92, 246, 0.2)" }
                        : undefined
                    }
                  >
                    <span
                      className="shrink-0 rounded-full"
                      style={{
                        width: 8,
                        height: 8,
                        background: client.color,
                      }}
                    />
                    {client.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Nav sections */}
        {navSections.map((section) => (
          <div key={section.label}>
            <h3
              className="text-[11px] font-semibold tracking-wider uppercase mb-2 px-3"
              style={{ color: "var(--text-muted)" }}
            >
              {section.label}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 text-sm rounded-lg px-3 py-2 transition-colors ${
                        isActive
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                      }`}
                      style={
                        isActive
                          ? { background: "rgba(139, 92, 246, 0.2)" }
                          : undefined
                      }
                    >
                      <Icon size={18} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span
                          className="text-[10px] font-semibold rounded-full px-1.5 py-0.5"
                          style={{
                            background: "rgba(139, 92, 246, 0.3)",
                            color: "var(--accent-purple)",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Status bar */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2">
        <span
          className="rounded-full shrink-0"
          style={{
            width: 8,
            height: 8,
            background: "var(--accent-green)",
            boxShadow: "0 0 6px var(--accent-green)",
          }}
        />
        <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
          {activeClientData?.name ?? "—"}
        </span>
        <span
          className="text-[10px] font-medium ml-auto"
          style={{ color: "var(--accent-green)" }}
        >
          Online
        </span>
      </div>
    </aside>
  );
}
