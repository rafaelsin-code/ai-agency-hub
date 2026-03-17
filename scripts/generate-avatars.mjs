import fs from "fs";
import path from "path";

const API_KEY = "AIzaSyBtgIqDnRY9MxZfmeuKmNePQJ78J4_Rtb0";
const MODEL = "nano-banana-pro-preview";
const OUTPUT_DIR = path.join(process.cwd(), "public/avatars");

const agents = [
  { id: "orion", name: "ORION", role: "CEO Digital", color: "#8B5CF6", vibe: "regal leader with silver-white hair, purple energy aura, commanding presence, glowing purple eyes" },
  { id: "hormozi", name: "HORMOZI", role: "Conselheiro de Ofertas", color: "#3B82F6", vibe: "muscular businessman with dark beard, intense blue eyes, confident smirk, sharp suit" },
  { id: "brunson", name: "BRUNSON", role: "Funnel Architect", color: "#3B82F6", vibe: "charming tech entrepreneur, brown hair, energetic smile, blue holographic diagrams floating around" },
  { id: "icaro", name: "ICARO", role: "Copywriter BR", color: "#3B82F6", vibe: "artistic writer with messy dark hair, thoughtful expression, pen in hand, surrounded by floating words" },
  { id: "atlas", name: "ATLAS", role: "BI Analyst", color: "#8B5CF6", vibe: "data scientist with glasses, holographic charts floating around, calm analytical expression" },
  { id: "head-vendas", name: "HEAD VENDAS", role: "Sales Director", color: "#EF4444", vibe: "aggressive sales leader, red tie, sharp jawline, red energy, pointing forward confidently" },
  { id: "head-conteudo", name: "HEAD CONTEÚDO", role: "Content Director", color: "#F97316", vibe: "creative director with orange scarf, tablet in hand, artistic background, warm lighting" },
  { id: "head-social", name: "HEAD SOCIAL", role: "Social Director", color: "#EC4899", vibe: "trendy social media expert, pink hair highlights, phone in hand, notification bubbles floating" },
  { id: "head-ads", name: "HEAD ADS", role: "Ads Director", color: "#EAB308", vibe: "data-driven marketer, yellow jacket, multiple screens behind, analytics graphs" },
  { id: "head-tecnologia", name: "HEAD TECH", role: "Tech Director", color: "#06B6D4", vibe: "cyberpunk hacker, cyan neon visor, mechanical keyboard, terminal code reflecting in eyes" },
  { id: "head-financeiro", name: "HEAD FINANCEIRO", role: "Finance Director", color: "#F59E0B", vibe: "refined accountant, gold cufflinks, calculator hologram, serious expression" },
  { id: "head-operacoes", name: "HEAD OPS", role: "Ops Director", color: "#22C55E", vibe: "organized operations manager, green clipboard, workflow diagrams behind, efficient look" },
  { id: "outbound", name: "OUTBOUND", role: "Prospecting", color: "#EF4444", vibe: "aggressive hunter with red headband, binoculars, searching expression, radar screen behind" },
  { id: "inbound", name: "INBOUND", role: "Lead Attraction", color: "#EF4444", vibe: "magnetic personality, warm smile, glowing red magnet, attracting floating leads" },
  { id: "closer", name: "CLOSER", role: "Deal Closer", color: "#EF4444", vibe: "smooth negotiator, red suit, handshake pose, confident killer instinct eyes" },
  { id: "spark", name: "SPARK", role: "Content Ideation", color: "#F97316", vibe: "energetic creative with orange lightning sparks around head, lightbulb moment, excited expression" },
  { id: "copy", name: "COPY", role: "Copywriter", color: "#F97316", vibe: "elegant writer, feather quill pen, glowing orange text floating, sophisticated binary code background" },
  { id: "storyteller", name: "STORYTELLER", role: "Scriptwriter", color: "#F97316", vibe: "dramatic narrator, flowing cape, open magical book with stories coming alive, cinematic lighting" },
  { id: "clock", name: "CLOCK", role: "Scheduling", color: "#EC4899", vibe: "precise scheduler, pink clockwork gears around, multiple timepieces, punctual robotic precision" },
  { id: "lens", name: "LENS", role: "Analytics", color: "#EC4899", vibe: "data visualizer, camera lens eye, pink holographic dashboards, analytical scanning" },
  { id: "criacao-ads", name: "ARTURO", role: "Ad Creative", color: "#EAB308", vibe: "digital artist, yellow paint splashes, creative explosion, holding digital brush, canvas of ads" },
  { id: "scale", name: "SCALE", role: "Ad Scaling", color: "#EAB308", vibe: "turbo engineer, rocket booster aesthetic, scaling graphs going up, yellow energy" },
  { id: "seo", name: "SEO", role: "SEO Expert", color: "#EAB308", vibe: "search specialist, magnifying glass, spider web of links, golden search bars" },
  { id: "traffic-engine", name: "TRAFFIC ENGINE", role: "Traffic Router", color: "#EAB308", vibe: "traffic controller, highway intersections of data, routing signals, yellow neon" },
  { id: "builder", name: "BUILDER", role: "Page Builder", color: "#06B6D4", vibe: "cyber architect, holographic building blueprints, constructing web pages, cyan tools" },
  { id: "mailer", name: "MAILER", role: "Email Marketing", color: "#06B6D4", vibe: "postal carrier futuristic, flying envelopes, cyan glow, email delivery drone" },
  { id: "integrator", name: "INTEGRATOR", role: "System Integrator", color: "#06B6D4", vibe: "connector, plugging cables, neural network behind, linking systems, cyan electricity" },
  { id: "project-manager", name: "PM", role: "Project Manager", color: "#22C55E", vibe: "organized planner, green gantt chart hologram, checklist, efficient expression" },
  { id: "client-success", name: "CLIENT SUCCESS", role: "Client Success", color: "#22C55E", vibe: "friendly advocate, green heart badge, helping hand gesture, warm supportive" },
  { id: "eagle", name: "EAGLE", role: "QA Auditor", color: "#CBD5E1", vibe: "eagle-eyed inspector, silver monocle, magnifying details, sharp piercing gaze, quality stamp" },
  { id: "sentinel", name: "SENTINEL", role: "Compliance", color: "#CBD5E1", vibe: "armored guardian, silver shield, law books floating, vigilant protective stance" },
  { id: "mirror", name: "MIRROR", role: "A/B Testing", color: "#CBD5E1", vibe: "dual reflection, split mirror showing two versions, analyzing differences, silver symmetry" },
];

