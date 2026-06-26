import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { useCurrency } from "@/hooks/use-currency";
import { CURRENCY_LABEL, CURRENCY_SYMBOL, type Currency } from "@/lib/storage";
import { Check, Coins } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "الإعدادات — مستشارك للبناء" }] }),
  component: SettingsPage,
});

const CURRENCIES: Currency[] = ["USD", "SAR", "JOD", "EUR"];

function SettingsPage() {
  const { currency, setCurrency } = useCurrency();

  function onSelect(c: Currency) {
    if (c === currency) return;
    setCurrency(c);
    toast.success(`تم تغيير العملة إلى ${CURRENCY_LABEL[c]}`);
  }

  return (
    <AppLayout>
      <PageHeader title="الإعدادات" subtitle="خصّص تجربتك في التطبيق" />

      <div className="max-w-2xl space-y-6">
        <section className="rounded-3xl bg-card p-6 shadow-sm border border-border/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold">العملة</h2>
              <p className="text-[13px] text-muted-foreground">
                تُستخدم في كل الحاسبات وتقارير المشاريع
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {CURRENCIES.map((c) => {
              const active = c === currency;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onSelect(c)}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-right transition-all active:scale-[0.98] ${
                    active
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-border bg-muted/20 hover:bg-muted/40"
                  }`}
                  aria-pressed={active}
                >
                  <div>
                    <div className="text-[15px] font-semibold">{CURRENCY_LABEL[c]}</div>
                    <div className="text-[13px] text-muted-foreground mt-0.5">
                      مثال: 1,250 {CURRENCY_SYMBOL[c]}
                    </div>
                  </div>
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full transition-all ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {active ? <Check className="h-4 w-4" /> : <span className="text-sm font-bold">{CURRENCY_SYMBOL[c]}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
