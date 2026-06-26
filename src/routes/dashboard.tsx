import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { costs, projects, quantities, auth, formatMoney, STATUS_LABEL, type CostCalc, type Project, type QuantityCalc } from "@/lib/storage";
import { Calculator, Ruler, FolderKanban, Plus, TrendingUp, Wallet, Hammer, ArrowLeft, ChevronLeft, Sparkles } from "lucide-react";

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
  const avgProgress = data.projs.length ? Math.round(data.projs.reduce((s, p) => s + p.progress, 0) / data.projs.length) : 0;

  const stats = [
    { label: "إجمالي الميزانيات", value: formatMoney(totalBudget), icon: Wallet, color: "bg-blue-50 dark:bg-blue-950/30", iconColor: "text-blue-600 dark:text-blue-400" },
    { label: "مشاريع نشطة", value: activeProjs.toString(), icon: Hammer, color: "bg-orange-50 dark:bg-orange-950/30", iconColor: "text-orange-600 dark:text-orange-400" },
    { label: "حسابات محفوظة", value: totalCalcs.toString(), icon: Calculator, color: "bg-emerald-50 dark:bg-emerald-950/30", iconColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "متوسط الإنجاز", value: avgProgress ? `${avgProgress}٪` : "—", icon: TrendingUp, color: "bg-violet-50 dark:bg-violet-950/30", iconColor: "text-violet-600 dark:text-violet-400" },
  ];

  return (
    <AppLayout>
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-[15px] text-muted-foreground">أهلاً بك 👋</p>
        <h1 className="text-display-lg mt-1">{data.name || "صديقي"}</h1>
      </div>

      {/* Stats Cards - iOS Wallet Style */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="stagger-item rounded-3xl bg-card p-5 shadow-sm border border-border/50 card-interactive"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`mb-3 grid h-10 w-10 place-items-center rounded-2xl ${s.color}`}>
                <Icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <div className="text-[13px] text-muted-foreground mb-0.5">{s.label}</div>
              <div className="text-xl font-bold tracking-tight number-highlight">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions - Large Cards */}
      <div className="mb-8">
        <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <QuickAction to="/projects" icon={Plus} title="مشروع جديد" gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
          <QuickAction to="/calculator/cost" icon={Calculator} title="حساب تكلفة" gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" />
          <QuickAction to="/calculator/quantity" icon={Ruler} title="الكميات" gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Calculations */}
        <div className="stagger-item" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
              آخر الحسابات
            </h2>
            {data.costs.length > 0 && (
              <span className="text-primary text-[13px] font-medium">الكل</span>
            )}
          </div>
          <SectionCard>
            {data.costs.length === 0 && data.quants.length === 0 ? (
              <EmptyState icon={Calculator} text="لم تقم بأي حساب بعد" />
            ) : (
              <div className="divide-y divide-border/50">
                {[...data.costs.slice(0, 3).map(c => ({
                  id: c.id, title: `${c.area} م²`, sub: c.city || c.country, value: formatMoney(c.total), type: "calc"
                })), ...data.quants.slice(0, 2).map(q => ({
                  id: q.id, title: q.title, sub: "حاسبة كميات", value: "", type: "quant"
                }))].slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 place-items-center rounded-xl ${item.type === 'calc' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-orange-50 dark:bg-orange-950/30'}`}>
                        {item.type === 'calc' ? (
                          <Calculator className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Ruler className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-[15px] font-medium">{item.title}</div>
                        <div className="text-[13px] text-muted-foreground">{item.sub}</div>
                      </div>
                    </div>
                    {item.value && (
                      <div className="text-[15px] font-semibold number-highlight">{item.value}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Recent Projects */}
        <div className="stagger-item" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
              المشاريع
            </h2>
            <Link to="/projects" className="text-primary text-[13px] font-medium">
              عرض الكل
            </Link>
          </div>
          <SectionCard>
            {data.projs.length === 0 ? (
              <EmptyState icon={FolderKanban} text="لا توجد مشاريع بعد" />
            ) : (
              <div className="divide-y divide-border/50">
                {data.projs.slice(0, 4).map((p) => (
                  <Link key={p.id} to="/projects" className="block py-3 first:pt-0 last:pb-0 transition-colors hover:bg-muted/30 -mx-4 px-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[15px] font-medium">{p.name}</div>
                      <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {STATUS_LABEL[p.status]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[13px] text-muted-foreground mb-2">
                      <span>{p.location}</span>
                      <span className="font-medium text-foreground">{formatMoney(p.budget)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* AI Assistant Promo */}
      <div className="mt-8 stagger-item" style={{ animationDelay: '300ms' }}>
        <Link
          to="/assistant"
          className="flex items-center gap-4 rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-md card-interactive"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">المساعد الذكي</div>
            <div className="text-[13px] opacity-80">اسأل أي سؤال واحصل على إجابة فورية</div>
          </div>
          <ChevronLeft className="h-5 w-5 opacity-60" />
        </Link>
      </div>
    </AppLayout>
  );
}

function QuickAction({ to, icon: Icon, title, gradient }: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  gradient: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center gap-3 rounded-3xl bg-card p-4 shadow-sm border border-border/50 card-interactive"
    >
      <div className={`grid h-12 w-12 place-items-center rounded-2xl ${gradient} text-white shadow-md transition-transform group-active:scale-95`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[13px] font-medium text-center">{title}</span>
    </Link>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-sm border border-border/50">
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="py-8 text-center">
      <Icon className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
      <p className="text-[15px] text-muted-foreground">{text}</p>
    </div>
  );
}
