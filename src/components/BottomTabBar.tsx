import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Calculator, Ruler, FolderKanban, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/calculator/cost", label: "التكلفة", icon: Calculator },
  { to: "/calculator/quantity", label: "الكميات", icon: Ruler },
  { to: "/projects", label: "مشاريعي", icon: FolderKanban },
  { to: "/assistant", label: "المساعد", icon: Sparkles },
] as const;

export function BottomTabBar() {
  const router = useRouter();
  const path = router.state.location.pathname;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="التنقل السفلي"
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-around">
        {TABS.map((t) => {
          const active = path === t.to || (t.to !== "/dashboard" && path.startsWith(t.to));
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1">
              <Link
                to={t.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl transition-all",
                    active && "bg-gradient-primary text-primary-foreground shadow-elegant",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
