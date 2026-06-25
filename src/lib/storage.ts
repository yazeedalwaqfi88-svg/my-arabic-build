// ======================================================
// CIVIL ENGINEERING PRO SYSTEM - FINAL CLEAN VERSION
// storage.ts
// ======================================================

/* =======================
   TYPES
======================= */

export type Currency = "USD" | "JOD" | "SAR" | "EUR";

export type UnitSystem = "metric" | "imperial";

export type BuildingType =
  | "residential"
  | "commercial"
  | "industrial"
  | "infrastructure";

export type ConstructionQuality =
  | "basic"
  | "standard"
  | "premium"
  | "luxury";

export type ProjectStatus =
  | "planning"
  | "design"
  | "foundation"
  | "structure"
  | "finishing"
  | "completed";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Session = {
  id: string;
  name: string;
  email: string;
};

export type AppSettings = {
  currency: Currency;
  theme: "light" | "dark";
  unit: UnitSystem;
};

/* =======================
   ENGINEERING DATA
======================= */

export type CostCalc = {
  id: string;
  createdAt: number;

  country: string;
  city: string;

  buildingType: BuildingType;

  area: number;
  floors: number;

  quality: ConstructionQuality;

  currency: Currency;

  structuralCost: number;
  finishingCost: number;
  electricalCost: number;
  plumbingCost: number;

  totalCost: number;
};

export type QuantityCalc = {
  id: string;
  createdAt: number;

  type: "concrete" | "steel" | "tile" | "paint";

  title: string;

  inputs: Record<string, number | string>;
  outputs: Record<string, number | string>;
};

export type Expense = {
  id: string;
  label: string;
  amount: number;
  date: string;
};

export type Project = {
  id: string;
  createdAt: number;

  name: string;
  location: string;

  budget: number;

  startDate: string;

  progress: number;

  status: ProjectStatus;

  quality: ConstructionQuality;

  notes: string;

  expenses: Expense[];
};

/* =======================
   STORAGE KEYS
======================= */

const K = {
  users: "ce_users",
  session: "ce_session",
  costs: "ce_costs",
  quantities: "ce_quantities",
  projects: "ce_projects",
  settings: "ce_settings",
};

/* =======================
   HELPERS
======================= */

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* =======================
   SETTINGS
======================= */

export const settings = {
  get(): AppSettings {
    return read<AppSettings>(K.settings, {
      currency: "USD",
      theme: "light",
      unit: "metric",
    });
  },

  setCurrency(currency: Currency) {
    const s = settings.get();
    write(K.settings, { ...s, currency });
  },

  setTheme(theme: "light" | "dark") {
    const s = settings.get();
    write(K.settings, { ...s, theme });
    document.documentElement.classList.toggle("dark", theme === "dark");
  },

  setUnit(unit: UnitSystem) {
    const s = settings.get();
    write(K.settings, { ...s, unit });
  },
};

/* =======================
   AUTH
======================= */

export const auth = {
  current(): Session | null {
    return read<Session | null>(K.session, null);
  },

  register(name: string, email: string, password: string): Session {
    const users = read<User[]>(K.users, []);

    if (users.some(u => u.email === email)) {
      throw new Error("Email already exists");
    }

    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    users.push(user);
    write(K.users, users);

    const session: Session = { id: user.id, name, email };
    write(K.session, session);

    return session;
  },

  login(email: string, password: string): Session {
    const users = read<User[]>(K.users, []);
    const u = users.find(x => x.email === email && x.password === password);

    if (!u) throw new Error("Invalid credentials");

    const session: Session = { id: u.id, name: u.name, email: u.email };
    write(K.session, session);

    return session;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(K.session);
    }
  },
};

/* =======================
   COST ENGINE
======================= */

export const costs = {
  list(): CostCalc[] {
    return read<CostCalc[]>(K.costs, []).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  },

  add(data: Omit<CostCalc, "id" | "createdAt" | "totalCost">): CostCalc {
    const multiplier =
      data.quality === "basic"
        ? 1
        : data.quality === "standard"
        ? 1.2
        : data.quality === "premium"
        ? 1.5
        : 2;

    const structuralCost = data.area * data.floors * 120 * multiplier;
    const finishingCost = data.area * 80 * multiplier;
    const electricalCost = data.area * 40;
    const plumbingCost = data.area * 35;

    const totalCost =
      structuralCost + finishingCost + electricalCost + plumbingCost;

    const item: CostCalc = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      structuralCost,
      finishingCost,
      electricalCost,
      plumbingCost,
      totalCost,
    };

    const all = read<CostCalc[]>(K.costs, []);
    all.push(item);
    write(K.costs, all);

    return item;
  },

  remove(id: string) {
    write(K.costs, read<CostCalc[]>(K.costs, []).filter(x => x.id !== id));
  },
};

/* =======================
   QUANTITY ENGINE
======================= */

export const quantities = {
  list(): QuantityCalc[] {
    return read<QuantityCalc[]>(K.quantities, []);
  },

  add(q: Omit<QuantityCalc, "id" | "createdAt">): QuantityCalc {
    const item: QuantityCalc = {
      ...q,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const all = read<QuantityCalc[]>(K.quantities, []);
    all.push(item);
    write(K.quantities, all);

    return item;
  },
};

/* =======================
   PROJECT ENGINE
======================= */

export const projects = {
  list(): Project[] {
    return read<Project[]>(K.projects, []).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  },

  add(p: Omit<Project, "id" | "createdAt" | "progress" | "expenses">): Project {
    const item: Project = {
      ...p,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      progress: 0,
      expenses: [],
    };

    const all = read<Project[]>(K.projects, []);
    all.push(item);
    write(K.projects, all);

    return item;
  },

  updateProgress(id: string, progress: number) {
    const all = read<Project[]>(K.projects, []);
    const p = all.find(x => x.id === id);

    if (p) {
      p.progress = progress;
      write(K.projects, all);
    }
  },
};

/* =======================
   FORMAT PRICE (CURRENCY)
======================= */

export function formatPrice(value: number): string {
  const currency = settings.get().currency;

  const map: Record<Currency, string> = {
    USD: "$",
    JOD: "د.أ",
    SAR: "ر.س",
    EUR: "€",
  };

  return `${new Intl.NumberFormat("en").format(value)} ${map[currency]}`;
}
