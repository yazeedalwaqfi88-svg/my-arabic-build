import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Search, BookOpen, Lightbulb, X, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "دليل البناء — نصائح ومقالات لبناء منزلك" },
      { name: "description", content: "مكتبة مقالات بالعربية تغطي مراحل البناء الثلاث: ما قبل البدء، أثناء التنفيذ، ومرحلة التشطيب — مع نصائح عملية." },
      { property: "og:title", content: "دليل البناء — مستشارك للبناء" },
      { property: "og:description", content: "مقالات ونصائح لكل مراحل بناء المنزل بأسلوب مبسّط." },
      { property: "og:url", content: "https://my-arabic-build.lovable.app/guide" },
    ],
    links: [{ rel: "canonical", href: "https://my-arabic-build.lovable.app/guide" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "دليل البناء",
          url: "https://my-arabic-build.lovable.app/guide",
          inLanguage: "ar",
          description: "مكتبة مقالات ونصائح لمراحل بناء المنزل قبل وأثناء وبعد التنفيذ.",
        }),
      },
    ],
  }),
  component: GuidePage,
});

type Article = {
  id: string;
  category: "before" | "during" | "finishing";
  title: string;
  summary: string;
  content: string;
  tips: string[];
};

const CATEGORIES = {
  before: { label: "قبل البناء", gradient: "bg-gradient-to-br from-blue-500 to-blue-600" },
  during: { label: "أثناء البناء", gradient: "bg-gradient-to-br from-orange-500 to-orange-600" },
  finishing: { label: "التشطيب", gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600" },
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

      {/* Search & Filters */}
      <div className="rounded-3xl bg-card shadow-sm border border-border/50 p-5 stagger-item">
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="ابحث في المقالات..."
            className="w-full rounded-2xl border border-input bg-background py-3.5 pr-12 pl-4 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>الكل</FilterChip>
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map(k => (
            <FilterChip key={k} active={cat === k} onClick={() => setCat(k)}>
              {CATEGORIES[k].label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setOpen(a)}
            className="group rounded-3xl bg-card p-5 shadow-sm border border-border/50 text-right card-interactive stagger-item"
            style={{ animationDelay: `${(i + 1) * 50}ms` }}
          >
            <div className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium text-white ${CATEGORIES[a.category].gradient}`}>
              {CATEGORIES[a.category].label}
            </div>
            <h3 className="text-[17px] font-semibold">{a.title}</h3>
            <p className="mt-2 text-[15px] text-muted-foreground line-clamp-2">{a.summary}</p>
            <div className="mt-4 flex items-center gap-1 text-[13px] font-medium text-primary">
              <span>اقرأ المزيد</span>
              <ChevronLeft className="h-4 w-4" />
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-3xl bg-muted/30 py-14 border border-dashed border-border/50">
            <BookOpen className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-[15px] text-muted-foreground">لا توجد مقالات مطابقة</p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4 glass-overlay animate-fade-in"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card shadow-xl animate-scale-in"
          >
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-border/50 bg-card px-6 py-4">
              <div>
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium text-white ${CATEGORIES[open.category].gradient}`}>
                  {CATEGORIES[open.category].label}
                </div>
                <h2 className="mt-2 text-xl font-semibold">{open.title}</h2>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="grid h-10 w-10 place-items-center rounded-2xl text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[15px] text-muted-foreground leading-relaxed">{open.summary}</p>
              <div className="mt-6 rounded-2xl bg-muted/50 p-5 text-[15px] leading-relaxed">{open.content}</div>

              <div className="mt-6 rounded-2xl bg-muted/30 p-5">
                <div className="flex items-center gap-2 text-[15px] font-semibold mb-4">
                  <Lightbulb className="h-4 w-4 text-secondary" />
                  نصائح مهمة
                </div>
                <ul className="space-y-3">
                  {open.tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-3 text-[15px]">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-2 text-[13px] font-medium transition-all active:scale-[0.97] ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted/50 hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
