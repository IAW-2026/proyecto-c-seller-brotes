interface StatCardProps {
  label: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  bg: string;
  iconColor: string;
  accent?: string;
  linkLabel?: string;
}

export default function StatCard({
  label,
  value,
  href,
  icon,
  bg,
  iconColor,
  accent,
  linkLabel,
}: StatCardProps) {
  return (
    <a
      href={href}
      className="bg-white rounded-xl border border-[var(--color-gris-piedra)] p-5 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center gap-3">
        <div className={`${bg} ${iconColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <span
          className="text-4xl font-bold"
          style={{ color: accent ?? "var(--color-verde-profundo)" }}
        >
          {value}
        </span>
      </div>
      <span className="text-sm text-gray-500">{label}</span>
      {linkLabel && (
        <span className="text-sm text-[var(--color-verde-bosque)] hover:underline w-fit">
          {linkLabel} →
        </span>
      )}
    </a>
  );
}