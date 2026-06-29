import { SignIn } from "@clerk/nextjs";
import AuthPanel from "@/components/AuthPanel";

export default function SignInPage() {
  return (
    <div
      className="flex min-h-screen flex-col md:flex-row"
      style={{ background: "var(--color-arena)" }}
    >
      <AuthPanel
        title="Bienvenido a Brotes"
        description="Tu plataforma para vender plantas y productos de jardinería de forma simple y segura."
      />
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <SignIn forceRedirectUrl="/redirect" />
      </div>
    </div>
  );
}
