import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Search, BookOpen, Lightbulb, X } from "lucide-react";

export const Route = createFileRoute("/guide")({
  head: () => ({ meta: [{ title: "دليل البناء — مستشارك للبناء" }] }),
  component: GuidePage,
});

type Article = {
  id: string; category: "before" | "during" | "finishing";
  title: string; summary: string; content: string; tips: string[];
};

const CATEGORIES = {
  before: { label: "قبل البناء", color: "bg-blue-500/10 text-blue-600" },
  during: { label: "أثناء البناء", color: "bg-orange-500/10 text-orange-600" },
  finishing: { label: "التشطيب", color: "bg-emerald-500/10 text-emerald-600" },
} as const;

const ARTICLES: Article[] = [
  {
    id: "1", category: "before", title: "كيف تختار أرض البناء المناسبة",
    summary: "خطوات اختيار قطعة الأرض المثالية لبناء منزلك بعيداً عن المشاكل المستقبلية.",
    content: "اختيار الأرض هو القرار الأهم في رحلة البناء. تأكد من توفر الخدمات (كهرباء، ماء، صرف صحي)، اطلع على المخطط الهيكلي للمنطقة، وتحقق من الصك العقاري ووجود أي ارتفاقات. اختر موقعاً قريباً من المدارس والخدمات الأساسية.",
    tips: ["تأكد من خلو الأرض من أي نزاعات قانونية", "افحص طبيعة التربة قبل الشراء", "تحقق من ارتفاع البناء المسموح به في المنطقة", "تجنب الأراضي في المناطق المنخفضة لتفادي تجمع الأمطار"],
  },
  {
    id: "2", category: "before", title: "ميزانية البناء: كيف تخطط بذكاء",
    summary: "كيف تحدد ميزانية واقعية لمشروع البناء وتتجنب التكاليف المخفية.",
    content: "ضع ميزانية تشمل: ثمن الأرض، الرسوم الحكومية، أتعاب المكتب الهندسي، تكلفة البناء، التشطيب، الأثاث، واحتفظ بـ 15-20٪ كاحتياطي للطوارئ. لا تنسى تكاليف العداد والربط بالخدمات.",
    tips: ["خصص 15-20٪ كميزانية احتياطية", "احصل على 3 عروض على الأقل من المقاولين", "وثّق كل مصروف من اليوم الأول", "تجنب التمويل الكامل بالقروض"],
  },
  {
    id: "3", category: "before", title: "اختيار المكتب الهندسي والمقاول",
    summary: "معايير اختيار المكتب الهندسي والمقاول لضمان جودة وسلامة البناء.",
    content: "اطلب رؤية مشاريع سابقة، تحقق من التراخيص والسجل التجاري، اقرأ تقييمات العملاء السابقين، وتأكد من وجود عقد واضح يحدد المدة والتكلفة وجدول الدفعات وضمان العيوب الخفية.",
    tips: ["لا تدفع كامل المبلغ مقدماً", "اطلب ضمان خمسي على الهيكل", "تأكد من تأمين المقاول ضد حوادث العمل", "حدد جدول دفعات مرتبط بمراحل الإنجاز"],
  },
  {
    id: "4", category: "during", title: "أساسات قوية: بداية المنزل المتين",
    summary: "أنواع الأساسات وأهمية فحص التربة قبل البدء.",
    content: "نوع الأساس يعتمد على طبيعة التربة وحجم المنزل. الأساسات الشريطية مناسبة للمنازل العادية، بينما تحتاج المباني الكبيرة لأساسات متشعبة (لبشة). لا تتنازل عن جودة الحديد والخرسانة في هذه المرحلة.",
    tips: ["اطلب تقرير فحص التربة قبل التصميم", "تأكد من جودة الحديد ومطابقته للمواصفات", "راقب صب الخرسانة بنفسك", "احرص على المعالجة بالماء لمدة 7 أيام"],
  },
  {
    id: "5", category: "during", title: "متابعة المقاول: نصائح لمالك المنزل",
    summary: "كيف تتابع مراحل البناء بفعالية حتى لو لم تكن مهندساً.",
    content: "زر الموقع بانتظام، التقط صوراً يومية، اطلب تقارير أسبوعية مكتوبة، استعن بمهندس استشاري للزيارات الدورية، ولا توافق على أي تغيير دون توثيقه كتابياً مع التكلفة الإضافية.",
    tips: ["صور كل مرحلة بالتاريخ والوقت", "احتفظ بنسخ من فواتير المواد", "لا توافق على تعديل دون عقد إضافي", "افحص جودة المواد قبل تركيبها"],
  },
  {
    id: "6", category: "finishing", title: "اختيار البلاط: الأنواع والاستخدامات",
    summary: "دليل عملي لاختيار البلاط المناسب لكل غرفة في منزلك.",
    content: "البورسلين الأفضل للأرضيات لمتانته، السيراميك مناسب للحوائط، الرخام الطبيعي فاخر لكنه يحتاج عناية. للحمامات اختر بلاطاً غير قابل للانزلاق، وللمطابخ اختر سهل التنظيف ومقاوماً للبقع.",
    tips: ["اشترِ 10٪ زيادة للهدر والإصلاحات المستقبلية", "تأكد من نفس رقم الدفعة لتطابق الألوان", "اختر مقاسات أكبر للغرف الواسعة", "للحمامات: درجة مقاومة انزلاق R10 أو أعلى"],
  },
  {
    id: "7", category: "finishing", title: "أنواع الدهانات وأيها الأفضل",
    summary: "الفرق بين دهانات البلاستيك والزيت والإيبوكسي ومتى تستخدم كلاً منها.",
    content: "دهان البلاستيك (الإيمولشن) الأكثر استخداماً للجدران الداخلية لسهولة تنظيفه. دهانات الزيت للحمامات والمطابخ لمقاومتها للرطوبة. الإيبوكسي للأرضيات والكراجات. اختر دهاناً صديقاً للبيئة (Low VOC) خاصة لغرف الأطفال.",
    tips: ["استخدم بطانة (برايمر) قبل الدهان الأساسي", "طبقتان كحد أدنى للحصول على لون متجانس", "اختر دهانات مقاومة للعفن للحمامات", "اختبر اللون على جزء صغير قبل الدهان الكامل"],
  },
  {
    id: "8", category: "finishing", title: "تكييف المنزل: مركزي أم سبليت؟",
    summary: "مقارنة بين أنظمة التكييف لاختيار الأنسب لمنزلك وميزانيتك.",
    content: "التكييف المركزي أجمل من الناحية الجمالية ويوزع البرودة بانتظام، لكن تكلفته أعلى ويحتاج صيانة دورية. السبليت أرخص ويسهل صيانته، ويسمح بالتحكم في كل غرفة على حدة. اختر حسب الميزانية وعدد الغرف.",
    tips: ["احسب الحمل الحراري بدقة قبل اختيار القدرة", "اختر أجهزة موفرة للطاقة (Inverter)", "اعتنِ بعزل الأسقف لتقليل استهلاك التكييف", "نظف الفلاتر شهرياً"],
  },
];

function GuidePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Article["category"]>("all");
  const [open, setOpen] = useState<Article | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return ARTICLES.filter(a => (cat === "all" || a.category === cat) &&
      (!qq || a.title.toLowerCase().includes(qq) || a.summary.toLowerCase().includes(qq)));
  }, [q, cat]);

  return (
    <AppLayout>
      <PageHeader title="دليل البناء" subtitle="مقالات ونصائح من خبراء البناء لمساعدتك في كل مرحلة" />

      <div className="rounded-2xl border bg-card p-4 shadow-card">
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث في المقالات..."
            className="w-full rounded-xl border bg-background py-2.5 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>الكل</FilterChip>
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map(k => (
            <FilterChip key={k} active={cat === k} onClick={() => setCat(k)}>{CATEGORIES[k].label}</FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(a => (
          <button key={a.id} onClick={() => setOpen(a)} className="group text-right rounded-2xl border bg-gradient-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
            <div className={`inline-block rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${CATEGORIES[a.category].color}`}>
              {CATEGORIES[a.category].label}
            </div>
            <h3 className="mt-3 text-base font-bold leading-snug">{a.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{a.summary}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              اقرأ المزيد ←
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-2 text-sm text-muted-foreground">لا توجد مقالات مطابقة</p>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div onClick={e => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border bg-card p-7 shadow-elegant">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className={`inline-block rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${CATEGORIES[open.category].color}`}>
                  {CATEGORIES[open.category].label}
                </div>
                <h2 className="mt-2 text-xl font-black">{open.title}</h2>
              </div>
              <button onClick={() => setOpen(null)} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{open.summary}</p>
            <div className="mt-5 rounded-2xl bg-muted/40 p-4 text-sm leading-relaxed">{open.content}</div>
            <div className="mt-5 rounded-2xl border bg-gradient-card p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Lightbulb className="h-4 w-4 text-secondary" /> نصائح مهمة
              </div>
              <ul className="space-y-2">
                {open.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
      active ? "border-primary bg-gradient-primary text-primary-foreground shadow-elegant" : "hover:bg-muted"
    }`}>{children}</button>
  );
}
