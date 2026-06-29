import Image from "next/image";

interface AuthPanelProps {
  title: string;
  description: string;
}

export default function AuthPanel({ title, description }: AuthPanelProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 px-10 py-16 md:w-1/2"
      style={{ background: "var(--color-verde-bosque)" }}
    >
      <Image
        src="/brotes-logo.png"
        alt="Brotes"
        width={140}
        height={140}
        priority
        className="drop-shadow-lg"
      />
      <div className="text-center">
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: "var(--color-arena)", fontFamily: "Georgia, serif" }}
        >
          {title}
        </h1>
        <p
          className="text-sm max-w-xs leading-relaxed"
          style={{ color: "var(--color-verde-brote)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
