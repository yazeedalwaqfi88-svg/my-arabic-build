import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calculator, Ruler, FolderKanban, BookOpen, Sparkles, HardHat,
  ArrowLeft, CheckCircle2, Building2, Hammer, Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مستشارك للبناء — احسب وخطط وتابع مشروع بناء منزلك" },
      { name: "description", content: "تطبيق عربي شامل لحساب تكاليف البناء، الكميات، ومتابعة مشروع منزلك خطوة بخطوة." },
      { property: "og:title", content: "مستشارك للبناء" },
      { property: "og:description", content: "ابنِ منزلك بثقة. احسب التكاليف والكميات وتابع مشروع البناء بسهولة." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Calculator, title: "حاسبة تكلفة البناء", desc: "احصل على تقدير دقيق لتكلفة بناء منزلك بناءً على الموقع والمساحة ومستوى التشطيب.", color: "from-blue-500 to-blue-700" },
  { icon: Ruler, title: "حاسبة الكميات", desc: "احسب كميات البلاط، الدهان، والخرسانة التي تحتاجها بدقة دون أخطاء.", color: "from-orange-500 to-orange-700" },
  { icon: FolderKanban, title: "متابعة المشروع", desc: "تابع مراحل البناء، المصروفات، ونسبة الإنجاز في مكان واحد منظم.", color: "from-emerald-500 to-emerald-700" },
  { icon: BookOpen, title: "دليل البناء", desc: "مقالات ونصائح من خبراء البناء لإرشادك في كل مرحلة من مراحل المشروع.", color: "from-violet-500 to-violet-700" },
  { icon: Sparkles, title: "المساعد الذكي", desc: "اسأل أي سؤال يخص البناء واحصل على إجابات فورية ومفيدة من مساعدنا الذكي.", color: "from-amber-500 to-amber-700" },
  { icon: Building2, title: "تجربة مبسطة", desc: "واجهة عربية سهلة الاستخدام مصممة للجميع، لا تحتاج خبرة هندسية مسبقة.", color: "from-pink-500 to-pink-700" },
];

