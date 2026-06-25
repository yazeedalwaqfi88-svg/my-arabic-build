import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { auth } from "@/lib/storage";
import { toast } from "sonner";
import { HardHat, Mail, Lock, ChevronLeft } from "lucide-react";

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

  return (
    <AuthShell title="مرحباً بعودتك" subtitle="سجّل دخولك لمتابعة مشاريعك">
      <form onSubmit={onSubmit} className="space-y-5">
        <Field icon={Mail} type="email" label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field icon={Lock} type="password" label="كلمة المرور" value={password} onChange={setPassword} placeholder="••••••••" />
        <button
          disabled={loading}
          className="w-full rounded-2xl bg-primary px-5 py-4 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97] disabled:opacity-50"
        >
          {loading ? "..." : "تسجيل الدخول"}
        </button>
        <div className="text-center text-[15px] text-muted-foreground pt-2">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="font-semibold text-primary">
            إنشاء حساب
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Gradient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[300px] w-[300px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        {/* Logo */}
        <Link to="/" className="mb-10 flex items-center justify-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-primary shadow-lg">
            <HardHat className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-right">
            <div className="text-xl font-bold tracking-tight">مستشارك للبناء</div>
            <div className="text-[13px] text-muted-foreground">شريكك في رحلة البناء</div>
          </div>
        </Link>

        {/* Card */}
        <div className="rounded-3xl bg-card p-7 shadow-sm border border-border/50 animate-scale-in">
          <h1 className="text-display-md">{title}</h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        {/* Back Link */}
        <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-[15px] text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, label, type, value, onChange, placeholder }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-medium">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          required
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-input bg-background px-5 py-3.5 pr-12 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20"
        />
      </div>
    </label>
  );
}
