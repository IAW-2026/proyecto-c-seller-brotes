import { SignUp } from "@clerk/nextjs";
import AuthPanel from "@/components/AuthPanel";

export default function SignUpPage() {
  return (
    <div
      className="flex min-h-screen flex-col md:flex-row"
      style={{ background: "var(--color-arena)" }}
    >
      <AuthPanel
        title="Creá tu cuenta"
        description="Registrate y empezá a vender plantas y productos de jardinería en Brotes."
      />
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <SignUp forceRedirectUrl="/redirect" />
      </div>
    </div>
  );
}
