import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { auth } from "@/lib/storage";
import { toast } from "sonner";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "إنشاء حساب — مستشارك للبناء" }] }),
  component: Register,
});

function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) { toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setLoading(true);
    try {
      auth.register(name.trim(), email.trim(), password);
      toast.success("تم إنشاء الحساب بنجاح! 🎉");
      router.navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطأ في التسجيل");
    } finally { setLoading(false); }
  }

  return <AuthShell title="ابدأ رحلتك معنا" subtitle="أنشئ حساباً مجانياً وابدأ بتخطيط مشروعك">
    <form onSubmit={onSubmit} className="space-y-4">
      <Field icon={User} type="text" label="الاسم الكامل" value={name} onChange={setName} placeholder="أحمد محمد" />
      <Field icon={Mail} type="email" label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field icon={Lock} type="password" label="كلمة المرور" value={password} onChange={setPassword} placeholder="6 أحرف على الأقل" />
      <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition hover:opacity-90 disabled:opacity-60">
        {loading ? "..." : "إنشاء الحساب"} <ArrowLeft className="h-4 w-4" />
      </button>
      <div className="text-center text-sm text-muted-foreground">
        لديك حساب؟ <Link to="/login" className="font-semibold text-primary hover:underline">سجّل الدخول</Link>
      </div>
    </form>
  </AuthShell>;
}
