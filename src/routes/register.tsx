import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { auth } from "@/lib/storage";
import { toast } from "sonner";
import { User, Mail, Lock } from "lucide-react";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب جديد — مستشارك للبناء" },
      { name: "description", content: "أنشئ حساباً مجانياً في مستشارك للبناء لحفظ حساباتك، تتبّع مشاريعك، والوصول إلى دليل البناء." },
      { property: "og:title", content: "إنشاء حساب — مستشارك للبناء" },
      { property: "og:description", content: "ابدأ مجاناً وخطّط لبناء منزلك خطوة بخطوة." },
      { property: "og:url", content: "https://my-arabic-build.lovable.app/register" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
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
      toast.success("تم إنشاء الحساب بنجاح!");
      router.navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطأ في التسجيل");
    } finally { setLoading(false); }
  }

  return (
    <AuthShell title="ابدأ رحلتك معنا" subtitle="أنشئ حساباً مجانياً وابدأ بتخطيط مشروعك">
      <form onSubmit={onSubmit} className="space-y-5">
        <Field icon={User} type="text" label="الاسم الكامل" value={name} onChange={setName} placeholder="أحمد محمد" />
        <Field icon={Mail} type="email" label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field icon={Lock} type="password" label="كلمة المرور" value={password} onChange={setPassword} placeholder="6 أحرف على الأقل" />
        <button
          disabled={loading}
          className="w-full rounded-2xl bg-primary px-5 py-4 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97] disabled:opacity-50"
        >
          {loading ? "..." : "إنشاء الحساب"}
        </button>
        <div className="text-center text-[15px] text-muted-foreground pt-2">
          لديك حساب؟{" "}
          <Link to="/login" className="font-semibold text-primary">
            تسجيل الدخول
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
