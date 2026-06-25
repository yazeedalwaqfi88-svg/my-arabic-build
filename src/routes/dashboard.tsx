import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { costs, projects, quantities, auth, formatSAR, STATUS_LABEL, type CostCalc, type Project, type QuantityCalc } from "@/lib/storage";
import { Calculator, Ruler, FolderKanban, Plus, TrendingUp, Wallet, Hammer, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "الرئيسية — مستشارك للبناء" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState<{ costs: CostCalc[]; quants: QuantityCalc[]; projs: Project[]; name: string }>({
    costs: [], quants: [], projs: [], name: "",
  });

  useEffect(() => {
    const s = auth.current();
    setData({ costs: costs.list(), quants: quantities.list(), projs: projects.list(), name: s?.name || "" });
  }, []);

  const totalBudget = data.projs.reduce((s, p) => s + (p.budget || 0), 0);
  const activeProjs = data.projs.filter(p => p.status !== "completed").length;
  const totalCalcs = data.costs.length + data.quants.length;

  const stats = [
    { label: "إجمالي الميزانيات", value: formatSAR(totalBudget), icon: Wallet, color: "from-blue-500 to-blue-700" },
    { label: "مشاريع نشطة", value: String(activeProjs), icon: Hammer, color: "from-orange-500 to-orange-700" },
    { label: "حسابات محفوظة", value: String(totalCalcs), icon: Calculator, color: "from-emerald-500 to-emerald-700" },
    { label: "نسبة الإنجاز", value: data.projs.length ? Math.round(data.projs.reduce((s, p) => s + p.progress, 0) / data.projs.length) + "٪" : "—", icon: TrendingUp, color: "from-violet-500 to-violet-700" },
  ];

  return (
    <AppLayout>
      <PageHeader title={`أهلاً، ${data.name || "صديقي"} 👋`} subtitle="إليك نظرة سريعة على مشاريعك وحساباتك" />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-2xl border bg-gradient-card p-5 shadow-card">
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-elegant`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-2xl font-black">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold">إجراءات سريعة</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickAction to="/projects" icon={Plus} title="مشروع جديد" desc="ابدأ بتتبع مشروع بناء" />
          <QuickAction to="/calculator/cost" icon={Calculator} title="حساب تكلفة" desc="قدّر تكلفة البناء" />
          <QuickAction to="/calculator/quantity" icon={Ruler} title="حساب كميات" desc="بلاط، دهان، خرسانة" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent calcs */}
        <Section title="آخر الحسابات" emptyText="لم تقم بأي حساب بعد" empty={!data.costs.length && !data.quants.length}>
          {[...data.costs.slice(0, 3).map(c => ({
            id: c.id, title: `حاسبة تكلفة — ${c.area} م²`, sub: `${c.city || c.country} • ${STATUS_LEVEL[c.level]}`,
            value: formatSAR(c.total), date: c.createdAt,
          })), ...data.quants.slice(0, 3).map(q => ({
            id: q.id, title: q.title, sub: "حاسبة كميات", value: "", date: q.createdAt,
          }))].sort((a, b) => b.date - a.date).slice(0, 5).map(item => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{item.title}</div>
                <div className="truncate text-xs text-muted-foreground">{item.sub}</div>
              </div>
              {item.value && <div className="shrink-0 text-sm font-bold text-primary">{item.value}</div>}
            </div>
          ))}
        </Section>

        {/* Recent projects */}
        <Section title="آخر المشاريع" emptyText="لا توجد مشاريع بعد" empty={!data.projs.length}
          action={<Link to="/projects" className="text-xs font-semibold text-primary hover:underline">عرض الكل ←</Link>}>
          {data.projs.slice(0, 4).map(p => (
            <Link key={p.id} to="/projects" className="block rounded-xl border bg-card p-4 transition hover:bg-muted/50">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">{p.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{p.location} • {formatSAR(p.budget)}</div>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${p.progress}%` }} />
              </div>
            </Link>
          ))}
        </Section>
      </div>
    </AppLayout>
  );
}

const STATUS_LEVEL: Record<string, string> = { economy: "اقتصادي", medium: "متوسط", luxury: "فاخر" };

function QuickAction({ to, icon: Icon, title, desc }: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <Link to={to} className="group flex items-center gap-4 rounded-2xl border bg-gradient-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <ArrowLeft className="h-4 w-4 text-muted-foreground transition group-hover:-translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

function Section({ title, children, empty, emptyText, action }: { title: string; children: React.ReactNode; empty?: boolean; emptyText?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold">{title}</h3>
        {action}
      </div>
      {empty ? (
        <div className="rounded-xl border-2 border-dashed py-10 text-center text-sm text-muted-foreground">
          <FolderKanban className="mx-auto mb-2 h-8 w-8 opacity-40" />
          {emptyText}
        </div>
      ) : <div className="space-y-2.5">{children}</div>}
    </div>
  );
}
