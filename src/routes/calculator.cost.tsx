import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { costs, formatMoney, type CostCalc } from "@/lib/storage";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Save, Trash2, Calculator, Building2, Hammer, Zap, Droplets } from "lucide-react";

export const Route = createFileRoute("/calculator/cost")({
  head: () => ({ meta: [{ title: "حاسبة تكلفة البناء — مستشارك للبناء" }] }),
  component: CostPage,
});

const COUNTRIES = ["السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عُمان", "مصر", "الأردن"];
const CITIES: Record<string, string[]> = {
  "السعودية": ["الرياض", "جدة", "الدمام", "مكة", "المدينة", "الطائف", "أبها"],
  "الإمارات": ["دبي", "أبوظبي", "الشارقة", "العين"],
  "الكويت": ["مدينة الكويت", "حولي", "الفروانية"],
  "قطر": ["الدوحة", "الريان", "الوكرة"],
  "البحرين": ["المنامة", "المحرق"],
  "عُمان": ["مسقط", "صلالة"],
  "مصر": ["القاهرة", "الإسكندرية", "الجيزة"],
  "الأردن": ["عمّان", "إربد"],
};

const BASE: Record<string, number> = {
  "السعودية": 1200, "الإمارات": 1400, "الكويت": 1300, "قطر": 1350,
  "البحرين": 1250, "عُمان": 1100, "مصر": 600, "الأردن": 800,
};
const LEVEL_MULT = { economy: 1.0, medium: 1.35, luxury: 1.8 };
const BREAKDOWN = { structural: 0.45, finishing: 0.35, electrical: 0.10, plumbing: 0.10 };

function calculate(country: string, area: number, floors: number, level: keyof typeof LEVEL_MULT) {
  const base = BASE[country] ?? 1200;
  const pricePerM2 = base * LEVEL_MULT[level];
  const totalArea = area * floors;
  const total = totalArea * pricePerM2;
  return {
    structural: total * BREAKDOWN.structural,
    finishing: total * BREAKDOWN.finishing,
    electrical: total * BREAKDOWN.electrical,
    plumbing: total * BREAKDOWN.plumbing,
    total,
  };
}

