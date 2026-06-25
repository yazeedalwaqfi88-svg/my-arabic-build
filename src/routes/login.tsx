import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { auth } from "@/lib/storage";
import { toast } from "sonner";
import { HardHat, Mail, Lock, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — مستشارك للبناء" }] }),
  component: Login,
});

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      auth.login(email.trim(), password);
      toast.success("تم تسجيل الدخول بنجاح");
      router.navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطأ في الدخول");
    } finally { setLoading(false); }
  }

  return <AuthShell title="مرحباً بعودتك" subtitle="سجّل دخولك لمتابعة مشاريعك">
    <form onSubmit={onSubmit} className="space-y-4">
      <Field icon={Mail} type="email" label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field icon={Lock} type="password" label="كلمة المرور" value={password} onChange={setPassword} placeholder="••••••••" />
      <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition hover:opacity-90 disabled:opacity-60">
        {loading ? "..." : "دخول"} <ArrowLeft className="h-4 w-4" />
      </button>
      <div className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟ <Link to="/register" className="font-semibold text-primary hover:underline">سجّل الآن</Link>
      </div>
    </form>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5 font-bold">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <HardHat className="h-5 w-5" />
          </span>
          <span className="text-lg">مستشارك للبناء</span>
        </Link>
        <div className="rounded-3xl border bg-card p-7 shadow-elegant sm:p-8">
          <h1 className="text-2xl font-black">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <Link to="/" className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground">← العودة للرئيسية</Link>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, label, type, value, onChange, placeholder }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; type: string; value: string; placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type} required value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border bg-background px-4 py-3 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </label>
  );
}
