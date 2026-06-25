// Local storage helpers for auth, calculations, projects
export type User = { id: string; name: string; email: string; password: string };
export type Session = { id: string; name: string; email: string };

export type CostCalc = {
  id: string; createdAt: number; country: string; city: string; area: number; floors: number;
  level: "economy" | "medium" | "luxury";
  structural: number; finishing: number; electrical: number; plumbing: number; total: number;
};

export type QuantityCalc = {
  id: string; createdAt: number; type: "tile" | "paint" | "concrete";
  title: string; inputs: Record<string, number | string>; outputs: Record<string, number | string>;
};

export type Project = {
  id: string; createdAt: number; name: string; location: string; budget: number;
  startDate: string; progress: number; status: ProjectStatus;
  notes: string; expenses: { id: string; label: string; amount: number; date: string }[];
};

export type ProjectStatus = "planning" | "foundation" | "construction" | "finishing" | "completed";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: "تخطيط",
  foundation: "أساسات",
  construction: "بناء",
  finishing: "تشطيب",
  completed: "مكتمل",
};

const K = {
  users: "mb_users",
  session: "mb_session",
  costs: "mb_costs",
  quantities: "mb_quantities",
  projects: "mb_projects",
  theme: "mb_theme",
};

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; }
  catch { return fallback; }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
}

export const auth = {
  current(): Session | null { return read<Session | null>(K.session, null); },
  register(name: string, email: string, password: string): Session {
    const users = read<User[]>(K.users, []);
    if (users.some(u => u.email === email)) throw new Error("هذا البريد مسجل مسبقاً");
    const user: User = { id: crypto.randomUUID(), name, email, password };
    users.push(user); write(K.users, users);
    const s: Session = { id: user.id, name, email }; write(K.session, s);
    return s;
  },
  login(email: string, password: string): Session {
    const users = read<User[]>(K.users, []);
    const u = users.find(x => x.email === email && x.password === password);
    if (!u) throw new Error("بيانات الدخول غير صحيحة");
    const s: Session = { id: u.id, name: u.name, email: u.email }; write(K.session, s);
    return s;
  },
  logout() { if (typeof window !== "undefined") localStorage.removeItem(K.session); },
};

export const costs = {
  list(): CostCalc[] { return read<CostCalc[]>(K.costs, []).sort((a, b) => b.createdAt - a.createdAt); },
  add(c: Omit<CostCalc, "id" | "createdAt">): CostCalc {
    const item: CostCalc = { ...c, id: crypto.randomUUID(), createdAt: Date.now() };
    const all = read<CostCalc[]>(K.costs, []); all.push(item); write(K.costs, all);
    return item;
  },
  remove(id: string) { write(K.costs, read<CostCalc[]>(K.costs, []).filter(x => x.id !== id)); },
};

export const quantities = {
  list(): QuantityCalc[] { return read<QuantityCalc[]>(K.quantities, []).sort((a, b) => b.createdAt - a.createdAt); },
  add(q: Omit<QuantityCalc, "id" | "createdAt">): QuantityCalc {
    const item: QuantityCalc = { ...q, id: crypto.randomUUID(), createdAt: Date.now() };
    const all = read<QuantityCalc[]>(K.quantities, []); all.push(item); write(K.quantities, all);
    return item;
  },
  remove(id: string) { write(K.quantities, read<QuantityCalc[]>(K.quantities, []).filter(x => x.id !== id)); },
};

export const projects = {
  list(): Project[] { return read<Project[]>(K.projects, []).sort((a, b) => b.createdAt - a.createdAt); },
  get(id: string) { return projects.list().find(p => p.id === id); },
  add(p: Omit<Project, "id" | "createdAt" | "progress" | "status" | "notes" | "expenses">): Project {
    const item: Project = { ...p, id: crypto.randomUUID(), createdAt: Date.now(), progress: 0, status: "planning", notes: "", expenses: [] };
    const all = read<Project[]>(K.projects, []); all.push(item); write(K.projects, all);
    return item;
  },
  update(id: string, patch: Partial<Project>) {
    const all = read<Project[]>(K.projects, []);
    const i = all.findIndex(p => p.id === id);
    if (i >= 0) { all[i] = { ...all[i], ...patch }; write(K.projects, all); }
  },
  remove(id: string) { write(K.projects, read<Project[]>(K.projects, []).filter(p => p.id !== id)); },
};

export const theme = {
  get(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(K.theme) as "light" | "dark") || "light";
  },
  set(t: "light" | "dark") {
    if (typeof window === "undefined") return;
    localStorage.setItem(K.theme, t);
    document.documentElement.classList.toggle("dark", t === "dark");
  },
  toggle() { theme.set(theme.get() === "dark" ? "light" : "dark"); },
};

export function formatSAR(n: number): string {
  return new Intl.NumberFormat("ar", { maximumFractionDigits: 0 }).format(Math.round(n)) + " ر.س";
}
export function formatNum(n: number, digits = 0): string {
  return new Intl.NumberFormat("ar", { maximumFractionDigits: digits }).format(n);
}
