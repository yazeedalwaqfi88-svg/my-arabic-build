import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { costs, formatSAR, type CostCalc } from "@/lib/storage";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Save, Trash2, Calculator } from "lucide-react";

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

// Base price per m² (SAR) by country & level — structural baseline
const BASE: Record<string, number> = {
  "السعودية": 1200, "الإمارات": 1400, "الكويت": 1300, "قطر": 1350,
  "البحرين": 1250, "عُمان": 1100, "مصر": 600, "الأردن": 800,
};
const LEVEL_MULT = { economy: 1.0, medium: 1.35, luxury: 1.8 };
// Breakdown ratios from total
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
    { name: "الهيكل", value: result.structural, color: "var(--chart-1)" },
    { name: "التشطيب", value: result.finishing, color: "var(--chart-2)" },
    { name: "الكهرباء", value: result.electrical, color: "var(--chart-3)" },
    { name: "السباكة", value: result.plumbing, color: "var(--chart-5)" },
  ] : [];

  return (
    <AppLayout>
      <PageHeader title="حاسبة تكلفة البناء" subtitle="احصل على تقدير تقريبي لتكلفة بناء منزلك" />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <div className="rounded-2xl border bg-card p-6 shadow-card lg:col-span-2">
          <h2 className="mb-5 flex items-center gap-2 text-base font-bold">
            <Calculator className="h-4 w-4 text-primary" /> بيانات المشروع
          </h2>
          <div className="space-y-4">
            <Select label="الدولة" value={country} onChange={setCountry} options={COUNTRIES} />
            <Select label="المدينة" value={city} onChange={setCity} options={CITIES[country] || []} />
            <Number label="المساحة (متر مربع)" value={area} onChange={setArea} />
            <Number label="عدد الأدوار" value={floors} onChange={setFloors} />
            <div>
              <span className="mb-1.5 block text-sm font-medium">مستوى التشطيب</span>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: "economy", l: "اقتصادي" },
                  { v: "medium", l: "متوسط" },
                  { v: "luxury", l: "فاخر" },
                ] as const).map(o => (
                  <button key={o.v} type="button" onClick={() => setLevel(o.v)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      level === o.v ? "border-primary bg-gradient-primary text-primary-foreground shadow-elegant" : "bg-card hover:bg-muted"
                    }`}>{o.l}</button>
                ))}
              </div>
            </div>
            <button onClick={onCalc} className="w-full rounded-xl bg-gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-elegant hover:opacity-90">
              احسب التكلفة
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {result ? (
            <div className="space-y-5">
              <div className="rounded-2xl bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
                <div className="text-sm opacity-90">إجمالي التكلفة التقديرية</div>
                <div className="mt-1 text-4xl font-black">{formatSAR(result.total)}</div>
                <div className="mt-2 text-xs opacity-90">{area} م² × {floors} أدوار • {city}</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ResultCard label="تكلفة الهيكل" value={result.structural} color="bg-blue-500/10 text-blue-600" />
                <ResultCard label="تكلفة التشطيب" value={result.finishing} color="bg-orange-500/10 text-orange-600" />
                <ResultCard label="تكلفة الكهرباء" value={result.electrical} color="bg-emerald-500/10 text-emerald-600" />
                <ResultCard label="تكلفة السباكة" value={result.plumbing} color="bg-violet-500/10 text-violet-600" />
              </div>
              <div className="rounded-2xl border bg-card p-5 shadow-card">
                <h3 className="mb-3 text-sm font-bold">توزيع التكلفة</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                        {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatSAR(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <button onClick={onSave} className="flex w-full items-center justify-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-bold hover:bg-muted">
                <Save className="h-4 w-4" /> حفظ الحساب
              </button>
            </div>
          ) : (
            <div className="grid h-full place-items-center rounded-2xl border-2 border-dashed p-10 text-center">
              <div>
                <Calculator className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">أدخل بياناتك واضغط "احسب التكلفة" لعرض النتائج</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved */}
      {saved.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold">الحسابات المحفوظة</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map(s => (
              <div key={s.id} className="rounded-2xl border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{s.area} م² • {s.floors} طابق</div>
                    <div className="truncate text-xs text-muted-foreground">{s.city} • {STATUS_LEVEL[s.level]}</div>
                  </div>
                  <button onClick={() => onDelete(s.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 text-lg font-black text-primary">{formatSAR(s.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

const STATUS_LEVEL: Record<string, string> = { economy: "اقتصادي", medium: "متوسط", luxury: "فاخر" };

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Number({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input type="number" min={0} value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}

function ResultCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card">
      <div className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold ${color}`}>{label}</div>
      <div className="mt-2 text-xl font-black">{formatSAR(value)}</div>
    </div>
  );
}
