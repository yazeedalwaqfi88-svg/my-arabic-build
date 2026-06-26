import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { auth, theme } from "@/lib/storage";
import {
  LayoutDashboard, Calculator, Ruler, FolderKanban, BookOpen, Sparkles,
  LogOut, Moon, Sun, Menu, X, HardHat, ChevronLeft, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomTabBar } from "./BottomTabBar";

const NAV = [
  { to: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/calculator/cost", label: "حاسبة التكلفة", icon: Calculator },
  { to: "/calculator/quantity", label: "حاسبة الكميات", icon: Ruler },
  { to: "/projects", label: "مشاريعي", icon: FolderKanban },
  { to: "/guide", label: "دليل البناء", icon: BookOpen },
  { to: "/assistant", label: "المساعد الذكي", icon: Sparkles },
  { to: "/settings", label: "الإعدادات", icon: Settings },
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
      {/* iOS-style navigation bar for mobile */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 px-5 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 font-semibold">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-sm">
              <HardHat className="h-[18px] w-[18px] text-primary-foreground" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">مستشارك</span>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-muted/50 transition-colors active:scale-95"
            aria-label="القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Slide-out sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-80 transform border-l border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:w-72",
            open ? "translate-x-0 shadow-2xl" : "translate-x-full lg:shadow-none",
          )}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="hidden items-center gap-4 px-6 py-6 lg:flex">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-md">
                <HardHat className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-semibold tracking-tight">مستشارك للبناء</div>
                <div className="text-[13px] text-muted-foreground">شريكك في رحلة البناء</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-1">
                {NAV.map((item) => {
                  const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-all duration-200",
                        active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-sidebar-foreground hover:bg-sidebar-accent active:scale-[0.98]",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                      {active && (
                        <div className="mr-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* User profile section */}
            <div className="border-t border-sidebar-border p-4 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-secondary text-secondary-foreground text-sm font-bold shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-semibold">{user.name}</div>
                  <div className="truncate text-[13px] text-muted-foreground">{user.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { theme.toggle(); setIsDark(!isDark); }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-muted/50 px-4 py-3 text-[15px] font-medium transition-all active:scale-[0.97] hover:bg-muted"
                >
                  {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                  <span>{isDark ? "فاتح" : "داكن"}</span>
                </button>
                <button
                  onClick={() => { auth.logout(); router.navigate({ to: "/login" }); }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-[15px] font-medium text-destructive transition-all active:scale-[0.97] hover:bg-destructive/20"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>خروج</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {open && (
          <div
            className="fixed inset-0 z-40 glass-overlay lg:hidden animate-fade-in"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      <BottomTabBar />
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 page-enter">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-display-lg text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1.5 text-body-md text-muted-foreground max-w-md">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
