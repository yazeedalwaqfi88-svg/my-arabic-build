import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { projects, formatSAR, STATUS_LABEL, type Project, type ProjectStatus } from "@/lib/storage";
import { toast } from "sonner";
import { Plus, Trash2, X, MapPin, Wallet, Calendar, FolderKanban, Pencil, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "مشاريعي — مستشارك للبناء" }] }),
  component: ProjectsPage,
});

const STATUSES: ProjectStatus[] = ["planning", "foundation", "construction", "finishing", "completed"];

const STATUS_COLORS: Record<ProjectStatus, string> = {
  planning: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  foundation: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  construction: "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400",
  finishing: "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
  completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
};

function ProjectsPage() {
  const [list, setList] = useState<Project[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  function refresh() { setList(projects.list()); }
  useEffect(refresh, []);

  return (
    <AppLayout>
      <PageHeader
        title="مشاريعي"
        subtitle="تابع مشاريع البناء، المصروفات، والإنجاز"
        action={
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            <span>مشروع جديد</span>
          </button>
        }
      />

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-muted/30 py-20 border border-dashed border-border/50">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-muted">
            <FolderKanban className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-5 text-[17px] font-semibold">لا توجد مشاريع بعد</h3>
          <p className="mt-1 text-[15px] text-muted-foreground text-center max-w-xs">
            ابدأ بإضافة مشروعك الأول لتتابع تقدمه ومراحل الإنشاء
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة مشروع</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((p, i) => (
            <ProjectCard
              key={p.id}
              p={p}
              onEdit={() => setEditing(p)}
              onChange={refresh}
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      )}

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} onSaved={() => { refresh(); setShowNew(false); }} />}
      {editing && <EditProjectModal p={editing} onClose={() => setEditing(null)} onSaved={() => { refresh(); setEditing(null); }} />}
    </AppLayout>
  );
}

function ProjectCard({ p, onEdit, onChange, style }: { p: Project; onEdit: () => void; onChange: () => void; style?: React.CSSProperties }) {
  const totalExpenses = p.expenses.reduce((s, e) => s + e.amount, 0);
  const budgetUsed = p.budget > 0 ? Math.min(100, (totalExpenses / p.budget) * 100) : 0;

  function del() {
    if (!confirm(`حذف مشروع "${p.name}"؟`)) return;
    projects.remove(p.id);
    onChange();
    toast.success("تم حذف المشروع");
  }

  return (
    <div
      className="rounded-3xl bg-card p-5 shadow-sm border border-border/50 card-interactive stagger-item"
      style={style}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[17px] font-semibold truncate">{p.name}</h3>
          </div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[p.status]}`}>
            {STATUS_LABEL[p.status]}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={del}
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground mb-4">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {p.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5" />
          {formatSAR(p.budget)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {p.startDate}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-muted-foreground">نسبة الإنجاز</span>
          <span className="text-[15px] font-semibold number-highlight">{p.progress}٪</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${p.progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-muted/50 p-3">
          <div className="text-[11px] text-muted-foreground mb-0.5">المصروف</div>
          <div className="text-[15px] font-semibold number-highlight">{formatSAR(totalExpenses)}</div>
        </div>
        <div className="rounded-2xl bg-muted/50 p-3">
          <div className="text-[11px] text-muted-foreground mb-0.5">من الميزانية</div>
          <div className="text-[15px] font-semibold">{Math.round(budgetUsed)}٪</div>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 glass-overlay animate-fade-in" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-card shadow-xl max-h-[85vh] overflow-y-auto animate-scale-in"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border/50 bg-card px-6 py-4">
          <h2 className="text-[17px] font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function NewProjectModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState(500000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  function save() {
    if (!name.trim()) { toast.error("أدخل اسم المشروع"); return; }
    projects.add({ name: name.trim(), location: location.trim(), budget, startDate });
    toast.success("تم إنشاء المشروع");
    onSaved();
  }

  return (
    <Modal title="مشروع جديد" onClose={onClose}>
      <div className="space-y-5">
        <InputField label="اسم المشروع" value={name} onChange={setName} placeholder="فيلا الرياض" />
        <InputField label="الموقع" value={location} onChange={setLocation} placeholder="الرياض، حي النرجس" />
        <InputField label="الميزانية (ر.س)" type="number" value={String(budget)} onChange={v => setBudget(parseFloat(v) || 0)} />
        <InputField label="تاريخ البدء" type="date" value={startDate} onChange={setStartDate} />
        <button
          onClick={save}
          className="w-full rounded-2xl bg-primary px-5 py-4 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97]"
        >
          إنشاء المشروع
        </button>
      </div>
    </Modal>
  );
}

function EditProjectModal({ p, onClose, onSaved }: { p: Project; onClose: () => void; onSaved: () => void }) {
  const [progress, setProgress] = useState(p.progress);
  const [status, setStatus] = useState<ProjectStatus>(p.status);
  const [notes, setNotes] = useState(p.notes);
  const [expLabel, setExpLabel] = useState("");
  const [expAmount, setExpAmount] = useState(0);
  const [expenses, setExpenses] = useState(p.expenses);

  function addExpense() {
    if (!expLabel.trim() || expAmount <= 0) return;
    setExpenses([...expenses, { id: crypto.randomUUID(), label: expLabel.trim(), amount: expAmount, date: new Date().toISOString().split("T")[0] }]);
    setExpLabel("");
    setExpAmount(0);
  }

  function removeExpense(id: string) {
    setExpenses(expenses.filter(e => e.id !== id));
  }

  function save() {
    projects.update(p.id, { progress, status, notes, expenses });
    toast.success("تم حفظ التغييرات");
    onSaved();
  }

  return (
    <Modal title={`تحديث: ${p.name}`} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <span className="mb-2 block text-[15px] font-medium">الحالة</span>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-2xl px-4 py-2 text-[13px] font-medium transition-all active:scale-[0.97] ${
                  status === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[15px] font-medium">نسبة الإنجاز</span>
            <span className="text-[15px] font-semibold text-primary number-highlight">{progress}٪</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={e => setProgress(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-muted focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-[15px] font-medium">ملاحظات</span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="أي ملاحظات عن المشروع..."
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20 resize-none"
          />
        </label>

        {/* Expenses Section */}
        <div className="rounded-2xl bg-muted/30 p-4">
          <div className="text-[15px] font-semibold mb-3">المصروفات</div>

          {expenses.length > 0 && (
            <div className="space-y-2 mb-3">
              {expenses.map(e => (
                <div key={e.id} className="flex items-center justify-between gap-3 rounded-2xl bg-card p-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-medium truncate">{e.label}</div>
                    <div className="text-[12px] text-muted-foreground">{e.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-semibold text-primary number-highlight">{formatSAR(e.amount)}</span>
                    <button
                      onClick={() => removeExpense(e.id)}
                      className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={expLabel}
              onChange={e => setExpLabel(e.target.value)}
              placeholder="مثلاً: شراء حديد"
              className="flex-1 rounded-2xl border border-input bg-background px-4 py-3 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20"
            />
            <input
              type="number"
              value={expAmount || ""}
              onChange={e => setExpAmount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-24 rounded-2xl border border-input bg-background px-4 py-3 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20"
            />
            <button
              onClick={addExpense}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-all active:scale-[0.95]"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          onClick={save}
          className="w-full rounded-2xl bg-primary px-5 py-4 text-[15px] font-semibold text-primary-foreground shadow-md transition-all active:scale-[0.97]"
        >
          حفظ التغييرات
        </button>
      </div>
    </Modal>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-medium">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-[15px] outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/20"
      />
    </label>
  );
}
