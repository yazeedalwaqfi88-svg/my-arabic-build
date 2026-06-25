import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { auth, theme } from "@/lib/storage";
import {
  LayoutDashboard, Calculator, Ruler, FolderKanban, BookOpen, Sparkles,
  LogOut, Moon, Sun, Menu, X, HardHat,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/calculator/cost", label: "حاسبة التكلفة", icon: Calculator },
  { to: "/calculator/quantity", label: "حاسبة الكميات", icon: Ruler },
  { to: "/projects", label: "مشاريعي", icon: FolderKanban },
  { to: "/guide", label: "دليل البناء", icon: BookOpen },
  { to: "/assistant", label: "المساعد الذكي", icon: Sparkles },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const s = auth.current();
    if (!s) { router.navigate({ to: "/login" }); return; }
    setUser(s);
    const t = theme.get();
    setIsDark(t === "dark");
    document.documentElement.classList.toggle("dark", t === "dark");
  }, [router]);

  const path = router.state.location.pathname;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-card/80 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <HardHat className="h-5 w-5" />
          </span>
          <span className="text-base">مستشارك للبناء</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 hover:bg-muted" aria-label="القائمة">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-72 transform border-l bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="hidden items-center gap-3 border-b px-6 py-5 lg:flex">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <HardHat className="h-6 w-6" />
              </span>
              <div>
                <div className="text-base font-bold leading-tight">مستشارك للبناء</div>
                <div className="text-xs text-muted-foreground">شريكك في رحلة البناء</div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              {NAV.map(item => {
                const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      active
                        ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t p-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent px-3 py-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-secondary text-secondary-foreground text-sm font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{user.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { theme.toggle(); setIsDark(!isDark); }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {isDark ? "فاتح" : "داكن"}
                </button>
                <button
                  onClick={() => { auth.logout(); router.navigate({ to: "/login" }); }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> خروج
                </button>
              </div>
            </div>
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
        )}

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
