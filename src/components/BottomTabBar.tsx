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
      className="fixed inset-x-0 bottom-0 z-50 glass border-t border-border/50 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      aria-label="التنقل السفلي"
    >
      <ul className="flex items-end justify-around px-4 pt-2">
        {TABS.map((t) => {
          const active = path === t.to || (t.to !== "/dashboard" && path.startsWith(t.to));
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1">
              <Link
                to={t.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 transition-colors duration-200",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "grid h-7 w-14 place-items-center rounded-full transition-all duration-200",
                    active && "bg-primary/15",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[22px] w-[22px] transition-all duration-200",
                      active && "stroke-[2.5px]",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-tight transition-all duration-200",
                    active && "text-primary font-semibold",
                  )}
                >
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