const TESTIMONIALS = [
  { name: "أحمد العتيبي", role: "مالك منزل، الرياض", text: "ساعدني التطبيق على فهم تكاليف البناء قبل التوقيع مع المقاول. وفّر علي آلاف الريالات!", rating: 5 },
  { name: "سارة المطيري", role: "تخطط لبناء فيلا", text: "حاسبة الكميات أنقذتني من شراء بلاط زائد. التصميم بسيط ومريح جداً.", rating: 5 },
  { name: "محمد الزهراني", role: "صاحب مشروع جديد", text: "أتابع كل مصروفاتي ومراحل البناء من جوالي. أفضل تطبيق عربي في هذا المجال.", rating: 5 },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
              <HardHat className="h-5 w-5" />
            </span>
            <span className="text-lg">مستشارك للبناء</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">المميزات</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground">آراء العملاء</a>
            <Link to="/guide" className="text-muted-foreground hover:text-foreground">الدليل</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted sm:inline-flex">دخول</Link>
            <Link to="/register" className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90">
              ابدأ الآن
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-32">
          <div className="text-center lg:text-right">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              منصة عربية شاملة لمشاريع البناء
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              ابنِ منزلك <span className="text-gradient-primary">بثقة</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg lg:text-xl">
              احسب التكاليف والكميات وتابع مشروع البناء بسهولة — من مرحلة التخطيط حتى تسليم المفتاح.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-elegant transition hover:opacity-90 hover:shadow-glow">
                ابدأ الآن مجاناً <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link to="/calculator/cost" className="inline-flex items-center gap-2 rounded-xl border-2 bg-card px-6 py-3.5 text-sm font-bold transition hover:bg-muted">
                <Calculator className="h-4 w-4" /> احسب التكلفة
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> مجاني بالكامل</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> بدون خبرة هندسية</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> باللغة العربية</span>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="animate-float rounded-3xl border bg-gradient-card p-6 shadow-elegant">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="text-xs text-muted-foreground">مشروع فيلا الرياض</div>
                  <div className="mt-1 text-lg font-bold">٣٠٠ متر مربع</div>
                </div>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">قيد التنفيذ</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { l: "هيكل", v: "٤٢٠,٠٠٠", c: "bg-blue-500/10 text-blue-600" },
                  { l: "تشطيب", v: "٣١٥,٠٠٠", c: "bg-orange-500/10 text-orange-600" },
                  { l: "كهرباء", v: "٧٥,٠٠٠", c: "bg-emerald-500/10 text-emerald-600" },
                  { l: "سباكة", v: "٦٠,٠٠٠", c: "bg-violet-500/10 text-violet-600" },
                ].map((x, i) => (
                  <div key={i} className="rounded-2xl border bg-card p-4">
                    <div className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold ${x.c}`}>{x.l}</div>
                    <div className="mt-2 text-lg font-extrabold">{x.v}</div>
                    <div className="text-[11px] text-muted-foreground">ريال سعودي</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-gradient-primary p-4 text-primary-foreground shadow-elegant">
                <div className="text-xs opacity-90">إجمالي التكلفة التقديرية</div>
                <div className="mt-1 text-2xl font-black">٨٧٠,٠٠٠ ر.س</div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-[65%] rounded-full bg-white/80" />
                </div>
                <div className="mt-1.5 text-[11px] opacity-90">نسبة الإنجاز ٦٥٪</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            { v: "+12K", l: "عائلة استخدمت التطبيق" },
            { v: "+8K", l: "مشروع تم تتبعه" },
            { v: "٩٨٪", l: "نسبة رضا العملاء" },
            { v: "+50", l: "مقال ودليل" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-gradient-primary sm:text-4xl">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground">
            <Hammer className="h-3.5 w-3.5" /> كل ما تحتاجه في مكان واحد
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">مميزات تجعل البناء أسهل</h2>
          <p className="mt-3 text-muted-foreground">أدوات احترافية مصممة خصيصاً لك، حتى لو لم تكن مهندساً.</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="group relative overflow-hidden rounded-2xl border bg-gradient-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-elegant`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">يثق بنا الآلاف</h2>
            <p className="mt-3 text-muted-foreground">قصص حقيقية من عائلات بنت منازل أحلامها معنا.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl border bg-card p-6 shadow-card">
                <div className="flex gap-0.5 text-secondary">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed">«{t.text}»</p>
                <div className="mt-6 flex items-center gap-3 border-t pt-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-elegant sm:p-16">
          <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-3xl font-black sm:text-4xl">جاهز لبناء منزل أحلامك؟</h2>
          <p className="relative mt-3 text-white/90">ابدأ اليوم مجاناً وخطط لمشروعك بثقة كاملة.</p>
          <Link to="/register" className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-elegant transition hover:bg-white/90">
            أنشئ حساباً مجانياً <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 font-bold">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
                  <HardHat className="h-5 w-5" />
                </span>
                <span className="text-lg">مستشارك للبناء</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                منصة عربية متكاملة تساعدك على حساب وتخطيط ومتابعة مشروع بناء منزلك بكل ثقة.
              </p>
            </div>
            <div>
              <div className="mb-3 text-sm font-bold">المنصة</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/calculator/cost" className="hover:text-foreground">حاسبة التكلفة</Link></li>
                <li><Link to="/calculator/quantity" className="hover:text-foreground">حاسبة الكميات</Link></li>
                <li><Link to="/projects" className="hover:text-foreground">إدارة المشاريع</Link></li>
                <li><Link to="/guide" className="hover:text-foreground">دليل البناء</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-sm font-bold">الحساب</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground">تسجيل الدخول</Link></li>
                <li><Link to="/register" className="hover:text-foreground">إنشاء حساب</Link></li>
                <li><Link to="/assistant" className="hover:text-foreground">المساعد الذكي</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground">
            <div>© {new Date().getFullYear()} مستشارك للبناء. جميع الحقوق محفوظة.</div>
            <div>صُنع بحب لمساعدتك على بناء منزل أحلامك 🏠</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
