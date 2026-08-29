interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ label, title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={`mb-8 ${align === 'center' ? 'text-center' : ''}`}>
      {label && (
        <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime uppercase block mb-2">
          {label}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-none">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary mt-3 text-sm md:text-base max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}
