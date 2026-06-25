import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Sparkles, Send, User } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "المساعد الذكي — مستشارك للبناء" }] }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTED = [
  "كم تكلفة بناء منزل 200 متر؟",
  "كيف أختار المقاول؟",
  "ما أفضل نوع دهان؟",
  "ما الفرق بين البورسلين والسيراميك؟",
];

function mockReply(q: string): string {
  const t = q.toLowerCase();
  if (t.includes("تكلف") || t.includes("سعر") || t.includes("متر")) {
    return "تكلفة بناء منزل 200 متر مربع تختلف حسب الموقع ومستوى التشطيب:\n\n• اقتصادي: ~240,000 ر.س (1200 ر.س/م²)\n• متوسط: ~325,000 ر.س (1625 ر.س/م²)\n• فاخر: ~430,000 ر.س (2160 ر.س/م²)\n\nهذه أسعار تقريبية للهيكل والتشطيب الأساسي. أنصحك باستخدام **حاسبة التكلفة** للحصول على تقدير أدق بناءً على بياناتك.";
  }
  if (t.includes("مقاول") || t.includes("متعهد")) {
    return "اختيار المقاول المناسب من أهم قرارات البناء. إليك أهم النصائح:\n\n1. **اطلب رؤية مشاريع سابقة** مكتملة وزرها بنفسك\n2. **تحقق من الترخيص** والسجل التجاري الساري\n3. **اقرأ تقييمات العملاء** السابقين\n4. **اطلب ضمان خمسي** على الهيكل الإنشائي\n5. **اعقد عقداً مفصلاً** يحدد المدة والتكلفة وجدول الدفعات\n6. **لا تدفع كامل المبلغ مقدماً** — اربط الدفعات بمراحل الإنجاز";
  }
  if (t.includes("دهان") || t.includes("بوية") || t.includes("لون")) {
    return "أفضل أنواع الدهانات تختلف حسب الاستخدام:\n\n• **البلاستيك (الإيمولشن)**: الأنسب للجدران الداخلية، سهل التنظيف وغير لامع\n• **الزيت**: مقاوم للرطوبة، مناسب للحمامات والمطابخ\n• **الإيبوكسي**: للأرضيات والكراجات لمتانته العالية\n\n💡 نصيحة: اختر دهاناً منخفض الانبعاثات (Low VOC) خاصة لغرف النوم والأطفال.";
  }
  if (t.includes("بلاط") || t.includes("بورسلين") || t.includes("سيراميك") || t.includes("رخام")) {
    return "اختيار البلاط يعتمد على المكان:\n\n• **البورسلين**: الأقوى والأنسب للأرضيات\n• **السيراميك**: أرخص ومناسب للحوائط\n• **الرخام الطبيعي**: فاخر لكنه يحتاج عناية\n\n💡 اشترِ كمية إضافية 10٪ للهدر، وتأكد من تطابق رقم الدفعة لضمان نفس اللون.";
  }
  if (t.includes("أساس") || t.includes("خرسان")) {
    return "الأساسات هي العمود الفقري للمنزل. أنواعها الرئيسية:\n\n• **الأساسات الشريطية**: للمنازل العادية والفلل الصغيرة\n• **الأساسات المنفصلة**: تحت الأعمدة فقط\n• **اللبشة المسلحة**: للمباني الكبيرة أو التربة الضعيفة\n\n⚠️ اطلب دائماً تقرير فحص التربة قبل تصميم الأساس، ولا تتنازل عن جودة الحديد والخرسانة.";
  }
  return "شكراً على سؤالك! هذا مساعد تجريبي يقدم إجابات عامة عن البناء. للحصول على معلومات أدق:\n\n• استخدم **حاسبة التكلفة** لتقدير ميزانيتك\n• راجع **دليل البناء** للمقالات التفصيلية\n• استشر مهندساً معتمداً للقرارات الإنشائية\n\nهل لديك سؤال محدد عن التكاليف، الكميات، أو مراحل البناء؟";
}

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "أهلاً بك! 👋 أنا **مساعد البناء الذكي**. يمكنني مساعدتك في أسئلة التكاليف، اختيار المواد، النصائح الإنشائية، وأي شيء يخص بناء منزلك. كيف يمكنني مساعدتك؟" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  function send(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: "assistant", text: mockReply(q) }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  }

  return (
    <AppLayout>
      <PageHeader title="مساعد البناء الذكي" subtitle="اسأل أي سؤال يخص البناء واحصل على إجابة فورية" />

      <div className="rounded-3xl border bg-card shadow-card overflow-hidden flex flex-col" style={{ height: "calc(100vh - 240px)", minHeight: 500 }}>
        {/* Header */}
        <div className="border-b bg-gradient-to-l from-primary/5 to-secondary/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold">مساعد البناء الذكي</div>
              <div className="text-xs text-muted-foreground">جاهز للإجابة على أسئلتك</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-5">
            {messages.map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
                  <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="border-t bg-muted/30 px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => send(s)} className="rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t bg-card p-4 sm:p-5">
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="mx-auto flex max-w-3xl items-center gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="اكتب سؤالك هنا..."
              className="flex-1 rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <button type="submit" disabled={!input.trim() || typing}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant transition hover:opacity-90 disabled:opacity-50">
              <Send className="h-4 w-4 -scale-x-100" />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl shadow-elegant ${
        isUser ? "bg-gradient-secondary text-secondary-foreground" : "bg-gradient-primary text-primary-foreground"
      }`}>
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser ? "bg-gradient-primary text-primary-foreground" : "bg-muted"
      }`}>
        {msg.text.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : <span key={j}>{part}</span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${delay}ms` }} />;
}
