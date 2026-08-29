import type { CustomThemeColors } from '../../types';

interface CustomThemeEditorProps {
  colors: CustomThemeColors;
  onChange: (colors: CustomThemeColors) => void;
}

const FIELDS: Array<{ key: keyof CustomThemeColors; label: string }> = [
  { key: 'accentLime', label: 'Primary accent' },
  { key: 'accentOrange', label: 'Coins / warm' },
  { key: 'accentPink', label: 'Glow / cool' },
];

export function CustomThemeEditor({ colors, onChange }: CustomThemeEditorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {FIELDS.map(({ key, label }) => (
        <label
          key={key}
          className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4"
        >
          <span className="text-xs text-text-secondary">{label}</span>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => onChange({ ...colors, [key]: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded-lg border border-white/15 bg-transparent p-0.5"
            />
            <input
              type="text"
              value={colors[key]}
              onChange={(e) => onChange({ ...colors, [key]: e.target.value })}
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs uppercase focus:border-accent-lime/40 focus:outline-none"
            />
          </div>
        </label>
      ))}
    </div>
  );
}
