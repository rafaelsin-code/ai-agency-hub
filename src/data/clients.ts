export interface Client {
  id: string;
  name: string;
  status: "online" | "offline" | "away";
  color: string;
}

export const clients: Client[] = [
  { id: "super-aprendizagem", name: "Super Aprendizagem", status: "online", color: "#3B82F6" },
  { id: "alta-cupula", name: "Alta Cupula", status: "offline", color: "#EF4444" },
  { id: "mario-trentim", name: "Mario Trentim", status: "online", color: "#22C55E" },
];
