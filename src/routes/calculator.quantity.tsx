import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { quantities, formatNum, formatSAR, type QuantityCalc } from "@/lib/storage";
import { toast } from "sonner";
import { Save, Trash2, Grid3x3, Paintbrush, Layers } from "lucide-react";

export const Route = createFileRoute("/calculator/quantity")({
  head: () => ({ meta: [{ title: "حاسبة الكميات — مستشارك للبناء" }] }),
  component: QuantityPage,
});

function QuantityPage() {
  const [saved, setSaved] = useState<QuantityCalc[]>([]);
  useEffect(() => { setSaved(quantities.list()); }, []);

  function refresh() { setSaved(quantities.list()); }
  function onDelete(id: string) { quantities.remove(id); refresh(); toast.success("تم الحذف"); }

  return (
    <AppLayout>
      <PageHeader title="حاسبة الكميات" subtitle="احسب احتياجاتك من البلاط، الدهان، والخرسانة بدقة" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="stagger-item">
          <TileCalc onSaved={refresh} />
        </div>
        <div className="stagger-item" style={{ animationDelay: '50ms' }}>
          <PaintCalc onSaved={refresh} />
        </div>
        <div className="stagger-item" style={{ animationDelay: '100ms' }}>
          <ConcreteCalc onSaved={refresh} />
        </div>
      </div>

      {saved.length > 0 && (
        <div className="mt-10 stagger-item" style={{ animationDelay: '150ms' }}>
          <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
            الحسابات المحفوظة
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map(s => (
              <div key={s.id} className="rounded-3xl bg-card p-4 shadow-sm border border-border/50 card-interactive">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-medium">{s.title}</div>
                    <div className="mt-2 space-y-1">
                      {Object.entries(s.outputs).slice(0, 2).map(([k, v]) => (
                        <div key={k} className="text-[13px] text-muted-foreground">
                          {k}: <span className="font-semibold text-foreground">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function CalcCard({ icon: Icon, title, gradient, children }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-card shadow-sm border border-border/50 overflow-hidden">
      <div className={`flex items-center gap-3 p-4 ${gradient}`}>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-[15px] font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

function NumberField({ label, value, onChange, suffix }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium">{label}</span>
      <div className="relative">
        <input
          type="number"
          min={0}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20"
        />
        {suffix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Output({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${highlight ? 'bg-primary/10' : 'bg-muted/50'}`}>
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className={`text-[15px] font-semibold number-highlight ${highlight ? 'text-primary' : ''}`}>{value}</span>
    </div>
  );
}

function TileCalc({ onSaved }: { onSaved: () => void }) {
  const [length, setLength] = useState(5);
  const [width, setWidth] = useState(4);
  const [tile, setTile] = useState(0.6);
  const area = length * width;
  const waste = 0.10;
  const tilesNeeded = tile > 0 ? Math.ceil((area / (tile * tile)) * (1 + waste)) : 0;

  function save() {
    if (area <= 0) return;
    quantities.add({
      type: "tile",
      title: `بلاط — ${formatNum(area, 1)} م²`,
      inputs: { length, width, tile },
      outputs: { "المساحة": formatNum(area, 1) + " م²", "عدد البلاط": formatNum(tilesNeeded) + " قطعة", "هدر": "10٪" },
    });
    onSaved();
    toast.success("تم الحفظ");
  }

  return (
    <CalcCard icon={Grid3x3} title="حاسبة البلاط" gradient="bg-gradient-to-br from-blue-500 to-blue-600">
      <NumberField label="الطول" value={length} onChange={setLength} suffix="م" />
      <NumberField label="العرض" value={width} onChange={setWidth} suffix="م" />
      <NumberField label="مقاس البلاط" value={tile} onChange={setTile} suffix="م" />

      <div className="space-y-2 pt-2">
        <Output label="المساحة" value={formatNum(area, 1) + " م²"} />
        <Output label="عدد البلاط" value={formatNum(tilesNeeded) + " قطعة"} highlight />
        <Output label="نسبة الهدر" value="10٪" />
      </div>

      <button
        onClick={save}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all active:scale-[0.97]"
      >
        <Save className="h-4 w-4" />
        <span>حفظ</span>
      </button>
    </CalcCard>
  );
}

function PaintCalc({ onSaved }: { onSaved: () => void }) {
  const [wallArea, setWallArea] = useState(100);
  const [coats, setCoats] = useState(2);
  const pricePerLiter = 35;
  const coverage = 10;
  const liters = coverage > 0 ? (wallArea * coats) / coverage : 0;
  const cost = liters * pricePerLiter;

  function save() {
    quantities.add({
      type: "paint",
      title: `دهان — ${wallArea} م²`,
      inputs: { wallArea, coats },
      outputs: { "كمية الدهان": formatNum(liters, 1) + " لتر", "التكلفة التقديرية": formatSAR(cost) },
    });
    onSaved();
    toast.success("تم الحفظ");
  }

  return (
    <CalcCard icon={Paintbrush} title="حاسبة الدهان" gradient="bg-gradient-to-br from-orange-500 to-orange-600">
      <NumberField label="مساحة الجدران" value={wallArea} onChange={setWallArea} suffix="م²" />
      <NumberField label="عدد الطبقات" value={coats} onChange={setCoats} />

      <div className="space-y-2 pt-2">
        <Output label="كمية الدهان" value={formatNum(liters, 1) + " لتر"} />
        <Output label="التكلفة التقديرية" value={formatSAR(cost)} highlight />
      </div>

      <button
        onClick={save}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all active:scale-[0.97]"
      >
        <Save className="h-4 w-4" />
        <span>حفظ</span>
      </button>
    </CalcCard>
  );
}

function ConcreteCalc({ onSaved }: { onSaved: () => void }) {
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(8);
  const [thickness, setThickness] = useState(0.15);
  const volume = length * width * thickness;

  function save() {
    quantities.add({
      type: "concrete",
      title: `خرسانة — ${formatNum(volume, 2)} م³`,
      inputs: { length, width, thickness },
      outputs: { "حجم الخرسانة": formatNum(volume, 2) + " م³" },
    });
    onSaved();
    toast.success("تم الحفظ");
  }

  return (
    <CalcCard icon={Layers} title="حاسبة الخرسانة" gradient="bg-gradient-to-br from-emerald-500 to-emerald-600">
      <NumberField label="الطول" value={length} onChange={setLength} suffix="م" />
      <NumberField label="العرض" value={width} onChange={setWidth} suffix="م" />
      <NumberField label="السماكة" value={thickness} onChange={setThickness} suffix="م" />

      <div className="space-y-2 pt-2">
        <Output label="حجم الخرسانة" value={formatNum(volume, 2) + " م³"} highlight />
      </div>

      <button
        onClick={save}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all active:scale-[0.97]"
      >
        <Save className="h-4 w-4" />
        <span>حفظ</span>
      </button>
    </CalcCard>
  );
}
