import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, Ruler, FolderKanban, BookOpen, Sparkles, HardHat, ChevronLeft, CircleCheck as CheckCircle2, Building2, Hammer, Star } from "lucide-react";

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
  { icon: Calculator, title: "حاسبة تكلفة البناء", desc: "احصل على تقدير دقيق لتكلفة بناء منزلك", gradient: "bg-gradient-to-br from-blue-500 to-blue-600" },
  { icon: Ruler, title: "حاسبة الكميات", desc: "احسب كميات البلاط، الدهان، والخرسانة", gradient: "bg-gradient-to-br from-orange-500 to-orange-600" },
  { icon: FolderKanban, title: "متابعة المشروع", desc: "تابع مراحل البناء والمصروفات", gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600" },
  { icon: BookOpen, title: "دليل البناء", desc: "مقالات ونصائح من خبراء البناء", gradient: "bg-gradient-to-br from-violet-500 to-violet-600" },
  { icon: Sparkles, title: "المساعد الذكي", desc: "إجابات فورية لأسئلة البناء", gradient: "bg-gradient-to-br from-amber-500 to-amber-600" },
  { icon: Building2, title: "تجربة مبسطة", desc: "واجهة عربية سهلة الاستخدام", gradient: "bg-gradient-to-br from-cyan-500 to-cyan-600" },
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
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 font-semibold">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary shadow-md">
              <HardHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-[17px]">مستشارك للبناء</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[15px] font-medium md:flex">
            <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">المميزات</a>
            <a href="#testimonials" className="text-muted-foreground transition-colors hover:text-foreground">آراء العملاء</a>
            <Link to="/guide" className="text-muted-foreground transition-colors hover:text-foreground">الدليل</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-2xl px-5 py-2.5 text-[15px] font-medium transition-colors hover:bg-muted sm:inline-flex"
            >
              دخول
            </Link>
            <Link
              to="/register"
              className="rounded-2xl bg-primary px-5 py-2.5 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97]"
            >
              ابدأ الآن
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-[13px] font-medium shadow-sm border border-border/50">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span>منصة عربية شاملة لمشاريع البناء</span>
              </div>

              <h1 className="mt-8 text-display-xl">
                ابنِ منزلك <span className="text-primary">بثقة</span>
              </h1>

              <p className="mt-5 text-body-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                احسب التكاليف والكميات وتابع مشروع البناء بسهولة — من مرحلة التخطيط حتى تسليم المفتاح.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97]"
                >
                  ابدأ الآن مجاناً
                  <ChevronLeft className="h-4 w-4" />
                </Link>
                <Link
                  to="/calculator/cost"
                  className="inline-flex items-center gap-2 rounded-2xl bg-card px-7 py-4 text-[15px] font-semibold shadow-sm border border-border/50 transition-all active:scale-[0.97]"
                >
                  <Calculator className="h-4 w-4" />
                  احسب التكلفة
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[15px] text-muted-foreground lg:justify-start">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  مجاني بالكامل
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  بدون خبرة هندسية
                </span>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="animate-float rounded-3xl bg-card p-6 shadow-lg border border-border/50">
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-5">
                  <div>
                    <div className="text-[13px] text-muted-foreground">مشروع فيلا الرياض</div>
                    <div className="mt-1 text-xl font-bold number-highlight">٣٠٠ متر مربع</div>
                  </div>
                  <span className="rounded-full bg-success/15 px-3 py-1.5 text-[13px] font-medium text-success">قيد التنفيذ</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "هيكل", v: "٤٢٠,٠٠٠" },
                    { l: "تشطيب", v: "٣١٥,٠٠٠" },
                    { l: "كهرباء", v: "٧٥,٠٠٠" },
                    { l: "سباكة", v: "٦٠,٠٠٠" },
                  ].map((x, i) => (
                    <div key={i} className="rounded-2xl bg-muted/50 p-4">
                      <div className="text-[11px] text-muted-foreground mb-1">{x.l}</div>
                      <div className="text-lg font-bold number-highlight">{x.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-primary p-5 text-primary-foreground">
                  <div className="text-[13px] opacity-80">إجمالي التكلفة التقديرية</div>
                  <div className="mt-1 text-2xl font-bold">٨٧٠,٠٠٠ ر.س</div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[65%] rounded-full bg-white/90" />
                  </div>
                  <div className="mt-2 text-[12px] opacity-80">نسبة الإنجاز ٦٥٪</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { v: "+12K", l: "عائلة استخدمت التطبيق" },
              { v: "+8K", l: "مشروع تم تتبعه" },
              { v: "98٪", l: "نسبة رضا العملاء" },
              { v: "+50", l: "مقال ودليل" },
            ].map((s, i) => (
              <div key={i} className="text-center stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="text-3xl font-bold text-primary">{s.v}</div>
                <div className="mt-1 text-[15px] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-[13px] font-medium">
            <Hammer className="h-4 w-4" />
            كل ما تحتاجه في مكان واحد
          </span>
          <h2 className="mt-5 text-display-md">مميزات تجعل البناء أسهل</h2>
          <p className="mt-3 text-body-md text-muted-foreground">أدوات احترافية مصممة خصيصاً لك، حتى لو لم تكن مهندساً.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group rounded-3xl bg-card p-6 shadow-sm border border-border/50 card-interactive stagger-item"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${f.gradient} text-white shadow-md`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-[17px] font-semibold">{f.title}</h3>
                <p className="mt-2 text-[15px] text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-display-md">يثق بنا الآلاف</h2>
            <p className="mt-3 text-body-md text-muted-foreground">قصص حقيقية من عائلات بنت منازل أحلامها معنا.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-3xl bg-card p-6 shadow-sm border border-border/50 stagger-item"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex gap-1 text-secondary">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold">{t.name}</div>
                    <div className="text-[13px] text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-lg lg:p-14">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-display-md">جاهز لبناء منزل أحلامك؟</h2>
          <p className="relative mt-3 text-[17px] opacity-90">ابدأ اليوم مجاناً وخطط لمشروعك بثقة كاملة.</p>
          <Link
            to="/register"
            className="relative mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-primary shadow-md transition-all active:scale-[0.97]"
          >
            أنشئ حساباً مجانياً
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 font-semibold">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary shadow-md">
                  <HardHat className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-[17px]">مستشارك للبناء</span>
              </div>
              <p className="mt-4 max-w-sm text-[15px] text-muted-foreground">
                منصة عربية متكاملة تساعدك على حساب وتخطيط ومتابعة مشروع بناء منزلك بكل ثقة.
              </p>
            </div>
            <div>
              <div className="mb-4 text-[15px] font-semibold">المنصة</div>
              <ul className="space-y-3 text-[15px] text-muted-foreground">
                <li><Link to="/calculator/cost" className="transition-colors hover:text-foreground">حاسبة التكلفة</Link></li>
                <li><Link to="/calculator/quantity" className="transition-colors hover:text-foreground">حاسبة الكميات</Link></li>
                <li><Link to="/projects" className="transition-colors hover:text-foreground">إدارة المشاريع</Link></li>
                <li><Link to="/guide" className="transition-colors hover:text-foreground">دليل البناء</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-4 text-[15px] font-semibold">الحساب</div>
              <ul className="space-y-3 text-[15px] text-muted-foreground">
                <li><Link to="/login" className="transition-colors hover:text-foreground">تسجيل الدخول</Link></li>
                <li><Link to="/register" className="transition-colors hover:text-foreground">إنشاء حساب</Link></li>
                <li><Link to="/assistant" className="transition-colors hover:text-foreground">المساعد الذكي</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6 text-[13px] text-muted-foreground">
            <div>&copy; {new Date().getFullYear()} مستشارك للبناء. جميع الحقوق محفوظة.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
