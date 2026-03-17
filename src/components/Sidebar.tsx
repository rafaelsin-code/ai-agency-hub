"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BarChart3,
  Briefcase,
  DollarSign,
  Activity,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Agents", href: "/escritorio", icon: Users },
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Squads", href: "/agentes", icon: Briefcase },
  { label: "Deliverables", href: "/galeria", icon: DollarSign },
  { label: "Activity", href: "/atividade", icon: Activity },
  { label: "Logs", href: "/logs", icon: FileText },
  { label: "Settings", href: "/configuracoes", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col shrink-0 h-screen sticky top-0"
      style={{
        width: 260,
        height: "100vh",
        background: "linear-gradient(180deg, #020818 0%, #050A18 100%)",
        borderRight: "1px solid rgba(45, 122, 255, 0.08)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-6 py-6"
        style={{ borderBottom: "1px solid rgba(45, 122, 255, 0.08)" }}
      >
        <span className="font-mono text-[22px] font-bold tracking-tight select-none">
          <span className="text-white">A</span>
          <span className="mx-1" />
          <span
            className="text-[#2D7AFF]"
            style={{
              textShadow: "0 0 12px rgba(45, 122, 255, 0.4)",
            }}
          >
            X
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 rounded-lg
                ${
                  isActive
                    ? "text-white bg-[rgba(45,122,255,0.1)] border-l-2 border-[#2D7AFF]"
                    : "text-[#5E7A9A] hover:text-white hover:bg-white/[0.03] border-l-2 border-transparent"
                }
              `}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-[#5E7A9A]"}
                style={
                  isActive
                    ? {
                        filter: "drop-shadow(0 0 6px rgba(45, 122, 255, 0.5))",
                      }
                    : undefined
                }
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom "N" logo */}
      <div className="flex items-center justify-center px-4 py-5">
        <div
          className="flex items-center justify-center font-mono font-bold select-none"
          style={{
            width: 36,
            height: 36,
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(45, 122, 255, 0.1)",
            borderRadius: 8,
          }}
        >
          N
        </div>
      </div>
    </aside>
  );
}
