import { useState } from "react";

interface Props {
  hour: number;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    category: string;
    startHour: number;
    durationHrs: number;
    difficulty: "SHORT" | "MEDIUM" | "DIFFICULT";
  }) => Promise<void>;
}

export default function TaskModal({ hour, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("focus");
  const [durationHrs, setDurationHrs] = useState(1);
  const [difficulty, setDifficulty] = useState<"SHORT" | "MEDIUM" | "DIFFICULT">("SHORT");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onCreate({ title, category, startHour: hour, durationHrs, difficulty });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel p-6"
      >
        <h2 className="mb-4 text-lg font-semibold">New task at {hour}:00</h2>

        <label className="mb-1 block text-xs text-cream/60">Title</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm"
          placeholder="e.g. DSA — arrays chapter"
        />

        <label className="mb-1 block text-xs text-cream/60">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm"
        >
          {["focus", "class", "work", "personal", "sleep", "meals", "travel"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-cream/60">Duration (hrs)</label>
            <input
              type="number"
              min={1}
              max={12}
              value={durationHrs}
              onChange={(e) => setDurationHrs(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-cream/60">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
              className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm"
            >
              <option value="SHORT">Short (+5c)</option>
              <option value="MEDIUM">Medium (+10c)</option>
              <option value="DIFFICULT">Difficult (+20c)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-cream/60 hover:text-cream"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add task"}
          </button>
        </div>
      </form>
    </div>
  );
}
