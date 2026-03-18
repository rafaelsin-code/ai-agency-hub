"use client";

import { useState } from "react";
import { BookOpen, Plus, Check, AlertCircle, ArrowRight } from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import { agents } from "@/data/agents";

interface BriefingData {
  id: string;
  nome: string;
  cliente: string;
  objetivo: string;
  publicoAlvo: string;
  dorPrincipal: string;
  desejoOculto: string;
  tomDeVoz: string;
  objecoes: string;
  referencias: string;
  instrucoesEspeciais: string;
  status: "ativo" | "inativo";
  criadoEm: string;
}

// Guia de perguntas para cada campo
const fieldGuide: Record<string, { question: string; help: string; placeholder: string }> = {
  nome: {
    question: "Qual o nome desse projeto/campanha?",
    help: "Um nome curto que identifica esse briefing. Ex: 'Lançamento Módulo 5', 'Black Friday 2026'",
    placeholder: "Ex: Lançamento Masterclass de Copy",
  },
  cliente: {
    question: "Para qual cliente/marca é esse trabalho?",
    help: "O nome do negócio ou marca pessoal que os agentes vão representar.",
    placeholder: "Ex: Alta Cúpula — marca pessoal de IA aplicada",
  },
  objetivo: {
    question: "Qual o objetivo principal? O que precisa acontecer?",
    help: "Seja específico. Não diga 'vender mais'. Diga 'Faturar R$200k em 14 dias com lançamento do curso X'. Quanto mais claro, melhor os agentes trabalham.",
    placeholder: "Ex: Gerar 500 leads qualificados e converter 50 vendas do curso de Copywriting a R$997 em 7 dias",
  },
  publicoAlvo: {
    question: "Quem é a pessoa que vai comprar? Descreva com detalhes.",
    help: "Não diga 'empreendedores'. Diga: 'Homens e mulheres, 28-45 anos, que já tentaram vender online mas não conseguiram passar de R$5k/mês. Usam Instagram, consomem conteúdo de marketing digital, já compraram pelo menos um curso online.' Quanto mais real, mais a copy conecta.",
    placeholder: "Ex: Profissionais liberais (médicos, advogados, dentistas), 30-50 anos, que querem criar presença digital mas não sabem por onde começar. Renda R$10-30k/mês. Usam Instagram e LinkedIn.",
  },
  dorPrincipal: {
    question: "Qual a DOR REAL dessa pessoa? O que tira o sono dela?",
    help: "A dor superficial é 'quero ganhar mais dinheiro'. A dor REAL é 'tenho vergonha de pedir desconto no restaurante na frente dos filhos'. Vá fundo. É essa dor que o ICARO vai usar pra conectar emocionalmente.",
    placeholder: "Ex: Vê colegas de faculdade prosperando online enquanto ele continua trocando hora por dinheiro. Sente que está ficando pra trás. Tem medo de ser substituído por IA.",
  },
  desejoOculto: {
    question: "O que essa pessoa REALMENTE deseja? (não é dinheiro)",
    help: "Ninguém quer 'dinheiro'. As pessoas querem o que o dinheiro traz: respeito, liberdade, segurança, poder de escolha. O desejo oculto é o combustível da narrativa. Ex: 'Quer provar pro pai que largou a faculdade que foi a decisão certa.'",
    placeholder: "Ex: Quer ter liberdade de tempo pra buscar os filhos na escola. Quer parar de depender de convênio. Quer ser reconhecido como autoridade na sua área.",
  },
  objecoes: {
    question: "Quais objeções essa pessoa vai ter? O que impede de comprar?",
    help: "Liste as desculpas reais: 'não tenho tempo', 'é caro demais', 'será que funciona pra mim?', 'já me decepcionei antes'. O HORMOZI vai usar isso pra construir garantias que eliminam o risco.",
    placeholder: "Ex: 'Não tenho tempo pra criar conteúdo', 'Já tentei e não funcionou', 'Marketing digital é coisa de influencer, não de profissional sério', 'Como vou aparecer se tenho vergonha de gravar?'",
  },
  tomDeVoz: {
    question: "Como a marca fala? Qual o tom da comunicação?",
    help: "É sério e profissional? Divertido e irreverente? Provocador? Inspiracional? Dê exemplos de como a marca FALA e como ela NUNCA falaria.",
    placeholder: "Ex: Direto, sem enrolação, com autoridade mas sem arrogância. Usa 'você', não 'vocês'. Pode usar humor sutil. NUNCA usa 'maravilhoso', 'incrível', 'sensacional' — essas palavras estão gastas.",
  },
  referencias: {
    question: "Tem referências? Concorrentes? Exemplos que admira?",
    help: "Links, nomes, páginas que você gosta. Pode ser de qualquer mercado. Ajuda os agentes a entenderem a direção visual e de comunicação.",
    placeholder: "Ex: Ícaro de Carvalho (tom de voz), Hormozi (estrutura de oferta), Página do Nubank (simplicidade visual). Concorrentes: Fulano e Cicrano.",
  },
  instrucoesEspeciais: {
    question: "Alguma instrução especial? Algo que NÃO pode faltar ou que NÃO pode acontecer?",
    help: "Regras específicas: 'não falar de preço na copy', 'usar depoimentos reais', 'focar em resultados de alunos', 'não usar gatilho de escassez falsa'.",
    placeholder: "Ex: Obrigatório usar depoimentos reais (tenho 12). Não prometer resultados específicos de faturamento. Não usar 'último dia' se não for verdade. Focar em transformação, não em método.",
  },
};