function CostPage() {
  const [country, setCountry] = useState("السعودية");
  const [city, setCity] = useState("الرياض");
  const [area, setArea] = useState(200);
  const [floors, setFloors] = useState(1);
  const [level, setLevel] = useState<"economy" | "medium" | "luxury">("medium");
  const [result, setResult] = useState<ReturnType<typeof calculate> | null>(null);
  const [saved, setSaved] = useState<CostCalc[]>([]);

  useEffect(() => { setSaved(costs.list()); }, []);
  useEffect(() => { setCity(CITIES[country]?.[0] || ""); }, [country]);

  function onCalc() {
    if (area <= 0 || floors <= 0) { toast.error("أدخل قيماً صحيحة"); return; }
    setResult(calculate(country, area, floors, level));
  }

  function onSave() {
    if (!result) return;
    costs.add({ country, city, area, floors, level, ...result });
    setSaved(costs.list());
    toast.success("تم حفظ الحساب");
  }

  function onDelete(id: string) {
    costs.remove(id); setSaved(costs.list()); toast.success("تم الحذف");
  }

  const chartData = result ? [
    { name: "الهيكل", value: result.structural, color: "#007AFF" },
    { name: "التشطيب", value: result.finishing, color: "#FF9500" },
    { name: "الكهرباء", value: result.electrical, color: "#34C759" },
    { name: "السباكة", value: result.plumbing, color: "#AF52DE" },
  ] : [];

  return (
    <AppLayout>
      <PageHeader title="حاسبة تكلفة البناء" subtitle="احصل على تقدير تقريبي لتكلفة بناء منزلك" />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inputs Panel */}
        <div className="lg:col-span-5 stagger-item">
          <div className="rounded-3xl bg-card p-6 shadow-sm border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-[15px] font-semibold">بيانات المشروع</div>
                <div className="text-[13px] text-muted-foreground">أدخل التفاصيل للحساب</div>
              </div>
            </div>

            <div className="space-y-5">
              <SelectField label="الدولة" value={country} onChange={setCountry} options={COUNTRIES} />
              <SelectField label="المدينة" value={city} onChange={setCity} options={CITIES[country] || []} />
              <NumberField label="المساحة (م²)" value={area} onChange={setArea} />
              <NumberField label="عدد الأدوار" value={floors} onChange={setFloors} />

              <div>
                <span className="mb-2 block text-[15px] font-medium">مستوى التشطيب</span>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { v: "economy", l: "اقتصادي", desc: "تشطيب أساسي" },
                    { v: "medium", l: "متوسط", desc: "تشطيب جيد" },
                    { v: "luxury", l: "فاخر", desc: "تشطيب عالي" },
                  ] as const).map(o => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setLevel(o.v)}
                      className={`rounded-2xl border p-3 text-center transition-all active:scale-[0.97] ${
                        level === o.v
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="text-[15px] font-semibold">{o.l}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onCalc}
                className="w-full rounded-2xl bg-primary px-5 py-4 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97]"
              >
                احسب التكلفة
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 stagger-item" style={{ animationDelay: '50ms' }}>
          {result ? (
            <div className="space-y-4">
              {/* Total Card */}
              <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-lg">
                <div className="text-[13px] opacity-80 mb-1">إجمالي التكلفة التقديرية</div>
                <div className="text-4xl font-bold tracking-tight number-highlight">{formatMoney(result.total)}</div>
                <div className="text-[13px] opacity-80 mt-2">
                  {area} م² × {floors} {floors > 1 ? "أدوار" : "طابق"} • {city}
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3">
                <BreakdownCard icon={Building2} label="الهيكل" value={result.structural} color="bg-blue-50 dark:bg-blue-950/30" iconColor="text-blue-500" />
                <BreakdownCard icon={Hammer} label="التشطيب" value={result.finishing} color="bg-orange-50 dark:bg-orange-950/30" iconColor="text-orange-500" />
                <BreakdownCard icon={Zap} label="الكهرباء" value={result.electrical} color="bg-emerald-50 dark:bg-emerald-950/30" iconColor="text-emerald-500" />
                <BreakdownCard icon={Droplets} label="السباكة" value={result.plumbing} color="bg-violet-50 dark:bg-violet-950/30" iconColor="text-violet-500" />
              </div>

              {/* Chart */}
              <div className="rounded-3xl bg-card p-5 shadow-sm border border-border/50">
                <div className="text-[15px] font-semibold mb-4">توزيع التكلفة</div>
                <div className="h-56">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                        {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => formatMoney(v)}
                        contentStyle={{ borderRadius: 16, border: "none", background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <button
                onClick={onSave}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-muted/50 px-5 py-4 text-[15px] font-semibold transition-all hover:bg-muted active:scale-[0.97]"
              >
                <Save className="h-4 w-4" />
                <span>حفظ الحساب</span>
              </button>
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-3xl bg-muted/30 border border-dashed border-border/50">
              <div className="text-center px-8">
                <Calculator className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-[15px] text-muted-foreground">
                  أدخل بياناتك واضغط "احسب التكلفة"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Calculations */}
      {saved.length > 0 && (
        <div className="mt-10 stagger-item" style={{ animationDelay: '100ms' }}>
          <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
            الحسابات المحفوظة
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map(s => (
              <div key={s.id} className="rounded-3xl bg-card p-4 shadow-sm border border-border/50 card-interactive">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[15px] font-medium">{s.area} م² • {s.floors} طابق</div>
                    <div className="text-[13px] text-muted-foreground">{s.city} • {STATUS_LEVEL[s.level]}</div>
                  </div>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 text-xl font-bold text-primary number-highlight">{formatMoney(s.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

const STATUS_LEVEL: Record<string, string> = { economy: "اقتصادي", medium: "متوسط", luxury: "فاخر" };

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-medium">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20 appearance-none"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-medium">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20"
      />
    </label>
  );
}

function BreakdownCard({ icon: Icon, label, value, color, iconColor }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  iconColor: string;
}) {
  return (
    <div className={`rounded-2xl p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold number-highlight">{formatMoney(value)}</div>
    </div>
  );
}