async function generateAvatar(agent) {
  const outputPath = path.join(OUTPUT_DIR, `${agent.id}.png`);

  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  ${agent.name} — already exists, skipping`);
    return;
  }

  const prompt = `Create a high-quality anime-style character avatar portrait for an AI agent called "${agent.name}" (${agent.role}). Style: dark cyberpunk, professional, detailed anime art. The character should have: ${agent.vibe}. Background: very dark, almost black with subtle ${agent.color} colored ambient glow. Square format, bust/portrait shot, looking slightly at camera. High detail, clean lines, vibrant colors against dark background. Style reference: modern anime character design like in gaming UI.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ ${agent.name} — API error ${response.status}: ${errText.slice(0, 200)}`);
      return;
    }

    const data = await response.json();

    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ ${agent.name} — saved (${(buffer.length / 1024).toFixed(0)}KB)`);
        return;
      }
    }

    console.error(`⚠️  ${agent.name} — no image in response`);
  } catch (err) {
    console.error(`❌ ${agent.name} — ${err.message}`);
  }
}

async function main() {
  console.log(`\n🎨 Generating ${agents.length} avatars with Gemini ${MODEL}...\n`);

  // Process in batches of 3 to avoid rate limits
  for (let i = 0; i < agents.length; i += 3) {
    const batch = agents.slice(i, i + 3);
    await Promise.all(batch.map(generateAvatar));
    if (i + 3 < agents.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  const generated = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".png")).length;
  console.log(`\n✨ Done! ${generated}/${agents.length} avatars generated.\n`);
}

main();
