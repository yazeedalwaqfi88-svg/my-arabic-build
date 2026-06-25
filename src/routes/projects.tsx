import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { projects, formatSAR, STATUS_LABEL, type Project, type ProjectStatus } from "@/lib/storage";
import { toast } from "sonner";
import { Plus, Trash2, X, MapPin, Wallet, Calendar, FolderKanban, Pencil } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "مشاريعي — مستشارك للبناء" }] }),
  component: ProjectsPage,
});

const STATUSES: ProjectStatus[] = ["planning", "foundation", "construction", "finishing", "completed"];

function ProjectsPage() {
  const [list, setList] = useState<Project[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  function refresh() { setList(projects.list()); }
  useEffect(refresh, []);

  return (
    <AppLayout>
      <PageHeader
        title="مشاريعي" subtitle="تابع مشاريع البناء، المصروفات، والإنجاز"
        action={
          <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant hover:opacity-90">
            <Plus className="h-4 w-4" /> مشروع جديد
          </button>
        }
      />

      {list.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed py-16 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-bold">لا توجد مشاريع بعد</h3>
          <p className="mt-1 text-sm text-muted-foreground">ابدأ بإضافة مشروعك الأول لتتابع تقدمه</p>
          <button onClick={() => setShowNew(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant">
            <Plus className="h-4 w-4" /> إضافة مشروع
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {list.map(p => <ProjectCard key={p.id} p={p} onEdit={() => setEditing(p)} onChange={refresh} />)}
        </div>
      )}

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} onSaved={() => { refresh(); setShowNew(false); }} />}
      {editing && <EditProjectModal p={editing} onClose={() => setEditing(null)} onSaved={() => { refresh(); setEditing(null); }} />}
    </AppLayout>
  );
}

function ProjectCard({ p, onEdit, onChange }: { p: Project; onEdit: () => void; onChange: () => void }) {
  const totalExpenses = p.expenses.reduce((s, e) => s + e.amount, 0);
  const budgetUsed = p.budget > 0 ? Math.min(100, (totalExpenses / p.budget) * 100) : 0;

  function del() {
    if (!confirm(`حذف مشروع "${p.name}"؟`)) return;
    projects.remove(p.id); onChange(); toast.success("تم حذف المشروع");
  }

  return (
    <div className="rounded-2xl border bg-gradient-card p-5 shadow-card transition hover:shadow-elegant">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold">{p.name}</h3>
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              {STATUS_LABEL[p.status]}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>
            <span className="inline-flex items-center gap-1"><Wallet className="h-3 w-3" /> {formatSAR(p.budget)}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.startDate}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
          <button onClick={del} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">نسبة الإنجاز</span>
          <span className="font-bold">{p.progress}٪</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${p.progress}%` }} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-4">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">المصروف</div>
          <div className="mt-0.5 text-sm font-bold">{formatSAR(totalExpenses)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">من الميزانية</div>
          <div className="mt-0.5 text-sm font-bold">{Math.round(budgetUsed)}٪</div>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-elegant max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {children}
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
      <div className="space-y-4">
        <Input label="اسم المشروع" value={name} onChange={setName} placeholder="فيلا الرياض" />
        <Input label="الموقع" value={location} onChange={setLocation} placeholder="الرياض، حي النرجس" />
        <Input label="الميزانية (ر.س)" type="number" value={String(budget)} onChange={v => setBudget(parseFloat(v) || 0)} />
        <Input label="تاريخ البدء" type="date" value={startDate} onChange={setStartDate} />
        <button onClick={save} className="w-full rounded-xl bg-gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-elegant hover:opacity-90">
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
    setExpLabel(""); setExpAmount(0);
  }
  function removeExpense(id: string) { setExpenses(expenses.filter(e => e.id !== id)); }
  function save() {
    projects.update(p.id, { progress, status, notes, expenses });
    toast.success("تم حفظ التغييرات");
    onSaved();
  }

  return (
    <Modal title={`تحديث: ${p.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <span className="mb-1.5 block text-sm font-medium">الحالة</span>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  status === s ? "border-primary bg-gradient-primary text-primary-foreground" : "hover:bg-muted"
                }`}>{STATUS_LABEL[s]}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">نسبة الإنجاز</span>
            <span className="font-bold text-primary">{progress}٪</span>
          </div>
          <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(parseInt(e.target.value))} className="w-full accent-primary" />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">ملاحظات</span>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="أي ملاحظات عن المشروع..."
            className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>

        <div className="rounded-2xl border bg-muted/30 p-4">
          <div className="mb-3 text-sm font-bold">المصروفات</div>
          <div className="space-y-2">
            {expenses.map(e => (
              <div key={e.id} className="flex items-center justify-between gap-2 rounded-xl bg-card p-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{e.label}</div>
                  <div className="text-xs text-muted-foreground">{e.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{formatSAR(e.amount)}</span>
                  <button onClick={() => removeExpense(e.id)} className="rounded-lg p-1 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
            <input value={expLabel} onChange={e => setExpLabel(e.target.value)} placeholder="مثلاً: شراء حديد" className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input type="number" value={expAmount} onChange={e => setExpAmount(parseFloat(e.target.value) || 0)} placeholder="0" className="w-24 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button onClick={addExpense} className="rounded-xl bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground hover:opacity-90"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        <button onClick={save} className="w-full rounded-xl bg-gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-elegant hover:opacity-90">
          حفظ التغييرات
        </button>
      </div>
    </Modal>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}