const mockBriefings: BriefingData[] = [
  {
    id: "1",
    nome: "Lançamento Módulo 5",
    cliente: "Alta Cúpula",
    objetivo: "Lançar o módulo 5 com faturamento mínimo de R$200k. Campanha de 14 dias.",
    publicoAlvo: "Empreendedores digitais, 25-45 anos, que já compraram módulos anteriores.",
    dorPrincipal: "Sente que está estagnado, vendo outros crescerem enquanto ele fica no mesmo lugar.",
    desejoOculto: "Quer ser reconhecido como autoridade. Quer que as pessoas peçam conselho pra ele.",
    tomDeVoz: "Direto, autoritário mas acessível. Sem enrolação.",
    objecoes: "Já comprei outros módulos e não apliquei. Será que esse vai ser diferente?",
    referencias: "Alex Hormozi (oferta), Ícaro de Carvalho (narrativa)",
    instrucoesEspeciais: "Usar cases reais dos módulos anteriores. Não prometer resultado financeiro específico.",
    status: "ativo",
    criadoEm: "17/03/2026",
  },
  {
    id: "2",
    nome: "Black Friday 2026",
    cliente: "Alta Cúpula",
    objetivo: "Queima de estoque dos cursos antigos + upsell para mentoria.",
    publicoAlvo: "Lista fria + leads que nunca compraram.",
    dorPrincipal: "Medo de perder a oportunidade. Todo mundo comprando e ele ficando de fora.",
    desejoOculto: "Quer pertencer ao grupo dos que aproveitam. Medo de ficar pra trás.",
    tomDeVoz: "Urgente mas honesto. Sem gatilho falso.",
    objecoes: "É desconto de verdade ou é marketing?",
    referencias: "Amazon, Americanas (estilo de campanha)",
    instrucoesEspeciais: "Desconto real de 60%. Não usar 'últimas vagas' se não for verdade.",
    status: "inativo",
    criadoEm: "15/03/2026",
  },
];

const emptyBriefing: BriefingData = {
  id: "",
  nome: "",
  cliente: "",
  objetivo: "",
  publicoAlvo: "",
  dorPrincipal: "",
  desejoOculto: "",
  tomDeVoz: "",
  objecoes: "",
  referencias: "",
  instrucoesEspeciais: "",
  status: "inativo",
  criadoEm: new Date().toLocaleDateString("pt-BR"),
};

