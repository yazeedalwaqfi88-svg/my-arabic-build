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
        <TileCalc onSaved={refresh} />
        <PaintCalc onSaved={refresh} />
        <ConcreteCalc onSaved={refresh} />
      </div>

      {saved.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold">الحسابات المحفوظة</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map(s => (
              <div key={s.id} className="rounded-2xl border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold">{s.title}</div>
                    <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      {Object.entries(s.outputs).map(([k, v]) => (
                        <div key={k}>{k}: <span className="font-semibold text-foreground">{String(v)}</span></div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => onDelete(s.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
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

function CalcCard({ icon: Icon, title, color, children }: { icon: React.ComponentType<{ className?: string }>; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${color} text-white shadow-elegant`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function NumberField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative">
        <input type="number" min={0} value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        {suffix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}

function Output({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-primary">{value}</span>
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
      type: "tile", title: `بلاط — ${formatNum(area, 1)} م²`,
      inputs: { length, width, tile },
      outputs: { "المساحة": formatNum(area, 1) + " م²", "عدد البلاط": formatNum(tilesNeeded) + " قطعة", "هدر": "10٪" },
    });
    onSaved(); toast.success("تم الحفظ");
  }
  return (
    <CalcCard icon={Grid3x3} title="حاسبة البلاط" color="bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="space-y-3">
        <NumberField label="الطول" value={length} onChange={setLength} suffix="م" />
        <NumberField label="العرض" value={width} onChange={setWidth} suffix="م" />
        <NumberField label="مقاس البلاط (ضلع المربع)" value={tile} onChange={setTile} suffix="م" />
        <div className="space-y-1.5 border-t pt-3">
          <Output label="المساحة" value={formatNum(area, 1) + " م²"} />
          <Output label="عدد البلاط" value={formatNum(tilesNeeded) + " قطعة"} />
          <Output label="نسبة الهدر" value="10٪" />
        </div>
        <button onClick={save} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant hover:opacity-90">
          <Save className="h-4 w-4" /> حفظ
        </button>
      </div>
    </CalcCard>
  );
}

function PaintCalc({ onSaved }: { onSaved: () => void }) {
  const [wallArea, setWallArea] = useState(100);
  const [coats, setCoats] = useState(2);
  const pricePerLiter = 35;
  const coverage = 10; // m² per liter per coat
  const liters = coverage > 0 ? (wallArea * coats) / coverage : 0;
  const cost = liters * pricePerLiter;
  function save() {
    quantities.add({
      type: "paint", title: `دهان — ${wallArea} م²`,
      inputs: { wallArea, coats },
      outputs: { "كمية الدهان": formatNum(liters, 1) + " لتر", "التكلفة التقديرية": formatSAR(cost) },
    });
    onSaved(); toast.success("تم الحفظ");
  }
  return (
    <CalcCard icon={Paintbrush} title="حاسبة الدهان" color="bg-gradient-to-br from-orange-500 to-orange-700">
      <div className="space-y-3">
        <NumberField label="مساحة الجدران" value={wallArea} onChange={setWallArea} suffix="م²" />
        <NumberField label="عدد الطبقات" value={coats} onChange={setCoats} />
        <div className="space-y-1.5 border-t pt-3">
          <Output label="كمية الدهان" value={formatNum(liters, 1) + " لتر"} />
          <Output label="التكلفة التقديرية" value={formatSAR(cost)} />
        </div>
        <button onClick={save} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant hover:opacity-90">
          <Save className="h-4 w-4" /> حفظ
        </button>
      </div>
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
      type: "concrete", title: `خرسانة — ${formatNum(volume, 2)} م³`,
      inputs: { length, width, thickness },
      outputs: { "حجم الخرسانة": formatNum(volume, 2) + " م³" },
    });
    onSaved(); toast.success("تم الحفظ");
  }
  return (
    <CalcCard icon={Layers} title="حاسبة الخرسانة" color="bg-gradient-to-br from-emerald-500 to-emerald-700">
      <div className="space-y-3">
        <NumberField label="الطول" value={length} onChange={setLength} suffix="م" />
        <NumberField label="العرض" value={width} onChange={setWidth} suffix="م" />
        <NumberField label="السماكة" value={thickness} onChange={setThickness} suffix="م" />
        <div className="space-y-1.5 border-t pt-3">
          <Output label="حجم الخرسانة" value={formatNum(volume, 2) + " م³"} />
        </div>
        <button onClick={save} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant hover:opacity-90">
          <Save className="h-4 w-4" /> حفظ
        </button>
      </div>
    </CalcCard>
  );
}