export default function BriefingPage() {
  const [briefings, setBriefings] = useState<BriefingData[]>(mockBriefings);
  const [selected, setSelected] = useState<BriefingData>(mockBriefings[0]);
  const [toast, setToast] = useState<string | null>(null);

  function selectBriefing(b: BriefingData) {
    setSelected(b);
  }

  function newBriefing() {
    const novo: BriefingData = {
      ...emptyBriefing,
      id: String(Date.now()),
      criadoEm: new Date().toLocaleDateString("pt-BR"),
    };
    setBriefings((prev) => [novo, ...prev]);
    setSelected(novo);
  }

  function updateField(field: keyof BriefingData, value: string) {
    setSelected((prev) => ({ ...prev, [field]: value }));
  }

  function saveBriefing() {
    setBriefings((prev) =>
      prev.map((b) => (b.id === selected.id ? selected : b))
    );
    setToast("Briefing salvo com sucesso!");
    setTimeout(() => setToast(null), 3000);
  }

  function activateBriefing() {
    const updated = briefings.map((b) => ({
      ...b,
      status: (b.id === selected.id ? "ativo" : "inativo") as "ativo" | "inativo",
    }));
    setBriefings(updated);
    setSelected({ ...selected, status: "ativo" });
    setToast("Briefing ativado! Os agentes vão usar este contexto.");
    setTimeout(() => setToast(null), 3000);
  }

  const fields: (keyof BriefingData)[] = [
    "nome", "cliente", "objetivo", "publicoAlvo", "dorPrincipal",
    "desejoOculto", "objecoes", "tomDeVoz", "referencias", "instrucoesEspeciais",
  ];

  const filledCount = fields.filter((f) => (selected[f] as string)?.trim()).length;
  const completionPct = Math.round((filledCount / fields.length) * 100);

  // Agents that receive the briefing
  const flowAgents = ["orion", "hormozi", "brunson", "icaro", "head-conteudo", "spark", "copy", "eagle"];

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex h-full">
        {/* Sidebar de briefings */}
        <div className="w-[280px] shrink-0 border-r border-[rgba(45,122,255,0.08)] p-4 flex flex-col gap-3">
          <button
            onClick={newBriefing}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#2D7AFF] text-white text-sm font-semibold hover:bg-[#2563EB] transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Novo Briefing
          </button>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {briefings.map((b) => (
              <button
                key={b.id}
                onClick={() => selectBriefing(b)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                  selected.id === b.id
                    ? "bg-[rgba(45,122,255,0.1)] border border-[rgba(45,122,255,0.25)]"
                    : "bg-[#0A1628] border border-transparent hover:border-[rgba(45,122,255,0.1)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white truncate">{b.nome || "Sem nome"}</span>
                  {b.status === "ativo" && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/20">
                      ATIVO
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5E7A9A]">{b.cliente || "Sem cliente"} · {b.criadoEm}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen size={20} className="text-[#2D7AFF]" />
                <h1 className="text-2xl font-bold text-white">Briefing</h1>
              </div>
              <p className="text-sm text-[#5E7A9A]">
                O cérebro da operação. Quanto mais completo, melhor os agentes trabalham.
                Sem briefing, eles não sabem pra quem estão falando.
              </p>
            </div>

            {/* Completion bar */}
            <div className="mb-8 p-4 rounded-xl bg-[#0A1628] border border-[rgba(45,122,255,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#5E7A9A] uppercase tracking-wider">
                  Completude do briefing
                </span>
                <span className={`text-sm font-bold ${completionPct === 100 ? "text-[#00E676]" : completionPct >= 60 ? "text-[#FFB300]" : "text-[#FF3B6E]"}`}>
                  {completionPct}%
                </span>
              </div>
              <div className="h-2 bg-[rgba(45,122,255,0.08)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completionPct}%`,
                    background: completionPct === 100 ? "#00E676" : completionPct >= 60 ? "#FFB300" : "#FF3B6E",
                  }}
                />
              </div>
              {completionPct < 100 && (
                <p className="text-[11px] text-[#5E7A9A] mt-2 flex items-center gap-1.5">
                  <AlertCircle size={12} className="text-[#FFB300]" />
                  {filledCount}/{fields.length} campos preenchidos. Preencha todos para máxima qualidade.
                </p>
              )}
            </div>

            {/* Formulário guiado */}
            <div className="space-y-6">
              {fields.map((field) => {
                const guide = fieldGuide[field];
                if (!guide) return null;
                const value = selected[field] as string;
                const isFilled = value?.trim().length > 0;
                const isLong = ["objetivo", "publicoAlvo", "dorPrincipal", "desejoOculto", "objecoes", "instrucoesEspeciais"].includes(field);

                return (
                  <div key={field} className="group">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isFilled ? "bg-[#00E676]/15" : "bg-[rgba(45,122,255,0.08)]"
                      }`}>
                        {isFilled ? (
                          <Check size={12} className="text-[#00E676]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#3A5068]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-semibold text-white block mb-1">
                          {guide.question}
                        </label>
                        <p className="text-[11px] text-[#5E7A9A] leading-relaxed mb-3">
                          {guide.help}
                        </p>
                      </div>
                    </div>
                    {isLong ? (
                      <textarea
                        value={value}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={guide.placeholder}
                        rows={3}
                        className="w-full bg-[#0A1628] border border-[rgba(45,122,255,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3A5068] outline-none focus:border-[#2D7AFF] focus:ring-1 focus:ring-[#2D7AFF]/20 transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={guide.placeholder}
                        className="w-full bg-[#0A1628] border border-[rgba(45,122,255,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3A5068] outline-none focus:border-[#2D7AFF] focus:ring-1 focus:ring-[#2D7AFF]/20 transition-all"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={saveBriefing}
                className="flex-1 py-3 rounded-xl bg-[#2D7AFF] text-white font-semibold hover:bg-[#2563EB] transition-colors cursor-pointer"
              >
                Salvar Briefing
              </button>
              {selected.status !== "ativo" && (
                <button
                  onClick={activateBriefing}
                  className="flex-1 py-3 rounded-xl bg-[#00E676]/10 text-[#00E676] font-semibold border border-[#00E676]/20 hover:bg-[#00E676]/20 transition-colors cursor-pointer"
                >
                  Ativar como Briefing Principal
                </button>
              )}
            </div>

            {/* Fluxo de distribuição */}
            <div className="mt-10 p-6 rounded-xl bg-[#0A1628] border border-[rgba(45,122,255,0.08)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5E7A9A] mb-4">
                Quem recebe esse briefing
              </h3>
              <p className="text-[11px] text-[#3A5068] mb-5">
                Quando ativo, esse briefing alimenta automaticamente todos os agentes na cadeia de produção.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {flowAgents.map((id, i) => {
                  const agent = agents.find((a) => a.id === id);
                  if (!agent) return null;
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[rgba(45,122,255,0.05)] border border-[rgba(45,122,255,0.08)]">
                        <AgentAvatar agentId={id} name={agent.name} color={agent.color} size={24} />
                        <span className="text-[11px] font-semibold text-white">{agent.name}</span>
                      </div>
                      {i < flowAgents.length - 1 && (
                        <ArrowRight size={14} className="text-[#3A5068]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-xl bg-[#00E676]/15 text-[#00E676] text-sm font-semibold border border-[#00E676]/20 backdrop-blur-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
